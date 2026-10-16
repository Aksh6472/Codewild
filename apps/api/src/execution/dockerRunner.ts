import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE ?? "atlas-java-sandbox";
const TIMEOUT_SECONDS = 5;

/**
 * Compiles and runs Java submissions inside short-lived, isolated Docker
 * containers (compile once, then run once per test case) with no network
 * access and hard resource/time limits.
 *
 * SECURITY.md flags this explicitly as the DEV-ONLY execution path for
 * ROADMAP.md Milestone 3 — it is NOT the hardened Milestone-4 sandbox and must
 * never be exposed to the public internet. The resource/network/timeout flags
 * below are applied anyway because they're nearly free with Docker and keep a
 * runaway submission from freezing local dev.
 *
 * Code never touches a shell string — it's written to a file on a disposable
 * per-submission temp directory, and `docker run` is invoked with an argv
 * array (spawn, not exec), so submitted source can't reach command injection
 * even in this non-hardened path.
 */

export interface CompileResult {
  workDir: string;
  success: boolean;
  stderr: string;
  timedOut: boolean;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

export async function compileInSandbox(code: string): Promise<CompileResult> {
  const workDir = await mkdtemp(join(tmpdir(), "atlas-submission-"));
  await writeFile(join(workDir, "Robot.java"), code, "utf-8");

  const result = await runContainer({
    workDir,
    mountMode: "rw", // javac needs to write Robot.class next to the source
    command: ["timeout", `${TIMEOUT_SECONDS}`, "javac", "/work/Robot.java"],
    stdin: null,
  });

  return {
    workDir,
    success: result.exitCode === 0 && !result.timedOut,
    stderr: result.stderr,
    timedOut: result.timedOut,
  };
}

export async function runInSandbox(workDir: string, stdin: string | null): Promise<RunResult> {
  return runContainer({
    workDir,
    mountMode: "ro",
    command: ["timeout", `${TIMEOUT_SECONDS}`, "java", "-cp", "/work", "Robot"],
    stdin,
  });
}

export async function cleanupWorkDir(workDir: string): Promise<void> {
  await rm(workDir, { recursive: true, force: true });
}

interface ContainerRunOptions {
  workDir: string;
  mountMode: "ro" | "rw";
  command: string[];
  stdin: string | null;
}

function runContainer(opts: ContainerRunOptions): Promise<RunResult> {
  const args = [
    "run",
    "--rm",
    opts.stdin !== null ? "-i" : undefined,
    "--network",
    "none",
    "--memory=256m",
    "--cpus=0.5",
    "--pids-limit=64",
    "--read-only",
    "--tmpfs",
    "/tmp:rw,size=10m",
    "-v",
    `${opts.workDir}:/work:${opts.mountMode}`,
    SANDBOX_IMAGE,
    ...opts.command,
  ].filter((a): a is string => typeof a === "string");

  return new Promise((resolve, reject) => {
    const proc = spawn("docker", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    if (opts.stdin !== null) {
      proc.stdin.write(opts.stdin);
    }
    proc.stdin.end();

    proc.on("error", reject);
    proc.on("close", (code) => {
      // `timeout` (coreutils) exits 124 specifically when it kills the wrapped
      // command for running too long — that's how we distinguish "timed out"
      // from "crashed" without parsing stderr text.
      resolve({ stdout, stderr, exitCode: code ?? 1, timedOut: code === 124 });
    });
  });
}
