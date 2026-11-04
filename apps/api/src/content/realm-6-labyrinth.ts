import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 6 — algorithms: searching, sorting, recursion and introductory
// dynamic programming. Ends with a timed DP interview drill before the quiz.
export const labyrinth: RealmDef = {
  slug: "labyrinth",
  name: "The Clockwork Labyrinth",
  subtitle: "Searching, sorting, recursion, dynamic programming",
  story:
    "Deep under the Archive, a labyrinth of clockwork rewards clever routes and punishes brute force. Here you learn to choose algorithms, not just write loops.",
  theme: "labyrinth",
  summary: {
    keyIdeas: [
      "Linear search checks every element (O(n)); binary search halves a sorted range each step (O(log n)).",
      "Simple sorts (selection, insertion, bubble) are O(n²); merge sort and Java's `Arrays.sort` are O(n log n).",
      "A recursive method needs a base case that stops, and a recursive case that moves toward it.",
      "Each recursive call gets its own frame on the call stack; too many nested calls cause StackOverflowError.",
      "Dynamic programming reuses answers to overlapping subproblems — memoize top-down or fill a table bottom-up.",
    ],
    mistakes: [
      "Binary search on unsorted data, or `while (lo < hi)` when the bounds are inclusive.",
      "Computing `mid = (lo + hi) / 2` without thinking — `lo + (hi - lo) / 2` can't overflow.",
      "A recursive method with no base case, or one that never gets closer to it.",
      "Plain recursion for Fibonacci-style problems: exponential time.",
      "Using int where results overflow — switch to long.",
    ],
  },
  levels: [
    {
      slug: "lab-searching",
      title: "Searching",
      kind: "lesson",
      concept: "searching",
      syllabusTag: "Unit 6: Searching",
      story: "A vault holds a million numbered gears in order. Find one before the clock strikes.",
      minutes: 14,
      blocks: [
        {
          type: "text",
          md: "**Linear search** checks elements one by one until it finds the target or runs out. It works on any data, but in the worst case it looks at all n elements: **O(n)**.\n\nIf the data is **sorted**, you can do far better. **Binary search** compares the target with the middle element and throws away the half that can't contain it. Each step halves the range, so a million elements need only about 20 comparisons: **O(log n)**.",
        },
        {
          type: "code",
          title: "Binary search",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    static int binarySearch(int[] a, int target) {", "Returns the index of target, or -1."],
            ["        int lo = 0, hi = a.length - 1;", "The range still in play: indexes lo..hi, inclusive."],
            ["        while (lo <= hi) {", "<= because a one-element range (lo == hi) still needs checking."],
            ["            int mid = lo + (hi - lo) / 2;", "The middle, written so lo + hi can't overflow."],
            ["            if (a[mid] == target) return mid;", ""],
            ["            if (a[mid] < target) lo = mid + 1;", "Target is bigger → it can only be right of mid."],
            ["            else hi = mid - 1;", "Target is smaller → only left of mid."],
            ["        }", ""],
            ["        return -1;", "The range became empty: not present."],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int[] gears = {3, 8, 15, 23, 42, 57, 91};", "Must be sorted!"],
            ["        System.out.println(binarySearch(gears, 42));", "4"],
            ["        System.out.println(binarySearch(gears, 10));", "-1"],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "binary-steps",
        },
        {
          type: "callout",
          tone: "warning",
          md: "The classic bugs: `lo = mid` instead of `lo = mid + 1` (can loop forever), and `while (lo < hi)` with inclusive bounds (skips the last candidate). Trace a two-element array by hand whenever you write a binary search.",
        },
        {
          type: "check",
          question: "sorted-precondition",
        },
      ],
      summary: {
        keyIdeas: [
          "Linear search: any data, O(n).",
          "Binary search: sorted data only, O(log n).",
          "Keep lo..hi inclusive, loop while lo <= hi, and move past mid each time.",
        ],
        mistakes: [
          "Binary searching unsorted data.",
          "lo = mid / hi = mid (no progress → infinite loop).",
          "Off-by-one loop conditions.",
        ],
      },
      questions: [
        {
          slug: "binary-steps",
          kind: "mcq",
          prompt: "About how many comparisons does binary search need, at most, on a sorted array of 1,000,000 elements?",
          options: [
            { id: "a", text: "About 20" },
            { id: "b", text: "About 1,000", feedback: "That's roughly √n. Binary search halves the range every step." },
            { id: "c", text: "About 500,000", feedback: "That's linear search's average case." },
          ],
          answer: "a",
          explanation: "2²⁰ ≈ 1,000,000, so halving a million-element range reaches one element after about 20 steps — that's what O(log n) means.",
        },
        {
          slug: "sorted-precondition",
          kind: "mcq",
          prompt: "You binary search `{9, 2, 7, 4, 1}` for 4. What happens?",
          options: [
            { id: "a", text: "It finds 4 at index 3", feedback: "It might get lucky on some inputs, but nothing guarantees it — here mid is 7, so it searches the left half and misses 4." },
            { id: "b", text: "It may wrongly report -1, because the halving logic assumes sorted order" },
            { id: "c", text: "It throws an exception", feedback: "It runs without error — it just gives a wrong answer." },
          ],
          answer: "b",
          explanation: "Discarding half the range is only safe when order guarantees the target isn't there. On unsorted data binary search silently returns wrong answers.",
        },
      ],
    },
    {
      slug: "lab-vault-search",
      title: "Vault search",
      kind: "trial",
      concept: "searching",
      syllabusTag: "Unit 6: Searching",
      story: "The vault keeper reads out gear numbers. Say where each one is — fast.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is `n`, then `n` **sorted** distinct numbers, then `q`, then `q` queries. Write `static int binarySearch(int[] a, int target)` and print, for each query, its index or `-1`.\n\nFor `5` / `2 4 6 8 10` / `3` / `8 2 5`: `3`, `0`, `-1`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              static int binarySearch(int[] a, int target) {
                  return -1;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) a[i] = in.nextInt();
                  int q = in.nextInt();
                  for (int i = 0; i < q; i++) {
                      System.out.println(binarySearch(a, in.nextInt()));
                  }
              }
          }
        `,
        requirements: [
          { description: "Implements binary search itself (no Arrays.binarySearch)", pattern: "Arrays\\.binarySearch|Collections\\.binarySearch", mustMatch: false },
          { description: "Halves the range (computes a mid point)", pattern: "\\bmid\\b|/\\s*2|>>>?\\s*1", mustMatch: true },
        ],
        hints: [
          "Keep two indexes, lo and hi, for the part of the array that could still hold the target.",
          "Loop while lo <= hi. Compare a[mid] with the target and move lo to mid + 1 or hi to mid - 1.",
          "Worked example, find 8 in [2, 4, 6, 8, 10]: lo 0, hi 4, mid 2 (6 < 8) → lo 3. mid 3 (8) → found at 3.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static int binarySearch(int[] a, int target) {
                  int lo = 0, hi = a.length - 1;
                  while (lo <= hi) {
                      int mid = lo + (hi - lo) / 2;
                      if (a[mid] == target) return mid;
                      if (a[mid] < target) lo = mid + 1;
                      else hi = mid - 1;
                  }
                  return -1;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) a[i] = in.nextInt();
                  int q = in.nextInt();
                  for (int i = 0; i < q; i++) {
                      System.out.println(binarySearch(a, in.nextInt()));
                  }
              }
          }
        `,
        solutionExplanation:
          "Each comparison discards half of what's left, so each query costs O(log n). Inclusive bounds with lo <= hi make the one-element range (and the first and last elements) reachable.",
        tests: [
          { description: "Finds 8 and 2, misses 5", stdin: "5\n2 4 6 8 10\n3\n8 2 5", stdout: "3\n0\n-1" },
          { description: "First and last elements", hidden: true, stdin: "4\n1 3 5 7\n2\n1 7", stdout: "0\n3" },
          { description: "One element; smaller and larger misses", hidden: true, stdin: "1\n5\n3\n5 4 6", stdout: "0\n-1\n-1" },
        ],
        feedback: [
          { codePattern: "while\\s*\\(\\s*lo\\s*<\\s*hi\\s*\\)", message: "With inclusive bounds, while (lo < hi) stops before checking the final candidate — use lo <= hi." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static int binarySearch(int[] a, int target) {
                    int lo = 0, hi = a.length - 1;
                    while (lo < hi) {
                        int mid = lo + (hi - lo) / 2;
                        if (a[mid] == target) return mid;
                        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
                    }
                    return -1;
                }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int[] a = new int[n];
                    for (int i = 0; i < n; i++) a[i] = in.nextInt();
                    int q = in.nextInt();
                    for (int i = 0; i < q; i++) System.out.println(binarySearch(a, in.nextInt()));
                }
            }
          `,
        ],
      },
    },
    {
      slug: "lab-sorting",
      title: "Sorting",
      kind: "lesson",
      concept: "sorting",
      syllabusTag: "Unit 6: Sorting",
      story: "Gears arrive jumbled. Binary search only works once they're in order.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "Sorting puts data in order, which unlocks binary search, duplicate detection and much more. Three simple algorithms each take **O(n²)** time — fine for small inputs, slow for large ones:\n- **Selection sort** — repeatedly find the smallest remaining element and swap it to the front.\n- **Bubble sort** — repeatedly swap neighbours that are out of order.\n- **Insertion sort** — grow a sorted prefix: take the next element and slide it left into place, like sorting cards in your hand.",
        },
        {
          type: "code",
          title: "Insertion sort",
          runnable: true,
          lines: [
            ["import java.util.Arrays;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int[] a = {5, 2, 4, 1, 3};", ""],
            ["        for (int i = 1; i < a.length; i++) {", "a[0..i-1] is already sorted; insert a[i] into it."],
            ["            int key = a[i];", "Pick up the next card."],
            ["            int j = i - 1;", ""],
            ["            while (j >= 0 && a[j] > key) {", "Larger sorted elements…"],
            ["                a[j + 1] = a[j];", "…shift one place right to make room."],
            ["                j--;", ""],
            ["            }", ""],
            ["            a[j + 1] = key;", "Drop the card into the gap."],
            ['            System.out.println("Pass " + i + ": " + Arrays.toString(a));', ""],
            ["        }", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "insertion-pass",
        },
        {
          type: "text",
          md: "**Merge sort** splits the array in half, sorts each half (recursively), then **merges** the two sorted halves in one pass. There are about log n levels of halving and each level does O(n) merging work: **O(n log n)**. For a million elements that's roughly 20 million steps instead of a trillion.\n\nIn real code, use the library: `Arrays.sort(a)` for arrays and `Collections.sort(list)` for lists — both O(n log n). To sort by a custom rule, pass a comparator: `Arrays.sort(words, (x, y) -> x.length() - y.length())` sorts Strings by length.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "You'll rarely write a sort in an interview, but you'll often be asked \"what's the complexity of your solution?\" — and if it sorts first, the answer is at least O(n log n). Knowing why simple sorts are O(n²) (a loop inside a loop) is the foundation for the complexity lesson in the Arena.",
        },
        {
          type: "check",
          question: "sort-complexity",
        },
      ],
      summary: {
        keyIdeas: [
          "Selection, bubble and insertion sort: nested loops, O(n²).",
          "Merge sort: split, sort halves, merge — O(n log n).",
          "Use Arrays.sort / Collections.sort in practice; comparators define custom orders.",
        ],
        mistakes: [
          "Inner loop bounds that read past the end (j + 1 out of range).",
          "Forgetting that insertion sort's while loop needs `j >= 0` first.",
          "Writing an O(n²) sort for large data when the library sort exists.",
        ],
      },
      questions: [
        {
          slug: "insertion-pass",
          kind: "mcq",
          prompt: "Insertion sort on `{5, 2, 4, 1, 3}`: what does the array look like after pass 2 (i = 2)?",
          options: [
            { id: "a", text: "[2, 4, 5, 1, 3]" },
            { id: "b", text: "[1, 2, 4, 5, 3]", feedback: "1 hasn't been picked up yet — pass 2 only inserts a[2] = 4." },
            { id: "c", text: "[2, 5, 4, 1, 3]", feedback: "That's the state after pass 1. Pass 2 slides 4 left past 5." },
          ],
          answer: "a",
          explanation: "Pass 1 inserts 2 → [2, 5, 4, 1, 3]. Pass 2 inserts 4 between 2 and 5 → [2, 4, 5, 1, 3]. The first three elements are now sorted.",
        },
        {
          slug: "sort-complexity",
          kind: "mcq",
          prompt: "Why is merge sort much faster than insertion sort on a million random numbers?",
          options: [
            { id: "a", text: "Merge sort does O(n log n) work; insertion sort does O(n²)" },
            { id: "b", text: "Merge sort uses less memory", feedback: "It actually uses more (an extra array for merging) — its advantage is time." },
            { id: "c", text: "Insertion sort can't handle duplicates", feedback: "It handles duplicates fine." },
          ],
          answer: "a",
          explanation: "For n = 1,000,000, n² is 10¹² while n log n is about 2 × 10⁷ — tens of thousands of times less work.",
        },
      ],
    },
    {
      slug: "lab-insertion-sort",
      title: "Gear sorter",
      kind: "trial",
      concept: "sorting",
      syllabusTag: "Unit 6: Sorting",
      story: "The sorting engine must show its working: the inspectors check every pass.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is `n`, then `n` numbers. Sort them with **insertion sort**, and after each pass `i = 1 … n-1` print the whole array separated by spaces.\n\nFor `4` / `3 1 4 2`:\n\n`1 3 4 2`\n`1 3 4 2`\n`1 2 3 4`\n\nFor `n = 1` print the single number once.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              static void printArray(int[] a) {
                  StringBuilder sb = new StringBuilder();
                  for (int i = 0; i < a.length; i++) {
                      if (i > 0) sb.append(' ');
                      sb.append(a[i]);
                  }
                  System.out.println(sb);
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) a[i] = in.nextInt();

              }
          }
        `,
        requirements: [{ description: "Sorts by hand (no Arrays.sort / Collections.sort)", pattern: "Arrays\\.sort|Collections\\.sort|\\.sort\\s*\\(", mustMatch: false }],
        hints: [
          "The lesson's insertion sort is exactly the algorithm — swap its println for printArray(a).",
          "Print after every pass, even one where nothing moved (pass 2 in the example). Handle n = 1 separately: there are no passes.",
          "Worked example, pass 3 on [1, 3, 4, 2]: key 2; 4 > 2 shifts, 3 > 2 shifts, 1 > 2 is false → put 2 at index 1 → [1, 2, 3, 4].",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              static void printArray(int[] a) {
                  StringBuilder sb = new StringBuilder();
                  for (int i = 0; i < a.length; i++) {
                      if (i > 0) sb.append(' ');
                      sb.append(a[i]);
                  }
                  System.out.println(sb);
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] a = new int[n];
                  for (int i = 0; i < n; i++) a[i] = in.nextInt();
                  if (n == 1) {
                      printArray(a);
                      return;
                  }
                  for (int i = 1; i < n; i++) {
                      int key = a[i];
                      int j = i - 1;
                      while (j >= 0 && a[j] > key) {
                          a[j + 1] = a[j];
                          j--;
                      }
                      a[j + 1] = key;
                      printArray(a);
                  }
              }
          }
        `,
        solutionExplanation:
          "Each pass inserts one more element into the sorted prefix by shifting larger ones right. The trace makes the O(n²) behaviour visible: in the worst case pass i shifts i elements.",
        tests: [
          { description: "Trace of 3 1 4 2", stdin: "4\n3 1 4 2", stdout: "1 3 4 2\n1 3 4 2\n1 2 3 4" },
          { description: "Reverse-sorted input", hidden: true, stdin: "3\n3 2 1", stdout: "2 3 1\n1 2 3" },
          { description: "Single number", hidden: true, stdin: "1\n7", stdout: "7" },
          { description: "Duplicates", hidden: true, stdin: "3\n2 1 2", stdout: "1 2 2\n1 2 2" },
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
                    for (int i = 0; i < n - 1; i++) {
                        int min = i;
                        for (int j = i + 1; j < n; j++) if (a[j] < a[min]) min = j;
                        int t = a[i]; a[i] = a[min]; a[min] = t;
                        StringBuilder sb = new StringBuilder();
                        for (int k = 0; k < n; k++) sb.append(k > 0 ? " " : "").append(a[k]);
                        System.out.println(sb);
                    }
                    if (n == 1) System.out.println(a[0]);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "lab-recursion",
      title: "Recursion",
      kind: "lesson",
      concept: "recursion",
      syllabusTag: "Unit 6: Recursion",
      story: "Each chamber of the labyrinth contains a smaller labyrinth. Solve one, and you've solved them all.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "A **recursive** method calls itself on a smaller version of the same problem. Every recursive method needs two parts:\n- a **base case** — a version so small the answer is immediate, which returns without recursing;\n- a **recursive case** — which reduces the problem and trusts the recursive call to solve the smaller version.\n\nIf every call moves closer to the base case, the recursion must end.",
        },
        {
          type: "code",
          title: "Factorial and digit sum",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    static long factorial(int n) {", "n! = n × (n-1) × … × 1"],
            ["        if (n <= 1) return 1;", "Base case: 0! and 1! are 1."],
            ["        return n * factorial(n - 1);", "Recursive case: n! = n × (n-1)! — a smaller problem."],
            ["    }", ""],
            ["", ""],
            ["    static int digitSum(int n) {", ""],
            ["        if (n < 10) return n;", "Base case: a single digit is its own sum."],
            ["        return n % 10 + digitSum(n / 10);", "Last digit + the sum of the rest."],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        System.out.println(factorial(5));", "5 × 4 × 3 × 2 × 1 = 120"],
            ["        System.out.println(digitSum(4096));", "4 + 0 + 9 + 6 = 19"],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "text",
          md: "**The call stack.** Each call gets its own *frame* holding its parameters and local variables. `factorial(3)` pauses while `factorial(2)` runs, which pauses while `factorial(1)` runs. Then the answers return back up: 1 → 2 × 1 = 2 → 3 × 2 = 6.\n\nIf the base case is missing (or never reached), frames pile up until Java runs out of stack space: `StackOverflowError`.",
        },
        {
          type: "check",
          question: "recursion-trace",
        },
        {
          type: "text",
          md: "Recursion shines on **trees**, because each child is itself the root of a smaller tree. The height of a tree is 1 + the taller child's height; an empty tree is the base case. An **in-order traversal** of a BST — left subtree, node, right subtree — visits the keys in sorted order.",
        },
        {
          type: "code",
          title: "Recursion on a tree",
          runnable: true,
          lines: [
            ["class TreeNode {", ""],
            ["    int key;", ""],
            ["    TreeNode left, right;", ""],
            ["    TreeNode(int key, TreeNode left, TreeNode right) {", ""],
            ["        this.key = key; this.left = left; this.right = right;", ""],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    static int countNodes(TreeNode t) {", ""],
            ["        if (t == null) return 0;", "Base case: an empty tree has no nodes."],
            ["        return 1 + countNodes(t.left) + countNodes(t.right);", "This node plus both subtrees."],
            ["    }", ""],
            ["", ""],
            ["    static void inOrder(TreeNode t) {", ""],
            ["        if (t == null) return;", ""],
            ["        inOrder(t.left);", "Everything smaller first…"],
            ['        System.out.print(t.key + " ");', "…then this key…"],
            ["        inOrder(t.right);", "…then everything larger."],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        TreeNode root = new TreeNode(50,", ""],
            ["            new TreeNode(30, new TreeNode(20, null, null), new TreeNode(40, null, null)),", ""],
            ["            new TreeNode(70, null, null));", ""],
            ["        inOrder(root);", "20 30 40 50 70"],
            ["        System.out.println();", ""],
            ["        System.out.println(countNodes(root));", "5"],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "base-case",
        },
      ],
      summary: {
        keyIdeas: [
          "Base case + recursive case that shrinks the problem.",
          "Each call has its own frame on the call stack; results return in reverse order.",
          "Trees are recursive: height, size and traversals are a few lines each.",
        ],
        mistakes: [
          "Missing or unreachable base case → StackOverflowError.",
          "Recursive calls that don't shrink the input (e.g. f(n) calling f(n)).",
          "Forgetting to return (or use) the recursive call's result.",
        ],
      },
      questions: [
        {
          slug: "recursion-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            public class Main {
                static int f(int n) {
                    if (n == 0) return 0;
                    return n + f(n - 2);
                }

                public static void main(String[] args) {
                    System.out.println(f(6));
                }
            }
          `,
          answer: "12",
          explanation: "f(6) = 6 + f(4) = 6 + 4 + f(2) = 6 + 4 + 2 + f(0) = 12. (f(5) would skip past 0 and never stop — a base case must be reachable!)",
        },
        {
          slug: "base-case",
          kind: "mcq",
          prompt: "`static int count(int n) { return 1 + count(n - 1); }` — what happens when you call `count(3)`?",
          options: [
            { id: "a", text: "It returns 3", feedback: "There's no case that stops it — n just keeps decreasing past 0." },
            { id: "b", text: "It crashes with StackOverflowError" },
            { id: "c", text: "It doesn't compile", feedback: "It compiles; the problem only appears when it runs." },
          ],
          answer: "b",
          explanation: "With no base case, each call makes another (3, 2, 1, 0, -1, …) until the call stack is exhausted. Adding `if (n == 0) return 0;` fixes it.",
        },
      ],
    },
    {
      slug: "lab-recursive-tree",
      title: "Labyrinth map",
      kind: "trial",
      concept: "recursion",
      syllabusTag: "Unit 6: Recursion",
      story: "The labyrinth's chambers form a binary search tree. Chart it — recursively.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is `n`, then `n` distinct numbers to insert into a BST in order. Using **recursive** methods, print two lines:\n\n`Sorted: <in-order traversal, space-separated>`\n`Height: <h>`\n\nHeight counts edges on the longest root-to-leaf path (a single node has height 0). For `5` / `50 30 70 20 40`: `Sorted: 20 30 40 50 70` and `Height: 2`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          class TreeNode {
              int key;
              TreeNode left, right;
              TreeNode(int key) { this.key = key; }
          }

          public class Main {
              static TreeNode insert(TreeNode t, int key) {
                  // recursive: an empty spot becomes the new node
                  return t;
              }

              static void inOrder(TreeNode t, StringBuilder out) {
              }

              static int height(TreeNode t) {
                  return 0;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  TreeNode root = null;
                  for (int i = 0; i < n; i++) root = insert(root, in.nextInt());
                  StringBuilder out = new StringBuilder();
                  inOrder(root, out);
                  System.out.println("Sorted: " + out.toString().trim());
                  System.out.println("Height: " + height(root));
              }
          }
        `,
        requirements: [{ description: "Doesn't sort the input another way", pattern: "Arrays\\.sort|Collections\\.sort|TreeSet|TreeMap", mustMatch: false }],
        hints: [
          "Recursive insert: if t is null, return a new node. Otherwise insert into the left or right subtree and store the result back: `t.left = insert(t.left, key);`.",
          "Height: the base case is the tricky part. If a single node has height 0, what should an empty tree (null) return so that 1 + max(...) works?",
          "Worked example: height(null) = -1, so a leaf is 1 + max(-1, -1) = 0, and its parent is 1 + max(0, -1) = 1.",
        ],
        solution: java`
          import java.util.Scanner;

          class TreeNode {
              int key;
              TreeNode left, right;
              TreeNode(int key) { this.key = key; }
          }

          public class Main {
              static TreeNode insert(TreeNode t, int key) {
                  if (t == null) return new TreeNode(key);
                  if (key < t.key) t.left = insert(t.left, key);
                  else t.right = insert(t.right, key);
                  return t;
              }

              static void inOrder(TreeNode t, StringBuilder out) {
                  if (t == null) return;
                  inOrder(t.left, out);
                  out.append(t.key).append(' ');
                  inOrder(t.right, out);
              }

              static int height(TreeNode t) {
                  if (t == null) return -1;
                  return 1 + Math.max(height(t.left), height(t.right));
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  TreeNode root = null;
                  for (int i = 0; i < n; i++) root = insert(root, in.nextInt());
                  StringBuilder out = new StringBuilder();
                  inOrder(root, out);
                  System.out.println("Sorted: " + out.toString().trim());
                  System.out.println("Height: " + height(root));
              }
          }
        `,
        solutionExplanation:
          "Each method handles the empty tree as its base case and trusts the recursive calls for the subtrees. Returning -1 for an empty tree makes a leaf's height 0, matching the edge-counting definition.",
        tests: [
          { description: "Five keys: sorted output, height 2", stdin: "5\n50 30 70 20 40", stdout: "Sorted: 20 30 40 50 70\nHeight: 2" },
          { description: "Single node", hidden: true, stdin: "1\n8", stdout: "Sorted: 8\nHeight: 0" },
          { description: "Sorted input builds a chain", hidden: true, stdin: "4\n1 2 3 4", stdout: "Sorted: 1 2 3 4\nHeight: 3" },
        ],
        feedback: [
          { stdoutPattern: "Height: 3$", message: "Your height is one too high — you're counting nodes, not edges. What should height(null) return?" },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            class TreeNode { int key; TreeNode left, right; TreeNode(int k) { key = k; } }
            public class Main {
                static TreeNode insert(TreeNode t, int key) {
                    if (t == null) return new TreeNode(key);
                    if (key < t.key) t.left = insert(t.left, key); else t.right = insert(t.right, key);
                    return t;
                }
                static void inOrder(TreeNode t, StringBuilder out) { if (t == null) return; inOrder(t.left, out); out.append(t.key).append(' '); inOrder(t.right, out); }
                static int height(TreeNode t) { if (t == null) return 0; return 1 + Math.max(height(t.left), height(t.right)); }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    TreeNode root = null;
                    for (int i = 0; i < n; i++) root = insert(root, in.nextInt());
                    StringBuilder out = new StringBuilder();
                    inOrder(root, out);
                    System.out.println("Sorted: " + out.toString().trim());
                    System.out.println("Height: " + height(root));
                }
            }
          `,
        ],
      },
    },
    {
      slug: "lab-dynamic-programming",
      title: "Dynamic programming",
      kind: "lesson",
      concept: "dynamic-programming",
      syllabusTag: "Unit 6: Dynamic Programming",
      story: "The labyrinth's clock gears mesh in patterns that repeat. Remember them, and the maze opens.",
      minutes: 18,
      blocks: [
        {
          type: "text",
          md: "Some recursive solutions solve the **same subproblem** again and again. Fibonacci is the classic: `fib(n) = fib(n-1) + fib(n-2)`. Computing `fib(5)` calls `fib(3)` twice, `fib(2)` three times… the number of calls roughly doubles with each n, so `fib(50)` would take billions of calls.\n\n**Dynamic programming (DP)** fixes this by computing each subproblem **once** and reusing the answer. Two styles:\n- **Memoization (top-down)** — keep the recursion, but store each result in an array or map and check it first.\n- **Tabulation (bottom-up)** — fill a table from the smallest subproblems upward with a loop.",
        },
        {
          type: "code",
          title: "Fibonacci three ways",
          runnable: true,
          lines: [
            ["public class Main {", ""],
            ["    static long slowFib(int n) {", "Plain recursion: exponential time."],
            ["        if (n <= 1) return n;", ""],
            ["        return slowFib(n - 1) + slowFib(n - 2);", ""],
            ["    }", ""],
            ["", ""],
            ["    static long[] memo = new long[91];", "memo[k] == 0 means \"not computed yet\" (fib(k) > 0 for k ≥ 1)."],
            ["    static long memoFib(int n) {", ""],
            ["        if (n <= 1) return n;", ""],
            ["        if (memo[n] != 0) return memo[n];", "Already solved? Reuse it."],
            ["        memo[n] = memoFib(n - 1) + memoFib(n - 2);", "Solve once and remember."],
            ["        return memo[n];", ""],
            ["    }", ""],
            ["", ""],
            ["    static long tableFib(int n) {", ""],
            ["        long[] dp = new long[n + 2];", "dp[k] will hold fib(k)."],
            ["        dp[1] = 1;", "The smallest subproblems, filled in directly."],
            ["        for (int k = 2; k <= n; k++) {", ""],
            ["            dp[k] = dp[k - 1] + dp[k - 2];", "Each entry from the two before it — O(n) total."],
            ["        }", ""],
            ["        return dp[n];", ""],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        System.out.println(slowFib(30));", "Fine for 30 (≈1.6 million calls); hopeless for 60."],
            ["        System.out.println(memoFib(90));", "Instant."],
            ["        System.out.println(tableFib(90));", "Instant, no recursion at all."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "overlap",
        },
        {
          type: "text",
          md: "**How to spot a DP problem:** the answer for a big input is built from answers for smaller inputs, and those smaller inputs overlap. To design one, write down:\n- the **state** — what `dp[i]` means (e.g. \"number of ways to reach step i\");\n- the **recurrence** — how `dp[i]` comes from smaller states;\n- the **base cases** — the smallest states, filled in directly.\n\nExample — **climbing stairs**: you can climb 1 or 2 steps at a time; how many ways reach step n? The last move was either 1 step (from n-1) or 2 steps (from n-2), so `ways[n] = ways[n-1] + ways[n-2]`, with `ways[0] = 1` and `ways[1] = 1`.",
        },
        {
          type: "callout",
          tone: "warning",
          md: "DP answers grow fast. `int` overflows past about 2.1 billion without any error — the value silently wraps negative. Use `long` for counts like these.",
        },
        {
          type: "check",
          question: "dp-recurrence",
        },
      ],
      summary: {
        keyIdeas: [
          "Overlapping subproblems + building big answers from small ones → DP.",
          "Memoization: recursion + cache. Tabulation: a loop filling a table.",
          "Define state, recurrence and base cases before coding.",
        ],
        mistakes: [
          "Plain recursion on overlapping subproblems (exponential time).",
          "Wrong or missing base cases in the table.",
          "int overflow in counting problems — use long.",
        ],
      },
      questions: [
        {
          slug: "overlap",
          kind: "mcq",
          prompt: "Why is `slowFib(50)` so slow, while `tableFib(50)` is instant?",
          options: [
            { id: "a", text: "slowFib recomputes the same smaller Fibonacci numbers an exponential number of times; tableFib computes each once" },
            { id: "b", text: "Recursion is always slower than loops", feedback: "memoFib is recursive and just as fast — the problem is repeated work, not recursion itself." },
            { id: "c", text: "slowFib uses long instead of int", feedback: "The type makes no meaningful difference to speed here." },
          ],
          answer: "a",
          explanation: "slowFib's call tree branches twice per level, so it's roughly O(2ⁿ). tableFib (and memoFib) solve each of the n subproblems once: O(n).",
        },
        {
          slug: "dp-recurrence",
          kind: "output",
          prompt: "Using `ways[0] = 1`, `ways[1] = 1`, `ways[i] = ways[i-1] + ways[i-2]`, type the number of ways to climb 5 steps.",
          code: java`
            long[] ways = new long[6];
            ways[0] = 1;
            ways[1] = 1;
            for (int i = 2; i <= 5; i++) {
                ways[i] = ways[i - 1] + ways[i - 2];
            }
            System.out.println(ways[5]);
          `,
          answer: "8",
          explanation: "The table fills as 1, 1, 2, 3, 5, 8. For example, the 3 ways to climb 3 steps are 1+1+1, 1+2 and 2+1.",
        },
      ],
    },
    {
      slug: "lab-stair-climber",
      title: "Stair climber",
      kind: "trial",
      concept: "dynamic-programming",
      syllabusTag: "Unit 6: Dynamic Programming",
      story: "The labyrinth's great stair has dozens of steps. The robot can take one or two at a time — and the clock is ticking.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is `n` (0 ≤ n ≤ 85). The robot climbs 1 or 2 steps at a time. Print the number of distinct ways to reach step `n`.\n\n`3` → `3`, `5` → `8`. The hidden tests use large n — plain recursion will run out of time, and int will overflow.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  int n = new Scanner(System.in).nextInt();

              }
          }
        `,
        hints: [
          "The lesson worked out the recurrence: ways[i] = ways[i-1] + ways[i-2], with ways[0] = ways[1] = 1.",
          "Fill a table bottom-up with a loop, and make it a long[] — the answer for 85 is about 4 × 10¹⁷.",
          "Worked example: a table of size n + 2 means ways[1] always exists, even when n = 0.",
        ],
        solution: java`
          import java.util.Scanner;

          public class Main {
              public static void main(String[] args) {
                  int n = new Scanner(System.in).nextInt();
                  long[] ways = new long[n + 2];
                  ways[0] = 1;
                  ways[1] = 1;
                  for (int i = 2; i <= n; i++) {
                      ways[i] = ways[i - 1] + ways[i - 2];
                  }
                  System.out.println(ways[n]);
              }
          }
        `,
        solutionExplanation:
          "Each step's count is the sum of the two below it, computed once each: O(n) time. long holds the 85-step answer (≈ 4.2 × 10¹⁷); int would overflow by step 46.",
        tests: [
          { description: "3 steps → 3 ways", stdin: "3", stdout: "3" },
          { description: "5 steps → 8 ways", stdin: "5", stdout: "8" },
          { description: "Zero steps: one way (stand still)", hidden: true, stdin: "0", stdout: "1" },
          { description: "45 steps (too slow for plain recursion)", hidden: true, stdin: "45", stdout: "1836311903" },
          { description: "85 steps (overflows int)", hidden: true, stdin: "85", stdout: "420196140727489673" },
        ],
        feedback: [
          { stdoutPattern: "^-\\d+$", message: "A negative count means int overflowed. Use long." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                static long ways(int n) { return n <= 1 ? 1 : ways(n - 1) + ways(n - 2); }
                public static void main(String[] args) {
                    System.out.println(ways(new Scanner(System.in).nextInt()));
                }
            }
          `,
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    int n = new Scanner(System.in).nextInt();
                    int[] w = new int[n + 2];
                    w[0] = 1; w[1] = 1;
                    for (int i = 2; i <= n; i++) w[i] = w[i - 1] + w[i - 2];
                    System.out.println(w[n]);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "lab-coin-change-drill",
      title: "Interview drill: Coin change",
      kind: "trial",
      concept: "dynamic-programming",
      syllabusTag: "Interview practice",
      story: "A timed drill on a famous DP interview question. Define your state out loud before you code.",
      minutes: 25,
      timeLimitMinutes: 25,
      challenge: {
        instructions:
          "The input is `k` coin values, then the `k` values, then an `amount`. Each coin can be used any number of times. Print the **fewest coins** that add up to `amount`, or `-1` if it can't be made.\n\nFor `3` / `1 2 5` / `11`: `3` (5 + 5 + 1). For `1` / `2` / `3`: `-1`.\n\nGreedy (always take the biggest coin) is wrong for some coin sets — use DP.",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int k = in.nextInt();
                  int[] coins = new int[k];
                  for (int i = 0; i < k; i++) coins[i] = in.nextInt();
                  int amount = in.nextInt();

              }
          }
        `,
        hints: [
          "State: dp[a] = fewest coins to make amount a. What is dp[0]?",
          "Recurrence: for each coin c ≤ a, you could finish with c, so dp[a] = min over coins of dp[a - c] + 1 — skipping amounts that can't be made.",
          "Worked example, coins {1, 3, 4}, amount 6: greedy takes 4 + 1 + 1 (3 coins), but dp finds 3 + 3 (2 coins). Use a large value like amount + 1 as \"impossible\".",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int k = in.nextInt();
                  int[] coins = new int[k];
                  for (int i = 0; i < k; i++) coins[i] = in.nextInt();
                  int amount = in.nextInt();

                  int impossible = amount + 1;
                  int[] dp = new int[amount + 1];
                  Arrays.fill(dp, impossible);
                  dp[0] = 0;
                  for (int a = 1; a <= amount; a++) {
                      for (int c : coins) {
                          if (c <= a && dp[a - c] + 1 < dp[a]) {
                              dp[a] = dp[a - c] + 1;
                          }
                      }
                  }
                  System.out.println(dp[amount] == impossible ? -1 : dp[amount]);
              }
          }
        `,
        solutionExplanation:
          "dp[a] tries every coin as the last one and reuses the best answer for the remainder, so each amount is solved once: O(amount × k) time, O(amount) space. amount + 1 can never be a real answer (you'd never need more coins than the amount with 1-coins), so it marks \"impossible\".",
        tests: [
          { description: "1 2 5 → 11 needs 3 coins", stdin: "3\n1 2 5\n11", stdout: "3" },
          { description: "Impossible amount", stdin: "1\n2\n3", stdout: "-1" },
          { description: "Greedy fails here", hidden: true, stdin: "3\n1 3 4\n6", stdout: "2" },
          { description: "Amount zero", hidden: true, stdin: "2\n3 7\n0", stdout: "0" },
          { description: "Larger amount", hidden: true, stdin: "3\n186 419 83\n6249", stdout: "38" },
        ],
        feedback: [
          {
            codePattern: "amount\\s*(/|%)=?\\s*coins\\[",
            message: "Dividing the amount by the largest coin is the greedy approach — it fails for coins like {1, 3, 4} and amount 6 (greedy uses 3 coins, the best is 2). Build a dp table over amounts instead.",
          },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int k = in.nextInt();
                    int[] coins = new int[k];
                    for (int i = 0; i < k; i++) coins[i] = in.nextInt();
                    int amount = in.nextInt();
                    Arrays.sort(coins);
                    int used = 0;
                    for (int i = k - 1; i >= 0; i--) { used += amount / coins[i]; amount %= coins[i]; }
                    System.out.println(amount == 0 ? used : -1);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "lab-guardian",
      title: "Guardian of the Labyrinth",
      kind: "quiz",
      concept: "algorithms-mastery",
      syllabusTag: "Unit 6 review",
      story: "At the centre of the labyrinth, a clockwork guardian times every answer.",
      minutes: 18,
      passingScore: 75,
      timeLimitMinutes: 20,
      questions: [
        {
          slug: "binary-trace",
          kind: "mcq",
          prompt: "Binary search for 23 in `{3, 8, 15, 23, 42, 57, 91}`: which values are compared, in order?",
          options: [
            { id: "a", text: "42, then 23", feedback: "The first mid is index (0 + 6) / 2 = 3 — not the 42 at index 4." },
            { id: "b", text: "23 only — found at the first middle index" },
            { id: "c", text: "3, 8, 15, 23", feedback: "That's linear search. Binary search starts in the middle." },
          ],
          answer: "b",
          explanation: "lo = 0, hi = 6, mid = 3, and a[3] is 23 — found on the first comparison. Binary search always starts at the middle.",
          reviewLesson: "lab-searching",
        },
        {
          slug: "search-choice",
          kind: "mcq",
          prompt: "You'll search an unsorted list of 50 names just once. What's the sensible choice?",
          options: [
            { id: "a", text: "Sort it, then binary search", feedback: "Sorting costs O(n log n) — more than the single O(n) scan it's meant to avoid." },
            { id: "b", text: "Linear search" },
            { id: "c", text: "Binary search directly", feedback: "Binary search on unsorted data gives wrong answers." },
          ],
          answer: "b",
          explanation: "For one search over unsorted data, a single O(n) scan is cheapest. Sorting pays off only when you'll search many times.",
          reviewLesson: "lab-searching",
        },
        {
          slug: "nested-loop-cost",
          kind: "mcq",
          prompt: "Why is insertion sort O(n²) in the worst case?",
          options: [
            { id: "a", text: "Each of the n elements may shift past up to n already-sorted elements" },
            { id: "b", text: "It sorts the array twice", feedback: "It makes a single left-to-right pass of insertions." },
            { id: "c", text: "It uses recursion", feedback: "Insertion sort is usually written with plain loops." },
          ],
          answer: "a",
          explanation: "On reverse-sorted input, pass i shifts i elements: 1 + 2 + … + (n-1) ≈ n²/2 moves.",
          reviewLesson: "lab-sorting",
        },
        {
          slug: "comparator",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            String[] w = {"gear", "cog", "spindle", "pin"};
            Arrays.sort(w, (a, b) -> a.length() - b.length());
            System.out.println(String.join(",", w));
          `,
          answer: "cog,pin,gear,spindle",
          explanation: "The comparator orders by length: cog and pin (3), gear (4), spindle (7). Java's object sort is stable, so cog stays before pin as in the input.",
          reviewLesson: "lab-sorting",
        },
        {
          slug: "recursive-output",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            public class Main {
                static void countdown(int n) {
                    if (n == 0) return;
                    System.out.print(n);
                    countdown(n - 1);
                    System.out.print(n);
                }

                public static void main(String[] args) {
                    countdown(3);
                }
            }
          `,
          answer: "321123",
          explanation: "Each call prints n on the way down (3, 2, 1), then — after the inner call returns — prints n again on the way back up (1, 2, 3).",
          reviewLesson: "lab-recursion",
        },
        {
          slug: "stack-overflow",
          kind: "mcq",
          prompt: "`static int half(int n) { if (n == 1) return 0; return 1 + half(n / 2); }` — which call crashes with StackOverflowError?",
          options: [
            { id: "a", text: "half(8)", feedback: "8 → 4 → 2 → 1 reaches the base case: returns 3." },
            { id: "b", text: "half(0)" },
            { id: "c", text: "half(1)", feedback: "1 is the base case: returns 0 immediately." },
          ],
          answer: "b",
          explanation: "0 / 2 is 0, so half(0) calls half(0) forever — it never reaches n == 1. A base case must be reachable from every valid input.",
          reviewLesson: "lab-recursion",
        },
        {
          slug: "memo-why",
          kind: "mcq",
          prompt: "What does memoization add to a recursive solution?",
          options: [
            { id: "a", text: "A cache of results, so each distinct subproblem is computed only once" },
            { id: "b", text: "A loop that replaces the recursion", feedback: "That's tabulation (bottom-up). Memoization keeps the recursion." },
            { id: "c", text: "Extra base cases", feedback: "The base cases stay the same; what changes is that results are stored and reused." },
          ],
          answer: "a",
          explanation: "Before computing, check the cache; after computing, store the result. Overlapping subproblems then cost nothing the second time.",
          reviewLesson: "lab-dynamic-programming",
        },
        {
          slug: "dp-table",
          kind: "output",
          prompt: "This counts paths through a grid moving only right or down. Type exactly what it prints.",
          code: java`
            int rows = 3, cols = 3;
            int[][] dp = new int[rows][cols];
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    if (r == 0 || c == 0) dp[r][c] = 1;
                    else dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
                }
            }
            System.out.println(dp[rows - 1][cols - 1]);
          `,
          answer: "6",
          explanation: "The first row and column have one path each. Then each cell sums the cell above and to the left: dp[1][1] = 2, dp[1][2] = 3, dp[2][1] = 3, dp[2][2] = 6.",
          reviewLesson: "lab-dynamic-programming",
        },
      ],
    },
  ],
};
