import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 7 — interview preparation: a problem-solving framework, complexity
// analysis, timed drills of common questions, and staged mock interviews.
export const arena: RealmDef = {
  slug: "arena",
  name: "The Interview Arena",
  subtitle: "Strategy, complexity, timed drills, mock interviews",
  story:
    "Every engineer who crosses the realms ends here. In the Arena you don't just solve problems — you explain them, under the clock, the way real interviews demand.",
  theme: "arena",
  summary: {
    keyIdeas: [
      "Interview routine: clarify → examples → brute force → optimise → plan → code → test → complexity — out loud.",
      "Big-O describes how cost grows with input size; drop constants and keep the dominant term.",
      "Common classes, fastest to slowest: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).",
      "Space complexity counts the extra memory your solution allocates (and the recursion stack).",
      "Pattern → tool: \"seen before?\" → HashMap/HashSet; sorted or pairs from both ends → two pointers; contiguous range → sliding window; shortest steps → BFS; overlapping subproblems → DP.",
    ],
    mistakes: [
      "Coding immediately without clarifying inputs, edge cases and output format.",
      "Going silent — the interviewer can't credit reasoning they can't hear.",
      "Declaring victory without tracing an example and an edge case.",
      "Counting a loop that halves as O(n) or forgetting the cost of a sort inside your solution.",
      "Optimising before you have a correct brute-force answer.",
    ],
  },
  levels: [
    {
      slug: "arena-framework",
      title: "The interview framework",
      kind: "lesson",
      concept: "interview-strategy",
      syllabusTag: "Interview: Problem-Solving Strategy",
      story: "The Arena's champion has a ritual for every problem. Learn it before your first bout.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "A coding interview tests *how you think* as much as whether you finish. Interviewers typically score communication, problem-solving, code quality and testing. A reliable routine covers all four:\n- **Clarify** — restate the problem; ask about input size, ranges, empty input, duplicates, negatives and the exact output.\n- **Examples** — work one small example by hand, plus an edge case.\n- **Brute force** — say the simplest correct approach and its complexity, even if it's slow.\n- **Optimise** — ask what work is repeated, and which data structure would remove it.\n- **Plan** — outline the steps before typing.\n- **Code** — clean names, small helper methods, narrate as you go.\n- **Test** — trace your example through the code, then edge cases.\n- **Complexity** — state time and space, and what drives each.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "Useful sentences: *\"Before I start, can I check — can the array be empty?\"* · *\"The brute force compares every pair, which is O(n²). I think a HashMap gets this to O(n).\"* · *\"Let me trace the example to check my loop bounds.\"* · *\"This is O(n) time and O(n) space for the map.\"*",
        },
        {
          type: "check",
          question: "clarify-first",
        },
        {
          type: "text",
          md: "**Pattern recognition** speeds up the \"optimise\" step. Ask what the problem is really about:\n- \"Have I seen this value / its complement before?\" → **HashMap / HashSet**.\n- Sorted data, or comparing from both ends → **two pointers**.\n- \"Longest / shortest contiguous run with some property\" → **sliding window**: grow the right edge, shrink the left when the window breaks the rule.\n- \"Fewest steps\" in a grid or network → **BFS**.\n- \"Number of ways\" or \"best total\" built from smaller answers → **DP**.\n- Nested or matching structure → **stack**.",
        },
        {
          type: "code",
          title: "Sliding window: longest run of distinct letters",
          runnable: true,
          lines: [
            ["import java.util.*;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        String s = "abcabcbb";', ""],
            ["        Map<Character, Integer> lastSeen = new HashMap<>();", "Where each char was last seen."],
            ["        int best = 0, left = 0;", "The window is s[left..right]."],
            ["        for (int right = 0; right < s.length(); right++) {", "Grow the window one char at a time."],
            ["            char c = s.charAt(right);", ""],
            ["            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {", "c is already inside the window…"],
            ["                left = lastSeen.get(c) + 1;", "…so jump left past its previous copy."],
            ["            }", ""],
            ["            lastSeen.put(c, right);", ""],
            ["            best = Math.max(best, right - left + 1);", "Window length after fixing it."],
            ["        }", ""],
            ["        System.out.println(best);", "3 (\"abc\") — in one O(n) pass."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "pattern-map",
        },
      ],
      summary: {
        keyIdeas: [
          "Clarify, example, brute force, optimise, plan, code, test, complexity.",
          "Think aloud — reasoning you don't say can't be scored.",
          "Map the problem to a pattern: hash map, two pointers, sliding window, BFS, DP, stack.",
        ],
        mistakes: [
          "Starting to code before clarifying.",
          "Skipping the brute force and getting stuck on the optimal answer.",
          "Not testing before saying \"done\".",
        ],
      },
      questions: [
        {
          slug: "clarify-first",
          kind: "mcq",
          prompt: "The interviewer says: \"Find the largest number in an array.\" What's the best first response?",
          options: [
            { id: "a", text: "Start typing a loop immediately", feedback: "You'd be guessing about empty arrays, negatives and the return type." },
            { id: "b", text: "Ask: can the array be empty, and what should I return then? Can it contain negatives?" },
            { id: "c", text: "Say you'll sort it and take the last element", feedback: "That works but is O(n log n) for an O(n) problem — and you still haven't clarified the edge cases." },
          ],
          answer: "b",
          explanation: "Clarifying edge cases first shows care and avoids solving the wrong problem. The empty array, for example, changes your return type or requires an exception.",
        },
        {
          slug: "pattern-map",
          kind: "mcq",
          prompt: "\"Return the length of the longest contiguous subarray whose sum is at most K\" (all numbers positive). Which pattern fits?",
          options: [
            { id: "a", text: "Sliding window" },
            { id: "b", text: "BFS", feedback: "BFS is for fewest steps in a graph or grid; there's no graph here." },
            { id: "c", text: "Binary search on the unsorted array", feedback: "Binary search needs sorted data — and the question is about a contiguous range." },
          ],
          answer: "a",
          explanation: "\"Longest contiguous range with a property\" with positive numbers is a classic sliding window: extend right, and shrink left while the sum exceeds K. O(n).",
        },
      ],
    },
    {
      slug: "arena-complexity",
      title: "Complexity analysis",
      kind: "lesson",
      concept: "complexity",
      syllabusTag: "Interview: Complexity Analysis",
      story: "The Arena judges don't just ask whether your solution works — they ask how it scales.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "**Big-O notation** describes how an algorithm's running time (or memory) grows as the input size n grows. It ignores constant factors and smaller terms, because for large n only the dominant term matters:\n- `3n + 10` → **O(n)**\n- `n² + 100n` → **O(n²)**\n- `5` → **O(1)** — constant, independent of n\n\nFrom fastest to slowest growth: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). For n = 1,000,000: log n ≈ 20, n log n ≈ 20 million, n² = a trillion.",
        },
        {
          type: "code",
          title: "Reading complexity from code",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int n = 16;", ""],
            ["        int steps = 0;", ""],
            ["        for (int i = 0; i < n; i++) steps++;", "One loop over n: O(n)."],
            ['        System.out.println("linear: " + steps);', ""],
            ["        steps = 0;", ""],
            ["        for (int i = 0; i < n; i++)", "A loop inside a loop, both over n…"],
            ["            for (int j = 0; j < n; j++) steps++;", "…n × n: O(n²)."],
            ['        System.out.println("quadratic: " + steps);', ""],
            ["        steps = 0;", ""],
            ["        for (int i = n; i > 1; i /= 2) steps++;", "Halving each time: O(log n)."],
            ['        System.out.println("logarithmic: " + steps);', ""],
            ["        steps = 0;", ""],
            ["        for (int i = 0; i < n; i++) steps++;", "Two loops one AFTER the other…"],
            ["        for (int j = 0; j < n; j++) steps++;", "…add: O(n + n) = O(n), not O(n²)."],
            ['        System.out.println("still linear: " + steps);', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "loop-complexity",
        },
        {
          type: "text",
          md: "**Rules of thumb:**\n- Sequential steps **add**; nested steps **multiply**.\n- A library call has its own cost: `Arrays.sort` is O(n log n), `list.contains` O(n), `map.get` O(1) average.\n- Recursion: (number of calls) × (work per call). Plain Fibonacci makes ~2ⁿ calls; binary search's recursion makes log n.\n- With two inputs, keep both: a grid is O(rows × cols); BFS is O(V + E).\n\n**Space complexity** counts extra memory: a HashMap of n entries is O(n); a few variables are O(1); recursion depth d uses O(d) stack.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "State complexity *with the reason*: \"O(n log n) time because of the sort; the scan afterwards is O(n), which is dominated. O(1) extra space apart from the sort.\" That sentence earns more credit than the bare answer.",
        },
        {
          type: "check",
          question: "hidden-cost",
        },
      ],
      summary: {
        keyIdeas: [
          "Drop constants and lower-order terms; keep the dominant one.",
          "Sequential → add, nested → multiply, halving → log n.",
          "Know your library costs; count recursion as calls × work per call.",
          "Space: extra structures plus recursion depth.",
        ],
        mistakes: [
          "Calling two separate loops O(n²).",
          "Ignoring the O(n) cost of list.contains or String concatenation inside a loop.",
          "Forgetting the sort in an otherwise O(n) solution.",
        ],
      },
      questions: [
        {
          slug: "loop-complexity",
          kind: "mcq",
          prompt: "What is the time complexity? `for (int i = 0; i < n; i++) for (int j = i; j < n; j++) count++;`",
          options: [
            { id: "a", text: "O(n)", feedback: "The inner loop isn't constant — it runs n - i times." },
            { id: "b", text: "O(n²)" },
            { id: "c", text: "O(n log n)", feedback: "Nothing halves here; the inner loop shrinks by one each time." },
          ],
          answer: "b",
          explanation: "The inner loop runs n, n-1, …, 1 times: about n²/2 total. Constants are dropped, so it's O(n²).",
        },
        {
          slug: "hidden-cost",
          kind: "mcq",
          prompt: "For each of n elements, a solution calls `list.contains(x)` on an ArrayList that grows to n elements. Overall complexity?",
          options: [
            { id: "a", text: "O(n)", feedback: "contains on an ArrayList scans the list — it's O(n) per call, not O(1)." },
            { id: "b", text: "O(n²)" },
            { id: "c", text: "O(log n)", feedback: "ArrayList isn't sorted or hashed, so there's no shortcut." },
          ],
          answer: "b",
          explanation: "n calls × O(n) each = O(n²). Swapping the list for a HashSet makes each check O(1) and the whole thing O(n).",
        },
      ],
    },
    {
      slug: "arena-reverse-words",
      title: "Drill: Reverse the words",
      kind: "trial",
      concept: "interview-strings",
      syllabusTag: "Interview practice",
      story: "A warm-up bout. Fifteen minutes on the clock — clarify, plan, code, test.",
      minutes: 15,
      timeLimitMinutes: 15,
      challenge: {
        instructions:
          "The input is one line of words separated by single spaces. Print the words in **reverse order**, separated by single spaces.\n\n`the arena awaits you` → `you awaits arena the`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String line = new Scanner(System.in).nextLine();

              }
          }
        `,
        hints: [
          "Clarify first: the input uses single spaces, and a one-word line just prints that word.",
          "`line.split(\" \")` gives an array of words. Then build the output from the last word to the first.",
          "Worked example: words = [a, b, c]; loop i from 2 down to 0, appending a space before every word except the first one you add.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String line = new Scanner(System.in).nextLine();
                  String[] words = line.split(" ");
                  StringBuilder out = new StringBuilder();
                  for (int i = words.length - 1; i >= 0; i--) {
                      out.append(words[i]);
                      if (i > 0) out.append(' ');
                  }
                  System.out.println(out);
              }
          }
        `,
        solutionExplanation:
          "split is O(n) and the reverse loop is O(n); a StringBuilder avoids the O(n²) cost of repeated String concatenation. Total O(n) time and O(n) space for the words array.",
        tests: [
          { description: "Four words reversed", stdin: "the arena awaits you", stdout: "you awaits arena the" },
          { description: "A single word", hidden: true, stdin: "champion", stdout: "champion" },
          { description: "Two words", hidden: true, stdin: "hello world", stdout: "world hello" },
        ],
        feedback: [
          { stdoutPattern: "^uoy", message: "You reversed the characters, not the words. Split the line into words first." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    String line = new Scanner(System.in).nextLine();
                    System.out.println(new StringBuilder(line).reverse());
                }
            }
          `,
        ],
      },
    },
    {
      slug: "arena-first-unique",
      title: "Drill: First unique character",
      kind: "trial",
      concept: "interview-hashing",
      syllabusTag: "Interview practice",
      story: "A common phone-screen question. Twenty minutes — aim for O(n).",
      minutes: 20,
      timeLimitMinutes: 20,
      challenge: {
        instructions:
          "The input is one lowercase word. Print the **index** of the first character that appears exactly once, or `-1` if every character repeats.\n\n`arena` → `1` (r), `aabb` → `-1`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();

              }
          }
        `,
        hints: [
          "Brute force: for each character, scan the whole word to count it — O(n²). What would let you know each count instantly?",
          "Two passes: first count every letter (an int[26] or a HashMap), then scan again and return the first index whose count is 1.",
          "Worked example, `arena`: counts a 2, r 1, e 1, n 1. Second pass: index 0 'a' has 2; index 1 'r' has 1 → answer 1.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();
                  int[] counts = new int[26];
                  for (int i = 0; i < s.length(); i++) {
                      counts[s.charAt(i) - 'a']++;
                  }
                  int answer = -1;
                  for (int i = 0; i < s.length(); i++) {
                      if (counts[s.charAt(i) - 'a'] == 1) {
                          answer = i;
                          break;
                      }
                  }
                  System.out.println(answer);
              }
          }
        `,
        solutionExplanation:
          "Counting first means the second pass can test each character in O(1). Two linear passes = O(n) time; the 26-slot table is O(1) extra space because its size doesn't depend on n.",
        tests: [
          { description: "arena → 1", stdin: "arena", stdout: "1" },
          { description: "Every character repeats", stdin: "aabb", stdout: "-1" },
          { description: "First character is unique", hidden: true, stdin: "zoom", stdout: "0" },
          { description: "Unique character at the end", hidden: true, stdin: "aabbc", stdout: "4" },
        ],
        feedback: [
          { stdoutPattern: "^2$", message: "That's the index of a character that appears once — but not the first one. Scan the word in its original order in the second pass." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    String s = new Scanner(System.in).next();
                    for (int i = 0; i < s.length() - 1; i++) {
                        if (s.charAt(i) != s.charAt(i + 1)) { System.out.println(i); return; }
                    }
                    System.out.println(-1);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "arena-mock-anagram",
      title: "Mock interview: Valid anagram",
      kind: "mock",
      concept: "mock-interview",
      syllabusTag: "Interview: Mock Interviews",
      story: "Your first full mock interview. The interviewer smiles and says: \"Given two strings, tell me whether one is an anagram of the other.\"",
      minutes: 30,
      timeLimitMinutes: 30,
      passingScore: 75,
      challenge: {
        instructions:
          "**Problem:** given two strings `s` and `t`, decide whether `t` is an anagram of `s` — the same letters, each used the same number of times, in any order.\n\nThe input is two lowercase words. Print `true` or `false`.\n\n`listen silent` → `true`, `rat car` → `false`.",
        guidance: "independent",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              static boolean isAnagram(String s, String t) {
                  return false;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  System.out.println(isAnagram(in.next(), in.next()));
              }
          }
        `,
        hints: [
          "If the lengths differ, the answer is immediately false.",
          "Count each letter of s up and each letter of t down in one int[26]; it's an anagram exactly when every count ends at 0.",
          "Worked example, `ab` / `ba`: a +1, b +1, then b −1, a −1 → all zeros → true.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static boolean isAnagram(String s, String t) {
                  if (s.length() != t.length()) {
                      return false;
                  }
                  int[] counts = new int[26];
                  for (int i = 0; i < s.length(); i++) {
                      counts[s.charAt(i) - 'a']++;
                      counts[t.charAt(i) - 'a']--;
                  }
                  for (int c : counts) {
                      if (c != 0) return false;
                  }
                  return true;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  System.out.println(isAnagram(in.next(), in.next()));
              }
          }
        `,
        solutionExplanation:
          "A single counting pass replaces sorting both strings: O(n) time instead of O(n log n), with O(1) extra space for the fixed 26-slot table.",
        tests: [
          { description: "listen / silent → true", stdin: "listen silent", stdout: "true" },
          { description: "rat / car → false", stdin: "rat car", stdout: "false" },
          { description: "Same letters, different counts", hidden: true, stdin: "aab abb", stdout: "false" },
          { description: "Different lengths", hidden: true, stdin: "abc abcd", stdout: "false" },
          { description: "Identical words", hidden: true, stdin: "arena arena", stdout: "true" },
        ],
        feedback: [
          {
            codePattern: "\\.indexOf\\s*\\(|\\.contains\\s*\\(",
            message: "Checking that each letter of s appears somewhere in t ignores how many times it appears — \"aab\" and \"abb\" would pass. Compare letter counts.",
          },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static boolean isAnagram(String s, String t) {
                    for (char c : s.toCharArray()) if (t.indexOf(c) < 0) return false;
                    return s.length() == t.length();
                }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    System.out.println(isAnagram(in.next(), in.next()));
                }
            }
          `,
        ],
      },
      questions: [
        {
          slug: "clarify-case",
          kind: "mcq",
          stage: "clarify",
          prompt: "Which clarifying question matters most before you design a solution?",
          options: [
            { id: "a", text: "\"Which programming language should I use?\"", feedback: "Fair to confirm, but it doesn't change the algorithm." },
            { id: "b", text: "\"Can the strings contain uppercase, spaces or non-English characters, or only lowercase a–z?\"" },
            { id: "c", text: "\"Should I print or return the answer?\"", feedback: "Useful, but it doesn't affect the approach — the character set does." },
          ],
          answer: "b",
          explanation: "The character set decides whether a fixed int[26] works or you need a HashMap, and whether \"A\" and \"a\" count as the same letter.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "clarify-edge",
          kind: "mcq",
          stage: "clarify",
          prompt: "Which edge case is worth confirming with the interviewer?",
          options: [
            { id: "a", text: "Two empty strings — are they anagrams of each other?" },
            { id: "b", text: "Strings longer than the universe", feedback: "Input size matters, but this isn't a realistic edge case." },
            { id: "c", text: "Whether the strings are palindromes", feedback: "Palindromes are a different property — irrelevant here." },
          ],
          answer: "a",
          explanation: "Empty input is the classic edge case. By the definition (same letters, same counts) two empty strings are anagrams — but confirming shows rigour.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "plan-brute",
          kind: "mcq",
          stage: "plan",
          prompt: "What's a correct brute-force approach to mention first?",
          options: [
            { id: "a", text: "Sort both strings and compare them — O(n log n)" },
            { id: "b", text: "Check that every letter of s appears somewhere in t", feedback: "Not correct: \"aab\" and \"abb\" pass that test but aren't anagrams — counts matter." },
            { id: "c", text: "Compare the first and last letters", feedback: "That ignores almost all of the string." },
          ],
          answer: "a",
          explanation: "Anagrams sort to the same string, so sorting both and comparing is a simple, correct baseline — worth stating before you optimise.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "plan-optimal",
          kind: "mcq",
          stage: "plan",
          prompt: "How can you beat O(n log n)?",
          options: [
            { id: "a", text: "Count letters: add for s, subtract for t, check all counts are zero — O(n)" },
            { id: "b", text: "Binary search each letter of s in t", feedback: "t isn't sorted, and sorting it costs O(n log n) anyway." },
            { id: "c", text: "Use recursion", feedback: "Recursion alone doesn't remove work; counting does." },
          ],
          answer: "a",
          explanation: "A frequency table compares letter counts directly in one pass, avoiding the sort entirely.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "test-trace",
          kind: "mcq",
          stage: "test",
          prompt: "Which test input would catch a solution that only checks \"every letter of s appears in t\"?",
          options: [
            { id: "a", text: "listen / silent", feedback: "That's a true anagram — the flawed solution also says true." },
            { id: "b", text: "aab / abb" },
            { id: "c", text: "rat / car", feedback: "'t' doesn't appear in car, so the flawed solution already says false." },
          ],
          answer: "b",
          explanation: "Every letter of aab appears in abb and the lengths match, but the counts differ. Good tests target the specific way a solution might be wrong.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "complexity-time",
          kind: "mcq",
          stage: "complexity",
          prompt: "What are the time and space complexity of the counting solution (lowercase a–z only)?",
          options: [
            { id: "a", text: "O(n) time, O(1) space" },
            { id: "b", text: "O(n) time, O(n) space", feedback: "The table has 26 slots no matter how long the strings are — that's constant space." },
            { id: "c", text: "O(n²) time, O(1) space", feedback: "Each character is visited once — there's no nested loop over n." },
          ],
          answer: "a",
          explanation: "One pass over the strings plus one pass over 26 counts: O(n) time. The table's size is fixed at 26, so extra space is O(1).",
          reviewLesson: "arena-complexity",
        },
      ],
    },
    {
      slug: "arena-longest-unique",
      title: "Drill: Longest distinct run",
      kind: "trial",
      concept: "sliding-window",
      syllabusTag: "Interview practice",
      story: "A favourite in on-site rounds. Thirty minutes — say \"sliding window\" before you write a line.",
      minutes: 30,
      timeLimitMinutes: 30,
      challenge: {
        instructions:
          "The input is one lowercase word. Print the length of the **longest substring with no repeated characters**.\n\n`abcabcbb` → `3` (\"abc\"), `bbbbb` → `1`, `pwwkew` → `3` (\"wke\").\n\nAim for O(n) with a sliding window.",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();

              }
          }
        `,
        hints: [
          "Brute force checks every substring — O(n³) or O(n²). Instead, keep a window [left, right] that never contains a repeat.",
          "Move right one step at a time. If the new character is already in the window, move left just past its previous position. Track the best window length.",
          "Worked example: the sliding-window example in the framework lesson solves exactly this problem.",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();
                  int[] lastSeen = new int[26];
                  Arrays.fill(lastSeen, -1);
                  int best = 0, left = 0;
                  for (int right = 0; right < s.length(); right++) {
                      int c = s.charAt(right) - 'a';
                      if (lastSeen[c] >= left) {
                          left = lastSeen[c] + 1;
                      }
                      lastSeen[c] = right;
                      best = Math.max(best, right - left + 1);
                  }
                  System.out.println(best);
              }
          }
        `,
        solutionExplanation:
          "Each index enters the window once and left only moves forward, so the scan is O(n). Remembering each letter's last position lets left jump straight past a repeat instead of creeping forward one step at a time.",
        tests: [
          { description: "abcabcbb → 3", stdin: "abcabcbb", stdout: "3" },
          { description: "pwwkew → 3", stdin: "pwwkew", stdout: "3" },
          { description: "All the same letter", hidden: true, stdin: "bbbbb", stdout: "1" },
          { description: "Repeat outside the window mustn't move left back", hidden: true, stdin: "abba", stdout: "2" },
          { description: "All distinct", hidden: true, stdin: "arenx", stdout: "5" },
        ],
        feedback: [
          {
            codePattern: "!=\\s*-1",
            message: "A repeat that's already left of the window mustn't pull left backwards (try \"abba\"). Only jump when the previous copy is inside the window: lastSeen[c] >= left.",
          },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    String s = new Scanner(System.in).next();
                    int[] last = new int[26];
                    Arrays.fill(last, -1);
                    int best = 0, left = 0;
                    for (int right = 0; right < s.length(); right++) {
                        int c = s.charAt(right) - 'a';
                        if (last[c] != -1) left = last[c] + 1;
                        last[c] = right;
                        best = Math.max(best, right - left + 1);
                    }
                    System.out.println(best);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "arena-mock-intervals",
      title: "Mock interview: Merge intervals",
      kind: "mock",
      concept: "mock-interview",
      syllabusTag: "Interview: Mock Interviews",
      story: "The final mock. The interviewer leans in: \"I'll give you a list of booking intervals. Merge any that overlap.\"",
      minutes: 35,
      timeLimitMinutes: 35,
      passingScore: 75,
      challenge: {
        instructions:
          "**Problem:** given `n` intervals `[start, end]` in any order, merge all overlapping intervals (intervals that touch, like `[1,3]` and `[3,5]`, also merge) and print the result sorted by start, one per line as `start end`.\n\nThe input is `n`, then `n` lines `start end`.\n\nFor `4` / `1 3` / `8 10` / `2 6` / `15 18`: `1 6`, `8 10`, `15 18`.",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[][] intervals = new int[n][2];
                  for (int i = 0; i < n; i++) {
                      intervals[i][0] = in.nextInt();
                      intervals[i][1] = in.nextInt();
                  }

              }
          }
        `,
        hints: [
          "If the intervals were sorted by start, overlapping ones would sit next to each other.",
          "Sort by start, then sweep: keep a current interval; if the next one starts at or before current's end, extend current's end to the max of both ends; otherwise output current and start a new one.",
          "Worked example: sort with `Arrays.sort(intervals, (a, b) -> a[0] - b[0]);` — then [1,3], [2,6] merge to [1,6] because 2 ≤ 3.",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[][] intervals = new int[n][2];
                  for (int i = 0; i < n; i++) {
                      intervals[i][0] = in.nextInt();
                      intervals[i][1] = in.nextInt();
                  }

                  Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
                  List<int[]> merged = new ArrayList<>();
                  for (int[] cur : intervals) {
                      if (!merged.isEmpty() && cur[0] <= merged.get(merged.size() - 1)[1]) {
                          int[] last = merged.get(merged.size() - 1);
                          last[1] = Math.max(last[1], cur[1]);
                      } else {
                          merged.add(new int[] {cur[0], cur[1]});
                      }
                  }
                  for (int[] m : merged) {
                      System.out.println(m[0] + " " + m[1]);
                  }
              }
          }
        `,
        solutionExplanation:
          "Sorting puts every group of overlapping intervals next to each other, so one sweep merges them. Taking the max of the ends handles an interval nested inside another. O(n log n) time for the sort, O(n) for the output list.",
        tests: [
          { description: "Classic example", stdin: "4\n1 3\n8 10\n2 6\n15 18", stdout: "1 6\n8 10\n15 18" },
          { description: "Touching intervals merge", hidden: true, stdin: "2\n1 3\n3 5", stdout: "1 5" },
          { description: "One interval inside another", hidden: true, stdin: "2\n1 10\n2 3", stdout: "1 10" },
          { description: "Unsorted, nothing overlaps", hidden: true, stdin: "3\n9 9\n1 2\n4 5", stdout: "1 2\n4 5\n9 9" },
        ],
        feedback: [
          { stdoutPattern: "^1 3\\n", message: "[1,3] should have merged with [2,6] — did you sort by start first, so overlapping intervals end up next to each other?" },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int[][] iv = new int[n][2];
                    for (int i = 0; i < n; i++) { iv[i][0] = in.nextInt(); iv[i][1] = in.nextInt(); }
                    Arrays.sort(iv, (a, b) -> a[0] - b[0]);
                    List<int[]> out = new ArrayList<>();
                    for (int[] c : iv) {
                        if (!out.isEmpty() && c[0] <= out.get(out.size() - 1)[1]) out.get(out.size() - 1)[1] = c[1];
                        else out.add(new int[] {c[0], c[1]});
                    }
                    for (int[] m : out) System.out.println(m[0] + " " + m[1]);
                }
            }
          `,
        ],
      },
      questions: [
        {
          slug: "clarify-touch",
          kind: "mcq",
          stage: "clarify",
          prompt: "Which question should you ask before coding?",
          options: [
            { id: "a", text: "\"Do intervals that only touch, like [1,3] and [3,5], count as overlapping?\"" },
            { id: "b", text: "\"Can I use a for loop?\"", feedback: "You can — this doesn't help you understand the problem." },
            { id: "c", text: "\"Are the intervals already merged?\"", feedback: "If they were, there'd be nothing to do — this doesn't clarify anything useful." },
          ],
          answer: "a",
          explanation: "Whether touching intervals merge changes a single comparison (< vs <=), and getting it wrong fails the boundary cases. Always pin down boundary behaviour.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "clarify-order",
          kind: "mcq",
          stage: "clarify",
          prompt: "The interviewer confirms the input intervals can be in any order. Why does that matter?",
          options: [
            { id: "a", text: "Overlapping intervals might be far apart in the list, so a single pass in input order can miss merges" },
            { id: "b", text: "It means there are duplicates", feedback: "Order and duplicates are separate questions." },
            { id: "c", text: "It doesn't matter", feedback: "It does: [1,3], [8,10], [2,6] has the overlapping pair separated." },
          ],
          answer: "a",
          explanation: "Unsorted input is the reason you need to sort first — that's the key insight of the problem.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "plan-approach",
          kind: "mcq",
          stage: "plan",
          prompt: "Which plan is correct and efficient?",
          options: [
            { id: "a", text: "Sort by start, then sweep once, extending the current interval or starting a new one" },
            { id: "b", text: "Compare every pair and merge until nothing changes", feedback: "Correct eventually, but O(n²) per round and possibly many rounds — mention it as the brute force, then improve." },
            { id: "c", text: "Sort by end, then binary search for overlaps", feedback: "Sorting by end doesn't keep chains of overlaps together the way sorting by start does." },
          ],
          answer: "a",
          explanation: "After sorting by start, an interval can only overlap the one currently being built, so one linear sweep finishes the job.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "test-nested",
          kind: "mcq",
          stage: "test",
          prompt: "Your merge step sets `last.end = cur.end`. Which test exposes the bug?",
          options: [
            { id: "a", text: "[1,10] and [2,3]" },
            { id: "b", text: "[1,3] and [5,7]", feedback: "These don't overlap, so the merge step never runs." },
            { id: "c", text: "[1,3] and [2,6]", feedback: "Here cur.end (6) is larger, so assigning it happens to be right." },
          ],
          answer: "a",
          explanation: "[2,3] sits inside [1,10]; assigning end = 3 would shrink the merged interval to [1,3]. The fix is end = max(last.end, cur.end).",
          reviewLesson: "arena-framework",
        },
        {
          slug: "complexity-sort",
          kind: "mcq",
          stage: "complexity",
          prompt: "What's the overall time complexity?",
          options: [
            { id: "a", text: "O(n)", feedback: "The sweep is O(n), but the sort before it costs O(n log n)." },
            { id: "b", text: "O(n log n)" },
            { id: "c", text: "O(n²)", feedback: "No pair-by-pair comparison happens — each interval is looked at once after sorting." },
          ],
          answer: "b",
          explanation: "Sorting dominates: O(n log n). The sweep adds O(n), which is absorbed. Space is O(n) for the merged output.",
          reviewLesson: "arena-complexity",
        },
      ],
    },
    {
      slug: "arena-guardian",
      title: "The Arena Champion",
      kind: "quiz",
      concept: "interview-mastery",
      syllabusTag: "Final review",
      story: "The Arena's champion has faced every engineer who came before you. Beat this final guardian and the path is complete.",
      minutes: 25,
      passingScore: 80,
      timeLimitMinutes: 25,
      questions: [
        {
          slug: "routine-order",
          kind: "mcq",
          prompt: "You've written a solution in an interview. What should you do before saying \"done\"?",
          options: [
            { id: "a", text: "Trace it with the example and an edge case, then state its complexity" },
            { id: "b", text: "Ask the interviewer whether it's correct", feedback: "Testing your own code is part of what's being assessed." },
            { id: "c", text: "Start optimising immediately", feedback: "Verify correctness first; optimisation without a working baseline is risky." },
          ],
          answer: "a",
          explanation: "Testing and complexity are scored parts of the interview. Tracing often reveals off-by-one bugs before the interviewer does.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "brute-force-value",
          kind: "mcq",
          prompt: "Why mention a brute-force solution when you already suspect a better one?",
          options: [
            { id: "a", text: "It shows a correct baseline, gives a complexity to beat, and guarantees you have something if time runs out" },
            { id: "b", text: "Interviewers prefer slow solutions", feedback: "They prefer good reasoning — the brute force is a step, not the destination." },
            { id: "c", text: "It isn't useful", feedback: "It anchors the conversation and protects you against getting stuck." },
          ],
          answer: "a",
          explanation: "A brute force proves you understand the problem, and its inefficiency points to what the optimisation must remove.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "pattern-pick-final",
          kind: "mcq",
          prompt: "\"Given a grid of open and blocked cells, find the fewest moves from the top-left to the bottom-right.\" Which approach?",
          options: [
            { id: "a", text: "BFS from the start cell" },
            { id: "b", text: "Sort the cells", feedback: "Cells have no meaningful order for a shortest path." },
            { id: "c", text: "Depth-first search, taking the first path found", feedback: "DFS finds a path, not necessarily the shortest." },
          ],
          answer: "a",
          explanation: "\"Fewest moves\" on an unweighted grid is a shortest-path problem: BFS explores in order of distance, so the first time it reaches the goal is optimal. O(rows × cols).",
          reviewLesson: "arena-framework",
        },
        {
          slug: "bigo-simplify",
          kind: "mcq",
          prompt: "An algorithm does `4n² + 30n log n + 500` steps. Its Big-O is:",
          options: [
            { id: "a", text: "O(n²)" },
            { id: "b", text: "O(n log n)", feedback: "n² grows faster than n log n, so it dominates for large n." },
            { id: "c", text: "O(4n² + 30n log n)", feedback: "Big-O drops constants and lower-order terms." },
          ],
          answer: "a",
          explanation: "Keep the fastest-growing term and drop its constant: 4n² → n².",
          reviewLesson: "arena-complexity",
        },
        {
          slug: "halving-loop",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            int n = 1000;
            int steps = 0;
            while (n > 1) {
                n /= 2;
                steps++;
            }
            System.out.println(steps);
          `,
          answer: "9",
          explanation: "1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1: nine halvings ≈ log₂ 1000. Halving loops are O(log n).",
          reviewLesson: "arena-complexity",
        },
        {
          slug: "space-recursion",
          kind: "mcq",
          prompt: "A recursive factorial(n) uses no arrays or collections. What is its space complexity?",
          options: [
            { id: "a", text: "O(1)", feedback: "Each pending call keeps a frame on the call stack." },
            { id: "b", text: "O(n)" },
            { id: "c", text: "O(log n)", feedback: "The recursion goes n levels deep, not log n." },
          ],
          answer: "b",
          explanation: "factorial(n) waits on factorial(n-1), which waits on factorial(n-2)… — n frames on the stack at the deepest point.",
          reviewLesson: "arena-complexity",
        },
        {
          slug: "optimise-lookup",
          kind: "mcq",
          prompt: "A solution checks, for each of n numbers, whether its negative appears anywhere in the array, using a nested loop. How do you improve it?",
          options: [
            { id: "a", text: "Put the numbers in a HashSet first, then check each negative in O(1) — O(n) total" },
            { id: "b", text: "Use a faster computer", feedback: "That changes the constant, not the O(n²) growth." },
            { id: "c", text: "Replace the inner loop with recursion", feedback: "The same comparisons happen — still O(n²)." },
          ],
          answer: "a",
          explanation: "\"Does X exist?\" asked repeatedly is the signal for a set. One pass to build it, one pass to query: O(n) time, O(n) space.",
          reviewLesson: "arena-complexity",
        },
        {
          slug: "window-trace",
          kind: "output",
          prompt: "This counts the maximum sum of any 3 consecutive values with a sliding window. Type exactly what it prints.",
          code: java`
            int[] a = {2, 1, 5, 1, 3, 2};
            int k = 3;
            int window = 0;
            for (int i = 0; i < k; i++) window += a[i];
            int best = window;
            for (int i = k; i < a.length; i++) {
                window += a[i] - a[i - k];
                best = Math.max(best, window);
            }
            System.out.println(best);
          `,
          answer: "9",
          explanation: "Windows: 2+1+5 = 8, 1+5+1 = 7, 5+1+3 = 9, 1+3+2 = 6. Each slide adds the new element and drops the oldest — O(n) instead of recomputing each sum.",
          reviewLesson: "arena-framework",
        },
        {
          slug: "sort-cost",
          kind: "mcq",
          prompt: "Your solution sorts the input, then does one linear pass. You tell the interviewer it's O(n). What's wrong?",
          options: [
            { id: "a", text: "Nothing — the pass is linear", feedback: "The sort is part of the solution too." },
            { id: "b", text: "The sort costs O(n log n), which dominates — the solution is O(n log n)" },
            { id: "c", text: "It should be O(n²) because there are two steps", feedback: "Sequential steps add, they don't multiply." },
          ],
          answer: "b",
          explanation: "O(n log n) + O(n) = O(n log n). Hidden library costs are a common slip in complexity answers.",
          reviewLesson: "arena-complexity",
        },
        {
          slug: "communicate",
          kind: "mcq",
          prompt: "You're stuck mid-interview. What's the most effective move?",
          options: [
            { id: "a", text: "Go quiet and think until you have the full answer", feedback: "Silence leaves the interviewer unable to help or to credit your reasoning." },
            { id: "b", text: "Say what you've tried, what's blocking you, and try a smaller example out loud" },
            { id: "c", text: "Ask for the answer", feedback: "Asking for a hint is fine; asking for the answer gives up the problem." },
          ],
          answer: "b",
          explanation: "Thinking aloud keeps the interviewer engaged, often earns a nudge, and shows the problem-solving process they're evaluating.",
          reviewLesson: "arena-framework",
        },
      ],
    },
  ],
};
