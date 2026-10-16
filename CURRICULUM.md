# Curriculum — Project Atlas

This is an **initial curriculum proposal**, not a final syllabus. World/topic order follows [DECISIONS.md#d2](DECISIONS.md). The world narrative, screens, and mechanics referenced below are defined in [GAME_DESIGN.md](GAME_DESIGN.md) and `design.md`.

## World 1 — Java Fundamentals (MVP scope — the only world with full detail below)

Topics, in prerequisite order: program structure → variables/data types → operators → input/output → conditions → loops → methods → arrays → strings → basic problem-solving.

## World 2 — Java OOP (future — not detailed yet)

Topics (prerequisite order, not yet broken into levels): classes and objects → constructors and `this` → encapsulation → inheritance → polymorphism → abstraction → interfaces → overloading/overriding → composition → practical object-oriented design. Requires World 1 complete (variables, methods, control flow) as a prerequisite.

## World 3 — DSA with Java (future — not detailed yet)

Topics (prerequisite order): complexity analysis → arrays and strings → searching and sorting → linked lists → stacks and queues → recursion → hashing → trees and BSTs → heaps → graphs → BFS/DFS → greedy algorithms → dynamic programming. Requires World 2 complete (needs classes for nodes/trees/graphs).

Per the founder brief, **World 2 and World 3 detailed level design is deferred** — do not create full level content for them until World 1 is validated (see [ROADMAP.md](ROADMAP.md) milestones 10–11).

## Topic specification template (applies to every topic, every world)

For each topic: learning objectives, prerequisite concepts, common misconceptions, a game mechanic ([GAME_DESIGN.md](GAME_DESIGN.md) mechanic-to-concept map), at least one practical challenge, assessment criteria, mastery requirements.

---

## World 1 — Java Fundamentals: topic specifications

### 1. Java program structure (`print`/output)
- **Objectives:** Recognize that a Java program needs a class and a `main` method to run; use `System.out.println` to produce output.
- **Prerequisites:** None.
- **Misconceptions:** Thinking every line needs to be inside `main` by instinct rather than understanding why; believing `public static void main(String[] args)` must be memorized syntax with no meaning (the game should explain it once, briefly, then let starter code supply it so it's never a blocker).
- **Game mechanic:** The robot speaks for the first time — `System.out.println` makes dialogue appear in-world ([GAME_DESIGN.md](GAME_DESIGN.md) table, variables/output row).
- **Challenge:** Level 1, below.
- **Assessment:** Visible test checks exact stdout match.
- **Mastery:** Pass without using hint rung 4.

### 2. Variables and data types
- **Objectives:** Declare and assign `int`, `double`, `String`, `boolean` variables; understand that a variable's type constrains what it can hold.
- **Prerequisites:** Program structure.
- **Misconceptions:** Confusing `=` (assignment) with mathematical equality; expecting a variable to auto-convert type (e.g., assigning a decimal to an `int` and expecting rounding rather than truncation/compile error).
- **Game mechanic:** Storing the robot's name/power updates a visible sign.
- **Challenge:** Level 2, below.
- **Mastery:** Pass with correct types chosen for each quantity (visible test checks output; a hidden test may reuse different input values to catch hardcoding).

### 3. Operators
- **Objectives:** Use arithmetic (`+ - * / %`), comparison, and logical operators; understand integer vs. floating-point division.
- **Prerequisites:** Variables and data types.
- **Misconceptions:** Expecting `7 / 2` to yield `3.5` with `int` operands (it yields `3`); operator precedence surprises.
- **Game mechanic:** Compute battery needed to cross a bridge of a given length.
- **Challenge:** Level 3, below.
- **Mastery:** Pass the hidden test using a *different* bridge length — i.e., the solution must be a formula, not a hardcoded answer.

### 4. Input and output
- **Objectives:** Read a value (via a provided `Scanner`-wrapped helper or a pre-supplied input variable, kept simple for beginners) and print formatted output.
- **Prerequisites:** Variables, operators.
- **Misconceptions:** Forgetting that input arrives as text and needs conversion to a number before arithmetic.
- **Game mechanic:** A sensor reading becomes a variable the player's code must act on.
- **Mastery:** Pass with correctly converted/typed input.

### 5. Conditions (`if`/`else`)
- **Objectives:** Write single and chained conditionals; use boolean expressions to gate behavior.
- **Prerequisites:** Operators (comparison/logical).
- **Misconceptions:** Using `=` instead of `==`; writing an `if` without an `else` when the problem needs one; nesting conditions where a single compound boolean expression would do.
- **Game mechanic:** A gate opens only when a sensor reads the right value.
- **Challenge:** Level 5, below.
- **Mastery:** Hidden test uses a sensor value that should trigger the opposite branch than the visible test.

### 6. Loops (`for`, `while`)
- **Objectives:** Choose `for` for a known repeat count, `while` for a condition-driven repeat; avoid infinite loops.
- **Prerequisites:** Conditions.
- **Misconceptions:** Off-by-one errors (`<` vs `<=`); forgetting to update the loop variable/condition in a `while`, causing an infinite loop (the execution service's timeout, [SECURITY.md](SECURITY.md), must surface this as a specific, friendly message, not a generic crash).
- **Game mechanic:** Move and collect a variable number of crystals (`for`); patrol until hitting a wall, then turn (`while`).
- **Challenge:** Levels 4 and 6, below.
- **Mastery:** Hidden test changes the repeat count/room shape; solution must generalize.

### 7. Methods
- **Objectives:** Define a method with parameters and a return type; call it; understand why extracting repeated logic into a method is useful.
- **Prerequisites:** Loops, conditions.
- **Misconceptions:** Confusing `void` methods with ones that must `return` a value; scope confusion (a variable declared inside a method isn't visible outside it).
- **Game mechanic:** Package `turnAround()` once, reuse it repeatedly — "teaching the robot a move."
- **Challenge:** Level 7, below.
- **Mastery:** Visible test requires the method to actually be called more than once (not inlined), checked by requiring the win condition to depend on at least two invocations in different contexts.

### 8. Arrays
- **Objectives:** Declare, populate, index, and iterate over an array; understand fixed size and zero-based indexing.
- **Prerequisites:** Loops.
- **Misconceptions:** Off-by-one on the last valid index (`length - 1`, not `length`); `ArrayIndexOutOfBoundsException` as a confusing error (rung-0 table must translate this specifically).
- **Game mechanic:** Sort crates by weight onto shelves.
- **Challenge:** Level 8, below.
- **Mastery:** Hidden test uses an array of different length/values.

### 9. Strings
- **Objectives:** Use core `String` methods (`length()`, `charAt()`, `substring()`, `equals()` — not `==`, for value comparison); build/modify text.
- **Prerequisites:** Arrays (strings as a related, sequence-like concept), loops.
- **Misconceptions:** Using `==` to compare `String` values (a very common and specifically Java misconception — must have its own rung-0 message); off-by-one in `substring` bounds.
- **Game mechanic:** Look up which key (a string label) opens which door.
- **Challenge:** Level 9, below.
- **Mastery:** Hidden test uses a different key/door mapping.

### 10. Basic problem-solving (boss)
- **Objectives:** Combine variables, conditions, loops, methods, arrays/strings in one multi-step program; decompose a larger goal into steps.
- **Prerequisites:** All of the above.
- **Misconceptions:** Not decomposing the problem — trying to write the whole solution as one block without structuring it into clear steps (the briefing/goal-checklist UI should make the decomposition visible as separate checklist items, per `design.md` §3.4).
- **Game mechanic:** Multi-step: read a sensor list → decide → route the robot → report.
- **Challenge:** Level 10 (boss), below.
- **Mastery:** All 3 hidden scenarios pass (per `design.md` §4 level 10).

---

## First 10 Java levels — detailed design

World: **"The Silent Foundry"** (story and world concept from `design.md` §4 — retained as-is, now specified in Java). Starter code in every level hides `public class` / `public static void main` boilerplate behind a pre-filled, non-editable wrapper where possible, or treats it as given starter code the player doesn't need to understand yet — the first editable line is always the first conceptually new thing, per [GAME_DESIGN.md](GAME_DESIGN.md) principle 5 ("one new idea per level").

### Level 1 — Wake-up (`print` / output)
- **Story:** The foundry's first robot has powered on but has never spoken. Your first line of code gives it a voice.
- **Instructions:** "Make the robot say hello to the foundry."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          // Write your code below this line
          
      }
  }
  ```
- **Expected behavior:** Prints `Hello, Foundry!` exactly; the robot's speech bubble shows the printed text in-world.
- **Test cases:** Visible — stdout equals `Hello, Foundry!`. Hidden — none (first level; see `design.md` principle 6, short/clean first win).
- **Hint progression:** Rung 0 covers missing semicolon, mismatched quotes, and `System.out.println` capitalization/typo — the single most common first-level errors. Rung 1+ unlikely to be needed.
- **Completion criteria:** Visible test passes.

### Level 2 — Name tag (variables, strings)
- **Story:** The robot needs an identity before it can be registered in the foundry's systems.
- **Instructions:** "Store the robot's name and power level, then print the robot's name tag."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          String name = "";      // give your robot a name
          int power = 0;          // set its power level (0-100)
          
          System.out.println(name + " - Power: " + power);
      }
  }
  ```
- **Expected behavior:** Name tag sign in-world updates to show the entered name and power.
- **Test cases:** Visible — output contains the chosen name and a numeric power value in the stated format. Hidden — re-run with the student's own chosen values to confirm no hardcoded literal was expected (this level has no single correct answer, only a correct *format* — the test checks structure, not exact string).
- **Hint progression:** Rung 0 covers `String`/`int` type mismatches and missing `+` concatenation.
- **Completion criteria:** Output format matches `<name> - Power: <power>`.

### Level 3 — Power math (operators)
- **Story:** A bridge lies ahead; crossing it costs battery proportional to its length.
- **Instructions:** "Calculate the battery needed to cross a bridge that is `bridgeLength` meters long, at `2` battery per meter."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          int bridgeLength = 12; // meters
          int batteryPerMeter = 2;
          
          int batteryNeeded = 0; // replace with the correct formula
          
          System.out.println("Battery needed: " + batteryNeeded);
      }
  }
  ```
- **Expected behavior:** Robot's battery gauge in-world shows the computed value before crossing.
- **Test cases:** Visible — `bridgeLength = 12` → `Battery needed: 24`. Hidden — `bridgeLength` changed to a different value (e.g., `7`) to confirm a formula, not a hardcoded `24`.
- **Hint progression:** Rung 1 nudge: "Battery needed depends on two numbers you already have — how do they combine?"
- **Completion criteria:** Both visible and hidden cases pass.

### Level 4 — Crystal mine (`for` loop)
- **Story:** A mine shaft holds crystals that power the foundry; the robot must collect all of them.
- **Instructions:** "Move and collect 10 crystals."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          int crystalCount = 10;
          
          // Use a loop to move and collect once per crystal
          
      }
  }
  ```
  (`robot.move()` / `robot.collect()` are provided helper calls from the game's runtime API, not methods the student writes — see [API_SPEC.md](API_SPEC.md) for how the execution sandbox exposes this limited world-interaction API.)
- **Expected behavior:** Robot visibly moves and collects 10 times in the world view; goal checklist ticks "crystals collected == 10."
- **Test cases:** Visible — `crystalCount = 10`. Hidden — `crystalCount = 7` (per `design.md` §4) to catch a hardcoded `for (i = 0; i < 10; i++)`.
- **Hint progression:** Rung 2 focus: "Look at how many times your loop runs. Does it match `crystalCount`, or a fixed number?"
- **Completion criteria:** Both cases pass; ★ requires solving without rung 4.

### Level 5 — The gate (`if`/`else`)
- **Story:** A sealed gate blocks the next district; a sensor reports a value, and the gate should open only under the right condition.
- **Instructions:** "Open the gate only if the sensor reading is above the safety threshold."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          int sensorReading = 75;
          int safetyThreshold = 50;
          
          // if the reading is above the threshold, open the gate
          
      }
  }
  ```
- **Expected behavior:** Gate animates open/stays shut based on the branch taken.
- **Test cases:** Visible — `sensorReading = 75` (above threshold, gate opens). Hidden — `sensorReading = 20` (below threshold, gate must stay shut).
- **Hint progression:** Rung 0 covers `=` vs `==`.
- **Completion criteria:** Correct behavior in both branches.

### Level 6 — Patrol (`while` + conditions)
- **Story:** A patrol corridor needs the robot to walk until it meets a wall, then turn.
- **Instructions:** "Walk forward until you hit a wall, then turn."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          // while there is no wall ahead, move forward
          // then turn
          
      }
  }
  ```
- **Expected behavior:** Robot walks a variable-length corridor and turns at the wall, regardless of corridor length.
- **Test cases:** Visible — a corridor of one length. Hidden — a different room shape (per `design.md` §4).
- **Hint progression:** Rung 1: "What tells your code when to stop walking — a fixed number, or something you can check each step?" Rung 0 specifically covers infinite-loop timeouts with a friendly message ("Your robot never stopped walking — check what makes the loop end").
- **Completion criteria:** Passes on both room shapes.

### Level 7 — Toolbelt (methods)
- **Story:** The robot needs a reusable "turn around" move it can call whenever needed, instead of repeating the same steps.
- **Instructions:** "Define `turnAround()` and use it twice in this level."
- **Starter code:**
  ```java
  public class Robot {
      static void turnAround() {
          // define the move here
      }
      
      public static void main(String[] args) {
          // call turnAround() where needed
      }
  }
  ```
- **Expected behavior:** The move executes identically both times it's called.
- **Test cases:** Visible — checks the win condition requires two calls to `turnAround()` in different world contexts.
- **Hint progression:** Rung 2: "You wrote the turn once — can you call it instead of repeating it?"
- **Completion criteria:** Passes with the method actually invoked (not inlined duplicate code — detected by requiring both usage points to produce correct behavior from one definition).

### Level 8 — Cargo bay (arrays)
- **Story:** Crates of varying weight need sorting onto shelves by weight order.
- **Instructions:** "Sort the crate weights from lightest to heaviest."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          int[] crateWeights = {40, 10, 25, 5};
          
          // sort crateWeights, lightest first
          
      }
  }
  ```
- **Expected behavior:** Crates visually reorder onto shelves by ascending weight.
- **Test cases:** Visible — the array above. Hidden — a different array (different length/values).
- **Hint progression:** Rung 3 worked example: sorting a different small array step by step.
- **Completion criteria:** Correct order on both arrays.

### Level 9 — Registry (strings)
- **Story:** A locked door registry maps key names to door names; the robot must look up the right key.
- **Instructions:** "Find which key opens `door`, from the given key list."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          String[] keys = {"copper", "iron", "gold"};
          String door = "iron";
          
          // find the matching key and print it
          
      }
  }
  ```
- **Expected behavior:** Matching key visually inserted into the door.
- **Test cases:** Visible — the example above. Hidden — a different key list/door name.
- **Hint progression:** Rung 0 specifically covers `==` vs `.equals()` for String comparison, flagged as a named Java-specific misconception.
- **Completion criteria:** Correct key identified on both cases.

### Level 10 — Foundry Core (boss — combine everything)
- **Story:** The foundry's central core has gone dark; waking it requires reading a list of sensor values, deciding on an action per sensor, routing the robot accordingly, and reporting the outcome.
- **Instructions:** "Read each sensor value. If it's safe, route power there. If not, skip it. Report how many were powered."
- **Starter code:**
  ```java
  public class Robot {
      public static void main(String[] args) {
          int[] sensorReadings = {60, 15, 80, 42, 95};
          int safetyThreshold = 50;
          int poweredCount = 0;
          
          // loop through sensorReadings
          // for each safe reading, route power and increment poweredCount
          
          System.out.println("Powered: " + poweredCount);
      }
  }
  ```
- **Expected behavior:** Each sensor animates powered/skipped in sequence; final report prints the count.
- **Test cases:** Visible — the array above (expected `Powered: 3`). Hidden — 3 distinct scenarios with different arrays/thresholds (per `design.md` §4, "3 hidden scenarios").
- **Hint progression:** Full ladder available, including rung 4 (marks the level "assisted" if used).
- **Completion criteria:** All 3 hidden scenarios pass; ★ requires solving without rung 4.

---

## Side quests (MVP, 2–3 total)

Reuse levels 4–7 mechanics (loops, methods) on new maps for revision, per `design.md` §4. Not individually designed yet — first candidate: a second crystal-mine layout requiring a nested loop variant. Defer full design until after World 1 validation.
