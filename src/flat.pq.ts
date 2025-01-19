import type { IComparer, IEqualityComparator, TypedArray, TypedArrayConstructor, IPriorityQueueLike, IPriorityNode, ITypedPriorityNode } from "./types.ts";
import { grow, upWithPriorities as moveUpWithPriorities, downWithPriorities, heapifyWithPriorities, upWithPriorities } from "./primitive.ts";

export class TypedPriorityQueue<
  Node extends ITypedPriorityNode = ITypedPriorityNode,
  Comparer extends IComparer<Node> = IComparer<Node>,
> implements IPriorityQueueLike<number> {
  protected _elements: TypedArray;
  protected _priorities: TypedArray;
  protected _size = 0;
  protected compare?: Comparer;
  protected _backend: TypedArrayConstructor;
  protected readonly _defaultSize: number;

  protected readonly _up = (node: Node, index: number) => {
    return upWithPriorities(this._elements, this._priorities)(
      node, index, this.compare as Comparer
    );
  }

  protected readonly _down = (node: Node, index: number) => {
    return downWithPriorities(this._elements, this._priorities, this._size)(
      node,
      index, 
      this.compare as Comparer
    );
  }

  protected readonly _heapify = (size: number) => {
    return heapifyWithPriorities(this._elements, this._priorities, size)(
      this.compare as Comparer
    );
  }

  /**
   * Creates a new instance of a flat priority queue.
   * @param backend - The typed array constructor for the elements.
   * @param size - The initial size of the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(backend: TypedArrayConstructor, size: number, comparer?: Comparer);
  /**
   * Creates a new instance of a flat priority queue.
   * @param elements - The elements to add to the queue.
   * @param priorities - The priorities of the elements.
   * @param backend - The typed array constructor for the elements.
   * @param comparer - An optional comparison function.
   */
  constructor(elements: number[], priorities: number[], backend: TypedArrayConstructor, comparer?: Comparer);
  /**
   * Creates a new instance of a flat priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  constructor(queue: TypedPriorityQueue<Node, Comparer>, comparer?: Comparer);
  constructor(
    backendOrElements: TypedArrayConstructor | number[] | TypedPriorityQueue<Node, Comparer>,
    sizeOrPriorities?: number | number[],
    comparerOrBackend?: Comparer | TypedArrayConstructor,
    comparer?: Comparer
  ) {
    const min: IComparer<Node> = (a, b) => {
      return a.priority - b.priority;
    }
    if (Array.isArray(backendOrElements) && Array.isArray(sizeOrPriorities)) {
      const elements = backendOrElements;
      const priorities = sizeOrPriorities;
      const backend = comparerOrBackend as TypedArrayConstructor;
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
      this._heapify(elements.length);
    } else if (typeof backendOrElements === "function" && typeof sizeOrPriorities === "number") {
      const backend = backendOrElements;
      const size = sizeOrPriorities;
      this._backend = backend;
      this._defaultSize = size;
      this._elements = new backend(size);
      this._priorities = new backend(size);
      this.compare = comparerOrBackend as Comparer;
    } else if (backendOrElements instanceof TypedPriorityQueue) {
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

  get heap(): IPriorityNode<number>[] {
    return Array
      .from(this._elements)
      .map((value, index) => ({ value, priority: this._priorities[index] }));
  }

  pop(): IPriorityNode<number> | undefined {
    if (this.isEmpty()) return undefined;
    const value = this._elements[0];
    const priority = this._priorities[0];
    this.removeRootNode();
    return { value, priority };
  }

  toArray(): number[] {
    const clone = this.clone();
    const result: number[] = [];
    while (!clone.isEmpty()) {
      result.push(clone.dequeue() as number);
    }
    return result;
  }

  clone(): this {
    const clone = new TypedPriorityQueue<Node, Comparer>(this);
    return clone as this;
  }

  remove(value: number, comparer: IEqualityComparator<number> = (a, b) => a === b): boolean {
    if (!this.compare) {
      console.log("[FlatPriorityQueue] No comparison function provided.");
      return false;
    }
    const index = this._elements.findIndex((v) => comparer(value, v));
    if (index < 0) return false;
    const [removedElement, removedPriority] = [this._elements[index], this._priorities[index]];
    const newSize = --this._size;
    const removedNode = {
      value: removedElement,
      priority: removedPriority,
      index: index
    } as const as Node;

    // If the element is not the last one, replace it with the last element.
    if (index < newSize) {
      const lastNode = {
        value: this._elements[newSize] as number,
        priority: this._priorities[newSize],
        index: newSize
      } as const as Node;

      // If the last element should be "bubbled up" (preserve heap property)
      if (this.compare(removedNode, lastNode) < 0) {
        this._up(lastNode, index);
      } else {
        // Otherwise, it should "bubble down"
        this._down(lastNode, index);
      }
    }

    this._elements[newSize] = 0;


    return true;
  }

  indexOf(value: number, dequeue = false, comparer: IEqualityComparator<number> = (a, b) => a === b): number {
    if (!dequeue) return this._elements.findIndex((v) => comparer?.(v, value));
    const clone = this.clone();
    let index = 0;
    while (!clone.isEmpty()) {
      if (comparer?.(clone.dequeue() as number, value)) return index;
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

  enqueue(value: number, priority: number): boolean {
    const currentSize = this._size;
    if (currentSize >= this._elements.length) {
      this.grow(this._elements.length * 2);
    }
    this._size = currentSize + 1;
    this._up({ value, priority } as const as Node, currentSize);
    return true;
  }

  dequeue(): number | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element;
  }

  peek(): number | undefined {
    return this.isEmpty() ? undefined : this._elements[0];
  }

  clear(): void {
    this._elements = new this._backend(this._defaultSize);
    this._priorities = new this._backend(this._defaultSize);
    this._size = 0;
  }

  get count(): number {
    return this._size;
  }

  get values(): number[] {
    return Array.from(this._elements) as number[];
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    if (this._elements.length !== this._priorities.length) {
      throw new Error("[FlatPriorityQueue] Elements and priorities are out of sync.");
    }
    
    const lastNodeIndex = --this._size;
    
    if (lastNodeIndex > 0) {
      // Move last node to root first
      this._elements[0] = this._elements[lastNodeIndex];
      this._priorities[0] = this._priorities[lastNodeIndex];
      
      // Down heapify from root
      const rootNode: Node = {
        value: this._elements[0] as number,
        priority: this._priorities[0] as number,
        index: 0
      } as const as Node;
      
      this._down(rootNode, 0);
    }

    // Clear last position
    this._elements[lastNodeIndex] = 0;
    this._priorities[lastNodeIndex] = 0;
  }

  protected grow(newSize: number): void {
    this._elements = grow(this._elements, newSize, this._backend);
    this._priorities = grow(this._priorities, newSize, this._backend);
  }
  /**
   * Iterates over the queue in priority order.
   * @returns - An iterator for the queue.
   */
  [Symbol.iterator](): Iterator<number> {
    return this.toArray()[Symbol.iterator]();
  }
}