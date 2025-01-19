// Author: Takeshi Iwana
// License: MIT
// Credits: 
//  * https://andrewlock.net/behind-the-implementation-of-dotnets-priorityqueue/
//  * https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/PriorityQueue.cs

/**
 * Priority Queue primitives for 4-ary heap operations.
 * Implements three variants:
 * 1. Basic: Uses node objects with embedded priorities
 * 2. Typed: Uses separate priority array for efficiency
 * 3. Stable: Maintains insertion order (FIFO) for equal priorities
 * 
 * @module PriorityQueue
 */
import type {
  IComparer,
  Indexable,
  IPriorityNode,
  IStableTypedPriorityNode,
  ITypedPriorityNode,
  TypedArray, TypedArrayConstructor
} from "./types.ts";

/**
 * The arity of the heap. This is the number of children each node has.
 */
export const ARITY = 4;
/**
 * The log base 2 of the heap's arity. This is used to efficiently calculate parent and child indices.
 * For example, with an arity of 4, log2(4) = 2, so we can use bit shifting to divide or multiply by 4.
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

/**
 * Moves an element up in a 4-ary heap to maintain heap properties.
 * 
 * @template T - The type of elements in the heap
 * @param nodes - The array representing the heap
 * @param node - The node to move up
 * @param index - The starting index of the element to move up
 * @param comparer - A function that compares two elements, returning:
 *                    - negative if first arg should be higher in heap
 *                    - positive if first arg should be lower in heap
 *                    - zero if elements are equal
 * 
 * @example
 * ```typescript
 * const minHeap = [1, 4, 3, 7];
 * up(minHeap)(minHeap[3], 3, (a, b) => a - b); // Moves 7 up if needed
 * ```
 * 
 * @remarks
 * This implementation specifically works with a 4-ary heap structure,
 * where each node has up to four children. The function repeatedly
 * compares an element with its parent and swaps them if necessary
 * until the heap property is restored.
 */
export const up = <T, P extends IPriorityNode<T> = IPriorityNode<T>>(
  nodes: Indexable<P>,
) => {
  return (
    node: P,
    index: number,
    comparer: IComparer<P>
  ): void => {
    let nodeIndex = index;
    while (nodeIndex > 0) {
      const parentIndex = parent(nodeIndex);
      const parentNode = nodes[parentIndex] as P;

      if (comparer(node, parentNode) >= 0) break;

      nodes[nodeIndex] = parentNode;
      nodeIndex = parentIndex;
    }

    nodes[nodeIndex] = node;
  }
}

/**
 * Moves an element up in a 4-ary heap with separate priority array to maintain heap properties.
 * 
 * @param nodes - The array representing the heap
 * @param priorities - The array representing the priorities
 * @param node - The node to move up
 * @param index - The starting index of the element to move up
 * @param comparer - A function that compares two elements, returning:
 *                    - negative if first arg should be higher in heap
 *                    - positive if first arg should be lower in heap
 *                    - zero if elements are equal
 */
export const upWithPriorities = (
  nodes: Indexable<number>,
  priorities: Indexable<number>
) => {
  return <P extends ITypedPriorityNode = ITypedPriorityNode>(
    node: P,
    index: number,
    comparer: IComparer<P>
  ): void => {
    let nodeIndex = index;
    while (nodeIndex > 0) {
      const parentIndex = parent(nodeIndex);
      const parentNode = {
        ...node,
        value: nodes[parentIndex],
        priority: priorities[parentIndex],
        nindex: parentIndex
      } as P;

      if (comparer(node, parentNode) >= 0) break;

      nodes[nodeIndex] = parentNode.value;
      priorities[nodeIndex] = parentNode.priority;
      nodeIndex = parentNode.nindex;
    }

    nodes[nodeIndex] = node.value;
    priorities[nodeIndex] = node.priority;
  }
}

/**
 * Moves an element up in a 4-ary heap with separate priority and index arrays to maintain heap properties.
 * 
 * @param nodes - The array representing the heap
 * @param priorities - The array representing the priorities
 * @param indices - The array representing the stable indices
 * @param node - The node to move up
 * @param index - The starting index of the element to move up
 * @param comparer - A function that compares two elements, returning:
 *                    - negative if first arg should be higher in heap
 *                    - positive if first arg should be lower in heap
 *                    - zero if elements are equal
 */
export const upWithPrioritiesAndIndices = (
  nodes: Indexable<number>,
  priorities: Indexable<number>,
  indices: Indexable<bigint>
) => {
  return <P extends IStableTypedPriorityNode = IStableTypedPriorityNode>(
    node: P,
    index: number,
    comparer: IComparer<P>
  ): void => {
    let nodeIndex = index;
    while (nodeIndex > 0) {
      const parentIndex = parent(nodeIndex);
      const parentNode = {
        ...node,
        value: nodes[parentIndex],
        priority: priorities[parentIndex],
        nindex: parentIndex,
        sindex: indices[parentIndex]
      } as P;

      if (comparer(node, parentNode) >= 0) break;

      nodes[nodeIndex] = parentNode.value;
      priorities[nodeIndex] = parentNode.priority;
      indices[nodeIndex] = parentNode.sindex;
      nodeIndex = parentNode.nindex;
    }

    nodes[nodeIndex] = node.value;
    priorities[nodeIndex] = node.priority;
    indices[nodeIndex] = node.sindex;
  }
}

/**
 * Moves a node down in a 4-ary heap to maintain the heap property.
 * The heap property ensures that each parent node has a priority less than or equal to its children.
 * 
 * @template T - The type of elements in the heap
 * @param nodes - The array representing the heap
 * @param size - The size of the heap
 * @param node - The node to move down
 * @param index - The starting index of the node to move down
 * @param comparer - A function that compares two elements and returns a number:
 *                    negative if first < second,
 *                    zero if first = second,
 *                    positive if first > second
 * 
 * @example
 * ```typescript
 * const minHeap = [1, 4, 3, 7, 8, 9, 10];
 * down(minHeap)(minHeap[1], 1, (a, b) => a - b);
 * // minHeap is now [1, 4, 3, 7, 8, 9, 10]
 * ```
 */
export const down = <T, P extends IPriorityNode<T> = IPriorityNode<T>>(
  nodes: Indexable<P>,
  size: number
) => {
  return (
    node: P,
    index: number,
    comparer: IComparer<P>
  ): void => {
    let nodeIndex = index;
    const nodeValue = node.value;
    const nodePriority = node.priority;

    while (true) {
      const childIndex = child(nodeIndex);
      if (childIndex >= size) break;

      // Find the minimum priority child
      let minChildIndex = childIndex;
      let minChild = { ...nodes[childIndex] };

      const childIndexUpperBound = Math.min(childIndex + ARITY, size);
      for (let i = childIndex + 1; i < childIndexUpperBound; i++) {
        const currentChild = { ...nodes[i] };
        if (comparer(currentChild, minChild) < 0) {
          minChildIndex = i;
          minChild = currentChild;
        }
      }

      // If the current node is in the correct position, stop.
      if (comparer({ ...node, value: nodeValue, priority: nodePriority, nindex: nodeIndex }, minChild) <= 0) {
        break;
      }

      // Swap values
      nodes[nodeIndex] = { ...minChild, nindex: minChildIndex };
      nodeIndex = minChildIndex;
    }

    nodes[nodeIndex] = { ...node, value: nodeValue, priority: nodePriority, nindex: nodeIndex };
  }
}

/**
 * Moves a node down in a 4-ary heap with separate priority array to maintain the heap property.
 * 
 * @param nodes - The array representing the heap
 * @param priorities - The array representing the priorities
 * @param size - The size of the heap
 * @param node - The node to move down
 * @param index - The starting index of the node to move down
 * @param comparer - A function that compares two elements and returns a number:
 *                    negative if first < second,
 *                    zero if first = second,
 *                    positive if first > second
 */
export const downWithPriorities = (
  nodes: Indexable<number>,
  priorities: Indexable<number>,
  size: number
) => {
  return <P extends ITypedPriorityNode = ITypedPriorityNode>(
    node: P,
    index: number,
    comparer: IComparer<P>
  ): void => {
    let nodeIndex = index;
    const nodeValue = node.value;
    const nodePriority = node.priority;

    while (true) {
      const childIndex = child(nodeIndex);
      if (childIndex >= size) break;

      // Find the minimum priority child
      let minChildIndex = childIndex;
      let minChildValue = nodes[childIndex];
      let minChildPriority = priorities[childIndex];

      const childIndexUpperBound = Math.min(childIndex + ARITY, size);
      for (let i = childIndex + 1; i < childIndexUpperBound; i++) {
        if (comparer(
          { ...node, value: nodes[i], priority: priorities[i], nindex: i } as P,
          { ...node, value: minChildValue, priority: minChildPriority, nindex: minChildIndex } as P) < 0) {
          minChildIndex = i;
          minChildValue = nodes[i];
          minChildPriority = priorities[i];
        }
      }

      // If the current node is in the correct position, stop.
      if (comparer(
        { ...node, value: nodeValue, priority: nodePriority, nindex: nodeIndex } as P,
        { ...node, value: minChildValue, priority: minChildPriority, nindex: minChildIndex } as P) <= 0) {
        break;
      }

      // Swap values
      nodes[nodeIndex] = minChildValue;
      priorities[nodeIndex] = minChildPriority;
      nodeIndex = minChildIndex;
    }

    nodes[nodeIndex] = nodeValue;
    priorities[nodeIndex] = nodePriority;
  }
}

/**
 * Moves a node down in a 4-ary heap with separate priority and index arrays to maintain the heap property.
 * 
 * @param nodes - The array representing the heap
 * @param priorities - The array representing the priorities
 * @param indices - The array representing the stable indices
 * @param size - The size of the heap
 * @param node - The node to move down
 * @param index - The starting index of the node to move down
 * @param comparer - A function that compares two elements and returns a number:
 *                    negative if first < second,
 *                    zero if first = second,
 *                    positive if first > second
 */
export const downWithPrioritiesAndIndices = (
  nodes: Indexable<number>,
  priorities: Indexable<number>,
  indices: Indexable<bigint>,
  size: number
) => {
  return <P extends IStableTypedPriorityNode = IStableTypedPriorityNode>(
    node: P,
    index: number,
    comparer: IComparer<P>
  ) => {

    let nodeIndex = index;
    const nodeValue = node.value;
    const nodePriority = node.priority;
    const nodeSIndex = node.sindex;

    while (true) {
      const childIndex = child(nodeIndex);
      if (childIndex >= size) break;

      // Find the minimum priority child
      let minChildIndex = childIndex;
      let minChildValue = nodes[childIndex];
      let minChildPriority = priorities[childIndex];
      let minChildSIndex = indices[childIndex];

      const childIndexUpperBound = Math.min(childIndex + ARITY, size);
      for (let i = childIndex + 1; i < childIndexUpperBound; i++) {
        if (comparer(
          { ...node, value: nodes[i], priority: priorities[i], nindex: i, sindex: indices[i] } as P,
          { ...node, value: minChildValue, priority: minChildPriority, nindex: minChildIndex, sindex: minChildSIndex } as P) < 0) {
          minChildIndex = i;
          minChildValue = nodes[i];
          minChildPriority = priorities[i];
          minChildSIndex = indices[i];
        }
      }

      // If the current node is in the correct position, stop.
      if (comparer(
        { ...node, value: nodeValue, priority: nodePriority, nindex: nodeIndex, sindex: nodeSIndex } as P,
        { ...node, value: minChildValue, priority: minChildPriority, nindex: minChildIndex, sindex: minChildSIndex } as P) <= 0) {
        break;
      }

      // Swap values
      nodes[nodeIndex] = minChildValue;
      priorities[nodeIndex] = minChildPriority;
      indices[nodeIndex] = minChildSIndex;
      nodeIndex = minChildIndex;
    }

    nodes[nodeIndex] = nodeValue;
    priorities[nodeIndex] = nodePriority;
    indices[nodeIndex] = nodeSIndex;
  };
}

/**
 * Converts an array into a heap data structure using the provided comparison function.
 * The heapification process is performed in-place, modifying the original array.
 * 
 * @template T - The type of elements in the heap
 * @param nodes - The array to be converted into a heap
 * @param size - The number of elements in the heap
 * @param comparer - A function that compares two elements and returns:
 *   - A negative number if a should be higher in the heap than b
 *   - Zero if a and b are equal
 *   - A positive number if a should be lower in the heap than b
 * @returns {void}
 * 
 * @example
 * const numbers = [4, 1, 3, 2, 5];
 * heapify(numbers, numbers.length)((a, b) => a - b); // Creates a min-heap
 * // numbers is now arranged as a heap
 */
export const heapify = <T, P extends IPriorityNode<T> = IPriorityNode<T>>(
  nodes: Indexable<P>,
  size: number
) => {
  return (
    comparer: IComparer<P>
  ): void => {
    const lastParentWithChildren = parent(size - 1);
    for (let i = lastParentWithChildren; i >= 0; --i) {
      const node = nodes[i];
      down(nodes, size)(node, i, comparer);
    }
  }
}

/**
 * Converts an array with separate priority array into a heap data structure using the provided comparison function.
 * The heapification process is performed in-place, modifying the original arrays.
 * 
 * @param nodes - The array to be converted into a heap
 * @param priorities - The array representing the priorities
 * @param size - The number of elements in the heap
 * @param comparer - A function that compares two elements and returns:
 *   - A negative number if a should be higher in the heap than b
 *   - Zero if a and b are equal
 *   - A positive number if a should be lower in the heap than b
 * @returns {void}
 */
export const heapifyWithPriorities = (
  nodes: Indexable<number>,
  priorities: Indexable<number>,
  size: number
) => {
  return <P extends ITypedPriorityNode = ITypedPriorityNode>(
    comparer: IComparer<P>,
  ) => {
    const lastParentWithChildren = parent(size - 1);
    for (let i = lastParentWithChildren; i >= 0; --i) {
      const node: P = { value: nodes[i], priority: priorities[i], nindex: i } as const as P;
      downWithPriorities(nodes, priorities, size)(node, i, comparer);
    }
  }
}

/**
 * Converts an array with separate priority and index arrays into a heap data structure using the provided comparison function.
 * The heapification process is performed in-place, modifying the original arrays.
 * 
 * @param nodes - The array to be converted into a heap
 * @param priorities - The array representing the priorities
 * @param indices - The array representing the stable indices
 * @param size - The number of elements in the heap
 * @param comparer - A function that compares two elements and returns:
 *   - A negative number if a should be higher in the heap than b
 *   - Zero if a and b are equal
 *   - A positive number if a should be lower in the heap than b
 * @returns {void}
 */
export const heapifyWithPrioritiesAndIndices = (
  nodes: Indexable<number>,
  priorities: Indexable<number>,
  indices: Indexable<bigint>,
  size: number
) => {
  return <P extends IStableTypedPriorityNode = IStableTypedPriorityNode>(
    comparer: IComparer<P>,
  ) => {
    const lastParentWithChildren = parent(size - 1);
    for (let i = lastParentWithChildren; i >= 0; --i) {
      const node: P = { value: nodes[i], priority: priorities[i], nindex: i, sindex: indices[i] } as const as P;
      downWithPrioritiesAndIndices(nodes, priorities, indices, size)(node, i, comparer);
    }
  }
};

/**
 * Grows an array to a new size and copies the elements from the original array.
 * @param elements - The original array to copy
 * @param size - The new size of the array
 * @param backend - The constructor for the new array
 * @returns A new array with the copied elements
 */
export const growTyped = <T extends TypedArray | BigInt64Array>(
  elements: T,
  minCapacity: number,
  backend: T extends BigInt64Array ? BigInt64ArrayConstructor : TypedArrayConstructor,
  growFactor = 2,
  minimumGrow = 4,
  maxSize = 2 ** 32 - 1
): T => {
  console.assert(elements.length < minCapacity, 'Min capacity must be greater than the current capacity.');

  let newCapacity = growFactor * elements.length;

  if (newCapacity > maxSize) {
    newCapacity = maxSize;
  }

  newCapacity = Math.max(newCapacity, elements.length + minimumGrow);

  if (newCapacity < minCapacity) {
    newCapacity = minCapacity;
  }

  const newElements = new backend(newCapacity);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  newElements.set(elements as any);
  return newElements as T;
}
