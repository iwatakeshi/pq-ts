
/**
 * A type representing a comparison function that determines the order of two elements.
 * 
 * @typeParam T - The type of elements being compared
 * @param a - First element to compare
 * @param b - Second element to compare
 * @returns 
 * - A negative number if `a` should be sorted before `b`
 * - A positive number if `a` should be sorted after `b`
 * - Zero if `a` equals `b`
 */
export type IComparer<T> = (a: T, b: T) => number;

/**
 * A type representing a function that compares two values for equality.
 * @template T The type of values being compared
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns True if the values are considered equal, false otherwise
 */
export type IEqualityComparator<T> = (a: T, b: T) => boolean;


/**
 * Represents a node in a priority queue that extends a basic Node type with priority information.
 * 
 * @template T The type of value stored in the node
 * @property {number} priority The priority value of the node used for queue ordering
 */
export interface INode<T> {
  value: T;
  priority: number;
}

/**
 * Represents a generic priority queue interface.
 * Elements in the queue are ordered based on their priority values.
 * 
 * @template T - The type of elements stored in the priority queue
 * @interface IPriorityQueue
 */
export interface IPriorityQueue<
  T,
  Node extends INode<T> = INode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> {
  /** The number of elements in the queue */
  readonly count: number;
  /** The elements in the queue returned in an unordered manner */
  readonly values: T[];
  /** The heap array containing the elements */
  readonly heap: Node[];
  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - The priority of the element.
   * @returns True if the element was added, false otherwise.
   */
  enqueue(value: T, priority: number): boolean;
  /**
   * Removes and returns the element at the front of the queue.
   * @returns The element at the front of the queue, or undefined if the queue is empty.
   */
  dequeue(): T | undefined;
  /**
   * Removes and returns the element at the front of the queue.
   */
  pop(): Node | undefined;
  /** Removes all elements from the queue */
  peek(): T | undefined;
  /** Removes all elements from the queue */
  clear(): void;
  /**
   * Returns the elements in the queue in priority order.
   * @returns An array of elements in the queue.
   */
  toArray(): T[];
  /**
   * Creates a shallow copy of the priority queue.
   * @returns A new priority queue instance with the same elements.
   */
  clone(): IPriorityQueue<T>;
  /**
   * Removes the first occurrence of a specific element from the queue.
   * @param value - The element to remove.
   * @param comparer - An optional equality comparison function.
   */
  remove(value: T, comparer?: IEqualityComparator<T>): boolean;
  /**
   * Returns the index of the first occurrence of a specific element in the queue.
   * @param value - The element to search for.
   * @param dequeue - If true, searches for the element by dequeuing elements from a cloned queue, preserving the original queue's order.
   * @param comparer - An optional equality comparison function.
   */
  indexOf(value: T, dequeue?: boolean, comparer?: IEqualityComparator<T>): number;
  /**
   * Returns the priority of the element at the specified index.
   * @param index - The index of the element.
   * @param dequeue - If true, retrieves the priority by dequeuing elements from a cloned queue, preserving the original queue's order.
   * @returns The priority of the element if it exists, or `Number.MAX_VALUE` if the index is out of range.
   */
  priorityAt(index: number, dequeue?: boolean): number;
  /**
   * Determine whether the queue is empty 
   */
  isEmpty(): boolean;
  /**
   * Returns a string representation of the queue.
   */
  toString(): string;
  /**
   * The comparison function used to determine the order of elements in the queue.
   */
  comparer?: Comparer
}

/**
 * Represents a node in a stable heap data structure.
 * Extends the base INode interface with an additional index property for stability.
 * 
 * @template T The type of value stored in the node
 * @interface StableHeapNode
 * @extends {INode<T>}
 * @property {bigint} index An index used to maintain insertion order stability
 */
export interface StableHeapNode<T> extends INode<T> {
  index: bigint;
}