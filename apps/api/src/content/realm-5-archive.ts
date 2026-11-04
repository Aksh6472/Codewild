import { java } from "./helpers.js";
import type { RealmDef } from "./types.js";

// Realm 5 — core data structures: linked lists, stacks, queues, hash maps,
// trees and graphs. Introduces the first timed interview drill.
export const archive: RealmDef = {
  slug: "archive",
  name: "The Archive Spires",
  subtitle: "Linked lists, stacks, queues, hash maps, trees, graphs",
  story:
    "The Archive stores every record the Guild has ever made. Finding anything fast depends on how it's organised — the data structure.",
  theme: "archive",
  summary: {
    keyIdeas: [
      "A linked list chains nodes by reference: O(1) insert at the head, O(n) to reach the k-th item. `ArrayList` is the everyday resizable list.",
      "Stack = last in, first out (`push`/`pop`/`peek`); queue = first in, first out (`offer`/`poll`/`peek`). Use `ArrayDeque` for both.",
      "`HashMap<K, V>` maps unique keys to values with O(1) average `put`/`get`/`containsKey`; `TreeMap` keeps keys sorted.",
      "A binary search tree keeps smaller keys left and larger right, so search follows one path from the root.",
      "A graph is vertices plus edges, stored as adjacency lists. Breadth-first search (BFS) with a queue finds the fewest hops.",
    ],
    mistakes: [
      "Losing the rest of a linked list by overwriting `next` before saving it.",
      "Calling `pop()`/`poll()` on an empty structure without checking `isEmpty()`.",
      "Using `==` to compare `Integer` objects taken from collections — use `.equals()` or unbox to int.",
      "Expecting a `HashMap` to iterate in insertion or sorted order.",
      "Forgetting the visited set in a graph search, so cycles loop forever.",
    ],
  },
  levels: [
    {
      slug: "archive-linked-lists",
      title: "Lists & linked lists",
      kind: "lesson",
      concept: "linked-lists",
      syllabusTag: "Unit 5: Linked Lists",
      story: "Arrays have a fixed size. The Archive's records grow every day.",
      minutes: 16,
      blocks: [
        {
          type: "text",
          md: "Arrays can't grow. Java's `ArrayList` can: it's a list backed by an array that is quietly replaced with a bigger one when it fills up. Collections hold **objects**, so for numbers you write the wrapper type `Integer` in angle brackets — Java converts between `int` and `Integer` automatically.",
        },
        {
          type: "code",
          title: "ArrayList: the everyday list",
          runnable: true,
          lines: [
            ["import java.util.ArrayList;", ""],
            ["import java.util.List;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        List<Integer> ids = new ArrayList<>();", "<Integer>: a list of Integers. The <> on the right repeats the type for you."],
            ["        ids.add(42);", "Append to the end; the list grows as needed."],
            ["        ids.add(7);", ""],
            ["        ids.add(0, 99);", "Insert at index 0 — every other element shifts right (slow for big lists)."],
            ["        System.out.println(ids + \" size \" + ids.size());", "[99, 42, 7] size 3"],
            ["        System.out.println(ids.get(1));", "get(i) is fast: 42."],
            ["        ids.remove(Integer.valueOf(7));", "Remove by value (not index)."],
            ["        for (int id : ids) System.out.print(id + \" \");", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "text",
          md: "A **linked list** works differently. Each **node** holds a value and a reference to the next node; the list is just a reference to the first node (the **head**). The last node's `next` is `null`.\n\n- Inserting at the head is O(1): make a new node point at the old head.\n- Reaching the k-th item means walking k links: O(n).\n- No shifting is ever needed, and the list never has to be copied to grow.",
        },
        {
          type: "code",
          title: "Building and walking a linked list",
          runnable: true,
          lines: [
            ["class Node {", ""],
            ["    int value;", ""],
            ["    Node next;", "A reference to another Node — or null at the end."],
            ["    Node(int value, Node next) {", ""],
            ["        this.value = value;", ""],
            ["        this.next = next;", ""],
            ["    }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Node head = null;", "An empty list."],
            ["        for (int v = 1; v <= 3; v++) {", ""],
            ["            head = new Node(v, head);", "Insert at head: the new node points at the old first node."],
            ["        }", "The list is now 3 → 2 → 1."],
            ["        for (Node cur = head; cur != null; cur = cur.next) {", "Walk: start at head, follow next until null."],
            ['            System.out.print(cur.value + " -> ");', ""],
            ["        }", ""],
            ['        System.out.println("null");', ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "head-insert",
        },
        {
          type: "callout",
          tone: "interview",
          md: "**Reverse a linked list** is one of the most-asked interview questions. The trick: walk the list once, and at each node save `next`, point the node backwards at `prev`, then advance. You'll do it in the next trial.",
        },
        {
          type: "check",
          question: "list-vs-array",
        },
      ],
      summary: {
        keyIdeas: [
          "ArrayList: resizable, fast get(i), slow inserts in the middle.",
          "Linked list: nodes + next references; O(1) head insert, O(n) access by position.",
          "Walk a linked list with `for (Node cur = head; cur != null; cur = cur.next)`.",
        ],
        mistakes: [
          "Dereferencing null at the end of the list (NullPointerException).",
          "Writing `List<int>` — collections need `Integer`.",
          "Losing nodes by overwriting a next reference you still need.",
        ],
      },
      questions: [
        {
          slug: "head-insert",
          kind: "output",
          prompt: "Type exactly what this prints (it uses the Node class from the example).",
          code: java`
            class Node {
                int value;
                Node next;
                Node(int value, Node next) { this.value = value; this.next = next; }
            }

            public class Main {
                public static void main(String[] args) {
                    Node head = new Node(5, null);
                    head = new Node(8, head);
                    head.next.next = new Node(2, null);
                    String out = "";
                    for (Node c = head; c != null; c = c.next) out += c.value;
                    System.out.println(out);
                }
            }
          `,
          answer: "852",
          explanation: "8 is inserted in front of 5, giving 8 → 5. head.next is the 5 node, and its next becomes a new 2 node: 8 → 5 → 2.",
        },
        {
          slug: "list-vs-array",
          kind: "mcq",
          prompt: "Which operation is faster on a linked list than on an ArrayList?",
          options: [
            { id: "a", text: "Getting the element at index 5000", feedback: "A linked list must walk 5000 links; an ArrayList jumps straight there." },
            { id: "b", text: "Inserting a new first element" },
            { id: "c", text: "Finding the size", feedback: "Both track their size; it's O(1) either way in Java's implementations." },
          ],
          answer: "b",
          explanation: "Inserting at the front of an ArrayList shifts every element (O(n)); a linked list just creates one node pointing at the old head (O(1)).",
        },
      ],
    },
    {
      slug: "archive-reverse-chain",
      title: "Reverse the chain",
      kind: "trial",
      concept: "linked-lists",
      syllabusTag: "Unit 5: Linked Lists",
      story: "An archive chain was filed backwards. Flip it — without building a new one.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is `n`, then `n` numbers. Build a linked list with your own `Node` class in **input order**, reverse it **in place** (by re-pointing `next` references), then print it as `a -> b -> c`.\n\nFor `4` / `1 2 3 4`: `4 -> 3 -> 2 -> 1`. For `n = 0` print `empty`.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          class Node {
              int value;
              Node next;

              Node(int value) {
                  this.value = value;
              }
          }

          public class Main {
              static Node reverse(Node head) {
                  // re-point each node's next to the previous node
                  return head;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Node head = null, tail = null;
                  // build the list in input order (append at the tail)

                  head = reverse(head);
                  // print the list as a -> b -> c, or "empty"
              }
          }
        `,
        requirements: [
          { description: "Uses your own Node class (no built-in lists)", pattern: "ArrayList|LinkedList|Collections|Deque|Stack", mustMatch: false },
          { description: "Defines static Node reverse(Node head)", pattern: "static\\s+Node\\s+reverse\\s*\\(\\s*Node\\s+\\w+\\s*\\)", mustMatch: true },
        ],
        hints: [
          "Appending: if the list is empty, the new node is both head and tail; otherwise `tail.next = node; tail = node;`.",
          "Reversing needs three references: prev (starts null), cur (starts at head) and next. Each step: save next, point cur.next at prev, move prev and cur forward.",
          "Worked example, list 1 → 2: cur = 1: next = 2, 1.next = null, prev = 1, cur = 2. cur = 2: next = null, 2.next = 1, prev = 2, cur = null. Return prev (2 → 1).",
        ],
        solution: java`
          import java.util.Scanner;

          class Node {
              int value;
              Node next;

              Node(int value) {
                  this.value = value;
              }
          }

          public class Main {
              static Node reverse(Node head) {
                  Node prev = null;
                  Node cur = head;
                  while (cur != null) {
                      Node next = cur.next;
                      cur.next = prev;
                      prev = cur;
                      cur = next;
                  }
                  return prev;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Node head = null, tail = null;
                  for (int i = 0; i < n; i++) {
                      Node node = new Node(in.nextInt());
                      if (head == null) {
                          head = node;
                      } else {
                          tail.next = node;
                      }
                      tail = node;
                  }

                  head = reverse(head);
                  if (head == null) {
                      System.out.println("empty");
                      return;
                  }
                  StringBuilder out = new StringBuilder();
                  for (Node cur = head; cur != null; cur = cur.next) {
                      if (cur != head) out.append(" -> ");
                      out.append(cur.value);
                  }
                  System.out.println(out);
              }
          }
        `,
        solutionExplanation:
          "Saving next before re-pointing cur.next is the whole trick — otherwise the rest of the list is lost. One pass, O(n) time and O(1) extra space, which is exactly what interviewers look for.",
        tests: [
          { description: "Reverses 1 2 3 4", stdin: "4\n1 2 3 4", stdout: "4 -> 3 -> 2 -> 1" },
          { description: "Single node", hidden: true, stdin: "1\n42", stdout: "42" },
          { description: "Empty list", hidden: true, stdin: "0", stdout: "empty" },
          { description: "Repeated values", hidden: true, stdin: "3\n5 5 9", stdout: "9 -> 5 -> 5" },
        ],
        feedback: [
          { stdoutPattern: "^1 -> 2 -> 3 -> 4$", message: "The list printed in its original order — reverse() is returning the old head. Return the new head (prev) after the loop." },
          { stdoutPattern: "^4$|^1$", message: "Only one node printed — the rest of the list was lost. Save cur.next before you overwrite it." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            class Node { int value; Node next; Node(int v) { value = v; } }
            public class Main {
                static Node reverse(Node head) {
                    Node prev = null, cur = head;
                    while (cur != null) { cur.next = prev; prev = cur; cur = cur.next; }
                    return prev;
                }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    Node head = null, tail = null;
                    for (int i = 0; i < n; i++) { Node node = new Node(in.nextInt()); if (head == null) head = node; else tail.next = node; tail = node; }
                    head = reverse(head);
                    if (head == null) { System.out.println("empty"); return; }
                    StringBuilder out = new StringBuilder();
                    for (Node c = head; c != null; c = c.next) { if (c != head) out.append(" -> "); out.append(c.value); }
                    System.out.println(out);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-stacks-queues",
      title: "Stacks & queues",
      kind: "lesson",
      concept: "stacks-queues",
      syllabusTag: "Unit 5: Stacks and Queues",
      story: "Requests pile up at the Archive desk. Some must be answered newest-first, others oldest-first.",
      minutes: 13,
      blocks: [
        {
          type: "text",
          md: "Two of the most useful structures restrict *where* you add and remove:\n- A **stack** is **last in, first out** (LIFO) — like a pile of plates. Operations: `push` (add on top), `pop` (remove the top), `peek` (look at the top). Used for undo, matching brackets, and backtracking.\n- A **queue** is **first in, first out** (FIFO) — like a line at a counter. Operations: `offer` (join the back), `poll` (leave the front), `peek`. Used for scheduling and breadth-first search.\n\nIn Java, `ArrayDeque` does both efficiently.",
        },
        {
          type: "code",
          title: "ArrayDeque as a stack and a queue",
          runnable: true,
          lines: [
            ["import java.util.ArrayDeque;", ""],
            ["import java.util.Deque;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        Deque<String> stack = new ArrayDeque<>();", ""],
            ['        stack.push("a");', ""],
            ['        stack.push("b");', ""],
            ['        stack.push("c");', "Top is now c."],
            ["        System.out.println(stack.pop() + stack.pop());", "Removes c then b → \"cb\"."],
            ["        System.out.println(stack.peek());", "a is still there."],
            ["", ""],
            ["        Deque<Integer> queue = new ArrayDeque<>();", ""],
            ["        queue.offer(1);", "Join the back."],
            ["        queue.offer(2);", ""],
            ["        queue.offer(3);", ""],
            ["        System.out.println(queue.poll() + \" \" + queue.poll());", "Leave from the front: 1 then 2."],
            ["        System.out.println(queue.isEmpty());", "false — 3 is waiting."],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "stack-trace",
        },
        {
          type: "text",
          md: "**Matching brackets** is the classic stack problem. Scan left to right: push every opening bracket; on a closing bracket, the top of the stack must be its partner — pop it. At the end the stack must be empty. The stack remembers *which bracket was opened most recently*, which is exactly the one that must close next.",
        },
        {
          type: "callout",
          tone: "warning",
          md: "`pop()` on an empty ArrayDeque throws an exception, and `poll()`/`peek()` return `null`. Check `isEmpty()` first — a closing bracket with nothing open is an *unbalanced* string, not a crash.",
        },
        {
          type: "check",
          question: "which-structure",
        },
      ],
      summary: {
        keyIdeas: [
          "Stack (LIFO): push, pop, peek. Queue (FIFO): offer, poll, peek.",
          "`Deque<T> d = new ArrayDeque<>();` serves as either.",
          "Brackets, undo and backtracking → stack. Scheduling and BFS → queue.",
        ],
        mistakes: [
          "Popping an empty stack.",
          "Mixing stack and queue methods on one deque (push adds to the front; offer to the back).",
          "Forgetting to check the stack is empty at the end of bracket matching.",
        ],
      },
      questions: [
        {
          slug: "stack-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            Deque<Integer> s = new ArrayDeque<>();
            s.push(1);
            s.push(2);
            s.pop();
            s.push(3);
            s.push(4);
            System.out.println(s.pop() + " " + s.peek() + " " + s.size());
          `,
          answer: "4 3 2",
          explanation: "After push 1, push 2, pop (removes 2), push 3, push 4 the stack is 1, 3, 4 (top). pop gives 4, peek sees 3, and 2 elements remain.",
        },
        {
          slug: "which-structure",
          kind: "mcq",
          prompt: "A print server must handle jobs in the order they arrive. Which structure fits?",
          options: [
            { id: "a", text: "A stack", feedback: "A stack would print the newest job first — unfair to whoever submitted first." },
            { id: "b", text: "A queue" },
            { id: "c", text: "A HashMap", feedback: "A map stores key-value pairs with no notion of arrival order." },
          ],
          answer: "b",
          explanation: "First in, first out is exactly \"in the order they arrive\" — a queue.",
        },
      ],
    },
    {
      slug: "archive-bracket-balancer",
      title: "Bracket balancer",
      kind: "trial",
      concept: "stacks-queues",
      syllabusTag: "Unit 5: Stacks and Queues",
      story: "Archive formulas are nested in brackets. A single mismatch corrupts the whole record.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is one string made of the characters `()[]{}`. Print `BALANCED` if every bracket is closed by the matching type in the right order, otherwise `UNBALANCED`.\n\n`{[()]}` → `BALANCED`, `([)]` → `UNBALANCED`, `((` → `UNBALANCED`.",
        guidance: "supported",
        starterCode: java`
          import java.util.ArrayDeque;
          import java.util.Deque;
          import java.util.Scanner;

          public class Main {
              static boolean isBalanced(String s) {
                  Deque<Character> stack = new ArrayDeque<>();

                  return true;
              }

              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();
                  System.out.println(isBalanced(s) ? "BALANCED" : "UNBALANCED");
              }
          }
        `,
        hints: [
          "Push each opening bracket. For each closing bracket, the stack's top must be the matching opener.",
          "Two ways to fail early: a closer arrives when the stack is empty, or the top is the wrong type. And one way to fail at the end: leftovers on the stack.",
          "Worked example, `(]`: push '('. Then ']' needs '[' on top, but the top is '(' → unbalanced.",
        ],
        solution: java`
          import java.util.ArrayDeque;
          import java.util.Deque;
          import java.util.Scanner;

          public class Main {
              static boolean isBalanced(String s) {
                  Deque<Character> stack = new ArrayDeque<>();
                  for (int i = 0; i < s.length(); i++) {
                      char c = s.charAt(i);
                      if (c == '(' || c == '[' || c == '{') {
                          stack.push(c);
                      } else {
                          if (stack.isEmpty()) {
                              return false;
                          }
                          char open = stack.pop();
                          if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) {
                              return false;
                          }
                      }
                  }
                  return stack.isEmpty();
              }

              public static void main(String[] args) {
                  String s = new Scanner(System.in).next();
                  System.out.println(isBalanced(s) ? "BALANCED" : "UNBALANCED");
              }
          }
        `,
        solutionExplanation:
          "The stack always holds the brackets still open, most recent on top — and the most recent one is the only one allowed to close next. One pass over the string: O(n) time, O(n) space.",
        tests: [
          { description: "{[()]} is balanced", stdin: "{[()]}", stdout: "BALANCED" },
          { description: "([)] crosses over", stdin: "([)]", stdout: "UNBALANCED" },
          { description: "Unclosed brackets left over", hidden: true, stdin: "((", stdout: "UNBALANCED" },
          { description: "A closer with nothing open", hidden: true, stdin: "())", stdout: "UNBALANCED" },
          { description: "Long nested and sequential mix", hidden: true, stdin: "()[]{([]{})}", stdout: "BALANCED" },
        ],
        feedback: [
          { codePattern: "^(?![\\s\\S]*isEmpty)[\\s\\S]*$", message: "What happens with \"((\" or \"())\"? Check stack.isEmpty() before popping, and again at the end." },
        ],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            public class Main {
                public static void main(String[] args) {
                    String s = new Scanner(System.in).next();
                    int depth = 0;
                    for (char c : s.toCharArray()) { if ("([{".indexOf(c) >= 0) depth++; else depth--; if (depth < 0) break; }
                    System.out.println(depth == 0 ? "BALANCED" : "UNBALANCED");
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-hash-maps",
      title: "Hash maps & sets",
      kind: "lesson",
      concept: "hash-maps",
      syllabusTag: "Unit 5: Hashing",
      story: "The Archive's index card system finds any record by name — instantly.",
      minutes: 15,
      blocks: [
        {
          type: "text",
          md: "A **map** stores **key → value** pairs, and finds a value by its key. Keys are unique: putting an existing key replaces its value. `HashMap` uses *hashing* to jump almost directly to the right slot, so `put`, `get` and `containsKey` are **O(1) on average** — no matter how many entries there are.\n\nA **set** is like a map with only keys: it stores unique values and answers \"have I seen this?\" in O(1) — `HashSet`.",
        },
        {
          type: "code",
          title: "Counting with a HashMap",
          runnable: true,
          lines: [
            ["import java.util.HashMap;", ""],
            ["import java.util.Map;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ['        String[] words = {"gear", "bolt", "gear", "cog", "gear", "bolt"};', ""],
            ["        Map<String, Integer> counts = new HashMap<>();", "Keys are Strings, values Integers."],
            ["        for (String w : words) {", ""],
            ["            counts.put(w, counts.getOrDefault(w, 0) + 1);", "Current count (0 if new), plus one."],
            ["        }", ""],
            ['        System.out.println(counts.get("gear"));', "3"],
            ['        System.out.println(counts.containsKey("nut"));', "false"],
            ["        for (Map.Entry<String, Integer> e : counts.entrySet()) {", "Iterate over key-value pairs…"],
            ['            System.out.println(e.getKey() + "=" + e.getValue());', "…in no particular order for a HashMap."],
            ["        }", ""],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "map-overwrite",
        },
        {
          type: "text",
          md: "`HashMap` makes no promise about order. When you need keys **sorted**, use `TreeMap` (same methods, keys kept in order, O(log n) operations). `LinkedHashMap` remembers insertion order.\n\nThe hash-map trick turns many O(n²) \"compare every pair\" solutions into O(n) — instead of searching for a partner, you *look it up*.",
        },
        {
          type: "callout",
          tone: "interview",
          md: "When an interviewer says \"can you do better than O(n²)?\", the answer is very often a HashMap or HashSet: store what you've seen so far, and check each new element against it in O(1). Two Sum — next trial after this — is the canonical example.",
        },
        {
          type: "check",
          question: "set-use",
        },
      ],
      summary: {
        keyIdeas: [
          "`Map<K, V>`: put, get, getOrDefault, containsKey, remove, entrySet.",
          "HashMap/HashSet: O(1) average lookups, no order. TreeMap/TreeSet: sorted keys.",
          "Counting pattern: `map.put(k, map.getOrDefault(k, 0) + 1)`.",
        ],
        mistakes: [
          "`map.get(missingKey)` returns null — unboxing that into an int crashes.",
          "Relying on HashMap iteration order.",
          "Using a list and `contains` (O(n)) where a set (O(1)) would do.",
        ],
      },
      questions: [
        {
          slug: "map-overwrite",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            Map<String, Integer> stock = new HashMap<>();
            stock.put("bolt", 4);
            stock.put("gear", 2);
            stock.put("bolt", 9);
            stock.put("gear", stock.get("gear") * 5);
            System.out.println(stock.get("bolt") + " " + stock.get("gear") + " " + stock.size());
          `,
          answer: "9 10 2",
          explanation: "Putting an existing key replaces its value: bolt becomes 9, gear becomes 2 × 5 = 10. There are still only two keys.",
        },
        {
          slug: "set-use",
          kind: "mcq",
          prompt: "You need to check whether a list of 1,000,000 IDs contains any duplicate. Which approach is fastest?",
          options: [
            { id: "a", text: "Compare every ID with every other ID", feedback: "That's about 500 billion comparisons — O(n²)." },
            { id: "b", text: "Add each ID to a HashSet; if add() returns false, it's a duplicate" },
            { id: "c", text: "Put them in an ArrayList and call contains() for each", feedback: "list.contains is O(n), so this is still O(n²) overall." },
          ],
          answer: "b",
          explanation: "Each HashSet add/check is O(1) on average, so one pass is O(n). add() returns false when the value is already present.",
        },
      ],
    },
    {
      slug: "archive-word-census",
      title: "Word census",
      kind: "trial",
      concept: "hash-maps",
      syllabusTag: "Unit 5: Hashing",
      story: "The Archive wants a census of every word in a damaged scroll.",
      minutes: 12,
      challenge: {
        instructions:
          "The input is a count `n`, then `n` lowercase words. Print each **distinct** word with how many times it appeared, as `<word> <count>`, one per line, in **alphabetical order**.\n\nFor `5` / `cog gear bolt gear cog`: `bolt 1`, `cog 2`, `gear 2`.",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();

              }
          }
        `,
        requirements: [{ description: "Uses a Map", pattern: "Map\\s*<", mustMatch: true }],
        hints: [
          "Counting is the getOrDefault pattern from the lesson.",
          "Which map keeps its keys in sorted order for you?",
          "Worked example: `Map<String, Integer> m = new TreeMap<>();` then iterate `for (String key : m.keySet())` — keys come out alphabetically.",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  Map<String, Integer> counts = new TreeMap<>();
                  for (int i = 0; i < n; i++) {
                      String word = in.next();
                      counts.put(word, counts.getOrDefault(word, 0) + 1);
                  }
                  for (Map.Entry<String, Integer> e : counts.entrySet()) {
                      System.out.println(e.getKey() + " " + e.getValue());
                  }
              }
          }
        `,
        solutionExplanation:
          "A TreeMap counts like a HashMap but iterates keys in sorted order, so no separate sort is needed. (A HashMap plus sorting the keys also works.)",
        tests: [
          { description: "Counts and sorts five words", stdin: "5\ncog gear bolt gear cog", stdout: "bolt 1\ncog 2\ngear 2" },
          { description: "All the same word", hidden: true, stdin: "3\nink ink ink", stdout: "ink 3" },
          { description: "Already reverse-sorted input", hidden: true, stdin: "4\nzeta yak xenon alpha", stdout: "alpha 1\nxenon 1\nyak 1\nzeta 1" },
        ],
        feedback: [
          { codePattern: "new\\s+HashMap", message: "A HashMap doesn't keep keys in any order. Use a TreeMap, or sort the keys before printing." },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    Map<String, Integer> counts = new LinkedHashMap<>();
                    for (int i = 0; i < n; i++) { String w = in.next(); counts.put(w, counts.getOrDefault(w, 0) + 1); }
                    for (String k : counts.keySet()) System.out.println(k + " " + counts.get(k));
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-two-sum-drill",
      title: "Interview drill: Two Sum",
      kind: "trial",
      concept: "hash-maps",
      syllabusTag: "Interview practice",
      story: "Your first timed drill. Real interviews give you about 20 minutes for a problem like this — talk yourself through it as you go.",
      minutes: 20,
      timeLimitMinutes: 20,
      challenge: {
        instructions:
          "The input is `n`, then `n` integers, then a `target`. Exactly one pair of different positions `i < j` has values adding up to `target`. Print `i j` (0-based positions).\n\nFor `4` / `2 7 11 15` / `9`: `0 1`.\n\nAim for **one pass with a HashMap** (O(n)) rather than checking every pair (O(n²)).",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] nums = new int[n];
                  for (int i = 0; i < n; i++) {
                      nums[i] = in.nextInt();
                  }
                  int target = in.nextInt();

              }
          }
        `,
        hints: [
          "For each number x, the partner you need is target - x. Have you already seen it?",
          "Keep a map from value → index of everything seen so far. Check for the partner *before* adding the current number (so a number can't pair with itself).",
          "Worked example, [3, 4, 5], target 9: see 3 (need 6, not seen; store 3→0), see 4 (need 5, not seen; store 4→1), see 5 (need 4 → seen at 1) → answer 1 2.",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int[] nums = new int[n];
                  for (int i = 0; i < n; i++) {
                      nums[i] = in.nextInt();
                  }
                  int target = in.nextInt();

                  Map<Integer, Integer> seen = new HashMap<>();
                  for (int j = 0; j < n; j++) {
                      int need = target - nums[j];
                      if (seen.containsKey(need)) {
                          System.out.println(seen.get(need) + " " + j);
                          return;
                      }
                      seen.put(nums[j], j);
                  }
              }
          }
        `,
        solutionExplanation:
          "Instead of searching for each number's partner (O(n) per number), the map answers \"have I seen target - x?\" in O(1), so the whole scan is O(n) time and O(n) space. Checking before inserting stops 3 + 3 = 6 from pairing one element with itself.",
        tests: [
          { description: "2 7 11 15, target 9 → 0 1", stdin: "4\n2 7 11 15\n9", stdout: "0 1" },
          { description: "Pair at the end", hidden: true, stdin: "5\n1 2 3 4 10\n14", stdout: "3 4" },
          { description: "Equal values (can't reuse one element)", hidden: true, stdin: "3\n3 2 3\n6", stdout: "0 2" },
          { description: "A number can't pair with itself", hidden: true, stdin: "4\n5 1 9 2\n10", stdout: "1 2" },
          { description: "Negative numbers", hidden: true, stdin: "4\n-3 8 4 -1\n-4", stdout: "0 3" },
        ],
        feedback: [
          { stdoutPattern: "^(\\d+) \\1$", message: "You paired a number with itself. Check the map for the partner before adding the current number." },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    int[] nums = new int[n];
                    for (int i = 0; i < n; i++) nums[i] = in.nextInt();
                    int target = in.nextInt();
                    Map<Integer, Integer> seen = new HashMap<>();
                    for (int j = 0; j < n; j++) seen.put(nums[j], j);
                    for (int i = 0; i < n; i++) {
                        Integer k = seen.get(target - nums[i]);
                        if (k != null) { System.out.println(i + " " + k); return; }
                    }
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-trees-graphs",
      title: "Trees & graphs",
      kind: "lesson",
      concept: "trees-graphs",
      syllabusTag: "Unit 5: Trees and Graphs",
      story: "The Archive's catalogue branches like a tree; its tunnels connect like a web.",
      minutes: 18,
      blocks: [
        {
          type: "text",
          md: "A **tree** is a hierarchy of nodes: one **root** at the top, each node with **children**, and **leaves** with none. In a **binary tree** each node has at most two children, `left` and `right`.\n\nA **binary search tree (BST)** adds one rule: every key in a node's left subtree is smaller, every key in its right subtree is larger. To find a key you compare and go left or right — one path from the root — which takes O(height) steps: about O(log n) when the tree is balanced.",
        },
        {
          type: "code",
          title: "BST insert and search (no recursion needed)",
          runnable: true,
          lines: [
            ["class TreeNode {", ""],
            ["    int key;", ""],
            ["    TreeNode left, right;", "Two child references, null when absent."],
            ["    TreeNode(int key) { this.key = key; }", ""],
            ["}", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    static TreeNode insert(TreeNode root, int key) {", ""],
            ["        TreeNode node = new TreeNode(key);", ""],
            ["        if (root == null) return node;", "An empty tree: the new node becomes the root."],
            ["        TreeNode cur = root;", ""],
            ["        while (true) {", ""],
            ["            if (key < cur.key) {", "Smaller → must go in the left subtree."],
            ["                if (cur.left == null) { cur.left = node; return root; }", "Found an empty spot: attach it."],
            ["                cur = cur.left;", ""],
            ["            } else {", "Larger (or equal) → right subtree."],
            ["                if (cur.right == null) { cur.right = node; return root; }", ""],
            ["                cur = cur.right;", ""],
            ["            }", ""],
            ["        }", ""],
            ["    }", ""],
            ["", ""],
            ["    static boolean contains(TreeNode root, int key) {", ""],
            ["        TreeNode cur = root;", ""],
            ["        while (cur != null) {", "Follow one path down."],
            ["            if (key == cur.key) return true;", ""],
            ["            cur = key < cur.key ? cur.left : cur.right;", ""],
            ["        }", ""],
            ["        return false;", "Fell off the tree: not present."],
            ["    }", ""],
            ["", ""],
            ["    public static void main(String[] args) {", ""],
            ["        TreeNode root = null;", ""],
            ["        for (int k : new int[] {50, 30, 70, 20, 40}) root = insert(root, k);", "50 is the root; 30, 20, 40 go left; 70 right."],
            ["        System.out.println(contains(root, 40) + \" \" + contains(root, 45));", "true false"],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "check",
          question: "bst-path",
        },
        {
          type: "text",
          md: "A **graph** is a set of **vertices** joined by **edges** — roads between towns, links between pages. Unlike a tree it can have cycles. The usual representation is an **adjacency list**: for each vertex, the list of its neighbours.\n\n**Breadth-first search (BFS)** explores a graph in rings: first every neighbour of the start, then their neighbours, and so on — using a **queue**. Because it reaches vertices in order of distance, BFS finds the **fewest edges** from the start to every other vertex. A `visited` record stops it going round cycles forever.",
        },
        {
          type: "code",
          title: "BFS over an adjacency list",
          runnable: true,
          lines: [
            ["import java.util.*;", ""],
            ["", ""],
            ["public class Main {", ""],
            ["    public static void main(String[] args) {", ""],
            ["        int n = 5;", "Vertices 0..4."],
            ["        List<List<Integer>> adj = new ArrayList<>();", "adj.get(v) is v's neighbour list."],
            ["        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());", ""],
            ["        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}};", ""],
            ["        for (int[] e : edges) {", ""],
            ["            adj.get(e[0]).add(e[1]);", "Undirected: record the edge both ways."],
            ["            adj.get(e[1]).add(e[0]);", ""],
            ["        }", ""],
            ["        int[] dist = new int[n];", ""],
            ["        Arrays.fill(dist, -1);", "-1 means not visited yet."],
            ["        Deque<Integer> queue = new ArrayDeque<>();", ""],
            ["        dist[0] = 0;", ""],
            ["        queue.offer(0);", "Start from vertex 0."],
            ["        while (!queue.isEmpty()) {", ""],
            ["            int v = queue.poll();", "Take the nearest unexplored vertex."],
            ["            for (int w : adj.get(v)) {", ""],
            ["                if (dist[w] == -1) {", "Only visit each vertex once."],
            ["                    dist[w] = dist[v] + 1;", "One more edge than its discoverer."],
            ["                    queue.offer(w);", ""],
            ["                }", ""],
            ["            }", ""],
            ["        }", ""],
            ["        System.out.println(Arrays.toString(dist));", "[0, 1, 1, 2, 3]"],
            ["    }", ""],
            ["}", ""],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          md: "Trees are naturally **recursive** — each child is the root of a smaller tree — so many tree algorithms (height, in-order traversal) are shortest written with recursion. You'll learn recursion properly in the next realm and revisit trees there.",
        },
        {
          type: "check",
          question: "bfs-structure",
        },
      ],
      summary: {
        keyIdeas: [
          "Tree: root, children, leaves. BST: left < node < right.",
          "BST search/insert follow one root-to-leaf path: O(height).",
          "Graph = vertices + edges, stored as adjacency lists.",
          "BFS uses a queue and a visited/dist array; it finds fewest-edge distances.",
        ],
        mistakes: [
          "Recording an undirected edge in only one direction.",
          "No visited check — BFS loops forever on a cycle.",
          "Inserting into a BST without walking down to an empty child slot.",
        ],
      },
      questions: [
        {
          slug: "bst-path",
          kind: "mcq",
          prompt: "In the BST built from 50, 30, 70, 20, 40, which keys does `contains(root, 35)` compare against?",
          options: [
            { id: "a", text: "50, 30, 40" },
            { id: "b", text: "50, 30, 20", feedback: "35 > 30, so the search goes right from 30 — toward 40, not 20." },
            { id: "c", text: "All five keys", feedback: "A BST search follows a single path; it never visits the other branches." },
          ],
          answer: "a",
          explanation: "35 < 50 → left to 30. 35 > 30 → right to 40. 35 < 40 → left, which is null: not found. Three comparisons, one path.",
        },
        {
          slug: "bfs-structure",
          kind: "mcq",
          prompt: "Why does BFS use a queue rather than a stack?",
          options: [
            { id: "a", text: "Queues are faster than stacks", feedback: "Both are O(1) per operation — it's about order, not speed." },
            { id: "b", text: "First-in-first-out explores vertices in order of distance, so the first time BFS reaches a vertex is by the fewest edges" },
            { id: "c", text: "A stack can't hold integers", feedback: "Stacks hold Integers just fine." },
          ],
          answer: "b",
          explanation: "The queue finishes all vertices at distance 1 before any at distance 2, and so on. A stack would dive deep first (that's depth-first search), which doesn't give shortest hop counts.",
        },
      ],
    },
    {
      slug: "archive-catalogue-tree",
      title: "Catalogue tree",
      kind: "trial",
      concept: "trees-graphs",
      syllabusTag: "Unit 5: Trees and Graphs",
      story: "The Archive files record numbers in a binary search tree. Answer the librarians' lookups.",
      minutes: 15,
      challenge: {
        instructions:
          "The input is `n`, then `n` distinct record numbers to insert into a BST (in order), then `q`, then `q` lookups. Print `Min: <smallest>` and `Max: <largest>` (n is at least 1), then for each lookup print `FOUND` or `MISSING`.\n\nFor `5` / `50 30 70 20 40` / `2` / `40 45`: `Min: 20`, `Max: 70`, `FOUND`, `MISSING`.\n\nUse your own BST — the smallest key is the leftmost node and the largest the rightmost.",
        guidance: "supported",
        starterCode: java`
          import java.util.Scanner;

          class TreeNode {
              int key;
              TreeNode left, right;
              TreeNode(int key) { this.key = key; }
          }

          public class Main {
              static TreeNode insert(TreeNode root, int key) {
                  return root;
              }

              static boolean contains(TreeNode root, int key) {
                  return false;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);

              }
          }
        `,
        requirements: [{ description: "Uses your own tree (no TreeSet/TreeMap/sorting)", pattern: "TreeSet|TreeMap|Arrays\\.sort|Collections", mustMatch: false }],
        hints: [
          "The lesson's insert and contains work as they are — the new part is min and max.",
          "Min: start at the root and keep going left while there is a left child. Max: the same, going right.",
          "Worked example: in the tree 50 → (30 → 20, 40), 70, going left from 50 visits 30 then 20, which has no left child — so 20 is the minimum.",
        ],
        solution: java`
          import java.util.Scanner;

          class TreeNode {
              int key;
              TreeNode left, right;
              TreeNode(int key) { this.key = key; }
          }

          public class Main {
              static TreeNode insert(TreeNode root, int key) {
                  TreeNode node = new TreeNode(key);
                  if (root == null) return node;
                  TreeNode cur = root;
                  while (true) {
                      if (key < cur.key) {
                          if (cur.left == null) { cur.left = node; return root; }
                          cur = cur.left;
                      } else {
                          if (cur.right == null) { cur.right = node; return root; }
                          cur = cur.right;
                      }
                  }
              }

              static boolean contains(TreeNode root, int key) {
                  TreeNode cur = root;
                  while (cur != null) {
                      if (key == cur.key) return true;
                      cur = key < cur.key ? cur.left : cur.right;
                  }
                  return false;
              }

              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  TreeNode root = null;
                  for (int i = 0; i < n; i++) {
                      root = insert(root, in.nextInt());
                  }
                  TreeNode lo = root, hi = root;
                  while (lo.left != null) lo = lo.left;
                  while (hi.right != null) hi = hi.right;
                  System.out.println("Min: " + lo.key);
                  System.out.println("Max: " + hi.key);
                  int q = in.nextInt();
                  for (int i = 0; i < q; i++) {
                      System.out.println(contains(root, in.nextInt()) ? "FOUND" : "MISSING");
                  }
              }
          }
        `,
        solutionExplanation:
          "The BST rule means the smallest key can't have anything to its left, so it's the leftmost node; likewise the largest is rightmost. Every operation follows one path — O(height) each.",
        tests: [
          { description: "Min, max and two lookups", stdin: "5\n50 30 70 20 40\n2\n40 45", stdout: "Min: 20\nMax: 70\nFOUND\nMISSING" },
          { description: "Sorted input (a tall, thin tree)", hidden: true, stdin: "4\n1 2 3 4\n2\n4 0", stdout: "Min: 1\nMax: 4\nFOUND\nMISSING" },
          { description: "A single record", hidden: true, stdin: "1\n9\n1\n9", stdout: "Min: 9\nMax: 9\nFOUND" },
        ],
        feedback: [{ stdoutPattern: "^Min: 50", message: "Min is the root's key — the loop must keep moving left while a left child exists." }],
        wrongSolutions: [
          java`
            import java.util.Scanner;
            class TreeNode { int key; TreeNode left, right; TreeNode(int k) { key = k; } }
            public class Main {
                static TreeNode insert(TreeNode root, int key) {
                    TreeNode node = new TreeNode(key);
                    if (root == null) return node;
                    TreeNode cur = root;
                    while (true) {
                        if (key < cur.key) { if (cur.left == null) { cur.left = node; return root; } cur = cur.left; }
                        else { if (cur.right == null) { cur.right = node; return root; } cur = cur.right; }
                    }
                }
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt();
                    TreeNode root = null;
                    for (int i = 0; i < n; i++) root = insert(root, in.nextInt());
                    System.out.println("Min: " + (root.left != null ? root.left.key : root.key));
                    System.out.println("Max: " + (root.right != null ? root.right.key : root.key));
                    int q = in.nextInt();
                    for (int i = 0; i < q; i++) { int k = in.nextInt(); System.out.println(k == root.key ? "FOUND" : "MISSING"); }
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-signal-network",
      title: "Signal network",
      kind: "trial",
      concept: "trees-graphs",
      syllabusTag: "Unit 5: Trees and Graphs",
      story: "Messages hop between Archive towers. How few hops can reach the far tower?",
      minutes: 18,
      challenge: {
        instructions:
          "The input is `n` (towers numbered 0 to n-1) and `m`, then `m` lines `a b` — an undirected link — then a `start` and a `goal`. Print `Hops: <k>` with the fewest links from start to goal, or `UNREACHABLE`.\n\nFor `5 5` / `0 1` / `0 2` / `1 3` / `2 3` / `3 4` / `0 4`: `Hops: 3`.",
        guidance: "independent",
        starterCode: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int m = in.nextInt();

              }
          }
        `,
        hints: [
          "Build an adjacency list (both directions per link), then run BFS from start.",
          "BFS's dist array gives the hop count to every tower; dist[goal] is still -1 if it was never reached.",
          "Worked example: the BFS code in the trees & graphs lesson computes exactly this dist array from vertex 0.",
        ],
        solution: java`
          import java.util.*;

          public class Main {
              public static void main(String[] args) {
                  Scanner in = new Scanner(System.in);
                  int n = in.nextInt();
                  int m = in.nextInt();
                  List<List<Integer>> adj = new ArrayList<>();
                  for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
                  for (int i = 0; i < m; i++) {
                      int a = in.nextInt(), b = in.nextInt();
                      adj.get(a).add(b);
                      adj.get(b).add(a);
                  }
                  int start = in.nextInt(), goal = in.nextInt();

                  int[] dist = new int[n];
                  Arrays.fill(dist, -1);
                  Deque<Integer> queue = new ArrayDeque<>();
                  dist[start] = 0;
                  queue.offer(start);
                  while (!queue.isEmpty()) {
                      int v = queue.poll();
                      for (int w : adj.get(v)) {
                          if (dist[w] == -1) {
                              dist[w] = dist[v] + 1;
                              queue.offer(w);
                          }
                      }
                  }
                  System.out.println(dist[goal] == -1 ? "UNREACHABLE" : "Hops: " + dist[goal]);
              }
          }
        `,
        solutionExplanation:
          "BFS visits towers in order of distance, so the first time it labels the goal is with the fewest hops. Each tower and link is processed once: O(n + m).",
        tests: [
          { description: "Fewest hops 0 → 4 is 3", stdin: "5 5\n0 1\n0 2\n1 3\n2 3\n3 4\n0 4", stdout: "Hops: 3" },
          { description: "Disconnected towers", hidden: true, stdin: "4 2\n0 1\n2 3\n0 3", stdout: "UNREACHABLE" },
          { description: "Start is the goal", hidden: true, stdin: "3 1\n0 1\n2 2", stdout: "Hops: 0" },
          { description: "A shortcut beats the long way round", hidden: true, stdin: "6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n0 5\n0 4", stdout: "Hops: 2" },
        ],
        feedback: [
          { stdoutPattern: "^Hops: 4$", message: "You found a path, but not the shortest one — make sure you're using a queue (BFS), not a stack." },
        ],
        wrongSolutions: [
          java`
            import java.util.*;
            public class Main {
                public static void main(String[] args) {
                    Scanner in = new Scanner(System.in);
                    int n = in.nextInt(), m = in.nextInt();
                    List<List<Integer>> adj = new ArrayList<>();
                    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
                    for (int i = 0; i < m; i++) { int a = in.nextInt(), b = in.nextInt(); adj.get(a).add(b); }
                    int start = in.nextInt(), goal = in.nextInt();
                    int[] dist = new int[n]; Arrays.fill(dist, -1);
                    Deque<Integer> q = new ArrayDeque<>(); dist[start] = 0; q.offer(start);
                    while (!q.isEmpty()) { int v = q.poll(); for (int w : adj.get(v)) if (dist[w] == -1) { dist[w] = dist[v] + 1; q.offer(w); } }
                    System.out.println(dist[goal] == -1 ? "UNREACHABLE" : "Hops: " + dist[goal]);
                }
            }
          `,
        ],
      },
    },
    {
      slug: "archive-guardian",
      title: "Guardian of the Archive",
      kind: "quiz",
      concept: "data-structures-mastery",
      syllabusTag: "Unit 5 review",
      story: "The Archive's guardian knows where every record lives — and asks whether you do.",
      minutes: 18,
      passingScore: 75,
      questions: [
        {
          slug: "linked-walk",
          kind: "mcq",
          prompt: "What does this do to a non-empty linked list? `head = head.next;`",
          options: [
            { id: "a", text: "Removes the first node (the list now starts at the second)" },
            { id: "b", text: "Removes the last node", feedback: "Only the head reference moves; the tail is untouched." },
            { id: "c", text: "Deletes the whole list", feedback: "Everything from the second node on is still reachable through head." },
          ],
          answer: "a",
          explanation: "The list is whatever is reachable from head. Moving head one step forward makes the old first node unreachable — O(1) removal at the front.",
          reviewLesson: "archive-linked-lists",
        },
        {
          slug: "arraylist-insert",
          kind: "mcq",
          prompt: "Why is `list.add(0, x)` slow on a large ArrayList?",
          options: [
            { id: "a", text: "Every existing element has to shift one place right" },
            { id: "b", text: "It sorts the list afterwards", feedback: "ArrayList never sorts itself." },
            { id: "c", text: "It always copies the list into a new array", feedback: "It only grows the array when full — the shifting happens every time." },
          ],
          answer: "a",
          explanation: "An ArrayList is backed by an array, and arrays can't make room at the front without moving everything: O(n).",
          reviewLesson: "archive-linked-lists",
        },
        {
          slug: "queue-trace",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            Deque<String> q = new ArrayDeque<>();
            q.offer("a");
            q.offer("b");
            q.offer("c");
            String first = q.poll();
            q.offer(first);
            System.out.println(q.poll() + q.peek() + q.size());
          `,
          answer: "bc2",
          explanation: "a leaves the front and rejoins at the back: b, c, a. poll gives b, peek sees c, and 2 remain.",
          reviewLesson: "archive-stacks-queues",
        },
        {
          slug: "undo-structure",
          kind: "mcq",
          prompt: "A text editor's undo button reverses the most recent action first. Which structure stores the history?",
          options: [
            { id: "a", text: "Queue", feedback: "A queue would undo your oldest action first." },
            { id: "b", text: "Stack" },
            { id: "c", text: "HashSet", feedback: "A set has no order and can't hold repeated actions." },
          ],
          answer: "b",
          explanation: "Most recent first is last-in, first-out — a stack: push each action, pop to undo.",
          reviewLesson: "archive-stacks-queues",
        },
        {
          slug: "map-count",
          kind: "output",
          prompt: "Type exactly what this prints.",
          code: java`
            Map<Character, Integer> m = new TreeMap<>();
            for (char c : "tree".toCharArray()) {
                m.put(c, m.getOrDefault(c, 0) + 1);
            }
            System.out.println(m);
          `,
          answer: "{e=2, r=1, t=1}",
          explanation: "Counts: t 1, r 1, e 2. A TreeMap keeps keys sorted, so it prints e, r, t in that order.",
          reviewLesson: "archive-hash-maps",
        },
        {
          slug: "hash-complexity",
          kind: "mcq",
          prompt: "What is the average time to check `map.containsKey(k)` on a HashMap with n entries?",
          options: [
            { id: "a", text: "O(1)" },
            { id: "b", text: "O(log n)", feedback: "That's a TreeMap, which keeps keys sorted in a balanced tree." },
            { id: "c", text: "O(n)", feedback: "That's searching an unsorted list — hashing avoids it." },
          ],
          answer: "a",
          explanation: "Hashing computes which bucket a key belongs in, so a lookup inspects only a handful of entries on average, regardless of n.",
          reviewLesson: "archive-hash-maps",
        },
        {
          slug: "bst-shape",
          kind: "mcq",
          prompt: "Inserting 1, 2, 3, 4, 5 (in that order) into an empty BST produces a tree of what height (counting edges from root to deepest leaf)?",
          options: [
            { id: "a", text: "2", feedback: "That would be a balanced tree — sorted input doesn't give one." },
            { id: "b", text: "4" },
            { id: "c", text: "5", feedback: "Close — 5 nodes in a chain have 4 edges between them." },
          ],
          answer: "b",
          explanation: "Each key is larger than all before it, so each becomes the right child of the previous: a chain 1 → 2 → 3 → 4 → 5 with 4 edges. Searches degrade to O(n) — why balanced trees matter.",
          reviewLesson: "archive-trees-graphs",
        },
        {
          slug: "bfs-visited",
          kind: "mcq",
          prompt: "What goes wrong if BFS on a graph with a cycle never checks whether a vertex was already visited?",
          options: [
            { id: "a", text: "It finds longer paths, but still finishes", feedback: "Without a visited check it never finishes on a cycle." },
            { id: "b", text: "It keeps re-adding the same vertices to the queue and never finishes" },
            { id: "c", text: "Nothing — BFS can't revisit vertices", feedback: "In a graph with a cycle, every vertex on the cycle is reachable again and again." },
          ],
          answer: "b",
          explanation: "In a cycle A–B–C–A, each vertex keeps rediscovering its neighbours. The visited (or dist == -1) check ensures each vertex is queued once.",
          reviewLesson: "archive-trees-graphs",
        },
      ],
    },
  ],
};
