// Author: Takeshi Iwana
// License: MIT
// Credits: 
//  * https://andrewlock.net/behind-the-implementation-of-dotnets-priorityqueue/
//  * https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/PriorityQueue.cs
import type { IComparer, Indexable, ReadonlyTuple, TypedArray, TypedArrayConstructor } from "./types.ts";


/**
 * The arity of the heap. This is the number of children each node has.
 */
export const ARITY = 4;
/**
 * The log base 2 of the heap's arity. This is used to efficiently calculate parent and child indices.
 * For example, with an arity of 4, log2(4) = 2, so we can use bit shifting to divide or multiply by 4.
 * This is equivalent to Math.log2(ARITY).
 */
export const LOG2_ARITY = 2;

/**
 * Calculates the parent index in a complete tree for a given node index.
 * Uses bit shifting to efficiently compute floor((index - 1) / ARITY).
 * 
 * @param index - The index of the current node (zero-based)
 * @returns The index of the parent node
 */
export const parent = (index: number): number => (index - 1) >> LOG2_ARITY;

/**
 * Calculates the index of a child node in a D-ary heap.
 * 
 * @param index - The index of the parent node
 * @param i - The child offset (0 to ARITY-1). Defaults to 0
 * @returns The index of the child node
 * 
 * @remarks
 * The formula used is: (parent_index << LOG2_ARITY) + child_offset + 1
 * This works because shifting left by LOG2_ARITY multiplies by ARITY,
 * giving us the first child index, then we add the offset and 1 for
 * the specific child position.
 */
export const child = (index: number, i = 0): number => (index << LOG2_ARITY) + i + 1;

/**
 * Swaps two elements in an array.
 * 
 * @template T - The type of elements in the array
 * @param elements - The array in which elements will be swapped
 * @param i - The index of the first element to swap
 * @param j - The index of the second element to swap
 */
export const swap = <T>(elements: T[], i: number, j: number): void => {
  const temp = elements[i];
  elements[i] = elements[j];
  elements[j] = temp;
}


const comparePriorities = (comparer: IComparer<number>, priorities: Indexable<number>, aIndex: number, bIndex: number): number => {
  return comparer(priorities[aIndex], priorities[bIndex], [aIndex, bIndex]);
};

/**
 * Moves an element up in a 4-ary heap to maintain heap properties.
 * 
 * @template T - The type of elements in the heap
 * @param index - The starting index of the element to move up
 * @param heap - The array representing the heap
 * @param {IComparer<T>} comparer - A function that compares two elements, returning:
 *                    - negative if first arg should be higher in heap
 *                    - positive if first arg should be lower in heap
 *                    - zero if elements are equal
 * 
 * @example
 * ```typescript
 * const minHeap = [1, 4, 3, 7];
 * up(3, minHeap, (a, b) => a - b); // Moves 7 up if needed
 * ```
 * 
 * @remarks
 * This implementation specifically works with a 4-ary heap structure,
 * where each node has up to four children. The function repeatedly
 * compares an element with its parent and swaps them if necessary
 * until the heap property is restored.
 */
export const up = <T, Heap extends Indexable<T>>(index: number, heap: Heap, comparer: IComparer<T>): void => {
  const node = heap[index];
  let nodeIndex = index;

  while (nodeIndex > 0) {
    const parentIndex = parent(nodeIndex);
    const parentNode = heap[parentIndex];

    if (comparer(node, parentNode, [nodeIndex, parentIndex]) >= 0) break;

    heap[nodeIndex] = parentNode;
    nodeIndex = parentIndex;
  }

  heap[nodeIndex] = node;
};

export const upWithPriorities = <
  T,
  Heap extends Indexable<T> = Indexable<T>
>(
  input: [T, priority: number],
  index: number, heap: Heap,
  comparer: IComparer<number>,
  priorities: Indexable<number>): void => {
  // const node = heap[index];
  // const nodePriority = priorities[index];
  // let nodeIndex = index;

  // while (nodeIndex > 0) {
  //   const parentIndex = parent(nodeIndex);
  //   const parentNode = heap[parentIndex];

  //   if (comparePriorities(comparer, priorities, nodeIndex, parentIndex) >= 0) break;

  //   heap[nodeIndex] = parentNode;
  //   priorities[nodeIndex] = priorities[parentIndex];
  //   nodeIndex = parentIndex;
  // }

  // heap[nodeIndex] = node;
  // priorities[nodeIndex] = nodePriority;
};

export const upWithPrioritiesAndIndices = <T, Heap extends Indexable<T>>(index: number, heap: Heap, comparer: IComparer<number>, priorities: Indexable<number>, indices: Indexable<bigint>): void => {
  const node = heap[index];
  const nodePriority = priorities[index];
  const nodeStableIndex = indices[index];
  let nodeIndex = index;

  while (nodeIndex > 0) {
    const parentIndex = parent(nodeIndex);;
    const parentNode = heap[parentIndex];

    if (comparePriorities(comparer, priorities, nodeIndex, parentIndex) >= 0) break;

    heap[nodeIndex] = parentNode;
    priorities[nodeIndex] = priorities[parentIndex];
    indices[nodeIndex] = indices[parentIndex];
    nodeIndex = parentIndex;
  }

  heap[nodeIndex] = node;
  priorities[nodeIndex] = nodePriority;
  indices[nodeIndex] = nodeStableIndex;
};

/**
 * Moves a node down in a 4-ary heap to maintain the heap property.
 * The heap property ensures that each parent node has a priority less than or equal to its children.
 * 
 * @template T - The type of elements in the heap
 * @param index - The starting index of the node to move down
 * @param length - The length of the heap
 * @param heap - The array representing the heap
 * @param {IComparer<T>} comparer - A function that compares two elements and returns a number:
 *                    negative if first < second,
 *                    zero if first = second,
 *                    positive if first > second
 * 
 * @example
 * ```typescript
 * const minHeap = [1, 4, 3, 7, 8, 9, 10];
 * down(1, minHeap.length, minHeap, (a, b) => a - b);
 * // minHeap is now [1, 4, 3, 7, 8, 9, 10]
 * ```
 */
export const down = <T, Heap extends Indexable<T>>(index: number, length: number, heap: Heap, comparer: IComparer<T>): void => {
  const node = heap[index];
  let nodeIndex = index;
  console.assert(0 <= index && index < length, `Index ${index} out of bounds`);

  let i = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((i = child(nodeIndex)) < length) {
    let minChild = heap[i];
    let minChildIndex = i;
    const childIndexUpperBound = Math.min(i + ARITY, length);

    while (++i < childIndexUpperBound) {
      const nextChild = heap[i];
      if (comparer(nextChild, minChild, [i, minChildIndex]) < 0) {
        minChild = nextChild;
        minChildIndex = i;
      }
    }

    if (comparer(node, minChild, [nodeIndex, minChildIndex]) <= 0) break;

    heap[nodeIndex] = minChild;
    nodeIndex = minChildIndex;
  }

  heap[nodeIndex] = node;
};

export const downWithPriorities = <T, Heap extends Indexable<T>>(index: number, length: number, heap: Heap, comparer: IComparer<number>, priorities: Indexable<number>): void => {
  const node = heap[index];
  const nodePriority = priorities[index];
  let nodeIndex = index;
  console.assert(0 <= index && index < length, `Index ${index} out of bounds`);

  let i = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((i = child(nodeIndex)) < length) {
    let minChild = heap[i];
    let minPriority = priorities[i];
    let minChildIndex = i;
    const childIndexUpperBound = Math.min(i + ARITY, length);

    while (++i < childIndexUpperBound) {
      const nextChild = heap[i];
      const nextPriority = priorities[i];
      if (comparePriorities(comparer, priorities, i, minChildIndex) < 0) {
        minChild = nextChild;
        minChildIndex = i;
        minPriority = nextPriority;
      }
    }

    if (comparePriorities(comparer, priorities, nodeIndex, minChildIndex) <= 0) break;

    heap[nodeIndex] = minChild;
    priorities[nodeIndex] = minPriority;
    nodeIndex = minChildIndex;
  }

  heap[nodeIndex] = node;
  priorities[nodeIndex] = nodePriority;
};

export const downWithPrioritiesAndIndices = <T, Heap extends Indexable<T>>(index: number, length: number, heap: Heap, comparer: IComparer<number>, priorities: Indexable<number>, indices: Indexable<bigint>): void => {
  const node = heap[index];
  const nodePriority = priorities[index];
  const nodeStableIndex = indices[index];
  let nodeIndex = index;
  console.assert(0 <= index && index < length, `Index ${index} out of bounds`);

  let i = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((i = child(nodeIndex)) < length) {
    let minChild = heap[i];
    let minPriority = priorities[i];
    let minStableIndex = indices[i];
    let minChildIndex = i;
    const childIndexUpperBound = Math.min(i + ARITY, length);

    while (++i < childIndexUpperBound) {
      const nextChild = heap[i];
      const nextPriority = priorities[i];
      const nextStableIndex = indices[i];
      if (comparePriorities(comparer, priorities, i, minChildIndex) < 0) {
        minChild = nextChild;
        minChildIndex = i;
        minPriority = nextPriority;
        minStableIndex = nextStableIndex;
      }
    }

    if (comparePriorities(comparer, priorities, nodeIndex, minChildIndex) <= 0) break;

    heap[nodeIndex] = minChild;
    priorities[nodeIndex] = minPriority;
    indices[nodeIndex] = minStableIndex;
    nodeIndex = minChildIndex;
  }

  heap[nodeIndex] = node;
  priorities[nodeIndex] = nodePriority;
  indices[nodeIndex] = nodeStableIndex;
};

/**
 * Converts an array into a heap data structure using the provided comparison function.
 * The heapification process is performed in-place, modifying the original array.
 * 
 * @template T - The type of elements in the heap
 * @param length - The number of elements in the heap
 * @param {T[]} heap - The array to be converted into a heap
 * @param {IComparer<T>} comparer - A function that compares two elements and returns:
 *   - A negative number if a should be higher in the heap than b
 *   - Zero if a and b are equal
 *   - A positive number if a should be lower in the heap than b
 * @returns {void}
 * 
 * @example
 * const numbers = [4, 1, 3, 2, 5];
 * heapify(numbers, (a, b) => a - b); // Creates a min-heap
 * // numbers is now arranged as a heap
 */
export const heapify = <T, Heap extends Indexable<T>>(length: number, heap: Heap, comparer: IComparer<T>): void => {
  const startIndex = (length - 1 - 1) >> LOG2_ARITY;
  for (let i = startIndex; i >= 0; i--) {
    down(i, length, heap, comparer);
  }
};

// Function to heapify with priorities
export const heapifyWithPriorities = <T, Heap extends Indexable<T>>(length: number, heap: Heap, comparer: IComparer<number>, priorities: Indexable<number>): void => {
  const startIndex = (length - 1 - 1) >> LOG2_ARITY;
  for (let i = startIndex; i >= 0; i--) {
    downWithPriorities(i, length, heap, comparer, priorities);
  }
};

// Function to heapify with priorities and indices
export const heapifyWithPrioritiesAndIndices = <T, Heap extends Indexable<T>>(length: number, heap: Heap, comparer: IComparer<number>, priorities: Indexable<number>, indices: Indexable<bigint>): void => {
  const startIndex = (length - 1 - 1) >> LOG2_ARITY;
  for (let i = startIndex; i >= 0; i--) {
    downWithPrioritiesAndIndices(i, length, heap, comparer, priorities, indices);
  }
};

/**
 * Grows an array to a new size and copies the elements from the original array.
 * @param elements - The original array to copy
 * @param size - The new size of the array
 * @param backend - The constructor for the new array
 * @returns A new array with the copied elements
 */
export const grow = <T extends TypedArray>(elements: T, size: number, backend: TypedArrayConstructor<T>): T => {
  if (size <= elements.length) return elements;
  const _elements = new backend(size) as T;
  _elements.set(elements);
  return _elements;
}