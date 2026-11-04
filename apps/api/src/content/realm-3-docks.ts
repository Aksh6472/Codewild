import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 3 — arrays, strings and common beginner patterns.
export const docks: RealmDef = {
  slug: "docks",
  name: "The Cargo Docks",
  subtitle: "Arrays, strings, common patterns",
  story:
    "Ships unload hundreds of crates at the docks. One variable per crate won't cut it — you need collections, and the patterns for working through them.",
  theme: "spires",
  summary: {
    keyIdeas: [
      "An array holds a fixed number of values of one type: `int[] w = new int[5];` or `int[] w = {4, 8, 1};`.",
      "Indexes run from 0 to `length - 1`; `w.length` is the size (no parentheses).",
      "Strings are read-only sequences of chars: `s.length()`, `s.charAt(i)`, `s.substring(a, b)`, `s.indexOf(\"x\")`.",
      "Compare Strings with `.equals()`, never `==`.",
      "Patterns: accumulate (sum/count), track best-so-far (max/min), two pointers (reverse/palindrome), frequency table (`int[26]`).",
    ],
    mistakes: [
      "Looping with `i <= arr.length` — the last index is length - 1.",
      "`s.length` vs `arr.length()` — Strings use the method length(), arrays the field length.",
      "Using `==` on Strings: it compares identity, not content.",
      "Starting a maximum at 0, which fails when every value is negative.",
      "Expecting `s.toUpperCase()` to change s — Strings never change; it returns a new String.",
    ],
  },
  levels: [
    {
      slug: "docks-arrays",
      title: "Arrays",
      kind: "lesson",
      concept: "arrays",
      syllabusTag: "Unit 3: Arrays",
      story: "A cargo manifest lists crate weights. Store them all, in order, under one name.",
      minutes: 14,
      blocks: [
        {
          type: "text",
          md: "An **array** is a numbered row of boxes, all of the same type. Its size is fixed when you create it. Each box is reached by its **index**, and indexes start at **0** — so an array of 4 has indexes 0, 1, 2, 3.",
        },
        {
          type: "code",
          title: "Creating, reading and looping",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int[] weights = {40, 10, 25, 5};", "An array literal: type int[], four values, length 4."],
            ["        System.out.println(weights[0]);", "First element: index 0 → 40."],
            ["        System.out.println(weights[weights.length - 1]);", "Last element: index length - 1 = 3 → 5."],
            ["        weights[1] = 12;", "Arrays are writable: replace index 1's value."],
            ["        int total = 0;", ""],
            ["        for (int i = 0; i < weights.length; i++) {", "The standard loop: i from 0 while i < length."],
            ["            total += weights[i];", ""],
            ["        }", ""],
            ['        System.out.println("Total: " + total);', "40 + 12 + 25 + 5 = 82."],
            ["        for (int w : weights) {", "The for-each loop: w takes each value in turn (no index needed)."],
            ['            System.out.print(w + " ");', ""],
            ["        }", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "last-index",
        },
        {
          type: "text",
          md: "To fill an array from input, create it with a size and then read into each box. `new int[n]` makes n boxes that all start at 0 (`false` for booleans, `null` for Strings).\n\nReaching outside the array — `weights[4]` when the length is 4 — crashes with an `ArrayIndexOutOfBoundsException`.",
        },
        {
          type: "code",
          title: "Reading n values",
          runnable: true,
          stdin: "3\n7 2 9",
          lines: [
            ["import java.util.Scanner;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Scanner in = new Scanner(System.in);", ""],
            ["        int n = in.nextInt();", "First the count…"],
            ["        int[] values = new int[n];", "…then an array of exactly that size."],
            ["        for (int i = 0; i < n; i++) {", ""],
            ["            values[i] = in.nextInt();", "…then each value, in order."],
            ["        }", ""],
            ['        System.out.println("Read " + values.length + " values; middle is " + values[n / 2]);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "array-trace",
        },
      ],
      summary: {
        keyIdeas: [
          "`int[] a = new int[n];` creates n zeros; `{1, 2, 3}` creates and fills.",
          "Valid indexes are 0 … a.length - 1.",
          "Loop with `for (int i = 0; i < a.length; i++)`, or for-each when you don't need the index.",
        ],
        mistakes: [
          "`i <= a.length` reads one past the end.",
          "Forgetting arrays start at index 0.",
          "Trying to change an array's size — create a new array instead.",
        ],
      },
      questions: [
        {
          slug: "last-index",
          kind: "mcq",
          prompt: "`String[] crew = new String[6];` What is the index of the last element?",
          options: [
            { id: "a", text: "6", feedback: "There are 6 elements, but counting starts at 0 — index 6 would be the 7th." },
            { id: "b", text: "5" },
            { id: "c", text: "crew.length", feedback: "crew.length is 6 — one past the last index." },
            { id: "d", text: "-1", feedback: "Java arrays don't support negative indexes." },
          ],
          answer: "b",
          explanation: "Indexes run from 0 to length - 1, so a 6-element array's last index is 5.",
        },
        {
          slug: "array-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int[] a = {3, 1, 4, 1, 5};
            int count = 0;
            for (int i = 0; i < a.length; i++) {
                if (a[i] > 2) {
                    count++;
                }
            }
            System.out.println(count + " " + a[a.length - 2]);
          `,
          answer: "3 1",
          explanation: "Values above 2 are 3, 4 and 5 → count 3. a.length - 2 is index 3, which holds 1.",
        },
      ],
    },
    {
      slug: "docks-cargo-manifest",
      title: "Cargo manifest",
      kind: "trial",
      concept: "arrays",
      syllabusTag: "Unit 3: Arrays",
      story: "The dockmaster needs a summary of every ship's cargo before it's unloaded.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is a count `n`, then `n` crate weights. Store them in an array, then print three lines:\n\n`Total: <sum>`\n`Heaviest: <largest>`\n`Lightest: <smallest>`\n\nFor `4` / `40 10 25 5`: `Total: 80`, `Heaviest: 40`, `Lightest: 5`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] weights = new int[n];
                  // read the n weights into the array

                  // compute and print the total, heaviest and lightest

              }
          }
        `,
        hints: [
          "Fill the array with a loop first, then make a second pass to compute the answers.",
          "Start heaviest and lightest at the first weight (weights[0]), not at 0 — then let every other weight challenge them.",
          "Worked example: `int best = a[0]; for (int i = 1; i < a.length; i++) { if (a[i] > best) best = a[i]; }`",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] weights = new int[n];
                  for (int i = 0; i < n; i++) {
                      weights[i] = in.nextInt();
                  }
                  int total = 0;
                  int heaviest = weights[0];
                  int lightest = weights[0];
                  for (int w : weights) {
                      total += w;
                      if (w > heaviest) heaviest = w;
                      if (w < lightest) lightest = w;
                  }
                  System.out.println("Total: " + total);
                  System.out.println("Heaviest: " + heaviest);
                  System.out.println("Lightest: " + lightest);
              }
          }
        `,
        solutionExplanation:
          "One pass can track several answers at once. Seeding heaviest and lightest with a real element (not 0) makes them correct for any values — including a lightest above 0.",
        tests: [
          { description: "Summary of 40 10 25 5", stdin: "4\n40 10 25 5", stdout: "Total: 80\nHeaviest: 40\nLightest: 5" },
          { description: "A single crate", hidden: true, stdin: "1\n17", stdout: "Total: 17\nHeaviest: 17\nLightest: 17" },
          { description: "All crates heavy (catches lightest starting at 0)", hidden: true, stdin: "3\n60 90 75", stdout: "Total: 225\nHeaviest: 90\nLightest: 60" },
        ],
        feedback: [
          { codePattern: "lightest\\s*=\\s*0\\s*;", message: "Starting lightest at 0 means no crate can ever be lighter — seed it with weights[0] instead." },
          { codePattern: "<=\\s*(n|weights\\.length)\\s*;", message: "A loop condition of <= n reads one past the end of the array — use < n." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int[] w = new int[n];
                    for (int i = 0; i < n; i++) w[i] = in.nextInt();
                    int total = 0, heaviest = 0, lightest = 0;
                    for (int x : w) { total += x; if (x > heaviest) heaviest = x; if (x < lightest) lightest = x; }
                    System.out.println("Total: " + total);
                    System.out.println("Heaviest: " + heaviest);
                    System.out.println("Lightest: " + lightest);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "docks-strings",
      title: "Strings",
      kind: "lesson",
      concept: "strings",
      syllabusTag: "Unit 3: Strings",
      story: "Every crate has a label. The robot must read, compare and rewrite them.",
      minutes: 15,
      blocks: [
        {
          type: "text",
          md: "A `String` is a sequence of characters, indexed from 0 just like an array. Strings are **immutable**: no method changes a String — methods like `toUpperCase()` return a *new* String.",
        },
        {
          type: "code",
          title: "The String toolkit",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        String label = "Cargo-Bay";', ""],
            ["        System.out.println(label.length());", "Number of characters: 9. Note the () — it's a method."],
            ["        System.out.println(label.charAt(0));", "The char at index 0: C."],
            ["        System.out.println(label.substring(6));", "From index 6 to the end: Bay."],
            ["        System.out.println(label.substring(0, 5));", "Index 0 up to (not including) 5: Cargo."],
            ['        System.out.println(label.indexOf("-"));', "Position of the first \"-\": 5 (or -1 if absent)."],
            ["        System.out.println(label.toUpperCase());", "A new String: CARGO-BAY. label itself is unchanged."],
            ['        System.out.println(label.contains("Bay"));', "true."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "substring",
        },
        {
          type: "text",
          md: "**Comparing Strings.** `==` asks \"are these the very same object in memory?\" — two Strings with identical text can be different objects (for example one typed in by the user). To compare **content**, always use `a.equals(b)` (or `a.equalsIgnoreCase(b)`).\n\nTo walk through a String, loop over its indexes and use `charAt(i)`. A `char` is a single character in single quotes, and chars can be compared with `==` because they're primitive values.",
        },
        {
          type: "code",
          title: "equals and char loops",
          runnable: true,
          stdin: "iron",
          lines: [
            ["import java.util.Scanner;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        String typed = new Scanner(System.in).next();", "A String built from input at runtime."],
            ['        System.out.println(typed == "iron");', "false — different objects, even with the same text!"],
            ['        System.out.println(typed.equals("iron"));', "true — same characters."],
            ["        int vowels = 0;", ""],
            ["        for (int i = 0; i < typed.length(); i++) {", ""],
            ["            char c = typed.charAt(i);", ""],
            ["            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {", "chars are primitives, so == is right here."],
            ["                vowels++;", ""],
            ["            }", ""],
            ["        }", ""],
            ['        System.out.println("Vowels: " + vowels);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          md: "Building a String in a loop with `+=` creates a new String every time. For long results use a `StringBuilder`: `StringBuilder sb = new StringBuilder(); sb.append(\"x\"); String result = sb.toString();` — and `sb.reverse()` reverses it.",
        },
        {
          type: "check",
          question: "string-equals",
        },
      ],
      summary: {
        keyIdeas: [
          "length(), charAt(i), substring(a, b), indexOf, contains, toUpperCase/toLowerCase.",
          "substring(a, b) includes a and excludes b.",
          "Compare text with equals(); compare chars with ==.",
          "Strings are immutable; StringBuilder builds text efficiently.",
        ],
        mistakes: [
          "`s1 == s2` for text comparison.",
          "`s.length` without parentheses (that's the array syntax).",
          "Calling `s.toUpperCase();` and expecting s to change.",
          "substring end index off by one.",
        ],
      },
      questions: [
        {
          slug: "substring",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            String s = "harbour";
            System.out.println(s.substring(1, 4) + s.charAt(s.length() - 1));
          `,
          answer: "arbr",
          explanation: "substring(1, 4) is indexes 1, 2, 3 → \"arb\". The last char (index 6) is 'r'. Joined: \"arbr\".",
        },
        {
          slug: "string-equals",
          kind: "mcq",
          prompt: "A password is read with `in.next()`. Which check correctly tests whether it is `\"open\"`?",
          options: [
            { id: "a", text: "password == \"open\"", feedback: "== compares object identity. A String read from input is a different object, so this is false even when the text matches." },
            { id: "b", text: "password.equals(\"open\")" },
            { id: "c", text: "password = \"open\"", feedback: "A single = assigns; it doesn't compare." },
            { id: "d", text: "password.charAt(0) == 'o'", feedback: "That only checks the first letter — \"oak\" would pass." },
          ],
          answer: "b",
          explanation: "equals compares the characters themselves, which is what you mean by \"is the password open?\".",
        },
      ],
    },
    {
      slug: "docks-registry",
      title: "Registry",
      kind: "trial",
      concept: "strings",
      syllabusTag: "Unit 3: Strings",
      story: "A locked door registry maps key names to door names; the robot must look up the right key.",
      minutes: 10,
      challenge: {
        instructions:
          "The input is a door name, then a count `n`, then `n` key names. Find the key whose name matches the door and print `Key found at position <p>` (positions start at 1). If no key matches, print `No key fits`.\n\nFor `iron` / `3` / `copper iron gold`: `Key found at position 2`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  String door = in.next();
                  int n = in.nextInt();
                  String[] keys = new String[n];
                  for (int i = 0; i < n; i++) {
                      keys[i] = in.next();
                  }

                  // find the matching key and print its position

              }
          }
        `,
        hints: [
          "Loop over the keys and compare each one with door. What should happen when you find a match — and when the loop ends without one?",
          "Compare Strings with `keys[i].equals(door)`. == compares objects, and the words read from input are different objects.",
          "Worked example: `int found = -1; for (int i = 0; i < a.length; i++) { if (a[i].equals(target)) { found = i; break; } }` — then check found after the loop.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  String door = in.next();
                  int n = in.nextInt();
                  String[] keys = new String[n];
                  for (int i = 0; i < n; i++) {
                      keys[i] = in.next();
                  }

                  int found = -1;
                  for (int i = 0; i < n; i++) {
                      if (keys[i].equals(door)) {
                          found = i;
                          break;
                      }
                  }
                  if (found == -1) {
                      System.out.println("No key fits");
                  } else {
                      System.out.println("Key found at position " + (found + 1));
                  }
              }
          }
        `,
        solutionExplanation:
          "-1 is a conventional \"not found\" marker because it can never be a real index. equals compares the text; positions are index + 1 because people count from 1.",
        tests: [
          { description: "Finds iron at position 2", stdin: "iron\n3\ncopper iron gold", stdout: "Key found at position 2" },
          { description: "No matching key", hidden: true, stdin: "silver\n2\ncopper gold", stdout: "No key fits" },
          { description: "Match is the first key", hidden: true, stdin: "oak\n4\noak pine elm ash", stdout: "Key found at position 1" },
        ],
        feedback: [
          { codePattern: "(==\\s*door|door\\s*==)", message: "== compares whether two Strings are the same object, not the same text — and words read from input are always new objects. Use keys[i].equals(door)." },
          { stdoutPattern: "position 1$", message: "Off by one? Positions count from 1, but indexes from 0." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    String door = in.next();
                    int n = in.nextInt();
                    String[] keys = new String[n];
                    for (int i = 0; i < n; i++) keys[i] = in.next();
                    for (int i = 0; i < n; i++) {
                        if (keys[i] == door) { System.out.println("Key found at position " + (i + 1)); return; }
                    }
                    System.out.println("No key fits");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "docks-patterns",
      title: "Common patterns",
      kind: "lesson",
      concept: "array-patterns",
      syllabusTag: "Unit 3: Problem-Solving Patterns",
      story: "Old dockhands solve every manifest puzzle with the same handful of tricks.",
      minutes: 15,
      blocks: [
        {
          type: "text",
          md: "Most beginner array and string problems are one of a few **patterns**. Recognising the pattern is half the solution:\n- **Accumulate** — a running sum or count declared before the loop.\n- **Best so far** — seed with the first element, let each element challenge it (max, min, longest).\n- **Two pointers** — one index from each end, moving toward each other (reverse, palindrome, pair sums in sorted data).\n- **Frequency table** — count occurrences in an array indexed by value, e.g. `int[26]` for letters.",
        },
        {
          type: "code",
          title: "Two pointers: reverse in place",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int[] a = {1, 2, 3, 4, 5};", ""],
            ["        int left = 0, right = a.length - 1;", "One pointer at each end."],
            ["        while (left < right) {", "Stop when they meet in the middle."],
            ["            int tmp = a[left];", "Swapping needs a temporary box…"],
            ["            a[left] = a[right];", ""],
            ["            a[right] = tmp;", "…or one value would be lost."],
            ["            left++;", "Move both pointers inward."],
            ["            right--;", ""],
            ["        }", ""],
            ["        System.out.println(java.util.Arrays.toString(a));", "Arrays.toString prints [5, 4, 3, 2, 1]."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "swap",
        },
        {
          type: "code",
          title: "Frequency table: counting letters",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        String word = "banana";', ""],
            ["        int[] counts = new int[26];", "One counter per letter a–z, all starting at 0."],
            ["        for (int i = 0; i < word.length(); i++) {", ""],
            ["            counts[word.charAt(i) - 'a']++;", "Chars are numbers underneath: 'a' - 'a' = 0, 'b' - 'a' = 1, … so each letter maps to its slot."],
            ["        }", ""],
            ["        for (int i = 0; i < 26; i++) {", ""],
            ["            if (counts[i] > 0) {", ""],
            ["                char letter = (char) ('a' + i);", "Turn the slot number back into its letter."],
            ['                System.out.println(letter + ": " + counts[i]);', ""],
            ["            }", ""],
            ["        }", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "callout",
          tone: "interview",
          md: "\"Can you do it in one pass?\" is a favourite follow-up. Accumulate, best-so-far and frequency tables all need only a single loop over the data — that's O(n) time, which you'll learn to name in the algorithms realm.",
        },
        {
          type: "check",
          question: "pattern-pick",
        },
      ],
      summary: {
        keyIdeas: [
          "Accumulate, best-so-far, two pointers and frequency table cover most beginner problems.",
          "Swapping two values needs a temporary variable.",
          "`c - 'a'` turns a lowercase letter into 0–25.",
        ],
        mistakes: [
          "Swapping with `a[i] = a[j]; a[j] = a[i];` — both end up the same.",
          "Two-pointer loops with `<=` that swap the middle element with itself (harmless) or cross over (bugs).",
          "Frequency arrays sized too small for the values they count.",
        ],
      },
      questions: [
        {
          slug: "swap",
          kind: "output",
          prompt: "This tries to swap without a temporary variable. Type exactly what it prints.",
          code: java`
            int[] a = {7, 9};
            a[0] = a[1];
            a[1] = a[0];
            System.out.println(a[0] + " " + a[1]);
          `,
          answer: "9 9",
          explanation: "After a[0] = a[1], both slots hold 9 and the 7 is gone forever. That's why a swap saves one value in tmp first.",
        },
        {
          slug: "pattern-pick",
          kind: "mcq",
          prompt: "Which pattern fits \"is this word the same backwards?\"",
          options: [
            { id: "a", text: "Frequency table", feedback: "Counts tell you which letters appear, not their order — \"ab\" and \"ba\" have the same counts." },
            { id: "b", text: "Two pointers" },
            { id: "c", text: "Accumulate a sum", feedback: "A sum loses the order of the letters entirely." },
          ],
          answer: "b",
          explanation: "Compare the first and last characters, move both pointers inward, and stop at the first mismatch — that's the palindrome check.",
        },
      ],
    },
    {
      slug: "docks-palindrome-seal",
      title: "Palindrome seal",
      kind: "trial",
      concept: "two-pointers",
      syllabusTag: "Unit 3: Problem-Solving Patterns",
      story: "Crates stamped with a palindrome seal get priority. Check every stamp.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is one lowercase word. Write `static boolean isPalindrome(String s)` using two pointers, and print `PALINDROME` or `NOT PALINDROME`.\n\n`level` → `PALINDROME`, `cargo` → `NOT PALINDROME`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {

              public static void main(String[] args) {
                  String word = new Scanner(System.in).next();

              }
          }
        `,
        requirements: [
          { description: "Defines static boolean isPalindrome(String s)", pattern: "static\\s+boolean\\s+isPalindrome\\s*\\(\\s*String\\s+\\w+\\s*\\)", mustMatch: true },
          { description: "Uses two pointers, not StringBuilder.reverse()", pattern: "\\.reverse\\s*\\(", mustMatch: false },
        ],
        hints: [
          "Two indexes: one starting at 0, one at s.length() - 1. Compare the chars they point at.",
          "As soon as one pair differs, you can return false. If the pointers meet without a mismatch, return true.",
          "Worked example: the two-pointer reverse in the patterns lesson — same loop shape, compare instead of swap.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static boolean isPalindrome(String s) {
                  int left = 0;
                  int right = s.length() - 1;
                  while (left < right) {
                      if (s.charAt(left) != s.charAt(right)) {
                          return false;
                      }
                      left++;
                      right--;
                  }
                  return true;
              }

              public static void main(String[] args) {
                  String word = new Scanner(System.in).next();
                  System.out.println(isPalindrome(word) ? "PALINDROME" : "NOT PALINDROME");
              }
          }
        `,
        solutionExplanation:
          "Each step checks one mirrored pair and moves inward, so it looks at each character at most once (O(n)) and stops early on the first mismatch. A one-letter word skips the loop and is a palindrome.",
        tests: [
          { description: "level is a palindrome", stdin: "level", stdout: "PALINDROME" },
          { description: "cargo is not", stdin: "cargo", stdout: "NOT PALINDROME" },
          { description: "Even length palindrome", hidden: true, stdin: "abba", stdout: "PALINDROME" },
          { description: "Single letter", hidden: true, stdin: "a", stdout: "PALINDROME" },
          { description: "Mismatch only in the middle pair", hidden: true, stdin: "abca", stdout: "NOT PALINDROME" },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static boolean isPalindrome(String s) {
                    return s.charAt(0) == s.charAt(s.length() - 1);
                }
                public static void main(String[] args) {
                    String word = new Scanner(System.in).next();
                    System.out.println(isPalindrome(word) ? "PALINDROME" : "NOT PALINDROME");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "docks-signal-frequency",
      title: "Signal frequency",
      kind: "trial",
      concept: "frequency-count",
      syllabusTag: "Unit 3: Problem-Solving Patterns",
      story: "An intercepted signal repeats one letter more than the rest. Find it.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is one lowercase word. Print its most frequent letter and how many times it appears, as `<letter>: <count>`. If several letters tie, choose the one that comes first in the alphabet.\n\n`banana` → `a: 3`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String word = new Scanner(System.in).next();

              }
          }
        `,
        hints: [
          "Build a frequency table: `int[] counts = new int[26];` and add one for each letter.",
          "Then find the best-so-far over the 26 slots. Scanning a→z and only replacing on a strictly larger count handles ties automatically.",
          "Worked example: see the letter-counting example in the patterns lesson; the second loop is a max-search instead of printing.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String word = new Scanner(System.in).next();
                  int[] counts = new int[26];
                  for (int i = 0; i < word.length(); i++) {
                      counts[word.charAt(i) - 'a']++;
                  }
                  int best = 0;
                  for (int i = 1; i < 26; i++) {
                      if (counts[i] > counts[best]) {
                          best = i;
                      }
                  }
                  System.out.println((char) ('a' + best) + ": " + counts[best]);
              }
          }
        `,
        solutionExplanation:
          "Two patterns combined: a frequency table, then best-so-far over it. Using > (not >=) keeps the earliest letter on a tie because later letters must strictly beat it.",
        tests: [
          { description: "banana → a: 3", stdin: "banana", stdout: "a: 3" },
          { description: "A tie goes to the earlier letter", hidden: true, stdin: "mississippi", stdout: "i: 4" },
          { description: "One letter", hidden: true, stdin: "z", stdout: "z: 1" },
        ],
        feedback: [
          { stdoutPattern: "^\\d+: \\d+$", message: "Your letter printed as a number — 'a' + best is an int. Cast it back: (char) ('a' + best)." },
          { codePattern: "counts\\[i\\]\\s*>=\\s*counts\\[best\\]", message: "With >= a later letter wins a tie; the instructions want the earliest. Use >." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    String word = new Scanner(System.in).next();
                    int[] counts = new int[26];
                    for (int i = 0; i < word.length(); i++) counts[word.charAt(i) - 'a']++;
                    int best = 0;
                    for (int i = 1; i < 26; i++) if (counts[i] >= counts[best]) best = i;
                    System.out.println((char) ('a' + best) + ": " + counts[best]);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "docks-crate-rotation",
      title: "Crate rotation",
      kind: "trial",
      concept: "array-patterns",
      syllabusTag: "Unit 3: Problem-Solving Patterns",
      story: "The conveyor shifts every crate along by k places; crates falling off the end wrap round to the front.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is `n`, then `n` numbers, then `k`. Rotate the array **right** by `k` places and print it on one line, separated by single spaces. `k` can be larger than `n`.\n\nFor `5` / `1 2 3 4 5` / `2`: `4 5 1 2 3`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) {
                      a[i] = in.nextInt();
                  }
                  int k = in.nextInt();

              }
          }
        `,
        hints: [
          "Where does the element at index i end up after rotating right by k? Work it out for the example by hand.",
          "It moves to index (i + k) % n. The % both wraps around the end and handles k larger than n.",
          "Worked example: rotating {1, 2, 3} right by 1 — index 0 → 1, index 1 → 2, index 2 → (2 + 1) % 3 = 0. Write into a second array, then print it.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) {
                      a[i] = in.nextInt();
                  }
                  int k = in.nextInt();
                  int[] rotated = new int[n];
                  for (int i = 0; i < n; i++) {
                      rotated[(i + k) % n] = a[i];
                  }
                  StringBuilder out = new StringBuilder();
                  for (int i = 0; i < n; i++) {
                      if (i > 0) out.append(' ');
                      out.append(rotated[i]);
                  }
                  System.out.println(out);
              }
          }
        `,
        solutionExplanation:
          "Each element's new position is (i + k) % n, so one pass into a fresh array does the whole rotation. Writing into a second array avoids overwriting values you still need.",
        tests: [
          { description: "Rotate 1..5 right by 2", stdin: "5\n1 2 3 4 5\n2", stdout: "4 5 1 2 3" },
          { description: "k larger than n", hidden: true, stdin: "5\n1 2 3 4 5\n7", stdout: "4 5 1 2 3" },
          { description: "No rotation", hidden: true, stdin: "3\n9 8 7\n0", stdout: "9 8 7" },
          { description: "Rotate by a full cycle", hidden: true, stdin: "4\n1 2 3 4\n4", stdout: "1 2 3 4" },
        ],
        feedback: [
          { stdoutPattern: "^3 4 5 1 2$", message: "That's a rotation to the left. Rotating right moves elements toward higher indexes." },
          { stdoutPattern: "\\S\\s{2,}\\S|,", message: "Check the separators: exactly one space between numbers, no commas." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int[] a = new int[n];
                    for (int i = 0; i < n; i++) a[i] = in.nextInt();
                    int k = in.nextInt();
                    int[] r = new int[n];
                    for (int i = 0; i < n; i++) r[i] = a[(i + k) % n];
                    StringBuilder out = new StringBuilder();
                    for (int i = 0; i < n; i++) out.append(i > 0 ? " " : "").append(r[i]);
                    System.out.println(out);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "docks-guardian",
      title: "Guardian of the Docks",
      kind: "quiz",
      concept: "docks-mastery",
      syllabusTag: "Unit 3 review",
      story: "The harbourmaster's guardian checks every manifest — and every engineer.",
      minutes: 15,
      passingScore: 75,
      questions: [
        {
          slug: "out-of-bounds",
          kind: "mcq",
          prompt: "`int[] a = new int[4];` then `for (int i = 0; i <= a.length; i++) { a[i] = i; }` — what happens?",
          options: [
            { id: "a", text: "It fills the array with 0, 1, 2, 3" , feedback: "It does fill those four — but the loop then tries one more index." },
            { id: "b", text: "It crashes with ArrayIndexOutOfBoundsException when i is 4" },
            { id: "c", text: "It doesn't compile", feedback: "The compiler can't know the index will go out of range — this fails only at runtime." },
          ],
          answer: "b",
          explanation: "i <= a.length lets i reach 4, but the last valid index is 3. Use i < a.length.",
          reviewLesson: "docks-arrays",
        },
        {
          slug: "array-default",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int[] slots = new int[3];
            slots[1] = 5;
            System.out.println(slots[0] + slots[1] + slots[2]);
          `,
          answer: "5",
          explanation: "new int[3] fills every slot with 0. Only slot 1 changes, so 0 + 5 + 0 = 5 (all ints, so + adds).",
          reviewLesson: "docks-arrays",
        },
        {
          slug: "string-immutable",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            String s = "dock";
            s.toUpperCase();
            System.out.println(s + s.length());
          `,
          answer: "dock4",
          explanation: "toUpperCase() returns a new String, which is thrown away here — s is unchanged. You'd need s = s.toUpperCase();",
          reviewLesson: "docks-strings",
        },
        {
          slug: "length-syntax",
          kind: "mcq",
          prompt: "Which line compiles?",
          options: [
            { id: "a", text: "int n = \"crate\".length;", feedback: "For a String, length is a method: length()." },
            { id: "b", text: "int n = new int[3].length();", feedback: "For an array, length is a field: no parentheses." },
            { id: "c", text: "int n = \"crate\".length();" },
          ],
          answer: "c",
          explanation: "Strings have a length() method; arrays have a length field. Mixing them up is a compile error.",
          reviewLesson: "docks-strings",
        },
        {
          slug: "charat-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            String w = "stack";
            String out = "";
            for (int i = w.length() - 1; i >= 0; i -= 2) {
                out += w.charAt(i);
            }
            System.out.println(out);
          `,
          answer: "kas",
          explanation: "i takes 4, 2, 0 → chars 'k', 'a', 's'. Joined: \"kas\".",
          reviewLesson: "docks-strings",
        },
        {
          slug: "max-seed",
          kind: "mcq",
          prompt: "This finds the largest value: `int max = 0; for (int x : a) if (x > max) max = x;` For which array is it wrong?",
          options: [
            { id: "a", text: "{3, 9, 4}", feedback: "9 > 0, so max ends at 9 — correct." },
            { id: "b", text: "{-4, -1, -7}" },
            { id: "c", text: "{0, 0, 0}", feedback: "The answer is 0, and that's what max stays at — correct." },
          ],
          answer: "b",
          explanation: "No element beats the starting 0, so it reports 0 — a value not in the array. Seed max with a[0] instead.",
          reviewLesson: "docks-patterns",
        },
        {
          slug: "freq-index",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int[] counts = new int[26];
            String s = "abcab";
            for (int i = 0; i < s.length(); i++) {
                counts[s.charAt(i) - 'a']++;
            }
            System.out.println(counts[0] + "" + counts[1] + counts[2] + counts[3]);
          `,
          answer: "2210",
          explanation: "a appears twice (slot 0), b twice (slot 1), c once (slot 2), d never (slot 3). The \"\" makes + join instead of add.",
          reviewLesson: "docks-patterns",
        },
        {
          slug: "two-pointer-stop",
          kind: "mcq",
          prompt: "In a two-pointer palindrome check, why is the loop condition `left < right`?",
          options: [
            { id: "a", text: "Once the pointers meet or cross, every mirrored pair has already been compared" },
            { id: "b", text: "Because left must always be 0", feedback: "left starts at 0 but moves inward every step." },
            { id: "c", text: "To avoid comparing the first character", feedback: "The first character is compared — with the last one — on the very first step." },
          ],
          answer: "a",
          explanation: "Each step checks one pair from the outside in. When left reaches right (odd length) the middle char pairs with itself; once they cross, there's nothing left to compare.",
          reviewLesson: "docks-patterns",
        },
      ],
    },
  ],
};
