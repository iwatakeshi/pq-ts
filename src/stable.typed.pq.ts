import type { IComparer, IEqualityComparator, TypedArray, TypedArrayConstructor, IPriorityQueueLike, IPriorityNode, ITypedPriorityNode, IStableTypedPriorityNode } from "./types.ts";
import { grow, upWithPriorities as moveUpWithPriorities, downWithPriorities, heapifyWithPriorities, upWithPriorities, upWithPrioritiesAndIndices, downWithPrioritiesAndIndices, heapifyWithPrioritiesAndIndices } from "./primitive.ts";
import { TypedPriorityQueue } from "./typed.pq.ts";

export class StableTypedPriorityQueue<
  Node extends IStableTypedPriorityNode = IStableTypedPriorityNode,
  Comparer extends IComparer<Node> = IComparer<Node>,
> extends TypedPriorityQueue<Node, Comparer> {
  protected _indices: BigInt64Array = new BigInt64Array(this._defaultSize);
  protected _sindex = 0n;
  protected _size = 0;
  protected compare?: Comparer;

  protected readonly _up = (node: Node, index: number) => {
    return upWithPrioritiesAndIndices(this._elements, this._priorities, this._indices)(
      node, index, this.compare as Comparer
    );
  }

  protected readonly _down = (node: Node, index: number) => {
    return downWithPrioritiesAndIndices(this._elements, this._priorities, this._indices, this._size)(
      node,
      index, 
      this.compare as Comparer
    );
  }

  protected readonly _heapify = (size: number) => {
    return heapifyWithPrioritiesAndIndices(this._elements, this._priorities, this._indices, size)(
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
  constructor(queue: StableTypedPriorityQueue<Node, Comparer>, comparer?: Comparer);
  constructor(
    backendOrElements: TypedArrayConstructor | number[] | StableTypedPriorityQueue<Node, Comparer>,
    sizeOrPriorities?: number | number[],
    comparerOrBackend?: Comparer | TypedArrayConstructor,
    comparer?: Comparer
  ) {
    if (backendOrElements instanceof StableTypedPriorityQueue) {
      const queue = backendOrElements;
      super(
        Array.from(queue._elements), 
        Array.from(queue._priorities), 
        queue._backend, 
        comparer ?? queue.compare
      );
      this._indices.set(queue._indices);
      this._sindex = queue._sindex;
      this._size = queue._size;
    } else if (Array.isArray(backendOrElements)) {
      // Elements array constructor
      super(backendOrElements, sizeOrPriorities as number[], comparerOrBackend as TypedArrayConstructor, comparer);
      this._indices = new BigInt64Array(this._defaultSize);
      this._sindex = 0n;
    } else {
      // Backend and size constructor
      super(backendOrElements, sizeOrPriorities as number, comparerOrBackend as Comparer);
      this._indices = new BigInt64Array(this._defaultSize);
      this._sindex = 0n;
    }

    // Set default comparer if none provided
    if (!this.compare) {
      this.compare = ((a: Node, b: Node) => {
        if (a.priority === b.priority) {
          return a.sindex < b.sindex ? -1 : 1;
        }
        return a.priority - b.priority;
      }) as Comparer;
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
    const clone = new StableTypedPriorityQueue<Node, Comparer>(this);
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

  override enqueue(value: number, priority: number): boolean {
    const currentSize = this._size;
    if (currentSize >= this._elements.length) {
      this.grow(this._elements.length * 2);
    }
    this._size = currentSize + 1;
    this._indices[currentSize] = this._sindex++;
  
    this._up({ value, priority, sindex: this._indices[currentSize] } as const as Node, currentSize);
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
      this._indices[0] = this._indices[lastNodeIndex];
      
      // Down heapify from root
      const rootNode: Node = {
        value: this._elements[0] as number,
        priority: this._priorities[0] as number,
        index: 0,
        sindex: this._indices[0]
      } as const as Node;
      
      this._down(rootNode, 0);
    }

    // Clear last position
    this._elements[lastNodeIndex] = 0;
    this._priorities[lastNodeIndex] = 0;
    this._indices[lastNodeIndex] = 0n;
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