import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 4 — object-oriented programming: classes, objects, methods,
// encapsulation, inheritance and polymorphism.
export const guild: RealmDef = {
  slug: "guild",
  name: "The Guild Fortress",
  subtitle: "Classes, objects, encapsulation, inheritance, polymorphism",
  story:
    "The Guild organises hundreds of robots, accounts and adventurers. To model a world that big, you'll design your own types — blueprints that bundle data with the actions on it.",
  theme: "fortress",
  summary: {
    keyIdeas: [
      "A class is a blueprint; an object is one thing built from it with `new`. Fields hold its data, methods its behaviour.",
      "A constructor initialises a new object; `this.name = name;` copies a parameter into a field.",
      "Encapsulation: make fields `private` and expose methods that keep the object valid (e.g. no negative balance).",
      "Inheritance: `class Knight extends Member` reuses Member's fields and methods; `super(...)` calls the parent constructor.",
      "Polymorphism: a `Member` variable can hold any subclass, and calling an overridden method runs the subclass's version.",
      "Abstract classes and interfaces declare methods every subclass must implement.",
    ],
    mistakes: [
      "Forgetting `new` — `Robot r;` declares a reference, it doesn't create an object.",
      "Shadowing: `name = name;` in a constructor assigns the parameter to itself; write `this.name = name;`.",
      "Making fields public so any code can put the object in an invalid state.",
      "Marking more than one class in a file `public`.",
      "Misspelling an overriding method — `@Override` makes the compiler catch it.",
    ],
  },
  levels: [
    {
      slug: "guild-classes",
      title: "Classes & objects",
      kind: "lesson",
      concept: "classes-objects",
      syllabusTag: "Unit 4: Classes and Objects",
      story: "The Guild registers every robot. Each has a name and a power level — and can describe itself.",
      minutes: 15,
      blocks: [
        {
          type: "text",
          md: "So far every variable held a number, a String or an array. **Object-oriented programming** lets you invent new types. A **class** is a blueprint that says what data each object has (**fields**) and what it can do (**methods**). An **object** (or *instance*) is one concrete thing built from the blueprint with `new`.",
        },
        {
          type: "code",
          title: "A class and two objects",
          runnable: true,
          lines: [
            ["class Robot {", "A second class in the same file — not public (only Main can be)."],
            ["    String name;", "Fields: every Robot object gets its own copy of these."],
            ["    int power;", ""],
            ["", ""],
            ["    Robot(String name, int power) {", "A constructor: same name as the class, no return type. Runs when you call new Robot(...)."],
            ["        this.name = name;", "this.name is the field; plain name is the parameter."],
            ["        this.power = power;", ""],
            ["    }", ""],
            ["", ""],
            ["    String describe() {", "An instance method — no static: it works on one particular robot."],
            ['        return name + " (power " + power + ")";', "Inside a method, name means this object's name."],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        Robot spark = new Robot("Spark", 70);', "new builds an object and runs the constructor."],
            ['        Robot bolt = new Robot("Bolt", 40);', "A separate object with its own fields."],
            ["        bolt.power += 25;", "Changing bolt doesn't touch spark."],
            ["        System.out.println(spark.describe());", "Call a method on an object with a dot."],
            ["        System.out.println(bolt.describe());", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "object-count",
        },
        {
          type: "text",
          md: "A variable of a class type holds a **reference** — an arrow pointing at an object — not the object itself. `Robot b = a;` copies the arrow, so both variables point at the **same** robot. A reference that points at nothing is `null`; calling a method on it crashes with a `NullPointerException`.",
        },
        {
          type: "code",
          title: "References",
          runnable: true,
          lines: [
            ["class Counter {", ""],
            ["    int value;", "Fields start at 0 / false / null if the constructor doesn't set them."],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Counter a = new Counter();", "With no constructor written, Java provides an empty one."],
            ["        Counter b = a;", "b points at the SAME object as a."],
            ["        b.value = 5;", ""],
            ["        System.out.println(a.value);", "5 — there's only one Counter."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "reference-alias",
        },
      ],
      summary: {
        keyIdeas: [
          "Class = blueprint (fields + methods); object = instance made with new.",
          "Constructors initialise fields; `this.x = x` resolves the name clash.",
          "Class-type variables hold references; assigning copies the reference.",
        ],
        mistakes: [
          "`name = name;` instead of `this.name = name;`.",
          "Calling a method on a null reference.",
          "Expecting `b = a` to copy an object.",
        ],
      },
      questions: [
        {
          slug: "object-count",
          kind: "mcq",
          prompt: "`Robot a = new Robot(\"A\", 1); Robot b = new Robot(\"B\", 2); Robot c = a;` — how many Robot objects exist?",
          options: [
            { id: "a", text: "1", feedback: "Each new creates an object — there are two news here." },
            { id: "b", text: "2" },
            { id: "c", text: "3", feedback: "c = a doesn't create anything; it copies a's reference." },
          ],
          answer: "b",
          explanation: "Objects are created only by new. c is just another reference to the object a points at.",
        },
        {
          slug: "reference-alias",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Box {
                int items;
                Box(int items) {
                    this.items = items;
                }
            }

            public class Main {
                public static void main(String[] args) {
                    Box x = new Box(3);
                    Box y = x;
                    Box z = new Box(3);
                    y.items = 10;
                    System.out.println(x.items + " " + z.items);
                }
            }
          `,
          answer: "10 3",
          explanation: "x and y refer to the same Box, so changing y.items changes what x sees. z is a different Box that still holds 3.",
        },
      ],
    },
    {
      slug: "guild-forge-robot",
      title: "Forge a robot",
      kind: "trial",
      concept: "classes-objects",
      syllabusTag: "Unit 4: Classes and Objects",
      story: "The Guild's forge builds robots to order. Write the blueprint.",
      minutes: 12,
      challenge: {
        instructions:
          "Complete the `Robot` class: a constructor that stores `name` and `power`, a method `void charge(int amount)` that adds to power (but never above 100), and `String describe()` returning `<name> (power <power>)`.\n\nThe input is a name, a starting power and a charge amount. For `Spark 70 20`, main prints `Spark (power 90)`; for `Spark 90 50` it prints `Spark (power 100)`.",
        guidance: "guided",
        steps: [
          "In the constructor, copy each parameter into its field with this.",
          "In charge, add amount to power, then cap it: if power > 100, set it to 100.",
          "In describe, return the text — don't print it.",
          "main is already written: it builds the robot, charges it and prints describe().",
        ],
        starterCode: java`
          import java.util.Scanner;

          class Robot {
              String name;
              int power;

              Robot(String name, int power) {
                  // store the parameters in the fields
              }

              void charge(int amount) {
                  // add amount, but never exceed 100
              }

              String describe() {
                  return ""; // e.g. Spark (power 90)
              }
          }

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  Robot robot = new Robot(in.next(), in.nextInt());
                  robot.charge(in.nextInt());
                  System.out.println(robot.describe());
              }
          }
        `,
        hints: [
          "Inside the constructor, `name` alone means the parameter. The field is `this.name`.",
          "charge has two steps: `power += amount;` then an if that caps it at 100 (or use Math.min(100, power + amount)).",
          "Worked example: `String label() { return title + \" #\" + id; }` — return builds a String from fields.",
        ],
        solution: java`
          import java.util.Scanner;

          class Robot {
              String name;
              int power;

              Robot(String name, int power) {
                  this.name = name;
                  this.power = power;
              }

              void charge(int amount) {
                  power += amount;
                  if (power > 100) {
                      power = 100;
                  }
              }

              String describe() {
                  return name + " (power " + power + ")";
              }
          }

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  Robot robot = new Robot(in.next(), in.nextInt());
                  robot.charge(in.nextInt());
                  System.out.println(robot.describe());
              }
          }
        `,
        solutionExplanation:
          "The constructor puts the object in a valid starting state; charge changes it while enforcing the 100 cap; describe reports it. Data and the rules about that data live together in one class.",
        tests: [
          { description: "Spark 70 charged by 20 → power 90", stdin: "Spark 70 20", stdout: "Spark (power 90)" },
          { description: "Charging caps at 100", hidden: true, stdin: "Bolt 90 50", stdout: "Bolt (power 100)" },
          { description: "Zero charge", hidden: true, stdin: "Nova 5 0", stdout: "Nova (power 5)" },
        ],
        feedback: [
          { stdoutPattern: "^null \\(power 0\\)$|^null", message: "The robot's name is null and power 0 — the constructor isn't storing its parameters. Use this.name = name;." },
          { stdoutPattern: "^$", message: "Nothing printed — describe() is still returning an empty String." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            class Robot {
                String name;
                int power;
                Robot(String name, int power) { name = name; power = power; }
                void charge(int amount) { power += amount; }
                String describe() { return name + " (power " + power + ")"; }
            }
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    Robot robot = new Robot(in.next(), in.nextInt());
                    robot.charge(in.nextInt());
                    System.out.println(robot.describe());
                }
            }
          `,
        ],
      },
    },
    {
      slug: "guild-encapsulation",
      title: "Encapsulation",
      kind: "lesson",
      concept: "encapsulation",
      syllabusTag: "Unit 4: Encapsulation",
      story: "Anyone could reach in and set a robot's power to -500. The Guild needs locks.",
      minutes: 13,
      blocks: [
        {
          type: "text",
          md: "If every field is open, any code anywhere can break your object's rules — a negative balance, a power of 9000. **Encapsulation** means hiding the data and exposing only methods that keep it valid:\n- mark fields `private` — only code inside the class can touch them\n- provide **getters** (`getBalance()`) to read and methods with rules (`deposit`, `withdraw`) to change\n\nThe rule (an *invariant*, like \"balance is never negative\") is then enforced in one place, and the rest of the program can't bypass it.",
        },
        {
          type: "code",
          title: "A class that protects itself",
          runnable: true,
          lines: [
            ["class Battery {", ""],
            ["    private int charge;", "private: invisible outside Battery."],
            ["", ""],
            ["    int getCharge() {", "A getter: read-only access to the value."],
            ["        return charge;", ""],
            ["    }", ""],
            ["", ""],
            ["    boolean use(int amount) {", "The only way to lower charge — and it checks the rules."],
            ["        if (amount <= 0 || amount > charge) {", "Reject nonsense and overdrafts."],
            ["            return false;", "Report failure; the object stays valid."],
            ["        }", ""],
            ["        charge -= amount;", ""],
            ["        return true;", ""],
            ["    }", ""],
            ["", ""],
            ["    void recharge() {", ""],
            ["        charge = 100;", ""],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Battery b = new Battery();", ""],
            ["        b.recharge();", ""],
            ["        System.out.println(b.use(30) + \" \" + b.getCharge());", "true 70"],
            ["        System.out.println(b.use(500) + \" \" + b.getCharge());", "false 70 — rejected, unchanged."],
            ["        // b.charge = -5;  would not compile: charge is private", "Uncomment it to see the compile error."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "private-access",
        },
        {
          type: "text",
          md: "**static vs instance.** An instance field (`private int charge;`) belongs to each object. A `static` field belongs to the class itself and is shared by every object — useful for counters like \"how many robots have been built\". Static methods (like `main`, or `Math.max`) don't need an object, which is also why they can't use instance fields directly.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "\"Why make fields private?\" is a classic OOP interview question. A strong answer: it protects invariants, lets you change the internal representation later without breaking callers, and keeps every rule about the data in one place.",
        },
        {
          type: "check",
          question: "static-shared",
        },
      ],
      summary: {
        keyIdeas: [
          "private fields + public methods = the class controls its own state.",
          "Getters read; methods with checks change.",
          "static members belong to the class and are shared by all objects.",
        ],
        mistakes: [
          "Adding a setter for every field, which re-opens the door to invalid states.",
          "Reading a private field from another class (compile error).",
          "Using a static field where each object needs its own value.",
        ],
      },
      questions: [
        {
          slug: "private-access",
          kind: "mcq",
          prompt: "In `main` (in class Main), which line compiles against the Battery class above?",
          options: [
            { id: "a", text: "b.charge = 100;", feedback: "charge is private — only code inside Battery can use it." },
            { id: "b", text: "int c = b.charge;", feedback: "Reading a private field from outside is also blocked." },
            { id: "c", text: "int c = b.getCharge();" },
          ],
          answer: "c",
          explanation: "The public way in is the getter. private blocks both reading and writing the field directly from other classes.",
        },
        {
          slug: "static-shared",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Robot {
                static int built = 0;
                int id;
                Robot() {
                    built++;
                    id = built;
                }
            }

            public class Main {
                public static void main(String[] args) {
                    Robot a = new Robot();
                    Robot b = new Robot();
                    Robot c = new Robot();
                    System.out.println(a.id + " " + c.id + " " + Robot.built);
                }
            }
          `,
          answer: "1 3 3",
          explanation: "built is static: one counter shared by all robots, reaching 3. Each robot's id is its own instance field, copied from the counter when it was built.",
        },
      ],
    },
    {
      slug: "guild-vault",
      title: "The guild vault",
      kind: "trial",
      concept: "encapsulation",
      syllabusTag: "Unit 4: Encapsulation",
      story: "The Guild's treasurer wants an account no one can overdraw — not even by accident.",
      minutes: 15,
      challenge: {
        instructions:
          "Write a class `Account` with a **private** `int balance` (starting at 0) and methods `boolean deposit(int amount)`, `boolean withdraw(int amount)` and `int getBalance()`. A deposit or withdrawal of 0 or less is rejected, and a withdrawal can never take the balance below 0.\n\nThe input is a count `n` followed by `n` commands like `deposit 50` or `withdraw 30`. After each command print `OK <balance>` if it succeeded or `DENIED <balance>` if it was rejected.\n\nFor `3` / `deposit 50` / `withdraw 80` / `withdraw 30`: `OK 50`, `DENIED 50`, `OK 20`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          // write the Account class here

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Account account = new Account();
                  for (int i = 0; i < n; i++) {
                      String command = in.next();
                      int amount = in.nextInt();
                      // call deposit or withdraw, then print OK/DENIED and the balance
                  }
              }
          }
        `,
        requirements: [
          { description: "balance is a private int field", pattern: "private\\s+int\\s+balance", mustMatch: true },
          { description: "Defines boolean withdraw(int amount)", pattern: "boolean\\s+withdraw\\s*\\(\\s*int\\s+\\w+\\s*\\)", mustMatch: true },
        ],
        hints: [
          "Model it on the Battery class in the lesson: the methods check the rules and return true or false.",
          "In main, choose the method with `command.equals(\"deposit\")`, keep the boolean it returns, and print based on it.",
          "Worked example: `boolean ok = account.withdraw(amount); System.out.println((ok ? \"OK \" : \"DENIED \") + account.getBalance());`",
        ],
        solution: java`
          import java.util.Scanner;

          class Account {
              private int balance = 0;

              boolean deposit(int amount) {
                  if (amount <= 0) {
                      return false;
                  }
                  balance += amount;
                  return true;
              }

              boolean withdraw(int amount) {
                  if (amount <= 0 || amount > balance) {
                      return false;
                  }
                  balance -= amount;
                  return true;
              }

              int getBalance() {
                  return balance;
              }
          }

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Account account = new Account();
                  for (int i = 0; i < n; i++) {
                      String command = in.next();
                      int amount = in.nextInt();
                      boolean ok = command.equals("deposit") ? account.deposit(amount) : account.withdraw(amount);
                      System.out.println((ok ? "OK " : "DENIED ") + account.getBalance());
                  }
              }
          }
        `,
        solutionExplanation:
          "Because balance is private, deposit and withdraw are the only doors in — and both check the rules — so no code anywhere can make the balance negative. The boolean return lets the caller react without the class printing anything itself.",
        tests: [
          { description: "Deposit, rejected overdraft, valid withdrawal", stdin: "3\ndeposit 50\nwithdraw 80\nwithdraw 30", stdout: "OK 50\nDENIED 50\nOK 20" },
          { description: "Rejects zero and negative amounts", hidden: true, stdin: "3\ndeposit 0\ndeposit -5\nwithdraw -10", stdout: "DENIED 0\nDENIED 0\nDENIED 0" },
          { description: "Withdrawing the exact balance is allowed", hidden: true, stdin: "2\ndeposit 40\nwithdraw 40", stdout: "OK 40\nOK 0" },
        ],
        feedback: [
          { codePattern: "command\\s*==", message: "Compare the command with .equals(\"deposit\") — == compares String objects, not text." },
          { stdoutPattern: "-\\d", message: "A negative balance slipped through: withdraw must refuse any amount larger than the balance." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            class Account {
                private int balance = 0;
                boolean deposit(int amount) { balance += amount; return true; }
                boolean withdraw(int amount) { if (amount > balance) return false; balance -= amount; return true; }
                int getBalance() { return balance; }
            }
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    Account account = new Account();
                    for (int i = 0; i < n; i++) {
                        String command = in.next();
                        int amount = in.nextInt();
                        boolean ok = command.equals("deposit") ? account.deposit(amount) : account.withdraw(amount);
                        System.out.println((ok ? "OK " : "DENIED ") + account.getBalance());
                    }
                }
            }
          `,
        ],
      },
    },
    {
      slug: "guild-inheritance",
      title: "Inheritance",
      kind: "lesson",
      concept: "inheritance",
      syllabusTag: "Unit 4: Inheritance",
      story: "Knights, archers and mages are all Guild members. Write what they share once.",
      minutes: 14,
      blocks: [
        {
          type: "text",
          md: "Often several classes share most of their code. **Inheritance** lets a class (the *subclass*) build on another (the *superclass*) with `extends`. The subclass gets all the superclass's fields and methods, then adds its own — or **overrides** an inherited method to behave differently.\n\nUse inheritance for an **is-a** relationship: a Knight *is a* Member. If the relationship is *has-a* (a Guild *has* Members), use a field instead.",
        },
        {
          type: "code",
          title: "extends, super and @Override",
          runnable: true,
          lines: [
            ["class Member {", "The superclass: what every member has."],
            ["    protected String name;", "protected: visible to subclasses (and the same package), hidden from everyone else."],
            ["", ""],
            ["    Member(String name) {", ""],
            ["        this.name = name;", ""],
            ["    }", ""],
            ["", ""],
            ["    String greet() {", ""],
            ['        return "I am " + name;', ""],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["class Knight extends Member {", "Knight inherits name and greet() from Member."],
            ["    private int armour;", "…and adds its own field."],
            ["", ""],
            ["    Knight(String name, int armour) {", ""],
            ["        super(name);", "Call Member's constructor first — it sets up the inherited part."],
            ["        this.armour = armour;", ""],
            ["    }", ""],
            ["", ""],
            ["    @Override", "Tells the compiler: this must replace an inherited method (it checks the spelling for you)."],
            ["    String greet() {", ""],
            ['        return super.greet() + ", knight with armour " + armour;', "super.greet() reuses the parent's version."],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        System.out.println(new Member("Ada").greet());', ""],
            ['        System.out.println(new Knight("Arthur", 7).greet());', "The overriding version runs."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "super-first",
        },
        {
          type: "text",
          md: "Every class in Java ultimately extends `Object`, which is why every object has a `toString()` method. Override it to control how your objects print: `System.out.println(knight)` calls `knight.toString()` automatically.\n\nJava allows only **one** superclass per class (`extends` takes a single name). For sharing a *role* across unrelated classes you'll use interfaces, in the next lesson.",
        },
        {
          type: "check",
          question: "override-trace",
        },
      ],
      summary: {
        keyIdeas: [
          "`class B extends A` — B inherits A's fields and methods.",
          "`super(...)` must be the first line of a subclass constructor when the parent needs arguments.",
          "@Override marks a method replacing an inherited one; super.method() calls the parent's version.",
          "Use inheritance for is-a, fields for has-a.",
        ],
        mistakes: [
          "Forgetting super(...) when the parent has no no-argument constructor (compile error).",
          "Overloading by accident (different parameters) when you meant to override.",
          "Using inheritance just to reuse code when the is-a relationship doesn't hold.",
        ],
      },
      questions: [
        {
          slug: "super-first",
          kind: "mcq",
          prompt: "Member has only the constructor `Member(String name)`. What must Knight's constructor do?",
          options: [
            { id: "a", text: "Call super(name) as its first statement" },
            { id: "b", text: "Nothing — Java copies the parent's constructor", feedback: "Constructors aren't inherited. Java would try to call super() with no arguments — which doesn't exist here." },
            { id: "c", text: "Set this.name = name and skip super", feedback: "Without super(name), Java inserts super() — and Member has no no-argument constructor, so it fails to compile." },
          ],
          answer: "a",
          explanation: "A subclass object contains a superclass part that must be constructed first. When the parent's constructor needs arguments, you pass them with super(...) on the first line.",
        },
        {
          slug: "override-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Animal {
                String sound() { return "..."; }
                String speak() { return "says " + sound(); }
            }

            class Owl extends Animal {
                @Override
                String sound() { return "hoot"; }
            }

            public class Main {
                public static void main(String[] args) {
                    System.out.println(new Owl().speak());
                }
            }
          `,
          answer: "says hoot",
          explanation: "speak() is inherited from Animal, but inside it sound() runs the Owl's override — the object is an Owl. That's dynamic dispatch, the heart of polymorphism.",
        },
      ],
    },
    {
      slug: "guild-polymorphism",
      title: "Polymorphism, abstract classes & interfaces",
      kind: "lesson",
      concept: "polymorphism",
      syllabusTag: "Unit 4: Polymorphism",
      story: "The Guild's payroll treats every member the same way — yet each is paid differently.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "**Polymorphism** (\"many forms\"): a variable of a superclass type can refer to an object of any of its subclasses. When you call a method, Java runs the version belonging to the **actual object**, not the variable's type. This lets one loop handle many kinds of object without a single `if` about which kind it is.",
        },
        {
          type: "code",
          title: "One array, many kinds",
          runnable: true,
          lines: [
            ["abstract class Member {", "abstract: you can't create a plain Member — only its subclasses."],
            ["    protected String name;", ""],
            ["    Member(String name) { this.name = name; }", ""],
            ["    abstract int weeklyPay();", "An abstract method has no body. Every concrete subclass MUST provide one."],
            ["    String payslip() {", "A normal method can call the abstract one."],
            ['        return name + ": " + weeklyPay();', ""],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["class Knight extends Member {", ""],
            ["    Knight(String name) { super(name); }", ""],
            ["    @Override int weeklyPay() { return 500; }", ""],
            ["}", ""],
            ["", ""],
            ["class Archer extends Member {", ""],
            ["    private int hours;", ""],
            ["    Archer(String name, int hours) { super(name); this.hours = hours; }", ""],
            ["    @Override int weeklyPay() { return hours * 20; }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        Member[] roster = { new Knight("Arthur"), new Archer("Robin", 30) };', "The array's type is Member; each element is a specific subclass."],
            ["        int total = 0;", ""],
            ["        for (Member m : roster) {", ""],
            ["            System.out.println(m.payslip());", "Same call, different behaviour — chosen by the real object."],
            ["            total += m.weeklyPay();", ""],
            ["        }", ""],
            ['        System.out.println("Total: " + total);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "dispatch",
        },
        {
          type: "text",
          md: "An **interface** is a pure contract: a list of methods a class promises to provide, with no fields. A class can `implements` many interfaces (but `extends` only one class).\n\n- Use an **abstract class** when subclasses share state or code (Member has a name and payslip()).\n- Use an **interface** for a capability unrelated classes can share — `Comparable`, `Runnable`, or your own `Payable`.",
        },
        {
          type: "code",
          title: "An interface",
          runnable: true,
          lines: [
            ["interface Chargeable {", ""],
            ["    int chargeCost();", "Interface methods are public and abstract by default."],
            ["}", ""],
            ["", ""],
            ["class Drone implements Chargeable {", ""],
            ["    public int chargeCost() { return 12; }", "Implementing methods must be public."],
            ["}", ""],
            ["", ""],
            ["class Lantern implements Chargeable {", "A completely unrelated class can share the same capability."],
            ["    public int chargeCost() { return 3; }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Chargeable[] things = { new Drone(), new Lantern(), new Drone() };", ""],
            ["        int sum = 0;", ""],
            ["        for (Chargeable c : things) sum += c.chargeCost();", ""],
            ['        System.out.println("Charging bill: " + sum);', "12 + 3 + 12 = 27."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "callout",
          tone: "interview",
          md: "Be ready to explain **abstract class vs interface** and to give a real polymorphism example. \"A payroll loop calls weeklyPay() on every Member and each subclass pays differently, so adding a new role needs no change to the loop\" is exactly the kind of answer interviewers want.",
        },
        {
          type: "check",
          question: "abstract-new",
        },
      ],
      summary: {
        keyIdeas: [
          "A superclass reference can hold any subclass object; the object's own override runs.",
          "Abstract methods force subclasses to implement them; abstract classes can't be instantiated.",
          "Interfaces define a capability; a class can implement several.",
        ],
        mistakes: [
          "`new Member(...)` when Member is abstract.",
          "Forgetting `public` when implementing an interface method.",
          "Long if/else chains on \"which kind is this?\" where an overridden method would do.",
        ],
      },
      questions: [
        {
          slug: "dispatch",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Shape {
                int sides() { return 0; }
            }
            class Triangle extends Shape {
                @Override int sides() { return 3; }
            }
            class Square extends Shape {
                @Override int sides() { return 4; }
            }

            public class Main {
                public static void main(String[] args) {
                    Shape[] shapes = { new Square(), new Shape(), new Triangle() };
                    int total = 0;
                    for (Shape s : shapes) total += s.sides();
                    System.out.println(total);
                }
            }
          `,
          answer: "7",
          explanation: "Each call runs the real object's version: Square 4 + Shape 0 + Triangle 3 = 7 — even though the array's type is Shape.",
        },
        {
          slug: "abstract-new",
          kind: "mcq",
          prompt: "With `abstract class Member { abstract int weeklyPay(); }`, which line compiles?",
          options: [
            { id: "a", text: "Member m = new Member();", feedback: "An abstract class can't be instantiated — what would weeklyPay() return?" },
            { id: "b", text: "Member m = new Knight(\"Arthur\");" },
            { id: "c", text: "Knight k = new Member();", feedback: "Two problems: Member is abstract, and a Member isn't necessarily a Knight." },
          ],
          answer: "b",
          explanation: "A Member variable can refer to any concrete subclass. You create the subclass object; the variable's type just promises it's some kind of Member.",
        },
      ],
    },
    {
      slug: "guild-roster",
      title: "Guild payroll",
      kind: "trial",
      concept: "polymorphism",
      syllabusTag: "Unit 4: Polymorphism",
      story: "Payday at the Guild. Every role is paid by its own rule — and the treasurer wants one loop to handle them all.",
      minutes: 20,
      challenge: {
        instructions:
          "Create an **abstract** class `Member` with a name and an abstract `int weeklyPay()`, and three subclasses:\n- `Knight` — paid a flat 500\n- `Archer` — paid 20 per hour worked\n- `Mage` — paid 300 plus 50 per spell learned\n\nThe input is a count `n`, then `n` lines: `knight <name>`, `archer <name> <hours>` or `mage <name> <spells>`. Store them all in one `Member[]`, then print `<name>: <pay>` for each in order, and finally `Total: <sum>`.\n\nFor `3` / `knight Arthur` / `archer Robin 30` / `mage Merlin 4`: `Arthur: 500`, `Robin: 600`, `Merlin: 500`, `Total: 1600`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          // abstract class Member and its three subclasses go here

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();

              }
          }
        `,
        requirements: [
          { description: "Member is an abstract class", pattern: "abstract\\s+class\\s+Member", mustMatch: true },
          { description: "Subclasses extend Member", pattern: "class\\s+(Knight|Archer|Mage)\\s+extends\\s+Member", mustMatch: true },
          { description: "Uses @Override", pattern: "@Override", mustMatch: true },
          { description: "The payroll loop doesn't check the role (polymorphism does it)", pattern: "instanceof", mustMatch: false },
        ],
        hints: [
          "The polymorphism lesson's roster example is the skeleton — add Mage and the input reading.",
          "Reading: `String role = in.next(); String name = in.next();` then read one more int only for archer and mage. Build the right subclass with if/else on role.",
          "Worked example: `if (role.equals(\"archer\")) { roster[i] = new Archer(name, in.nextInt()); }` — the printing loop afterwards never needs to know the role.",
        ],
        solution: java`
          import java.util.Scanner;

          abstract class Member {
              protected String name;

              Member(String name) {
                  this.name = name;
              }

              abstract int weeklyPay();
          }

          class Knight extends Member {
              Knight(String name) {
                  super(name);
              }

              @Override
              int weeklyPay() {
                  return 500;
              }
          }

          class Archer extends Member {
              private int hours;

              Archer(String name, int hours) {
                  super(name);
                  this.hours = hours;
              }

              @Override
              int weeklyPay() {
                  return hours * 20;
              }
          }

          class Mage extends Member {
              private int spells;

              Mage(String name, int spells) {
                  super(name);
                  this.spells = spells;
              }

              @Override
              int weeklyPay() {
                  return 300 + 50 * spells;
              }
          }

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Member[] roster = new Member[n];
                  for (int i = 0; i < n; i++) {
                      String role = in.next();
                      String name = in.next();
                      if (role.equals("knight")) {
                          roster[i] = new Knight(name);
                      } else if (role.equals("archer")) {
                          roster[i] = new Archer(name, in.nextInt());
                      } else {
                          roster[i] = new Mage(name, in.nextInt());
                      }
                  }
                  int total = 0;
                  for (Member m : roster) {
                      int pay = m.weeklyPay();
                      System.out.println(m.name + ": " + pay);
                      total += pay;
                  }
                  System.out.println("Total: " + total);
              }
          }
        `,
        solutionExplanation:
          "The role is checked once, when each object is built. After that, the payroll loop just calls weeklyPay() and each subclass answers by its own rule — adding a new role later means a new subclass, not edits to the loop.",
        tests: [
          {
            description: "Knight, archer and mage payroll",
            stdin: "3\nknight Arthur\narcher Robin 30\nmage Merlin 4",
            stdout: "Arthur: 500\nRobin: 600\nMerlin: 500\nTotal: 1600",
          },
          { description: "Only archers, including zero hours", hidden: true, stdin: "2\narcher Tell 0\narcher Hood 12", stdout: "Tell: 0\nHood: 240\nTotal: 240" },
          { description: "A mage with no spells", hidden: true, stdin: "1\nmage Apprentice 0", stdout: "Apprentice: 300\nTotal: 300" },
        ],
        feedback: [
          { codePattern: "role\\s*==", message: "Compare role with .equals(\"knight\") — == checks whether two Strings are the same object." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int total = 0;
                    for (int i = 0; i < n; i++) {
                        String role = in.next(); String name = in.next();
                        int pay = role.equals("knight") ? 500 : role.equals("archer") ? in.nextInt() * 20 : 300 + 50 * in.nextInt();
                        System.out.println(name + ": " + pay);
                        total += pay;
                    }
                    System.out.println("Total: " + total);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "guild-guardian",
      title: "Guardian of the Guild",
      kind: "quiz",
      concept: "oop-mastery",
      syllabusTag: "Unit 4 review",
      story: "The Guild's guardian is itself an object — and it only respects those who understand objects.",
      minutes: 15,
      passingScore: 75,
      questions: [
        {
          slug: "this-shadow",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Tag {
                String text;
                Tag(String text) {
                    text = text;
                }
            }

            public class Main {
                public static void main(String[] args) {
                    System.out.println(new Tag("crate").text);
                }
            }
          `,
          answer: "null",
          explanation: "Inside the constructor, text means the parameter, so text = text assigns the parameter to itself. The field is never set and keeps its default, null. It should be this.text = text.",
          reviewLesson: "guild-classes",
        },
        {
          slug: "reference-copy",
          kind: "mcq",
          prompt: "`Robot a = new Robot(\"A\", 10); Robot b = a; b.power = 99;` What is `a.power`?",
          options: [
            { id: "a", text: "10", feedback: "b = a copied the reference, not the robot — there's only one object." },
            { id: "b", text: "99" },
            { id: "c", text: "It doesn't compile", feedback: "Assigning one Robot variable to another is fine." },
          ],
          answer: "b",
          explanation: "a and b point at the same object, so a change through b is visible through a.",
          reviewLesson: "guild-classes",
        },
        {
          slug: "why-private",
          kind: "mcq",
          prompt: "What is the main benefit of making `balance` private and changing it only via `withdraw()`?",
          options: [
            { id: "a", text: "The program runs faster", feedback: "private has no effect on speed." },
            { id: "b", text: "The class can enforce its rules (no overdrafts) because nothing can bypass withdraw()" },
            { id: "c", text: "It hides the code from other programmers", feedback: "The source is still visible — private controls access from other classes, not secrecy." },
          ],
          answer: "b",
          explanation: "Encapsulation keeps every rule about the data in one place, so the object can never be put in an invalid state from outside.",
          reviewLesson: "guild-encapsulation",
        },
        {
          slug: "static-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Ticket {
                static int next = 100;
                int number;
                Ticket() {
                    number = next;
                    next += 5;
                }
            }

            public class Main {
                public static void main(String[] args) {
                    Ticket a = new Ticket();
                    Ticket b = new Ticket();
                    System.out.println(a.number + " " + b.number + " " + Ticket.next);
                }
            }
          `,
          answer: "100 105 110",
          explanation: "next is shared by the class: the first ticket takes 100, the second 105, leaving next at 110. number is per object.",
          reviewLesson: "guild-encapsulation",
        },
        {
          slug: "super-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            class Base {
                String id() { return "B"; }
            }
            class Child extends Base {
                @Override
                String id() { return super.id() + "C"; }
            }
            class GrandChild extends Child {
                @Override
                String id() { return super.id() + "G"; }
            }

            public class Main {
                public static void main(String[] args) {
                    Base x = new GrandChild();
                    System.out.println(x.id());
                }
            }
          `,
          answer: "BCG",
          explanation: "The object is a GrandChild, so its id() runs. It calls Child's version, which calls Base's: \"B\" + \"C\" + \"G\".",
          reviewLesson: "guild-inheritance",
        },
        {
          slug: "is-a",
          kind: "mcq",
          prompt: "Which design uses inheritance appropriately?",
          options: [
            { id: "a", text: "class Engine extends Car", feedback: "A car has an engine — an engine isn't a kind of car. Use a field." },
            { id: "b", text: "class Guild extends Member", feedback: "A guild has members; it isn't one." },
            { id: "c", text: "class Mage extends Member" },
          ],
          answer: "c",
          explanation: "A Mage is a Member — the is-a test passes. Has-a relationships (car/engine, guild/members) belong in fields.",
          reviewLesson: "guild-inheritance",
        },
        {
          slug: "interface-vs-abstract",
          kind: "mcq",
          prompt: "A Drone, a Lantern and a Robot share nothing except that each can be recharged. What fits best?",
          options: [
            { id: "a", text: "An interface Chargeable that each class implements" },
            { id: "b", text: "An abstract class Chargeable that each class extends", feedback: "That would use up each class's only superclass slot for an unrelated capability." },
            { id: "c", text: "Copy a chargeCost() method into each class with no shared type", feedback: "Then you can't put them in one array or loop over them together." },
          ],
          answer: "a",
          explanation: "Interfaces describe a capability unrelated classes can share — and a class can implement many interfaces while still extending something else.",
          reviewLesson: "guild-polymorphism",
        },
        {
          slug: "polymorphic-loop",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            abstract class Spell {
                abstract int cost();
            }
            class Spark extends Spell {
                int cost() { return 2; }
            }
            class Blaze extends Spell {
                int cost() { return 5; }
            }

            public class Main {
                public static void main(String[] args) {
                    Spell[] book = { new Blaze(), new Spark(), new Spark(), new Blaze() };
                    int mana = 20;
                    for (Spell s : book) {
                        if (mana >= s.cost()) {
                            mana -= s.cost();
                        }
                    }
                    System.out.println(mana);
                }
            }
          `,
          answer: "6",
          explanation: "20 − 5 (Blaze) = 15, − 2 = 13, − 2 = 11, − 5 = 6. Each cost() call runs the real object's version.",
          reviewLesson: "guild-polymorphism",
        },
      ],
    },
  ],
};
