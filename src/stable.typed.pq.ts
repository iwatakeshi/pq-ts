import type { IComparer, IEqualityComparator, IStableNode, TypedArrayConstructor } from "./types.ts";
import { growTyped, upWithPrioritiesAndIndices, heapifyWithPrioritiesAndIndices, downWithPriorities } from "./primitive.ts";
import { growTyped, upWithPriorities, downWithPrioritiesAndIndices, heapifyWithPrioritiesAndIndices } from "./primitive.ts";
import { TypedPriorityQueue } from "./typed.pq.ts";

export class StableTypedPriorityQueue<
  Node extends IStableNode<number> = IStableNode<number>,
  Comparer extends IComparer<Node> = IComparer<Node>,
> extends TypedPriorityQueue<Node, Comparer> {
  protected _indices: BigInt64Array;
  protected _sindex = 0n;

  protected readonly _up = (node: Node, index: number) => {
    return upWithPriorities(this._elements, this._priorities, this._indices)(
      node, index, this.compare as Comparer
    );
  }

  protected readonly _down = (node: Node, index: number) => {
    return downWithPriorities(this._elements, this._priorities, this._size, this._indices)(
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
   * Creates a new instance of a stable priority queue backed by a typed array.
   * @param backend - The typed array constructor for the elements.
   * @param size - The initial size of the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(backend: TypedArrayConstructor, size: number, comparer?: Comparer) {
    const min = (a: Node, b: Node) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return a.sindex < b.sindex ? -1 : 1;
    }
    super(backend, size, comparer ?? min as Comparer);
    this._indices = new BigInt64Array(this._defaultSize);
  }

  get heap(): Node[] {
    return Array
      .from(this._elements)
      .map((value, index) => ({
        value, priority: this._priorities[index], nindex: index
      }) as Node);
  }

  pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const value = this._elements[0];
    const priority = this._priorities[0];
    const sindex = this._indices[0];
    this.removeRootNode();
    return { value, priority, nindex: 0, sindex, } as Node;
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
    const clone = new StableTypedPriorityQueue<Node, Comparer>(this._backend, this._defaultSize, this.compare);
    clone._elements.set(this._elements);
    clone._priorities.set(this._priorities);
    clone._indices.set(this._indices);
    clone._size = this._size;
    clone._sindex = this._sindex;
    return clone as this;
  }

  remove(value: number, comparer: IEqualityComparator<number> = (a, b) => a === b): boolean {
    const index = this._elements.findIndex((v) => comparer(value, v));
    if (index < 0) return false;
    const [removedElement, removedPriority] = [this._elements[index], this._priorities[index]];
    const newSize = --this._size;
    const removedNode = {
      value: removedElement,
      priority: removedPriority,
      nindex: index,
      sindex: this._indices[index]
    } as const as Node;

    // If the element is not the last one, replace it with the last element.
    if (index < newSize) {
      const lastNode = {
        value: this._elements[newSize] as number,
        priority: this._priorities[newSize],
        nindex: newSize,
        sindex: this._indices[newSize]
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
    this._priorities[newSize] = 0;
    this._indices[newSize] = 0n;

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
    if (!dequeue || index === 0) return this._priorities[index];
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
    this._indices = new BigInt64Array(this._defaultSize);
    this._size = 0;
    this._sindex = 0n;
  }

  get count(): number {
    return this._size;
  }

  get values(): number[] {
    const result: number[] = [];
    for (let i = 0; i < this._size; i++) {
      result.push(this._elements[i]);
    }
    return result;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    if (this._elements.length !== this._priorities.length) {
      throw new Error("[pq-ts] Elements and priorities are out of sync.");
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
        nindex: 0,
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
    this._elements = growTyped(this._elements, newSize, this._backend);
    this._priorities = growTyped(this._priorities, newSize, this._backend);
    this._indices = growTyped(this._indices, newSize, BigInt64Array);
  }

  /**
   * Iterates over the queue in priority order.
   * @returns - An iterator for the queue.
   */
  [Symbol.iterator](): Iterator<number> {
    return this.toArray()[Symbol.iterator]();
  }

  /**
  * Create a queue from elements and priorities.
  * 
  * @param elements - An array of elements to be added to the queue.
  * @param priorities - An array of priorities corresponding to the elements.
  * @param backend - The typed array constructor to be used for the queue.
  * @param size - The initial size of the queue.
  * @param comparer - (Optional) A custom comparer for the queue elements.
  * @returns A new instance of the stable typed priority queue.
  */
  static override from(
    elements: number[],
    priorities: number[],
    backend: TypedArrayConstructor,
    size: number,
    comparer?: IComparer<IStableNode<number>>
  ): StableTypedPriorityQueue<IStableNode<number>>;

  /**
   * Create a queue from an existing queue.
   * 
   * @param queue - An existing queue to copy.
   * @param comparer - (Optional) A custom comparer for the queue elements.
   * @returns A new instance of the stable typed priority queue.
   */
  static override from<Node extends IStableNode<number>>(
    queue: StableTypedPriorityQueue<Node>,
    comparer?: IComparer<Node>
  ): StableTypedPriorityQueue<Node>;
  static override from<Node extends IStableNode<number>>(
    elementsOrQueue: number[] | StableTypedPriorityQueue<Node>,
    prioritiesOrSize?: number[] | IComparer<Node>,
    backendOrComparer?: TypedArrayConstructor | IComparer<Node>,
    size?: number,
    comparer?: IComparer<Node>
  ): StableTypedPriorityQueue<Node> {
    const fromElements = (
      elements: number[],
      priorities: number[],
      backend: TypedArrayConstructor,
      size: number,
      comparer?: IComparer<Node>
    ) => {
      const queue = new StableTypedPriorityQueue<Node>(backend, size, comparer);
      for (let i = 0; i < elements.length; i++) {
        queue.enqueue(elements[i], priorities[i]);
      }
      return queue;
    };

    const fromQueue = (
      queue: StableTypedPriorityQueue<Node>,
      comparer?: IComparer<Node>
    ) => {
      const size = queue._size > queue._defaultSize ? queue._size : queue._defaultSize;
      const newQueue = new StableTypedPriorityQueue<Node>(queue._backend, size, comparer);
      newQueue._elements.set(queue._elements);
      newQueue._priorities.set(queue._priorities);
      newQueue._indices.set(queue._indices);
      newQueue._size = queue._size;
      newQueue._sindex = queue._sindex;
      newQueue._indices.set(queue._indices);
      return newQueue;
    };

    if (Array.isArray(elementsOrQueue)) {
      return fromElements(
        elementsOrQueue as number[],
        prioritiesOrSize as number[],
        backendOrComparer as TypedArrayConstructor,
        size as number,
        comparer as IComparer<IStableNode<number>>
      );
    }

    return fromQueue(
      elementsOrQueue as StableTypedPriorityQueue<Node>,
      prioritiesOrSize as IComparer<Node>
    );
  }

}