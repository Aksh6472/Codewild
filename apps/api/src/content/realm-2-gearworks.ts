import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 2 — conditionals, loops, methods and basic problem-solving.
export const gearworks: RealmDef = {
  slug: "gearworks",
  name: "The Gearworks",
  subtitle: "Conditions, loops, methods, problem-solving",
  story:
    "Beyond the foundry lies a district of gates, mines and patrol corridors. Machines here must decide, repeat and reuse — and so will your code.",
  theme: "forge",
  summary: {
    keyIdeas: [
      "`if (condition) { ... } else { ... }` runs exactly one branch; `else if` chains check conditions in order.",
      "Combine conditions with `&&` (both), `||` (either) and `!` (not).",
      "`for (int i = 1; i <= n; i++)` repeats a known number of times; `while (condition)` repeats until something changes.",
      "Accumulate with a variable declared before the loop: `int sum = 0;` then `sum += x;` inside it.",
      "A method packages steps under a name: `static int square(int x) { return x * x; }` — parameters in, return value out.",
      "Solve problems by understanding input/output, planning in plain steps, tracing by hand, then testing edge cases.",
    ],
    mistakes: [
      "`if (x = 5)` — one = assigns; comparison needs ==.",
      "Off-by-one loops: `i < n` vs `i <= n`, starting at 0 vs 1.",
      "Forgetting to change the loop variable in a while loop — it never ends.",
      "Declaring the accumulator inside the loop, so it resets every time.",
      "A method declared `int` with a path that never returns a value.",
    ],
  },
  levels: [
    {
      slug: "gear-conditions",
      title: "Making decisions",
      kind: "lesson",
      concept: "conditionals",
      syllabusTag: "Unit 2: Conditional Statements",
      story: "The Gearworks gate has a sensor. It must open only when it's safe.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "Programs become useful when they can **choose**. An `if` statement runs a block of code only when its condition is `true`; an optional `else` block runs otherwise. A condition is any expression that is `true` or `false` — usually a comparison like `reading > 50`.",
        },
        {
          type: "code",
          title: "if / else if / else",
          runnable: true,
          stdin: "72",
          lines: [
            ["import java.util.Scanner;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int temp = new Scanner(System.in).nextInt();", "Read one number (the input box below supplies it)."],
            ["        if (temp >= 90) {", "Checked first. Only if this is false does Java look at the next condition."],
            ['            System.out.println("Overheating!");', ""],
            ["        } else if (temp >= 60) {", "Reached only when temp < 90. So this branch means 60–89."],
            ['            System.out.println("Running warm");', ""],
            ["        } else {", "Everything else (below 60). No condition needed."],
            ['            System.out.println("Cool");', ""],
            ["        }", "Exactly one of the three branches ran."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "branch-trace",
        },
        {
          type: "text",
          md: "Combine conditions with **logical operators**:\n- `a && b` — true only if both are true (\"and\")\n- `a || b` — true if either is true (\"or\")\n- `!a` — flips true and false (\"not\")\n\nFor example, a reading is in the safe band when `reading >= 20 && reading <= 80`.",
        },
        {
          type: "callout",
          tone: "warning",
          md: "`=` stores a value; `==` compares. `if (x = 5)` won't even compile for an int in Java — the compiler catches the slip. Also, always use braces `{ }` around a branch: without them only the next single line belongs to the `if`.",
        },
        {
          type: "check",
          question: "logical-and",
        },
      ],
      summary: {
        keyIdeas: [
          "if runs a block when the condition is true; else covers every other case.",
          "else if chains are checked top to bottom — the first true branch wins.",
          "&& needs both sides true, || needs at least one, ! negates.",
        ],
        mistakes: [
          "Using = instead of ==.",
          "Ordering else-if checks so a broad condition hides a narrower one (check >= 90 before >= 60).",
          "Missing braces, so only one line is controlled by the if.",
        ],
      },
      questions: [
        {
          slug: "branch-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int score = 60;
            if (score > 80) {
                System.out.println("Gold");
            } else if (score > 50) {
                System.out.println("Silver");
            } else if (score > 30) {
                System.out.println("Bronze");
            } else {
                System.out.println("None");
            }
          `,
          answer: "Silver",
          explanation:
            "60 > 80 is false, so Java checks the next condition. 60 > 50 is true, so \"Silver\" prints and the rest of the chain is skipped — even though 60 > 30 is also true.",
        },
        {
          slug: "logical-and",
          kind: "mcq",
          prompt: "Which condition is true only when `age` is between 13 and 19, inclusive?",
          options: [
            { id: "a", text: "age >= 13 || age <= 19", feedback: "With || any age passes — every number is either ≥ 13 or ≤ 19." },
            { id: "b", text: "age >= 13 && age <= 19" },
            { id: "c", text: "13 <= age <= 19", feedback: "Java can't chain comparisons like maths; 13 <= age gives a boolean, which can't be compared with 19." },
            { id: "d", text: "age > 13 && age < 19", feedback: "Close — but this excludes 13 and 19 themselves." },
          ],
          answer: "b",
          explanation: "Both conditions must hold at once, so you need &&. >= and <= include the end points 13 and 19.",
        },
      ],
    },
    {
      slug: "gear-gate",
      title: "The gate",
      kind: "trial",
      concept: "conditionals",
      syllabusTag: "Unit 2: Conditional Statements",
      story: "A sealed gate blocks the next district; a sensor reports a value, and the gate should open only under the right condition.",
      minutes: 8,
      challenge: {
        instructions:
          "The input is a sensor reading. The safety threshold is 50. If the reading is **above** the threshold, print `Gate OPEN`; otherwise print `Gate CLOSED`.\n\nExample: input `75` → `Gate OPEN`.",
        guidance: "guided",
        steps: [
          "The reading is already read for you. Write an if statement comparing it with safetyThreshold.",
          "Print Gate OPEN inside the if block.",
          "Add an else block that prints Gate CLOSED.",
          "\"Above\" means strictly greater — think about what should happen at exactly 50.",
        ],
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int sensorReading = in.nextInt();
                  int safetyThreshold = 50;

                  // if the reading is above the threshold, open the gate

              }
          }
        `,
        hints: [
          "The shape you need is `if (condition) { ... } else { ... }`.",
          "The condition compares two variables you already have: `sensorReading > safetyThreshold`.",
          "Worked example: `if (speed > limit) { System.out.println(\"Too fast\"); } else { System.out.println(\"OK\"); }`",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int sensorReading = in.nextInt();
                  int safetyThreshold = 50;

                  if (sensorReading > safetyThreshold) {
                      System.out.println("Gate OPEN");
                  } else {
                      System.out.println("Gate CLOSED");
                  }
              }
          }
        `,
        solutionExplanation:
          "> is strictly greater, so a reading of exactly 50 is not above the threshold and the else branch keeps the gate closed. Exactly one branch runs for any reading.",
        tests: [
          { description: "Reading 75 opens the gate", stdin: "75", stdout: "Gate OPEN" },
          { description: "A low reading keeps it shut", hidden: true, stdin: "20", stdout: "Gate CLOSED" },
          { description: "Exactly at the threshold isn't above it", hidden: true, stdin: "50", stdout: "Gate CLOSED" },
        ],
        feedback: [
          { codePattern: ">=\\s*(50|safetyThreshold)", message: "\"Above the threshold\" means strictly greater — >= also opens the gate at exactly 50." },
          { stdoutPattern: "Gate OPEN\\s*Gate CLOSED", message: "Both messages printed — the second println isn't inside an else, so it always runs." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    int sensorReading = new Scanner(System.in).nextInt();
                    if (sensorReading >= 50) {
                        System.out.println("Gate OPEN");
                    } else {
                        System.out.println("Gate CLOSED");
                    }
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-loops",
      title: "Loops",
      kind: "lesson",
      concept: "loops",
      syllabusTag: "Unit 2: Loops",
      story: "The crystal mine needs the same action done again and again — exactly the right number of times.",
      minutes: 15,
      blocks: [
        {
          type: "text",
          md: "A **loop** repeats a block of code. Java's `for` loop is ideal when you know how many times to repeat. It has three parts inside the parentheses, separated by semicolons:\n- **start**: `int i = 1` — create a counter\n- **condition**: `i <= 5` — keep going while this is true\n- **update**: `i++` — runs after each repetition",
        },
        {
          type: "code",
          title: "Counting and accumulating",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int sum = 0;", "The accumulator lives OUTSIDE the loop so it keeps its value between repetitions."],
            ["        for (int i = 1; i <= 5; i++) {", "i takes the values 1, 2, 3, 4, 5. When i becomes 6, i <= 5 is false and the loop stops."],
            ['            System.out.println("Step " + i);', "Runs once per repetition."],
            ["            sum += i;", "Add this step's value to the running total."],
            ["        }", ""],
            ['        System.out.println("Sum: " + sum);', "After the loop: 1+2+3+4+5 = 15."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "loop-count",
        },
        {
          type: "text",
          md: "A `while` loop repeats **as long as** its condition stays true — use it when you don't know the number of repetitions in advance, only when to stop. Something inside the loop must eventually make the condition false, or it runs forever (an *infinite loop* — the trial runner stops it after a few seconds).\n\n`break` leaves a loop immediately; `continue` skips to the next repetition.",
        },
        {
          type: "code",
          title: "A while loop",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int battery = 20;", ""],
            ["        int steps = 0;", ""],
            ["        while (battery >= 6) {", "Checked before every repetition — including the first."],
            ["            battery -= 6;", "This change is what eventually ends the loop."],
            ["            steps++;", ""],
            ["        }", ""],
            ['        System.out.println(steps + " steps, " + battery + " left");', "20 → 14 → 8 → 2: three steps, 2 left."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "callout",
          tone: "warning",
          md: "**Off-by-one errors** are the classic loop bug. `for (int i = 0; i < 5; i++)` and `for (int i = 1; i <= 5; i++)` both run 5 times; `for (int i = 0; i <= 5; i++)` runs 6. Trace the first and last values of `i` whenever you write a loop.",
        },
        {
          type: "check",
          question: "while-trace",
        },
      ],
      summary: {
        keyIdeas: [
          "for (start; condition; update) — best when you know how many repetitions.",
          "while (condition) — best when you know when to stop, not how many times.",
          "Declare accumulators (sum, count) before the loop and update them inside.",
        ],
        mistakes: [
          "Off-by-one: < vs <=, starting at 0 vs 1.",
          "A while loop whose condition never becomes false.",
          "Resetting the accumulator inside the loop.",
        ],
      },
      questions: [
        {
          slug: "loop-count",
          kind: "mcq",
          prompt: "How many times does this loop print? `for (int i = 0; i <= 10; i += 2) { System.out.println(i); }`",
          options: [
            { id: "a", text: "5", feedback: "Count the values: 0, 2, 4, 6, 8 — and 10 also passes i <= 10." },
            { id: "b", text: "6" },
            { id: "c", text: "10", feedback: "i goes up by 2 each time, not 1." },
            { id: "d", text: "11", feedback: "That would be i++ from 0 to 10; here the update is i += 2." },
          ],
          answer: "b",
          explanation: "i takes the values 0, 2, 4, 6, 8, 10 — six values. When i becomes 12, i <= 10 is false and the loop ends.",
        },
        {
          slug: "while-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int n = 1;
            while (n < 20) {
                n = n * 3;
            }
            System.out.println(n);
          `,
          answer: "27",
          explanation: "n goes 1 → 3 → 9 → 27. After 9, 9 < 20 is still true so it becomes 27; then 27 < 20 is false and the loop stops.",
        },
      ],
    },
    {
      slug: "gear-crystal-mine",
      title: "Crystal mine",
      kind: "trial",
      concept: "for-loops",
      syllabusTag: "Unit 2: Loops",
      story: "A mine shaft holds crystals that power the foundry; the robot must collect all of them.",
      minutes: 10,
      challenge: {
        instructions:
          "The input is the number of crystals `n`. Collect each one, printing a line per crystal, then report the total energy — crystal number *k* holds *k × 10* energy.\n\nFor `n = 3`:\n\n`Collected crystal 1`\n`Collected crystal 2`\n`Collected crystal 3`\n`Total energy: 60`",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int crystalCount = in.nextInt();

                  // Use a loop to collect once per crystal

              }
          }
        `,
        hints: [
          "You need to repeat crystalCount times, with a counter going 1, 2, 3, … — that's a for loop.",
          "Look at how many times your loop runs. Does it match `crystalCount`, or a fixed number? Keep a running total outside the loop.",
          "Worked example: `int total = 0; for (int k = 1; k <= 4; k++) { total += k * 2; }` leaves total = 20.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int crystalCount = in.nextInt();
                  int energy = 0;
                  for (int k = 1; k <= crystalCount; k++) {
                      System.out.println("Collected crystal " + k);
                      energy += k * 10;
                  }
                  System.out.println("Total energy: " + energy);
              }
          }
        `,
        solutionExplanation:
          "The loop counter k runs from 1 to crystalCount, so it both numbers each line and gives that crystal's energy (k * 10). energy is declared before the loop so it accumulates.",
        tests: [
          { description: "Collects 3 crystals and reports 60 energy", stdin: "3", stdout: "Collected crystal 1\nCollected crystal 2\nCollected crystal 3\nTotal energy: 60" },
          {
            description: "A mine with 7 crystals (catches a hardcoded loop)",
            hidden: true,
            stdin: "7",
            stdout: "Collected crystal 1\nCollected crystal 2\nCollected crystal 3\nCollected crystal 4\nCollected crystal 5\nCollected crystal 6\nCollected crystal 7\nTotal energy: 280",
          },
          { description: "A single crystal", hidden: true, stdin: "1", stdout: "Collected crystal 1\nTotal energy: 10" },
        ],
        feedback: [
          { stdoutPattern: "^Collected crystal 0", message: "Your first crystal is numbered 0 — start the counter at 1 (or print k + 1)." },
          { stdoutPattern: "Total energy: 0$", message: "Total energy is 0: is energy declared before the loop and increased inside it?" },
          { stdoutPattern: "Collected crystal 4\\nTotal", message: "One crystal too many — check < versus <= in your loop condition." },
        ],
        wrongSolutions: [
          java`
            public class Main {
                public static void main(String[] args) {
                    System.out.println("Collected crystal 1");
                    System.out.println("Collected crystal 2");
                    System.out.println("Collected crystal 3");
                    System.out.println("Total energy: 60");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-patrol",
      title: "Patrol",
      kind: "trial",
      concept: "while-loops",
      syllabusTag: "Unit 2: Loops",
      story: "A patrol robot walks a corridor until its battery can't take another step.",
      minutes: 10,
      challenge: {
        instructions:
          "The input is the robot's starting battery. Each step costs **7** battery, and the robot keeps stepping while it has at least 7 left. Print the number of steps and the battery remaining:\n\nFor `50`:\n\n`Steps: 7`\n`Battery left: 1`\n\nUse a `while` loop.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int battery = in.nextInt();

              }
          }
        `,
        requirements: [{ description: "Uses a while loop", pattern: "\\bwhile\\s*\\(", mustMatch: true }],
        hints: [
          "What tells your code when to stop walking — a fixed number, or something you can check each step?",
          "Loop while `battery >= 7`. Inside: take 7 away and count the step.",
          "Worked example: `while (fuel >= 3) { fuel -= 3; laps++; }` — starting from fuel 10 gives laps 3, fuel 1.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int battery = in.nextInt();
                  int steps = 0;
                  while (battery >= 7) {
                      battery -= 7;
                      steps++;
                  }
                  System.out.println("Steps: " + steps);
                  System.out.println("Battery left: " + battery);
              }
          }
        `,
        solutionExplanation:
          "The condition is checked before every step, so a robot with less than 7 battery never moves (0 steps). Subtracting inside the loop is what guarantees it ends.",
        tests: [
          { description: "Battery 50 → 7 steps, 1 left", stdin: "50", stdout: "Steps: 7\nBattery left: 1" },
          { description: "Too little battery to move", hidden: true, stdin: "6", stdout: "Steps: 0\nBattery left: 6" },
          { description: "Battery runs out exactly", hidden: true, stdin: "70", stdout: "Steps: 10\nBattery left: 0" },
        ],
        feedback: [
          { stdoutPattern: "Steps: 8", message: "One step too many: the battery went below zero. The robot only steps while it has at least 7." },
          { stdoutPattern: "Battery left: -", message: "Negative battery means a step happened that couldn't be afforded — check the loop condition." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    int battery = new Scanner(System.in).nextInt();
                    int steps = battery / 7;
                    System.out.println("Steps: " + steps);
                    System.out.println("Battery left: " + battery % 7);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-methods",
      title: "Methods",
      kind: "lesson",
      concept: "methods",
      syllabusTag: "Unit 2: Methods",
      story: "The robot keeps repeating the same moves. Time to give them names.",
      minutes: 14,
      blocks: [
        {
          type: "text",
          md: "A **method** is a named, reusable block of code. You *define* it once and *call* it as often as you need. Methods keep programs short, readable and easy to fix — change the method and every call benefits.\n\nA method's header says what it needs and what it gives back:\n- `static` — for now, every method you write sits next to `main` and is static\n- the **return type** — `int`, `String`, `boolean`… or `void` if it returns nothing\n- the **name** — a verb in camelCase, like `computeArea`\n- the **parameters** — the inputs, each with a type",
        },
        {
          type: "code",
          title: "Defining and calling methods",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    static int square(int x) {", "Takes one int (called x inside the method) and promises to return an int."],
            ["        return x * x;", "return sends the value back to the caller and ends the method."],
            ["    }", ""],
            ["", ""],
            ["    static void greet(String name) {", "void: does something (prints) but returns no value."],
            ['        System.out.println("Hello, " + name);', ""],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int a = square(4);", "The call square(4) runs the method with x = 4 and is replaced by its result, 16."],
            ["        System.out.println(a + square(3));", "16 + 9 = 25. A call can be used anywhere a value can."],
            ['        greet("Ada");', "A void call is a statement on its own."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "method-call",
        },
        {
          type: "text",
          md: "**Scope:** variables declared inside a method exist only inside that method. `main` can't see the `x` in `square`, and `square` can't see `main`'s variables — information goes in through parameters and comes out through `return`. A method with a non-void return type must return a value on **every** path through it.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "Interviewers often hand you a method signature like `static boolean isPalindrome(String s)` and ask you to fill it in. Reading a signature fluently — inputs, output type — is the first step of every coding question.",
        },
        {
          type: "check",
          question: "void-vs-return",
        },
      ],
      summary: {
        keyIdeas: [
          "Define once, call many times: `static returnType name(params) { ... }`.",
          "Parameters carry values in; return carries one value out.",
          "void methods perform an action and return nothing.",
          "Variables are scoped to the method (and block) that declares them.",
        ],
        mistakes: [
          "Forgetting `return` in a non-void method, or returning on only some paths.",
          "Trying to use a variable from main inside another method.",
          "Calling a method with the wrong number or type of arguments.",
        ],
      },
      questions: [
        {
          slug: "method-call",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            public class Main {
                static int twice(int n) {
                    return n * 2;
                }

                public static void main(String[] args) {
                    int x = twice(3);
                    System.out.println(twice(x) + 1);
                }
            }
          `,
          answer: "13",
          explanation: "twice(3) is 6, stored in x. twice(6) is 12, plus 1 is 13. Each call uses its own argument.",
        },
        {
          slug: "void-vs-return",
          kind: "mcq",
          prompt: "Which header fits a method that checks whether a number is even and gives back the answer?",
          options: [
            { id: "a", text: "static void isEven(int n)", feedback: "void returns nothing — the caller couldn't use the answer." },
            { id: "b", text: "static boolean isEven(int n)" },
            { id: "c", text: "static int isEven(boolean n)", feedback: "The input is a number, and the answer is yes/no — the types are swapped." },
            { id: "d", text: "static boolean isEven()", feedback: "Without a parameter, which number would it check?" },
          ],
          answer: "b",
          explanation: "It takes the number to test (int n) and returns a yes/no answer (boolean). The name reads naturally: if (isEven(x)) …",
        },
      ],
    },
    {
      slug: "gear-toolbelt",
      title: "Toolbelt",
      kind: "trial",
      concept: "methods",
      syllabusTag: "Unit 2: Methods",
      story: "The robot needs a reusable tool: pick the strongest of three power cells.",
      minutes: 10,
      challenge: {
        instructions:
          "Write a method `static int maxOfThree(int a, int b, int c)` that returns the largest of its three arguments, and use it in `main`.\n\nThe input is three whole numbers; print `Max: ` followed by the largest. For `4 9 2`, print `Max: 9`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              // define maxOfThree here

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int a = in.nextInt();
                  int b = in.nextInt();
                  int c = in.nextInt();
                  // call maxOfThree and print the result
              }
          }
        `,
        requirements: [
          { description: "Defines static int maxOfThree(int a, int b, int c)", pattern: "static\\s+int\\s+maxOfThree\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)", mustMatch: true },
          { description: "Calls maxOfThree from main", pattern: "maxOfThree\\s*\\(\\s*\\w+\\s*,", mustMatch: true },
        ],
        hints: [
          "Start the method with the best-so-far: `int best = a;` — then check whether b or c beats it.",
          "Two separate ifs (not else-if) let both b and c have a turn: `if (b > best) best = b;`.",
          "Worked example: `static int maxOfTwo(int x, int y) { if (x > y) { return x; } return y; }`",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static int maxOfThree(int a, int b, int c) {
                  int best = a;
                  if (b > best) {
                      best = b;
                  }
                  if (c > best) {
                      best = c;
                  }
                  return best;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int a = in.nextInt();
                  int b = in.nextInt();
                  int c = in.nextInt();
                  System.out.println("Max: " + maxOfThree(a, b, c));
              }
          }
        `,
        solutionExplanation:
          "Keeping a \"best so far\" and letting each other value challenge it scales to any number of values — it's the same idea you'll use to find the maximum of an array. (Math.max(a, Math.max(b, c)) also works.)",
        tests: [
          { description: "Max of 4 9 2 is 9", stdin: "4 9 2", stdout: "Max: 9" },
          { description: "Largest value last", hidden: true, stdin: "1 2 3", stdout: "Max: 3" },
          { description: "Negative numbers", hidden: true, stdin: "-5 -2 -9", stdout: "Max: -2" },
          { description: "Ties", hidden: true, stdin: "7 7 3", stdout: "Max: 7" },
        ],
        feedback: [
          { codePattern: "else\\s+if\\s*\\(\\s*c\\s*>", message: "With else-if, c only gets checked when b didn't win — so 1 2 3 would miss the 3. Give each value its own if." },
          { codePattern: "int\\s+best\\s*=\\s*0", message: "Starting best at 0 breaks for all-negative inputs (-5 -2 -9 would give 0). Start with one of the actual values." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static int maxOfThree(int a, int b, int c) {
                    int best = 0;
                    if (a > best) best = a;
                    if (b > best) best = b;
                    if (c > best) best = c;
                    return best;
                }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int a = in.nextInt(), b = in.nextInt(), c = in.nextInt();
                    System.out.println("Max: " + maxOfThree(a, b, c));
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-problem-solving",
      title: "Solving problems step by step",
      kind: "lesson",
      concept: "problem-solving",
      syllabusTag: "Unit 2: Problem Solving",
      story: "The Gearworks' chief engineer never starts typing first. Here's her method.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "Knowing Java syntax isn't the same as knowing *what to write*. Experienced programmers follow a routine before and after coding:\n- **Understand** — what's the input? What exactly must be output? Work one example by hand.\n- **Plan** — write the steps in plain words (pseudocode) before any Java.\n- **Code** — translate one step at a time, running as you go.\n- **Check** — trace your code with the example, then try edge cases: the smallest input, zero, negatives, ties.",
        },
        {
          type: "text",
          md: "**Worked example — is a number prime?** A prime has exactly two divisors: 1 and itself.\n\nPlan in plain words:\n- Numbers below 2 are not prime.\n- Try every divisor d from 2 up to n − 1. If any divides n evenly (`n % d == 0`), it's not prime.\n- If none do, it's prime.",
        },
        {
          type: "code",
          title: "From plan to code",
          runnable: true,
          stdin: "21",
          lines: [
            ["import java.util.Scanner;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int n = new Scanner(System.in).nextInt();", "Understand: one whole number in."],
            ["        boolean prime = n >= 2;", "Plan step 1: below 2 is never prime."],
            ["        for (int d = 2; d < n; d++) {", "Plan step 2: try each candidate divisor."],
            ["            if (n % d == 0) {", "Divides evenly → found a divisor."],
            ["                prime = false;", ""],
            ["                break;", "No need to keep checking once we know."],
            ["            }", ""],
            ["        }", ""],
            ['        System.out.println(n + (prime ? " is prime" : " is not prime"));', "condition ? a : b picks a if true, b if false — a compact if/else for values."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "edge-case",
        },
        {
          type: "text",
          md: "**Trace tables** make loops visible. Write one column per variable and one row per repetition. For n = 9: d = 2 → 9 % 2 = 1, keep going; d = 3 → 9 % 3 = 0 → not prime, break. When your output is wrong, a trace table shows *where* it went wrong.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "This routine is exactly what interviewers grade: they want to hear you restate the problem, ask about edge cases, describe a plan, and test your code — not just see the final answer. You'll practise it formally in the Interview Arena.",
        },
        {
          type: "check",
          question: "plan-order",
        },
      ],
      summary: {
        keyIdeas: [
          "Understand → plan → code → check, every time.",
          "Pseudocode first: plain-language steps you then translate.",
          "Trace tables reveal what a loop actually does.",
          "Always test edge cases: smallest input, zero, negatives, duplicates.",
        ],
        mistakes: [
          "Starting to type before understanding the expected output.",
          "Testing only the example you were given.",
          "Writing everything at once instead of running after each step.",
        ],
      },
      questions: [
        {
          slug: "edge-case",
          kind: "mcq",
          prompt: "The prime checker above starts with `prime = n >= 2`. Which input would be wrongly reported as prime if it started with `prime = true` instead?",
          options: [
            { id: "a", text: "2", feedback: "2 really is prime — the loop doesn't run, and true is the right answer." },
            { id: "b", text: "1" },
            { id: "c", text: "9", feedback: "9 % 3 == 0, so the loop would still set prime to false." },
            { id: "d", text: "15", feedback: "15 % 3 == 0, so the loop still catches it." },
          ],
          answer: "b",
          explanation: "For n = 1 the loop (d from 2 while d < 1) never runs, so nothing changes prime. Starting at true would report 1 as prime — that's why the edge case is handled up front.",
        },
        {
          slug: "plan-order",
          kind: "mcq",
          prompt: "You're given a new problem. What should you do first?",
          options: [
            { id: "a", text: "Start writing the loop — you can figure out the rest as you go", feedback: "Coding before understanding is the most common way to solve the wrong problem." },
            { id: "b", text: "Work through one example by hand to confirm the exact input and output" },
            { id: "c", text: "Look up the fastest possible algorithm", feedback: "Optimising comes after you have a correct plan." },
          ],
          answer: "b",
          explanation: "An example worked by hand confirms you understand the input, the output format and the logic — it also becomes your first test case.",
        },
      ],
    },
    {
      slug: "gear-signal-pattern",
      title: "Signal pattern",
      kind: "trial",
      concept: "problem-solving",
      syllabusTag: "Unit 2: Problem Solving",
      story: "The Gearworks' signal tower blinks a pattern to coordinate the machines.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is a number `n`. For every number from 1 to n, print one line:\n- `GearWorks` if it's divisible by both 3 and 5\n- `Gear` if divisible by 3\n- `Works` if divisible by 5\n- otherwise the number itself\n\nFor `n = 5`: `1`, `2`, `Gear`, `4`, `Works` (one per line).",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();

              }
          }
        `,
        hints: [
          "Loop i from 1 to n; inside, an if / else if / else chain decides what to print.",
          "Order matters: check \"divisible by both\" first — otherwise 15 stops at the \"divisible by 3\" branch.",
          "Worked example: `if (i % 6 == 0) { ... } else if (i % 2 == 0) { ... }` — the more specific test must come first.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  for (int i = 1; i <= n; i++) {
                      if (i % 3 == 0 && i % 5 == 0) {
                          System.out.println("GearWorks");
                      } else if (i % 3 == 0) {
                          System.out.println("Gear");
                      } else if (i % 5 == 0) {
                          System.out.println("Works");
                      } else {
                          System.out.println(i);
                      }
                  }
              }
          }
        `,
        solutionExplanation:
          "The chain is checked top to bottom, so the combined case must come first. (i % 15 == 0 is an equivalent first test.) Each number prints exactly one line.",
        tests: [
          { description: "Pattern up to 5", stdin: "5", stdout: "1\n2\nGear\n4\nWorks" },
          {
            description: "Pattern up to 15 (includes a GearWorks)",
            hidden: true,
            stdin: "15",
            stdout: "1\n2\nGear\n4\nWorks\nGear\n7\n8\nGear\nWorks\n11\nGear\n13\n14\nGearWorks",
          },
          { description: "Just one number", hidden: true, stdin: "1", stdout: "1" },
        ],
        feedback: [
          {
            codePattern: "%\\s*3\\s*==\\s*0\\s*\\)[\\s\\S]*(%\\s*15|&&)",
            message: "Your \"divisible by 3\" check comes before the \"divisible by both\" check, so 15 stops at Gear. Put the combined test first.",
          },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    int n = new Scanner(System.in).nextInt();
                    for (int i = 1; i <= n; i++) {
                        if (i % 3 == 0) System.out.println("Gear");
                        else if (i % 5 == 0) System.out.println("Works");
                        else if (i % 15 == 0) System.out.println("GearWorks");
                        else System.out.println(i);
                    }
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-prime-sensor",
      title: "Prime sensor",
      kind: "trial",
      concept: "problem-solving",
      syllabusTag: "Unit 2: Problem Solving",
      story: "The vault's lock only accepts prime-numbered keycards.",
      minutes: 12,
      challenge: {
        instructions:
          "Write `static boolean isPrime(int n)` and use it. The input is a keycard number; print `PRIME` or `NOT PRIME`.\n\nExamples: `7` → `PRIME`, `12` → `NOT PRIME`. Remember: numbers below 2 are not prime.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {

              public static void main(String[] args) {
                  int n = new Scanner(System.in).nextInt();

              }
          }
        `,
        requirements: [{ description: "Defines static boolean isPrime(int n)", pattern: "static\\s+boolean\\s+isPrime\\s*\\(\\s*int\\s+\\w+\\s*\\)", mustMatch: true }],
        hints: [
          "You planned this exact problem in the lesson — now it lives in a method that returns true or false.",
          "Inside isPrime: return false for n < 2; return false as soon as a divisor is found; return true after the loop.",
          "Worked example: `static boolean hasEvenDigit(int n) { while (n > 0) { if (n % 10 % 2 == 0) return true; n /= 10; } return false; }`",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static boolean isPrime(int n) {
                  if (n < 2) {
                      return false;
                  }
                  for (int d = 2; d * d <= n; d++) {
                      if (n % d == 0) {
                          return false;
                      }
                  }
                  return true;
              }

              public static void main(String[] args) {
                  int n = new Scanner(System.in).nextInt();
                  System.out.println(isPrime(n) ? "PRIME" : "NOT PRIME");
              }
          }
        `,
        solutionExplanation:
          "Returning early keeps the logic flat. The loop only needs d * d <= n: if n had a divisor larger than its square root, it would also have one smaller — a speed-up you'll analyse properly in the Interview Arena.",
        tests: [
          { description: "7 is prime", stdin: "7", stdout: "PRIME" },
          { description: "12 is not prime", stdin: "12", stdout: "NOT PRIME" },
          { description: "1 is not prime", hidden: true, stdin: "1", stdout: "NOT PRIME" },
          { description: "2 is prime", hidden: true, stdin: "2", stdout: "PRIME" },
          { description: "A square of a prime", hidden: true, stdin: "49", stdout: "NOT PRIME" },
          { description: "A large prime", hidden: true, stdin: "7919", stdout: "PRIME" },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static boolean isPrime(int n) {
                    for (int d = 2; d < n; d++) {
                        if (n % d == 0) return false;
                    }
                    return true;
                }
                public static void main(String[] args) {
                    int n = new Scanner(System.in).nextInt();
                    System.out.println(isPrime(n) ? "PRIME" : "NOT PRIME");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "gear-guardian",
      title: "Guardian of the Gearworks",
      kind: "quiz",
      concept: "gearworks-mastery",
      syllabusTag: "Unit 2 review",
      story: "The Gearworks guardian spins up its cogs. Answer true, or the gears stay locked.",
      minutes: 15,
      passingScore: 75,
      questions: [
        {
          slug: "else-if-order",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int t = 95;
            if (t > 50) {
                System.out.println("warm");
            } else if (t > 90) {
                System.out.println("hot");
            } else {
                System.out.println("cold");
            }
          `,
          answer: "warm",
          explanation: "t > 50 is checked first and is true, so \"warm\" prints and the chain stops. The broader test hides the narrower one — order else-ifs from most specific to least.",
          reviewLesson: "gear-conditions",
        },
        {
          slug: "or-logic",
          kind: "mcq",
          prompt: "`boolean ok = !(x > 10) || x == 15;` For which value of x is ok **false**?",
          options: [
            { id: "a", text: "5", feedback: "x > 10 is false, so !(false) is true — ok is true." },
            { id: "b", text: "15", feedback: "x == 15 is true, and || needs only one side — ok is true." },
            { id: "c", text: "12" },
            { id: "d", text: "10", feedback: "10 > 10 is false, so the left side is true — ok is true." },
          ],
          answer: "c",
          explanation: "For 12: 12 > 10 is true, so !(true) is false; 12 == 15 is false. false || false is false.",
          reviewLesson: "gear-conditions",
        },
        {
          slug: "for-sum",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int total = 0;
            for (int i = 1; i < 5; i++) {
                total += i * i;
            }
            System.out.println(total);
          `,
          answer: "30",
          explanation: "i runs 1, 2, 3, 4 (i < 5 stops at 5). 1 + 4 + 9 + 16 = 30.",
          reviewLesson: "gear-loops",
        },
        {
          slug: "infinite-loop",
          kind: "mcq",
          prompt: "Why does this never finish? `int i = 0; while (i < 10) { System.out.println(i); }`",
          options: [
            { id: "a", text: "i < 10 is a syntax error", feedback: "It compiles fine — the problem appears only when it runs." },
            { id: "b", text: "Nothing inside the loop changes i, so i < 10 stays true forever" },
            { id: "c", text: "println can't print ints", feedback: "println prints ints happily." },
          ],
          answer: "b",
          explanation: "A while loop ends only when its condition becomes false. i stays 0, so 0 < 10 is always true. Adding i++ inside fixes it.",
          reviewLesson: "gear-loops",
        },
        {
          slug: "accumulator-reset",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            for (int i = 1; i <= 3; i++) {
                int count = 0;
                count++;
                System.out.print(count);
            }
          `,
          answer: "111",
          explanation: "count is declared inside the loop, so it's recreated as 0 on every repetition — it can never get past 1. Accumulators belong before the loop.",
          reviewLesson: "gear-loops",
        },
        {
          slug: "method-return",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            public class Main {
                static int f(int x) {
                    if (x > 3) {
                        return x - 3;
                    }
                    return x + 3;
                }

                public static void main(String[] args) {
                    System.out.println(f(5) + f(1));
                }
            }
          `,
          answer: "6",
          explanation: "f(5): 5 > 3, so it returns 2. f(1): 1 > 3 is false, so it returns 4. 2 + 4 = 6. return ends the method immediately.",
          reviewLesson: "gear-methods",
        },
        {
          slug: "missing-return",
          kind: "mcq",
          prompt: "Why won't this compile? `static int sign(int n) { if (n > 0) { return 1; } else if (n < 0) { return -1; } }`",
          options: [
            { id: "a", text: "When n is 0, neither branch runs and the method returns nothing" },
            { id: "b", text: "Methods can't contain else if", feedback: "else if works anywhere an if does." },
            { id: "c", text: "-1 isn't a valid int", feedback: "Negative numbers are perfectly valid ints." },
          ],
          answer: "a",
          explanation: "A method declared int must return on every path. For n == 0 both conditions are false, so javac reports \"missing return statement\". A final return 0; fixes it.",
          reviewLesson: "gear-methods",
        },
        {
          slug: "edge-first",
          kind: "mcq",
          prompt: "Your program reads a count `n`, then n scores, and prints `total / n`. Which test is the most important edge case to try?",
          options: [
            { id: "a", text: "n = 100 with typical scores", feedback: "That's a normal case — useful, but it rarely reveals bugs." },
            { id: "b", text: "n = 0" },
            { id: "c", text: "n = 3 where every score is 50", feedback: "A reasonable check, but not the case most likely to crash." },
          ],
          answer: "b",
          explanation: "With n = 0 the program divides by zero and crashes. Edge cases (zero, one item, negatives) are where bugs hide — always test them.",
          reviewLesson: "gear-problem-solving",
        },
      ],
    },
  ],
};
