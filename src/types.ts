
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

export interface IQueue<T> {
  /** The number of elments in the queue */
  readonly count: number;
  /** Determine whether the queue is empty */
  readonly isEmpty: boolean;
  /** The elements in the queue returned in an unordered manner */
  readonly values: T[];
  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - Optional priority of the element.
   * @returns True if the element was added, false otherwise.
   */
  enqueue(value: T, priority?: number): boolean;
  /**
   * Removes and returns the element at the front of the queue.
   * @returns The element at the front of the queue, or undefined if the queue is empty.
   */
  dequeue(): T | undefined;
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
   * Returns a shallow copy of the queue.
   * @returns A new queue instance with the same elements.
   */
  clone(): IQueue<T>;
  /**
   * Returns a string representation of the queue.
   */
  toString(): string;
}


/**
 * Represents a node in a priority queue that extends a basic Node type with priority information.
 * 
 * @template T The type of value stored in the node
 * @property {number} priority The priority value of the node used for queue ordering
 */
export type HeapNode<T> = { value: T, priority: number };

/**
 * Represents a generic priority queue interface.
 * Elements in the queue are ordered based on their priority values.
 * 
 * @template T - The type of elements stored in the priority queue
 * @interface IPriorityQueue
 * @extends {IQueue<HeapNode<T>>}
 */
export interface IPriorityQueue<T> extends IQueue<T> {
  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - The priority of the element.
   * @returns True if the element was added, false otherwise.
   */
  enqueue(value: T, priority: number): boolean;
  /**
   * Creates a shallow copy of the priority queue.
   */
  clone(): IPriorityQueue<T>;
  /**
   * Removes the first occurrence of a specific element from the queue.
   * @param value - The element to remove.
   */
  remove(value: T): boolean;
  /**
   * The comparison function used to determine the order of elements in the queue.
   */
  comparer?: IComparer<HeapNode<T>>;
}