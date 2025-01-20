import type { IPriorityQueue, IComparer, IPriorityNode, IEqualityComparator } from "./types.ts";
import { up, down, heapify } from "./primitive.ts";

export class PriorityQueue<
  T,
  Node extends IPriorityNode<T> = IPriorityNode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> implements IPriorityQueue<T, Node> {
  private static readonly GROW_FACTOR = 2;
  private static readonly MINIMUM_GROW = 4;
  private static readonly MAX_SIZE = 2 ** 32 - 1;

  /**
   * The elements in the queue used internally.
   * @protected
   */
  protected _elements: Node[] = [];
  /**
   * The compare function used internally.
   */
  compare: Comparer;
  /**
   * The size of elements in the queue used internally.
   * @protected
   */
  protected _size = 0;

  protected _up = (node: Node, index: number) => {
    return up(this._elements)(
      node,
      index,
      this.compare as Comparer
    )
  }

  protected _down = (node: Node, index: number) => {
    return down(this._elements, this._size)(
      node,
      index,
      this.compare as Comparer
    )
  }

  protected _heapify = (size: number) => {
    return heapify(this._elements, size)(this.compare as Comparer);
  }

  protected _grow(
    minCapacity: number,
  ) {
    console.assert(this._elements.length < minCapacity, 'Min capacity must be greater than the current capacity.');

    let newCapacity = PriorityQueue.GROW_FACTOR * this._elements.length;

    if (newCapacity > PriorityQueue.MAX_SIZE) {
      newCapacity = PriorityQueue.MAX_SIZE;
    }

    newCapacity = Math.max(newCapacity, this._elements.length + PriorityQueue.MINIMUM_GROW);

    if (newCapacity < minCapacity) {
      newCapacity = minCapacity;
    }

    this._elements.length = newCapacity;
  }

  /**
   * Creates a new instance of a priority queue.
   */
  constructor();
  /**
   * Creates a new instance of a priority queue.
   * @param comparer - An optional comparison function.
   */
  constructor(compare: Comparer);
  /**
   * Creates a new instance of a priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  constructor(
    queue: PriorityQueue<T, Node, Comparer>,
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
    elements?: T[] | PriorityQueue<T, Node, Comparer>,
    comparer?: Comparer
  ) {
    const min = (a: Node, b: Node) => a.priority - b.priority;
    if (elements instanceof PriorityQueue) {
      const self = elements as PriorityQueue<T, Node, Comparer>;
      this._elements = [...self._elements];
      this._size = self._size;
      this.compare = self.compare ?? min as Comparer;
    } else if (Array.isArray(elements)) {
      this.compare = comparer ?? min as Comparer;
      for (const element of elements) {
        this.enqueue(element, 0);
      }
      this._size = elements.length;
    } else if (typeof elements === "function") {
      this.compare = elements ?? min as Comparer;
    } else {
      this.compare = comparer ?? min as Comparer;
    }
    console.assert(this.compare, "No comparison function provided.");

    this._heapify(this._size);
  }

  /**
   * Removes the root node from the heap.
   * @returns - The removed node.
   * @protected
   */
  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    const lastNodeIndex = --this._size;

    if (lastNodeIndex > 0) {
      // Store last node
      const lastNode = this._elements[lastNodeIndex];
      // Move last node to root and down heapify
      this._down(lastNode, 0);
    }

    // Remove last element
    this._elements[lastNodeIndex] = undefined as unknown as Node;
  }

  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - The priority of the element.
   * @returns - True if the element was added, false otherwise.
   */
  enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;
    const currentSize = this._size;
    if (this._elements.length === currentSize) {
      this._grow(currentSize + 1);
    }
    const element = { value, priority, nindex: currentSize } as Node;
    this._size = currentSize + 1;
    this._up(element, currentSize);

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
    const results: T[] = [];
    for (let i = 0; i < this._size; i++) {
      results.push(this._elements[i].value);
    }
    return results;
  }
  /**
   * The heap array containing the elements.
   * @returns - The heap array containing the elements.
   * @readonly
   */
  get heap(): Node[] {
    return this._elements
  }

  /**
   * Returns the elements in the queue in priority order.
   * @returns - An array of elements in the queue.
   */
  toArray(): T[] {
    const clone = this.clone();
    const result: T[] = [];
    while (!clone.isEmpty()) {
      result.push(clone.dequeue() as T);
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
      if (this.compare(lastNode, removedElement) < 0) {
        this._down(lastNode, index);
      } else {
        this._up(lastNode, index);
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
    if (!dequeue) return this._elements.findIndex((node: Node | undefined) => node && comparer(node.value, value));
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
    if (!dequeue || index === 0) return this._elements[index].priority;
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
    return new PriorityQueue(this, this.compare) as this;
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
   * Creates a new instance of a priority queue from another queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  static from<
    T,
    Node extends IPriorityNode<T>,
    Comparer extends IComparer<Node>,
    Self extends typeof PriorityQueue<T, Node, Comparer>
  >(
    this: Self,
    queue: PriorityQueue<T, Node, Comparer>,
    comparer?: Comparer
  ): InstanceType<Self>;
  /**
   * Creates a new instance of a priority queue from an array of elements.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  static from<
    T,
    Node extends IPriorityNode<T>,
    Comparer extends IComparer<Node>,
    Self extends typeof PriorityQueue<T, Node, Comparer>
  >(
    this: Self,
    elements: T[],
    comparer?: Comparer
  ): InstanceType<Self>;
  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   * @returns - A new priority queue instance.
   */
  static from<
    T,
    Node extends IPriorityNode<T>,
    Comparer extends IComparer<Node>,
    Self extends typeof PriorityQueue<T, Node, Comparer>
  >(
    elements?: T[] | PriorityQueue<T, Node, Comparer>,
    comparer?: Comparer
  ): InstanceType<Self> {
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new this(elements as any, comparer) as InstanceType<Self>;
  }
}