import type { IComparer, IEqualityComparator, TypedArray, TypedArrayConstructor, IPriorityQueueLike, INode, IPriorityNode } from "./types.ts";
import { up, down, heapify, grow, LOG2_ARITY, upWithPriorities as moveUpWithPriorities, downWithPriorities, heapifyWithPriorities } from "./primitive.ts";

export class FlatPriorityQueue<
  T extends number = number,
  Node extends IPriorityNode<T> = IPriorityNode<T>,
  Comparer extends IComparer<T> = IComparer<number>,
  Heap extends TypedArray = Uint32Array,
> implements IPriorityQueueLike<T, Node> {
  protected _elements: Heap;
  protected _priorities: typeof this._elements;
  protected _size = 0;
  protected compare?: Comparer;
  protected _backend: TypedArrayConstructor<Heap>;
  protected readonly _defaultSize: number;

  /**
   * Creates a new instance of a flat priority queue.
   * @param backend - The typed array constructor for the elements.
   * @param size - The initial size of the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(backend: TypedArrayConstructor<Heap>, size: number, comparer?: Comparer);
  /**
   * Creates a new instance of a flat priority queue.
   * @param elements - The elements to add to the queue.
   * @param priorities - The priorities of the elements.
   * @param backend - The typed array constructor for the elements.
   * @param comparer - An optional comparison function.
   */
  constructor(elements: T[], priorities: number[], backend: TypedArrayConstructor<Heap>, comparer?: Comparer);
  /**
   * Creates a new instance of a flat priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  constructor(queue: FlatPriorityQueue<T, Node, Comparer, Heap>, comparer?: Comparer);
  constructor(
    backendOrElements: TypedArrayConstructor<Heap> | T[] | FlatPriorityQueue<T, Node, Comparer, Heap>,
    sizeOrPriorities?: number | number[],
    comparerOrBackend?: Comparer | TypedArrayConstructor<Heap>,
    comparer?: Comparer
  ) {
    const min: IComparer<number> = (a, b) => {
      return a - b;
    }
    if (Array.isArray(backendOrElements) && Array.isArray(sizeOrPriorities)) {
      const elements = backendOrElements;
      const priorities = sizeOrPriorities;
      const backend = comparerOrBackend as TypedArrayConstructor<Heap>;
      this._backend = backend;
      this._defaultSize = elements.length;
      this._elements = new backend(elements.length);
      this._priorities = new backend(priorities.length);
      this.compare = comparer;
      if (elements.length !== priorities.length) {
        throw new Error("[FlatPriorityQueue] Elements and priorities are out of sync.");
      }
      for (let i = 0; i < elements.length; i++) {
        this._elements[i] = elements[i];
        this._priorities[i] = priorities[i];
      }
      this._size = elements.length;
      heapifyWithPriorities(this._size, this._elements, this.compare as Comparer, this._priorities);
    } else if (typeof backendOrElements === "function" && typeof sizeOrPriorities === "number") {
      const backend = backendOrElements;
      const size = sizeOrPriorities;
      this._backend = backend;
      this._defaultSize = size;
      this._elements = new backend(size);
      this._priorities = new backend(size);
      this.compare = comparerOrBackend as Comparer;
    } else if (backendOrElements instanceof FlatPriorityQueue) {
      const queue = backendOrElements;
      this._backend = queue._backend;
      this._defaultSize = queue._defaultSize;
      this._elements = new this._backend(queue._elements.length);
      this._priorities = new this._backend(queue._priorities.length);
      this.compare = comparer ?? queue.compare;
      this._elements.set(queue._elements);
      this._priorities.set(queue._priorities);
      this._size = queue._size;
    } else {
      throw new Error("[FlatPriorityQueue] Invalid constructor arguments.");
    }

    if (!this.compare) {
      this.compare = min as Comparer;
    }
  }

  get heap(): Node[] {
    return Array
      .from(this._elements)
      .map((value, index) => ({ value, priority: this._priorities[index] } as Node));
  }

  pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const value = this._elements[0];
    const priority = this._priorities[0];
    this.removeRootNode();
    return { value, priority } as Node;
  }

  toArray(): T[] {
    const clone = this.clone();
    const result: T[] = [];
    while (!clone.isEmpty()) {
      result.push(clone.dequeue() as T);
    }
    return result;
  }

  clone(): this {
    const clone = new FlatPriorityQueue<T, Node, Comparer, Heap>(this);
    return clone as this;
  }

  remove(value: T, comparer: IEqualityComparator<T> = (a, b) => a === b): boolean {
    const index = this._elements.findIndex((v) => comparer(value, v as T));
    if (index === -1) return false;  // Element not found.

    const newSize = --this._size;

    // If the element is not the last one, replace it with the last element.
    if (index < newSize) {
      const lastElement = this._elements[newSize];

      // Swap the element with the last element
      this._elements[index] = lastElement;
      this._elements[newSize] = 0; // Remove reference to the last element

      // If the last element should be "bubbled up" (preserve heap property)
      if (this.compare && this.compare(this._priorities[newSize], this._priorities[index], [newSize, index]) < 0) {
        moveUpWithPriorities(index, this._elements, this.compare as Comparer, this._priorities);
      } else {
        // Otherwise, it should "bubble down"
        downWithPriorities(index, newSize, this._elements, this.compare as Comparer, this._priorities);
      }
    } else {
      // If the element is the last one, just clear it
      this._elements[index] = 0;
      this._priorities[index] = 0;
    }
    return true;
  }

  indexOf(value: T, dequeue = false, comparer: IEqualityComparator<T> = (a, b) => a === b): number {
    if (!dequeue) return this._elements.findIndex((v) => comparer?.(v as T, value));
    const clone = this.clone();
    let index = 0;
    while (!clone.isEmpty()) {
      if (comparer?.(clone.dequeue() as T, value)) return index;
      index++;
    }
    return -1;
  }

  priorityAt(index: number, dequeue = false): number {
    if (index >= this._size) return Number.MAX_VALUE;
    if (!dequeue) return this._priorities[index];
    const clone = this.clone();
    let i = index;
    // We don't really know the index of the element
    // so we will have to dequeue until we find the element
    while (!clone.isEmpty()) {
      const node = clone.pop();
      if (i-- === 0) return node?.priority ?? Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  }

  toString(): string {
    return this.toArray().join(", ");
  }

  enqueue(value: T, priority: number): boolean {
    const currentSize = this._size;
    if (currentSize >= this._elements.length) {
      this.grow(this._elements.length * 2);
    }
    this._size = currentSize + 1;
    moveUpWithPriorities([value, priority], currentSize, this._elements as Heap, this.compare as Comparer, this._priorities);
    return true;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element as T;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this._elements[0] as T;
  }

  clear(): void {
    this._elements = new this._backend(this._defaultSize);
    this._priorities = new this._backend(this._defaultSize);
    this._size = 0;
  }

  get count(): number {
    return this._size;
  }

  get values(): T[] {
    return Array.from(this._elements) as T[];
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    if (this._elements.length !== this._priorities.length) {
      throw new Error("[FlatPriorityQueue] Elements and priorities are out of sync.");
    }
    this._size = Math.max(0, this._size - 1);
    if (this._size > 0) {
      const lastNode = this._elements[this._size];
      const lastPriority = this._priorities[this._size];
      this._elements[0] = lastNode;
      this._priorities[0] = lastPriority;
      downWithPriorities(0, this._size, this._elements, this.compare as Comparer, this._priorities);
    }
    this._elements[this._size] = 0;
    this._priorities[this._size] = 0;
  }

  protected grow(newSize: number): void {
    this._elements = grow(this._elements, newSize, this._backend);
    this._priorities = grow(this._priorities, newSize, this._backend);
  }
  /**
   * Iterates over the queue in priority order.
   * @returns - An iterator for the queue.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.toArray()[Symbol.iterator]();
  }
}