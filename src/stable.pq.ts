import type { IComparer, IEqualityComparator, StableHeapNode } from "./types.ts";
import { up, heapify } from "./primitive.ts";
import { PriorityQueue } from "./pq.ts";

export class StablePriorityQueue<
  T,
  Node extends StableHeapNode<T> = StableHeapNode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> extends PriorityQueue<T, Node, Comparer> {
  /**
   * The elements in the queue used internally.
   * @protected
   */
  protected override _elements: Node[] = [];
  /**
   * The compare function used internally.
   * @protected
   */
  protected override _comparer?: Comparer;
  private _index = 0n;

  /**
   * Creates a new instance of a stable priority queue.
   */
  constructor();
  /**
   * Creates a new instance of a stable priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(
    elements: Node[],
    comparer?: Comparer
  );
  /**
   * Creates a new instance of a stable priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  constructor(
    queue: StablePriorityQueue<T, Node, Comparer>,
    comparer?: Comparer
  );
  /**
   * Creates a new instance of a stable priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  constructor(
    elements: T[],
    comparer?: IComparer<T>
  );
  constructor(
    elements?: T[] | StablePriorityQueue<T, Node, Comparer> | Node[],
    comparer?: Comparer
  ) {
    super([], comparer);
    if (elements instanceof StablePriorityQueue) {
      this._elements = [...elements._elements];
      this._size = elements._size;
      this._comparer = elements._comparer;
    } else if (Array.isArray(elements)) {
      for (const element of elements) {
        this.enqueue(element as T, 0);
      }
      this._size = elements.length;
      this._comparer = comparer;
    } else {
      this._comparer = comparer;
    }

    heapify(this._size, this._elements, this.compare.bind(this));
  }

  /**
   * Compares two nodes based on their priority values.
   * @param a - The first node to compare
   * @param b - The second node to compare
   * @returns A negative number if the first node has a lower priority,
   */
  protected override compare(a: Node, b: Node): number {
    if (this._comparer) return this._comparer(a, b);
    // If the priorities are the same, compare by index
    if (a.priority === b.priority) return a.___index < b.___index ? -1 : 1;

    return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
  }

  /**
   * Adds an element to the end of the queue.
   * @param value - The value to add.
   * @param priority - The priority of the element.
   * @returns True if the element was added, false otherwise.
   */
  override enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;

    this._elements.push({ value, priority, ___index: this._index++ } as Node);
    up(this._size++, this._elements, this.compare.bind(this));

    return true;
  }

  /**
   * Removes and returns the element at the front of the queue.
   * @returns The element at the front of the queue, or undefined if the queue is empty.
   */
  override pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return { value: element.value, priority: element.priority, ___index: element.___index } as Node;
  }

  /**
   * Removes the first occurrence of a specific element from the queue.
   */
  override get heap(): Node[] {
    return this._elements.map(({ value, priority, ___index }) => ({ value, priority, ___index } as Node));
  }

  /**
   * Returns the elements in the queue in priority order.
   * @returns The elements in the queue in priority order.
   */
  override clone(): StablePriorityQueue<T, Node, Comparer> {
    return new StablePriorityQueue(this, this._comparer);
  }

  /**
   * Removes the first occurrence of a specific element from the queue.
   * @param value - The element to remove.
   * @param dequeue - If true, searches for the element by dequeuing elements from a cloned queue, preserving the original queue's order.
   * @param comparer - An optional equality comparison function.
   * @returns True if the element was removed, false otherwise.
   */
  override indexOf(value: T, dequeue = false, comparer: IEqualityComparator<T> = (a, b) => a === b): number {
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
  override priorityAt(index: number, dequeue = false): number {
    if (index < 0 || index >= this._size) return Number.MAX_VALUE;
    if (!dequeue) return this._elements[index].priority;
    const clone = this.clone();
    for (let i = 0; i < index; i++) {
      clone.dequeue();
    }
    return clone.pop()?.priority ?? Number.MAX_VALUE;
  }

  /**
   * Creates a new instance of a priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  static from<T>(
    elements: StableHeapNode<T>[],
    comparer?: IComparer<StableHeapNode<T>>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  /**
   * Creates a new instance of a stable priority queue.
   * @param queue - The queue to copy elements from.
   * @param comparer - An optional comparison function.
   */
  static from<T>(
    queue: StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>,
    comparer?: IComparer<StableHeapNode<T>>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  /**
   * Creates a new instance of a stable priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   */
  static from<T>(
    elements: T[],
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  /**
   * Creates a new instance of a stable priority queue.
   * @param elements - The elements to add to the queue.
   * @param comparer - An optional comparison function.
   * @returns - A new priority queue instance.
   */
  static from<T>(
    elements?: T[] | StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>,
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new StablePriorityQueue(elements as any, comparer);
  }
}