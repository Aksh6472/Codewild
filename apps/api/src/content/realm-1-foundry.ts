import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 1 — how programs work, environment, variables, types, I/O, operators.
// Trials keep the Foundry's `Robot` class from Milestone 3 (CURRICULUM.md
// levels 1-3); later realms switch to the conventional `Main`.
export const foundry: RealmDef = {
  slug: "foundry",
  name: "The Silent Foundry",
  subtitle: "Programs, variables, input & output, operators",
  story:
    "The foundry's robots have gone quiet. Every line of Java you write brings another machine back to life — starting with a single word.",
  theme: "village",
  summary: {
    keyIdeas: [
      "Java source (.java) is compiled by javac into bytecode (.class), which the JVM runs.",
      "Every program starts in `public static void main(String[] args)`; statements run top to bottom and end with `;`.",
      "A variable has a type, a name and a value: `int power = 75;`. `int` holds whole numbers, `double` decimals, `boolean` true/false, `char` one character, `String` text.",
      "`System.out.println` prints and moves to a new line; `print` stays on the same line. `Scanner` reads input.",
      "`/` between two ints drops the remainder; `%` gives the remainder. `*` and `/` happen before `+` and `-`.",
    ],
    mistakes: [
      "Forgetting the semicolon at the end of a statement.",
      "Writing `system.out.println` — Java is case-sensitive, it's `System`.",
      "Expecting `7 / 2` to be `3.5` — with two ints it's `3`.",
      "Writing `\"Total: \" + a + b` and getting `Total: 23` instead of `Total: 5` — add parentheses: `(a + b)`.",
      "Using `=` (assignment) where you meant to compare with `==`.",
    ],
  },
  levels: [
    {
      slug: "foundry-how-programs-work",
      title: "How programs work",
      kind: "lesson",
      concept: "program-structure",
      syllabusTag: "Unit 1: Program Structure",
      story: "Before the robot can speak, you need to know how instructions reach it.",
      minutes: 10,
      blocks: [
        {
          type: "text",
          md: "A **program** is a list of instructions a computer follows, in order. Computers only understand machine code, so we write in a readable language — Java — and a tool translates it.\n\nJava's translation happens in two steps:\n- **javac** (the compiler) checks your `.java` file and turns it into **bytecode** (a `.class` file). If your code breaks Java's grammar rules, this is where you get a *compile error*.\n- **java** starts the **JVM** (Java Virtual Machine), which runs the bytecode. Problems that only show up while running are *runtime errors*.",
        },
        {
          type: "callout",
          tone: "tip",
          md: "**Your coding environment.** In Atlas, the editor in your browser *is* your environment: pressing **Run** sends your code to a sandbox that compiles it with `javac` and runs it with `java` (JDK 21).\n\nTo code on your own computer later:\n- Install a JDK (Java Development Kit), version 17 or newer.\n- Check it works: run `java -version` in a terminal.\n- Save code as `Main.java`, then run `javac Main.java` followed by `java Main`.\n- An editor or IDE with Java support makes this a single click.",
        },
        {
          type: "code",
          title: "Your first program",
          runnable: true,
          lines: [
            ["public class Main {", "Every Java program lives inside a class. Its name must match the file name: Main.java."],
            ["    public static void main(String[] args) {", "The entry point — Java starts running here. You'll learn each word later; for now, copy it exactly."],
            ['        System.out.println("Hello, Foundry!");', "A statement: print the text in quotes, then move to a new line. It ends with a semicolon."],
            ["    }", "Closes main."],
            ["}", "Closes the class. Every { needs a matching }."],
          ],
        },
        {
          type: "check",
          question: "javac-role",
        },
        {
          type: "text",
          md: "Statements run **top to bottom**, one at a time. `println` prints and then starts a new line; `print` prints and stays on the same line. Java is **case-sensitive**: `System` and `system` are different names, and only one of them exists.",
        },
        {
          type: "code",
          title: "Order matters",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        System.out.print("Power ");', "Prints without a newline, so the next output continues on this line."],
            ['        System.out.println("on");', "Continues the same line, then ends it."],
            ['        System.out.println("Systems ready");', "Starts on a fresh line."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "print-vs-println",
        },
        {
          type: "callout",
          tone: "warning",
          md: "If Run shows a compile error, read the **first** error message first — later errors are often caused by the first one. A missing `;` or `}` is the most common culprit.",
        },
      ],
      summary: {
        keyIdeas: [
          "javac compiles source into bytecode; the JVM runs it.",
          "Code runs from the first line of main to the last, in order.",
          "println ends the line; print doesn't.",
        ],
        mistakes: [
          "Missing semicolons and unmatched braces.",
          "Wrong capitalisation: `system.out.println`, `String` vs `string`.",
          "A class name that doesn't match its file name.",
        ],
      },
      questions: [
        {
          slug: "javac-role",
          kind: "mcq",
          prompt: "What does `javac` do?",
          options: [
            { id: "a", text: "Runs your program line by line", feedback: "Running is the JVM's job (the `java` command). javac comes first." },
            { id: "b", text: "Translates your .java source into bytecode, reporting any compile errors" },
            { id: "c", text: "Downloads Java libraries from the internet", feedback: "javac works entirely on your source file — no downloading involved." },
            { id: "d", text: "Formats your code so it's easier to read", feedback: "Formatting is an editor feature; javac checks and translates code." },
          ],
          answer: "b",
          explanation:
            "javac is the compiler: it checks your code follows Java's rules and translates it into bytecode (.class). The JVM then runs that bytecode — two separate steps.",
        },
        {
          slug: "print-vs-println",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            System.out.print("A");
            System.out.print("B");
            System.out.println("C");
            System.out.println("D");
          `,
          answer: "ABC\nD",
          explanation:
            "print keeps the cursor on the same line, so A, B and C join up as ABC. println(\"C\") ends that line, and D prints on the next one.",
        },
      ],
    },
    {
      slug: "foundry-wake-up",
      title: "Wake-up",
      kind: "trial",
      concept: "print-output",
      syllabusTag: "Unit 1: Program Structure",
      story: "The foundry's first robot has powered on but has never spoken. Your first line of code gives it a voice.",
      minutes: 5,
      challenge: {
        instructions: "Make the robot say hello to the foundry. It must print exactly: `Hello, Foundry!`",
        guidance: "guided",
        steps: [
          "Find the comment that says where to write your code.",
          "Write a System.out.println statement with the text in double quotes.",
          "End the statement with a semicolon, then press Run.",
        ],
        starterCode: java`
          public class Robot {
              public static void main(String[] args) {
                  // Write your code below this line

              }
          }
        `,
        hints: [
          "Printing a line of text is done with `System.out.println(...)`.",
          "Text goes inside double quotes, and the statement ends with `;`. Capital letters and punctuation must match exactly.",
          "Worked example — printing a different message: `System.out.println(\"Good morning!\");`",
        ],
        solution: java`
          public class Robot {
              public static void main(String[] args) {
                  System.out.println("Hello, Foundry!");
              }
          }
        `,
        solutionExplanation:
          "println prints the text between the quotes exactly as written and ends the line. The quotes mark where the text starts and stops — they aren't printed.",
        tests: [{ description: "Robot prints exactly: Hello, Foundry!", stdout: "Hello, Foundry!" }],
        feedback: [
          { stdoutPattern: "^hello, foundry!?$", message: "Close! Java output is case-sensitive — check the capital H and F." },
          { stdoutPattern: "^Hello,? Foundry$", message: "Almost — check the punctuation: a comma after Hello and an exclamation mark at the end." },
        ],
        wrongSolutions: [
          java`
            public class Robot {
                public static void main(String[] args) {
                    System.out.println("hello foundry");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "foundry-variables",
      title: "Variables & data types",
      kind: "lesson",
      concept: "variables-types",
      syllabusTag: "Unit 1: Variables & Data Types",
      story: "The robot needs to remember things: its name, its power, whether it's online.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "A **variable** is a named box that holds a value. In Java, every box has a **type** that decides what can go in it — and the type can never change.\n\nDeclaring a variable has three parts: `type name = value;`",
        },
        {
          type: "code",
          title: "The everyday types",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int power = 75;", "int: whole numbers (no decimal point), from about -2 billion to 2 billion."],
            ["        double temperature = 36.6;", "double: numbers with a decimal point."],
            ["        boolean online = true;", "boolean: only true or false."],
            ["        char grade = 'A';", "char: a single character, in single quotes."],
            ['        String name = "Spark";', "String: text, in double quotes. Capital S — it's a class, not a basic type."],
            ['        System.out.println(name + " has power " + power);', "+ between a String and anything else joins them into one String."],
            ["        power = 90;", "Assignment: replace the value. No type this time — the box already exists."],
            ['        System.out.println("Power is now " + power);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "pick-type",
        },
        {
          type: "text",
          md: "**Naming rules:** names can contain letters, digits, `_` and `$`, can't start with a digit, and can't be a Java keyword like `class`. By convention Java uses **camelCase**: `batteryLevel`, not `battery_level` or `BatteryLevel`.\n\nA variable must be given a value before you read it — Java refuses to compile code that might use an empty box.",
        },
        {
          type: "callout",
          tone: "warning",
          md: "`int count = 3.7;` doesn't compile: a decimal won't fit in an int box. Going the other way is fine — `double d = 3;` stores `3.0`.",
        },
        {
          type: "check",
          question: "reassign",
        },
      ],
      summary: {
        keyIdeas: [
          "Declare with `type name = value;`; reassign with `name = value;`.",
          "int, double, boolean and char are primitive types; String holds text.",
          "Use camelCase names that say what the value means.",
        ],
        mistakes: [
          "Putting the type again when reassigning (`int power = 90;` twice) — that's a second declaration and won't compile.",
          "Using single quotes for text (`'Spark'`) — single quotes are only for one char.",
          "Reading a variable before it has a value.",
        ],
      },
      questions: [
        {
          slug: "pick-type",
          kind: "mcq",
          prompt: "Which type fits a robot's battery percentage that can be 87.5?",
          options: [
            { id: "a", text: "int", feedback: "int can only hold whole numbers — the .5 wouldn't fit." },
            { id: "b", text: "double" },
            { id: "c", text: "boolean", feedback: "boolean holds only true or false." },
            { id: "d", text: "char", feedback: "char holds one character, like 'A'." },
          ],
          answer: "b",
          explanation: "87.5 has a decimal part, so it needs a double. int would force you to drop the .5.",
        },
        {
          slug: "reassign",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int crates = 4;
            crates = 7;
            crates = crates + 2;
            System.out.println("Crates: " + crates);
          `,
          answer: "Crates: 9",
          explanation:
            "Each assignment replaces the old value: 4, then 7, then 7 + 2 = 9. The right-hand side is worked out first, using the current value, before it's stored.",
        },
      ],
    },
    {
      slug: "foundry-name-tag",
      title: "Name tag",
      kind: "trial",
      concept: "variables-strings",
      syllabusTag: "Unit 1: Variables & Data Types",
      story: "The robot needs an identity before it can be registered in the foundry's systems.",
      minutes: 5,
      challenge: {
        instructions:
          "Store the robot's name and power level, then print its name tag in the form `Name - Power: number` — for example `Spark - Power: 75`. Any name and any whole number from 0 to 100 will do.",
        guidance: "guided",
        steps: [
          "Put a name between the quotes of the `name` variable.",
          "Change the power from 0 to a whole number between 1 and 100.",
          "Leave the println line as it is and press Run.",
        ],
        starterCode: java`
          public class Robot {
              public static void main(String[] args) {
                  String name = "";      // give your robot a name
                  int power = 0;          // set its power level (0-100)

                  System.out.println(name + " - Power: " + power);
              }
          }
        `,
        hints: [
          "The name is text, so it goes between double quotes: `\"Spark\"`.",
          "An empty String `\"\"` prints nothing — so right now the tag starts with \" - Power\". Fill both values in.",
          "Worked example: `String city = \"Pune\"; int year = 2024;` then `city + \" - Year: \" + year` prints `Pune - Year: 2024`.",
        ],
        solution: java`
          public class Robot {
              public static void main(String[] args) {
                  String name = "Spark";
                  int power = 75;

                  System.out.println(name + " - Power: " + power);
              }
          }
        `,
        solutionExplanation:
          "The + operator joins the String name, the literal \" - Power: \" and the int power (converted to text) into one line.",
        tests: [{ description: "Name tag shows a name and a numeric power level", stdoutPattern: "^.+ - Power: \\d+$" }],
        feedback: [
          { stdoutPattern: "^ - Power", message: "The tag starts with \" - Power\" — the name is still the empty String \"\". Put a name between the quotes." },
        ],
        wrongSolutions: [
          java`
            public class Robot {
                public static void main(String[] args) {
                    String name = "";
                    int power = 0;
                    System.out.println(name + " - Power: " + power);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "foundry-io",
      title: "Input & output",
      kind: "lesson",
      concept: "input-output",
      syllabusTag: "Unit 1: Input & Output",
      story: "Visitors are arriving at the foundry gate. The robot must listen as well as speak.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "So far your programs always print the same thing. Real programs read **input** and react to it. Java's `Scanner` reads what's typed in (standard input) one piece at a time.\n\nIn trials, the input is provided for you — each test case types different values into your program, which is how the trial checks you *calculated* the answer rather than hardcoding it.",
        },
        {
          type: "code",
          title: "Reading a name and a number",
          runnable: true,
          stdin: "Ada 20",
          lines: [
            ["import java.util.Scanner;", "Scanner lives in the java.util package, so we import it at the very top."],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Scanner in = new Scanner(System.in);", "Create one Scanner that reads from standard input (System.in)."],
            ["        String name = in.next();", "next() reads the next word (stops at a space or newline)."],
            ["        int age = in.nextInt();", "nextInt() reads the next whole number."],
            ['        System.out.println("Hi " + name + ", age " + age);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "text",
          md: "The useful Scanner methods:\n- `next()` — the next word\n- `nextLine()` — the rest of the current line, spaces included\n- `nextInt()` / `nextDouble()` — the next number\n\nTry editing the input box above and running again: the same program gives different output for different input.",
        },
        {
          type: "check",
          question: "scanner-method",
        },
        {
          type: "text",
          md: "When you join text and numbers with `+`, Java works **left to right**. As soon as one side is a String, `+` means \"join\", not \"add\". Parentheses force the arithmetic to happen first.",
        },
        {
          type: "code",
          title: "Join vs add",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int a = 2, b = 3;", "Two int variables declared on one line."],
            ['        System.out.println("Sum: " + a + b);', '"Sum: " + 2 is the String "Sum: 2"; adding 3 joins again → "Sum: 23".'],
            ['        System.out.println("Sum: " + (a + b));', "Parentheses run first: 2 + 3 = 5, then it's joined → \"Sum: 5\"."],
            ['        System.out.println(a + b + " total");', "Left to right: 2 + 3 = 5 (both ints), then joined → \"5 total\"."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "concat-order",
        },
      ],
      summary: {
        keyIdeas: [
          "Create one `Scanner in = new Scanner(System.in);` and read values in the order they arrive.",
          "next() reads a word, nextLine() a whole line, nextInt()/nextDouble() a number.",
          "Once a String is involved, + joins — use parentheses around arithmetic.",
        ],
        mistakes: [
          "Forgetting `import java.util.Scanner;`.",
          "Reading with nextInt() when the next input is a word — that crashes with InputMismatchException.",
          "`\"Total: \" + a + b` joining digits instead of adding them.",
        ],
      },
      questions: [
        {
          slug: "scanner-method",
          kind: "mcq",
          prompt: "The input is `New Delhi` and you want both words in one String. Which call reads it?",
          options: [
            { id: "a", text: "in.next()", feedback: "next() stops at the first space, so you'd only get \"New\"." },
            { id: "b", text: "in.nextLine()" },
            { id: "c", text: "in.nextInt()", feedback: "nextInt() reads a number — on text it crashes with InputMismatchException." },
            { id: "d", text: "in.nextWord()", feedback: "Scanner has no nextWord() method — that wouldn't compile." },
          ],
          answer: "b",
          explanation: "nextLine() reads everything up to the end of the line, spaces included. next() reads only up to the first space.",
        },
        {
          slug: "concat-order",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int x = 4;
            System.out.println(x + 1 + "!" + x + 1);
          `,
          answer: "5!41",
          explanation:
            "Left to right: x + 1 is 5 (both ints). 5 + \"!\" becomes the String \"5!\". From then on + joins: \"5!\" + 4 → \"5!4\", + 1 → \"5!41\".",
        },
      ],
    },
    {
      slug: "foundry-visitor-log",
      title: "Visitor log",
      kind: "trial",
      concept: "input-output",
      syllabusTag: "Unit 1: Input & Output",
      story: "The gate robot greets every visitor and logs when their access badge renews — five years from today.",
      minutes: 8,
      challenge: {
        instructions:
          "The input is a visitor's first name and age, e.g. `Ada 20`. Print exactly:\n\n`Welcome, Ada! In 5 years you will be 25.`\n\nYour program must work for any name and age.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  // read the name, then the age

                  // print the welcome line

              }
          }
        `,
        hints: [
          "Read the word with `in.next()` and the number with `in.nextInt()`, in that order.",
          "Check your output for the age: if you see something like `205`, Java joined 20 and 5 as text. Which part should be calculated first?",
          "Worked example: `System.out.println(\"Next year: \" + (year + 1) + \".\");` — the parentheses make Java add before joining.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  String name = in.next();
                  int age = in.nextInt();
                  System.out.println("Welcome, " + name + "! In 5 years you will be " + (age + 5) + ".");
              }
          }
        `,
        solutionExplanation:
          "next() and nextInt() read the two values in order. (age + 5) is in parentheses so it's added as numbers before being joined into the sentence.",
        tests: [
          { description: "Greets Ada (20) correctly", stdin: "Ada 20", stdout: "Welcome, Ada! In 5 years you will be 25." },
          { description: "Works for another visitor", hidden: true, stdin: "Linus 33", stdout: "Welcome, Linus! In 5 years you will be 38." },
        ],
        feedback: [
          {
            stdoutPattern: "be 205\\.?$",
            message:
              "Your age came out as 205: \"...be \" + age + 5 joins the digits as text. Wrap the arithmetic in parentheses: (age + 5).",
          },
          {
            codePattern: "\"Ada\"",
            message: "You've written \"Ada\" into the code — but each test types a different name. Print the variable you read from the Scanner instead.",
          },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Robot {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    String name = in.next();
                    int age = in.nextInt();
                    System.out.println("Welcome, " + name + "! In 5 years you will be " + age + 5 + ".");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "foundry-operators",
      title: "Operators",
      kind: "lesson",
      concept: "operators",
      syllabusTag: "Unit 1: Operators",
      story: "Bridges, batteries and shift clocks — the foundry runs on arithmetic.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "Java's arithmetic operators are `+ - * / %`. Two of them surprise beginners:\n- **Integer division:** when both sides of `/` are ints, the result is an int and the remainder is thrown away. `7 / 2` is `3`.\n- **Remainder (`%`):** `7 % 2` is `1` — what's left over. It's perfect for \"is this even?\" (`n % 2 == 0`) and splitting units (minutes into hours and minutes).",
        },
        {
          type: "code",
          title: "Division and remainder",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        System.out.println(7 / 2);", "Both ints → integer division → 3."],
            ["        System.out.println(7 % 2);", "Remainder of 7 ÷ 2 → 1."],
            ["        System.out.println(7.0 / 2);", "One side is a double → real division → 3.5."],
            ["        System.out.println(2 + 3 * 4);", "* before + (like maths) → 2 + 12 = 14."],
            ["        System.out.println((2 + 3) * 4);", "Parentheses first → 5 * 4 = 20."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "int-division",
        },
        {
          type: "text",
          md: "**Shortcuts for updating a variable:**\n- `x += 5;` means `x = x + 5;` (also `-=`, `*=`, `/=`)\n- `x++;` adds 1, `x--;` subtracts 1\n\n**Comparison** operators produce a boolean: `==` (equal), `!=` (not equal), `<`, `>`, `<=`, `>=`. **Logical** operators combine booleans: `&&` (and), `||` (or), `!` (not). You'll use these constantly in the next realm.",
        },
        {
          type: "code",
          title: "Updating and comparing",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int battery = 50;", ""],
            ["        battery -= 20;", "Same as battery = battery - 20 → 30."],
            ["        battery++;", "Add one → 31."],
            ["        boolean low = battery < 40;", "A comparison is true or false — here, true."],
            ['        System.out.println(battery + " " + low);', "Prints 31 true."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "modulo-use",
        },
      ],
      summary: {
        keyIdeas: [
          "int / int drops the remainder; use a double for real division.",
          "% gives the remainder — use it for even/odd and unit conversion.",
          "Precedence: parentheses, then * / %, then + -.",
          "+=, -=, ++ and -- update a variable in place.",
        ],
        mistakes: [
          "Expecting 7 / 2 to be 3.5.",
          "Using = (store a value) when you mean == (compare).",
          "Forgetting precedence: 2 + 3 * 4 is 14, not 20.",
        ],
      },
      questions: [
        {
          slug: "int-division",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int total = 17;
            int teams = 5;
            System.out.println(total / teams);
            System.out.println(total % teams);
          `,
          answer: "3\n2",
          explanation: "17 / 5 with ints is 3 (the remainder is dropped). 17 % 5 is the remainder: 17 - 3 × 5 = 2.",
        },
        {
          slug: "modulo-use",
          kind: "mcq",
          prompt: "Which expression is true exactly when `n` is even?",
          options: [
            { id: "a", text: "n / 2 == 0", feedback: "n / 2 is half of n — that's only 0 when n is 0 or 1." },
            { id: "b", text: "n % 2 == 0" },
            { id: "c", text: "n % 2 == 1", feedback: "A remainder of 1 means n is odd." },
            { id: "d", text: "n = 2", feedback: "= stores a value; it doesn't compare." },
          ],
          answer: "b",
          explanation: "An even number divides by 2 with nothing left over, so its remainder n % 2 is 0.",
        },
      ],
    },
    {
      slug: "foundry-power-math",
      title: "Power math",
      kind: "trial",
      concept: "operators",
      syllabusTag: "Unit 1: Operators",
      story: "A bridge lies ahead; crossing it costs battery proportional to its length.",
      minutes: 6,
      challenge: {
        instructions:
          "The input is the bridge length in meters. Crossing costs 2 battery per meter. Print `Battery needed: ` followed by the total — for a 12-meter bridge, `Battery needed: 24`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner scanner = new Scanner(System.in);
                  int bridgeLength = scanner.nextInt(); // meters
                  int batteryPerMeter = 2;

                  int batteryNeeded = 0; // replace with the correct formula

                  System.out.println("Battery needed: " + batteryNeeded);
              }
          }
        `,
        hints: [
          "Battery needed depends on two numbers you already have — how do they combine?",
          "Use the variables, not the number 24: a different bridge length is tested too.",
          "Worked example: the cost of `boxes` boxes at `price` each is `boxes * price`.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner scanner = new Scanner(System.in);
                  int bridgeLength = scanner.nextInt(); // meters
                  int batteryPerMeter = 2;

                  int batteryNeeded = bridgeLength * batteryPerMeter;

                  System.out.println("Battery needed: " + batteryNeeded);
              }
          }
        `,
        solutionExplanation:
          "The formula uses the variables, so it works for any bridge: length × cost per meter.",
        tests: [
          { description: "Battery needed for a 12-meter bridge", stdin: "12", stdout: "Battery needed: 24" },
          {
            description: "Battery needed for a different bridge length (catches a hardcoded answer)",
            hidden: true,
            stdin: "7",
            stdout: "Battery needed: 14",
          },
        ],
        feedback: [
          { codePattern: "batteryNeeded\\s*=\\s*24\\s*;", message: "24 is right for this bridge only — another bridge length is tested. Calculate it from the variables." },
          { stdoutPattern: "Battery needed: 14$", message: "That's the battery for the bridge plus 2 — check whether you added where you meant to multiply." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Robot {
                public static void main(String[] args) {
                    Scanner scanner = new Scanner(System.in);
                    int bridgeLength = scanner.nextInt();
                    System.out.println("Battery needed: 24");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "foundry-shift-clock",
      title: "Shift clock",
      kind: "trial",
      concept: "integer-division",
      syllabusTag: "Unit 1: Operators",
      story: "The foundry clock only counts minutes. The night crew wants hours and minutes.",
      minutes: 10,
      challenge: {
        instructions:
          "The input is a number of minutes. Print it as hours and minutes: for `135`, print `2 hours and 15 minutes`. Always use the words `hours` and `minutes`, even for 0 or 1.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int totalMinutes = in.nextInt();

              }
          }
        `,
        hints: [
          "There are 60 minutes in an hour. Which operator tells you how many whole hours fit?",
          "Integer division gives the whole hours; the remainder operator gives what's left over.",
          "Worked example: 250 seconds is `250 / 60` = 4 minutes and `250 % 60` = 10 seconds.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Robot {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int totalMinutes = in.nextInt();
                  int hours = totalMinutes / 60;
                  int minutes = totalMinutes % 60;
                  System.out.println(hours + " hours and " + minutes + " minutes");
              }
          }
        `,
        solutionExplanation:
          "Integer division by 60 counts whole hours and throws the rest away; % 60 is exactly the rest. Together they split any number of minutes.",
        tests: [
          { description: "135 minutes → 2 hours and 15 minutes", stdin: "135", stdout: "2 hours and 15 minutes" },
          { description: "Under an hour", hidden: true, stdin: "59", stdout: "0 hours and 59 minutes" },
          { description: "Exact hours", hidden: true, stdin: "600", stdout: "10 hours and 0 minutes" },
        ],
        feedback: [
          { stdoutPattern: "^2\\.25", message: "You got a decimal — that's real division. Use int division for the hours and % for the leftover minutes." },
          { codePattern: "^(?![\\s\\S]*%)[\\s\\S]*$", message: "How will you find the leftover minutes? The remainder operator % is built for exactly this." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Robot {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int totalMinutes = in.nextInt();
                    System.out.println(totalMinutes / 60 + " hours and " + (totalMinutes - 60) + " minutes");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "foundry-guardian",
      title: "Guardian of the Foundry",
      kind: "quiz",
      concept: "foundry-mastery",
      syllabusTag: "Unit 1 review",
      story: "The foundry's guardian construct blocks the road to the Gearworks. It only lets through engineers who understand what they built.",
      minutes: 12,
      passingScore: 75,
      questions: [
        {
          slug: "compile-vs-run",
          kind: "mcq",
          prompt: "A program has `System.out.println(\"Hi\")` with no semicolon. When is this problem found?",
          options: [
            { id: "a", text: "When javac compiles it — the program never runs" },
            { id: "b", text: "Only when that line runs", feedback: "Grammar mistakes are caught before anything runs — the compiler reads the whole file first." },
            { id: "c", text: "Never — Java adds the semicolon for you", feedback: "Java never guesses missing semicolons; it reports an error." },
          ],
          answer: "a",
          explanation: "A missing semicolon breaks Java's grammar, so javac reports a compile error and no bytecode is produced.",
          reviewLesson: "foundry-how-programs-work",
        },
        {
          slug: "print-sequence",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            System.out.println("Ready");
            System.out.print("Set ");
            System.out.print("Go");
          `,
          answer: "Ready\nSet Go",
          explanation: "println ends the first line; the two print calls continue on the second line.",
          reviewLesson: "foundry-how-programs-work",
        },
        {
          slug: "type-choice",
          kind: "mcq",
          prompt: "Which declaration compiles?",
          options: [
            { id: "a", text: "int count = 2.5;", feedback: "2.5 is a decimal — it doesn't fit in an int." },
            { id: "b", text: "String name = 'Spark';", feedback: "Single quotes are for a single char; text needs double quotes." },
            { id: "c", text: "boolean ready = \"true\";", feedback: "\"true\" in quotes is a String, not the boolean value true." },
            { id: "d", text: "double speed = 3;" },
          ],
          answer: "d",
          explanation: "A whole number fits in a double (it becomes 3.0). The others put a value of the wrong type in the box.",
          reviewLesson: "foundry-variables",
        },
        {
          slug: "reassignment-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int a = 3;
            int b = a;
            a = 10;
            System.out.println(a + " " + b);
          `,
          answer: "10 3",
          explanation: "b = a copies the value 3 into b. Changing a later doesn't change b — they're separate boxes.",
          reviewLesson: "foundry-variables",
        },
        {
          slug: "concat-trap",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int coins = 2;
            int gems = 3;
            System.out.println("Loot: " + coins + gems);
          `,
          answer: "Loot: 23",
          explanation: "\"Loot: \" + 2 is a String, so + 3 joins again: \"Loot: 23\". (coins + gems) in parentheses would give 5.",
          reviewLesson: "foundry-io",
        },
        {
          slug: "scanner-crash",
          kind: "mcq",
          prompt: "The input is `seven`. What happens when the program calls `in.nextInt()`?",
          options: [
            { id: "a", text: "It returns 7", feedback: "Scanner doesn't read words as numbers — only digits." },
            { id: "b", text: "It returns 0", feedback: "There's no default value; the read fails." },
            { id: "c", text: "The program crashes with an InputMismatchException" },
          ],
          answer: "c",
          explanation: "nextInt() can only read digits. Text where a number should be is a runtime error: InputMismatchException.",
          reviewLesson: "foundry-io",
        },
        {
          slug: "division-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int m = 125;
            System.out.println(m / 60 + ":" + m % 60);
          `,
          answer: "2:5",
          explanation: "125 / 60 is 2 whole hours; 125 % 60 is 5 minutes left. % and / happen before +, then the parts are joined.",
          reviewLesson: "foundry-operators",
        },
        {
          slug: "precedence",
          kind: "mcq",
          prompt: "What is the value of `10 - 2 * 3 + 1`?",
          options: [
            { id: "a", text: "25", feedback: "That's ((10 - 2) * 3) + 1 — but * happens before - and +." },
            { id: "b", text: "5" },
            { id: "c", text: "3", feedback: "That's 10 - (2 * 3 + 1)... close, but - and + go left to right: 10 - 6 first, then + 1." },
          ],
          answer: "b",
          explanation: "Multiplication first: 2 * 3 = 6. Then left to right: 10 - 6 = 4, 4 + 1 = 5.",
          reviewLesson: "foundry-operators",
        },
      ],
    },
  ],
};
