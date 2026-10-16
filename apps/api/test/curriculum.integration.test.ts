import { describe, it, expect } from "vitest";
import { execSync, spawnSync } from "node:child_process";
import { evaluateSubmission, type TestCaseSpec } from "../src/execution/evaluateSubmission.js";

// Curriculum validation tests (TESTING.md): the authored reference solution
// for each of levels 1-3 must pass every visible+hidden test case, and a
// documented wrong answer must fail. Runs against the REAL Docker sandbox
// (not mocked, per TESTING.md's "code-execution tests" guidance) — requires
// Docker running and the atlas-java-sandbox image built (see
// docs/engineering/DEVELOPMENT_SETUP.md). Skips with a clear message if either
// prerequisite is missing, rather than silently reporting false coverage.
//
// This check must run synchronously at module-evaluation time, not inside a
// beforeAll — `describe.runIf`'s condition is read while the file is being
// collected, before any lifecycle hook has a chance to run.
function checkDockerReady(): boolean {
  try {
    execSync("docker info", { stdio: "ignore" });
    const img = spawnSync("docker", ["image", "inspect", process.env.SANDBOX_IMAGE ?? "atlas-java-sandbox"], { stdio: "ignore" });
    return img.status === 0;
  } catch {
    return false;
  }
}

const dockerReady = checkDockerReady();
if (!dockerReady) {
  console.warn(
    "Skipping curriculum integration tests: Docker is not running or atlas-java-sandbox image is not built. " +
    "See docs/engineering/DEVELOPMENT_SETUP.md."
  );
}

const level1Pass = [
  "public class Robot {",
  "    public static void main(String[] args) {",
  '        System.out.println("Hello, Foundry!");',
  "    }",
  "}",
].join("\n");

const level1Tests: TestCaseSpec[] = [
  { id: "t1", isHidden: false, description: "says hello", input: null, expected: { stdout: "Hello, Foundry!" } },
];

const level3Pass = [
  "import java.util.Scanner;",
  "public class Robot {",
  "    public static void main(String[] args) {",
  "        Scanner scanner = new Scanner(System.in);",
  "        int bridgeLength = scanner.nextInt();",
  "        int batteryPerMeter = 2;",
  "        int batteryNeeded = bridgeLength * batteryPerMeter;",
  '        System.out.println("Battery needed: " + batteryNeeded);',
  "    }",
  "}",
].join("\n");

// The documented wrong answer: hardcodes the visible case's expected output
// instead of computing a formula (CURRICULUM.md level 3 mastery requirement).
const level3Hardcoded = [
  "import java.util.Scanner;",
  "public class Robot {",
  "    public static void main(String[] args) {",
  "        Scanner scanner = new Scanner(System.in);",
  "        int bridgeLength = scanner.nextInt();",
  '        System.out.println("Battery needed: 24");',
  "    }",
  "}",
].join("\n");

const level3Tests: TestCaseSpec[] = [
  { id: "t1", isHidden: false, description: "12m bridge", input: { stdin: "12" }, expected: { stdout: "Battery needed: 24" } },
  { id: "t2", isHidden: true, description: "7m bridge (catches hardcoding)", input: { stdin: "7" }, expected: { stdout: "Battery needed: 14" } },
];

describe.runIf(dockerReady)("curriculum validation (real sandbox)", () => {
  it("level 1 reference solution passes", async () => {
    const outcome = await evaluateSubmission(level1Pass, level1Tests);
    expect(outcome.overallStatus).toBe("passed");
  });

  it("level 3 reference solution passes both visible and hidden cases", async () => {
    const outcome = await evaluateSubmission(level3Pass, level3Tests);
    expect(outcome.overallStatus).toBe("passed");
  });

  it("level 3 hardcoded wrong answer fails specifically on the hidden case", async () => {
    const outcome = await evaluateSubmission(level3Hardcoded, level3Tests);
    expect(outcome.overallStatus).toBe("failed");
    const visible = outcome.results.find((r) => !r.isHidden);
    const hidden = outcome.results.find((r) => r.isHidden);
    expect(visible?.passed).toBe(true);
    expect(hidden?.passed).toBe(false);
  });

  it("an infinite loop is reported as a timeout, not left to hang", async () => {
    const infinite = [
      "public class Robot {",
      "    public static void main(String[] args) {",
      "        while (true) {}",
      "    }",
      "}",
    ].join("\n");
    const outcome = await evaluateSubmission(infinite, level1Tests);
    expect(outcome.overallStatus).toBe("timeout");
  }, 15000);
});
