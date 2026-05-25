export const mockQuestions = [
  {
    id: 'q1',
    text: 'Given a directed acyclic graph (DAG) representing task dependencies, which of the following algorithms is most appropriate for determining a valid execution order where every task is performed only after all its dependencies are met?',
    options: [
      { id: 'A', text: "Dijkstra's Shortest Path Algorithm" },
      { id: 'B', text: "Kruskal's Minimum Spanning Tree" },
      { id: 'C', text: "Topological Sorting using Kahn's Algorithm" },
      { id: 'D', text: "Breadth-First Search (BFS) starting from any arbitrary node" }
    ],
    correctAnswer: 'C',
    codeSnippet: `function scheduleTasks(tasks, dependencies):
    // Initialization
    inDegree = [0] * len(tasks)
    graph = buildGraph(tasks, dependencies)
    
    // ... ? ...`
  },
  {
    id: 'q2',
    text: 'Which data structure is most optimal for implementing a Least Recently Used (LRU) cache?',
    options: [
      { id: 'A', text: "Array" },
      { id: 'B', text: "Hash Map combined with a Doubly Linked List" },
      { id: 'C', text: "Binary Search Tree" },
      { id: 'D', text: "Min-Heap" }
    ],
    correctAnswer: 'B'
  },
  {
    id: 'q3',
    text: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
    options: [
      { id: 'A', text: "O(1)" },
      { id: 'B', text: "O(log n)" },
      { id: 'C', text: "O(n)" },
      { id: 'D', text: "O(n log n)" }
    ],
    correctAnswer: 'B'
  }
];