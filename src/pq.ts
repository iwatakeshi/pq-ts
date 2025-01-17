import type { IPriorityQueue, IComparer, INode, IEqualityComparator } from "./types.ts";
import { up, down, heapify } from "./primitive.ts";

export class PriorityQueue<
  T,
  Node extends INode<T> = INode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> implements IPriorityQueue<T, Node> {
  /**
   * The elements in the queue used internally.
   * @protected
   */
  protected _elements: Node[] = [];
  /**
   * The compare function used internally.
   * @protected
   */
  protected _comparer?: Comparer;
  /**
   * The size of elements in the queue used internally.
   * @protected
   */
  protected _size = 0;
  /**
   * The bound compare function.
   * @protected
   */
  protected readonly _compare: (a: Node, b: Node) => number;

  /**
   * Creates a new instance of a priority queue.
   */
  constructor();
  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(
    elements: Node[],
    comparer?: Comparer
  );
  /**
   * Creates a new instance of a priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  constructor(
    queue: PriorityQueue<T, Node>,
    comparer?: Comparer
  );
  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(
    elements: T[],
    comparer?: IComparer<T>
  );
  constructor(
    elements?: T[] | PriorityQueue<T, Node>,
    comparer?: Comparer
  ) {
    if (elements instanceof PriorityQueue) {
      this._elements = [...elements._elements];
      this._size = elements._size;
      this._comparer = elements._comparer as Comparer;
    } else if (Array.isArray(elements)) {
      for (const element of elements) {
        this.enqueue(element, 0);
      }
      this._size = elements.length;
      this._comparer = comparer;
    } else {
      this._comparer = comparer;
    }

    this._compare = this.compare.bind(this);
    heapify(this._size, this._elements, this._compare);
  }

  /**
   * Compares two nodes based on their priority values.
   * @param a - The first node to compare
   * @param b - The second node to compare
   * @returns - A negative number if the first node has a lower priority,
   * @protected
   */
  protected compare(a: Node, b: Node): number {
    if (this._comparer) return this._comparer(a, b);
    return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
  }
  /**
   * Removes the root node from the heap.
   * @returns - The removed node.
   * @protected
   */
  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    const lastNode = this._elements[--this._size];
    if (this._size > 0) {
      this._elements[0] = lastNode;
      down(0, this._size, this._elements, this._compare);
    }
    this._elements.pop();
  }

  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - The priority of the element.
   * @returns - True if the element was added, false otherwise.
   */
  enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;

    this._elements.push({ value, priority } as Node);
    up(this._size++, this._elements, this._compare);

    return true;
  }

  /**
   * Removes and returns the element at the front of the queue.
   * @returns - The element at the front of the queue, or undefined if the queue is empty.
   */
  dequeue(): T | undefined {
    return this.pop()?.value;
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * @returns - The element at the front of the queue, or undefined if the queue is empty.
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this._elements[0].value;
  }
  /**
   * Removes and returns the element at the front of the queue.
   * @returns - The element at the front of the queue, or undefined if the queue is empty.
   */
  pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element;
  }
  /**
   * Removes all elements from the queue.
   */
  clear(): void {
    this._elements = [];
    this._size = 0;
  }

  /**
   * The number of elements in the queue.
   * @returns - The number of elements in the queue.
   * @readonly
   */
  get count(): number {
    return this._size;
  }

  /**
   * The elements in the queue returned in an unordered manner.
   * @returns - The elements in the queue.
   * @readonly
   */
  get values(): T[] {
    return this._elements.map((node) => node.value);
  }
  /**
   * The heap array containing the elements.
   * @returns - The heap array containing the elements.
   * @readonly
   */
  get heap(): Node[] {
    return this._elements;
  }

  /**
   * Returns the elements in the queue in priority order.
   * @returns - An array of elements in the queue.
   */
  toArray(): T[] {
    const clone = this.clone();
    const result: T[] = [];
    while (!clone.isEmpty()) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      result.push(clone.dequeue()!);
    }
    return result;
  }

  /**
   * Returns true if the queue is empty, false otherwise.
   * @returns - True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Removes the first occurrence of a specific element from the queue.
   * @param value - The element to remove.
   * @param comparer - An optional equality comparison function.
   * @returns - True if the element was removed, false otherwise.
   */
  remove(value: T, comparer: IEqualityComparator<T> = (a, b) => a === b): boolean {
    const index = this._elements.findIndex((node) => comparer(node.value, value));
    if (index === -1) return false;

    const removedElement = this._elements[index];
    const newSize = --this._size;

    if (index < newSize) {
      const lastNode = this._elements[newSize];
      this._elements[index] = lastNode;
      if (this._compare(lastNode, removedElement) < 0) {
        up(index, this._elements, this._compare);
      } else {
        down(index, newSize, this._elements, this._compare);
      }
    }

    this._elements.pop();
    return true;
  }
  /**
   * Returns the index of the first occurrence of a specific element in the queue.
   * @param value - The element to search for.
   * @param dequeue - If true, searches for the element by dequeuing elements from a cloned queue, preserving the original queue's order.
   * @param comparer - An optional equality comparison function.
   * @returns - The index of the element if it exists, or -1 if the element is not found.
   */
  indexOf(value: T, dequeue?: boolean, comparer: IEqualityComparator<T> = (a, b) => a === b): number {
    if (!dequeue) return this._elements.findIndex((node) => comparer(node.value, value));
    const clone = this.clone();
    let index = 0;
    while (!clone.isEmpty()) {
      if (comparer(clone.dequeue() as T, value)) return index;
      index++;
    }

    return -1;
  }

  /**
   * Returns the priority of the element at the specified index.
   * @param index - The index of the element.
   * @param dequeue - If true, retrieves the priority by dequeuing elements from a cloned queue, preserving the original queue's order.
   * @returns - The priority of the element if it exists, or `Number.MAX_VALUE` if the index is out of range.
   */
  priorityAt(index: number, dequeue = false): number {
    if (index >= this._size) return Number.MAX_VALUE;
    if (!dequeue) return this._elements[index].priority;
    const clone = this.clone();
    let i = index;
    // Once we dequeue, we don't really know the index of the element
    // so we will have to dequeue until we find the element
    while (!clone.isEmpty()) {
      const node = clone.pop();
      if (i-- === 0) return node?.priority ?? Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  }

  /**
   * Creates a shallow copy of the priority queue.
   * @returns - A new priority queue instance with the same elements.
   */
  clone(): this {
    return new PriorityQueue(this, this._comparer) as this;
  }

  /**
   * Returns a string representation of the queue.
   * @returns - A string representation of the queue.
   */
  toString(): string {
    return this.toArray().join(", ");
  }
  /**
   * Iterates over the queue in priority order.
   * @returns - An iterator for the queue.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.toArray()[Symbol.iterator]();
  }

  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  static from<T, Node extends INode<T> = INode<T>>(
    elements: INode<T>[],
    comparer?: IComparer<INode<T>>
  ): PriorityQueue<T, Node>;
  /**
   * Creates a new instance of a priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  static from<T, Node extends INode<T> = INode<T>>(
    queue: PriorityQueue<T, Node>,
    comparer?: IComparer<INode<T>>
  ): PriorityQueue<T, Node>;
  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  static from<T, Node extends INode<T> = INode<T>>(
    elements: T[],
    comparer?: IComparer<T>
  ): PriorityQueue<T, Node>;
  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   * @returns - A new priority queue instance.
   */
  static from<T, Node extends INode<T> = INode<T>>(
    elements?: T[] | PriorityQueue<T, Node>,
    comparer?: IComparer<T>
  ): PriorityQueue<T, Node> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new PriorityQueue(elements as any, comparer as any);
  }
}