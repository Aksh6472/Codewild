import type { FastifyInstance } from "fastify";
import type { PlaygroundRunResponse } from "@atlas/shared-types";
import { compileInSandbox, runInSandbox, cleanupWorkDir } from "../execution/dockerRunner.js";
import { classify } from "../execution/errorClassification.js";
import { rung0Message } from "../hints/rung0.js";

// Runs a lesson's example (or the learner's edit of it) once, with no grading.
// Same DEV-ONLY sandbox as submissions (SECURITY.md) — never internet-facing.
// A small in-flight cap keeps a burst of clicks from spawning a container pile.
export const MAX_CODE_CHARS = 20_000;
const MAX_CONCURRENT_RUNS = 4;
let inFlight = 0;

export async function playgroundRoutes(app: FastifyInstance) {
  app.post("/playground/run", async (req, reply) => {
    const body = req.body as { code?: unknown; stdin?: unknown } | undefined;
    const code = body?.code;
    const stdin = typeof body?.stdin === "string" ? body.stdin : null;
    if (typeof code !== "string" || code.length === 0 || code.length > MAX_CODE_CHARS) {
      return reply.code(400).send({ error: { code: "bad_request", message: "code must be a non-empty string" } });
    }
    if (inFlight >= MAX_CONCURRENT_RUNS) {
      return reply.code(429).send({ error: { code: "busy", message: "Too many runs at once — try again in a moment." } });
    }

    inFlight++;
    try {
      const compile = await compileInSandbox(code);
      try {
        if (!compile.success) {
          const classification = compile.timedOut ? "timeout" : "compile_error";
          const response: PlaygroundRunResponse = {
            status: classification,
            stdout: "",
            stderr: compile.stderr,
            message: rung0Message(classification, compile.stderr),
          };
          return response;
        }
        const run = await runInSandbox(compile, stdin);
        const classification = classify({
          compileExitCode: 0,
          compileStderr: "",
          runExitCode: run.timedOut ? null : run.exitCode,
          runStderr: run.stderr,
          timedOut: run.timedOut,
        });
        const response: PlaygroundRunResponse = {
          status: classification === "none" ? "ok" : classification,
          stdout: run.stdout,
          stderr: run.stderr,
          message: rung0Message(classification, run.stderr),
        };
        return response;
      } finally {
        await cleanupWorkDir(compile.workDir);
      }
    } finally {
      inFlight--;
    }
  });
}
