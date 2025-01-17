// Author: Takeshi Iwana
// License: MIT
// Credits: 
//  * https://andrewlock.net/behind-the-implementation-of-dotnets-priorityqueue/
//  * https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/PriorityQueue.cs
import type { IComparer } from "./types.ts";


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
 * @throws {RangeError} When index is less than 1 (root has no parent)
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
 * @throws {TypeError} When indices are out of bounds
 */
export const swap = <T>(elements: T[], i: number, j: number): void => {
  const temp = elements[i];
  elements[i] = elements[j];
  elements[j] = temp;
}

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
export const up = <T>(
  index: number,
  heap: T[],
  comparer: IComparer<T>
): void => {
  const node = heap[index];
  let nodeIndex = index;

  while (nodeIndex > 0) {
    const parentIndex = parent(nodeIndex);
    const parentNode = heap[parentIndex];

    if (comparer(node, parentNode) < 0) {
      heap[nodeIndex] = parentNode;
      nodeIndex = parentIndex;
    } else {
      break;
    }
  }

  heap[nodeIndex] = node;
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
export const down = <T>(index: number, length: number, heap: T[], comparer: IComparer<T>): void => {
  const node = heap[index];
  let currentIndex = index;

  while (true) {
    const firstChildIndex = child(currentIndex);
    if (firstChildIndex >= length) break;

    const lastChildIndex = Math.min(firstChildIndex + ARITY, length);
    let minChildIndex = firstChildIndex;
    let minChild = heap[firstChildIndex];

    // Find minimum child using direct comparisons
    for (let i = firstChildIndex + 1; i < lastChildIndex; i++) {
      const nextChild = heap[i];
      if (comparer(nextChild, minChild) < 0) {
        minChild = nextChild;
        minChildIndex = i;
      }
    }

    // Early exit if heap property is satisfied
    if (comparer(node, minChild) <= 0) break;

    // Single assignment instead of swap
    heap[currentIndex] = minChild;
    currentIndex = minChildIndex;
  }

  heap[currentIndex] = node;
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
export const heapify = <T>(length: number, heap: T[], comparer: IComparer<T>): void => {
  // Start from the last parent node and move up the tree
  for (let i = parent(length - 1); i >= 0; i--) {
    down(i, length, heap, comparer);
  }
}