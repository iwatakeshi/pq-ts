/**
 * # pq-ts
 *
 * `pq-ts` is a TypeScript library that provides efficient and flexible priority
 * queue implementations. It includes both standard and stable priority queues,
 * ensuring that elements with the same priority maintain their relative order of
 * insertion. Additionally, it supports typed priority queues which use typed
 * arrays.
 *
 * ## Features
 *
 * - **Priority Queue**: A standard priority queue that orders elements based on
 *   their priority.
 * - **Stable Priority Queue**: A stable priority queue that maintains the relative
 *   order of elements with the same priority.
 * - **Typed Priority Queue**: A priority queue with typed arrays.
 * - **Stable Typed Priority Queue**: A stable priority queue with typed arrays.
 * - **Custom Comparer**: Support for custom comparison functions to define the
 *   order of elements.
 * - **Efficient Operations**: Optimized for efficient enqueue, dequeue, and heap
 *   operations.
 *
 * ## Installation
 *
 * You can install `pq-ts` using npm, yarn, or bun:
 *
 * ```sh
 * # Using npm
 * npm install pq-ts
 *
 * # Using yarn
 * yarn add pq-ts
 *
 * # Using bun
 * bun add pq-ts
 * ```
 *
 * ## Usage
 *
 * ### Importing the Library
 *
 * ```typescript
 * import {
 *   PriorityQueue,
 *   StablePriorityQueue,
 *   StableTypedPriorityQueue,
 *   TypedPriorityQueue,
 * } from "pq-ts";
 * ```
 *
 * ### Priority Queue
 *
 * ```typescript
 * const pq = new PriorityQueue<number>();
 *
 * // Enqueue elements with priorities
 * pq.enqueue(1, 5);
 * pq.enqueue(2, 3);
 * pq.enqueue(3, 4);
 *
 * // Dequeue elements (lowest priority first)
 * console.log(pq.dequeue()); // 2
 * console.log(pq.dequeue()); // 3
 * console.log(pq.dequeue()); // 1
 * ```
 *
 * ### Stable Priority Queue
 *
 * ```typescript
 * const spq = new StablePriorityQueue<number>();
 *
 * spq.enqueue(1, 5);
 * spq.enqueue(2, 3);
 * spq.enqueue(3, 4);
 *
 * console.log(spq.dequeue()); // 2
 * console.log(spq.dequeue()); // 3
 * console.log(spq.dequeue()); // 1
 * ```
 *
 * ### Typed Priority Queue
 *
 * ```typescript
 * const tpq = new TypedPriorityQueue(Int32Array, 10);
 *
 * tpq.enqueue(1, 5);
 * tpq.enqueue(2, 3);
 * tpq.enqueue(3, 4);
 *
 * console.log(tpq.dequeue()); // 2
 * console.log(tpq.dequeue()); // 3
 * console.log(tpq.dequeue()); // 1
 * ```
 *
 * ### Using a Custom Comparer
 *
 * ```typescript
 * const customComparer = (
 *   a: { value: number; priority: number },
 *   b: { value: number; priority: number },
 * ) => {
 *   return b.priority - a.priority; // Max-heap
 * };
 *
 * const pq = new PriorityQueue<number>(customComparer);
 * pq.enqueue(1, 5);
 * pq.enqueue(2, 3);
 * pq.enqueue(3, 4);
 *
 * console.log(pq.dequeue()); // 1
 * console.log(pq.dequeue()); // 3
 * console.log(pq.dequeue()); // 2
 * ```
 *
 * ## Credits
 *
 * - [Behind the implementation of .NET's PriorityQueue](https://andrewlock.net/behind-the-implementation-of-dotnets-priorityqueue/)
 * - [DotNet's PriorityQueue<TElement,TPriority> Class](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/PriorityQueue.cs)
 *
 * @module
 */

export * from "./src/types.ts";
export * from "./src/primitive.ts";
export * from "./src/pq.ts";
export * from "./src/stable.pq.ts";
export * from "./src/typed.pq.ts";
export * from "./src/stable.typed.pq.ts";