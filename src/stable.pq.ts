import type { IComparer, IEqualityComparator, StableHeapNode } from "./types.ts";
import { up, heapify } from "./primitive.ts";
import { PriorityQueue } from "./pq.ts";

export class StablePriorityQueue<
  T,
  Node extends StableHeapNode<T> = StableHeapNode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> extends PriorityQueue<T, Node, Comparer> {
  protected override _elements: Node[] = [];
  protected override _comparer?: Comparer;
  protected override readonly _compare: (a: Node, b: Node) => number;
  private _index = 0n;

  constructor();
  constructor(elements: Node[], comparer?: Comparer);
  constructor(queue: StablePriorityQueue<T, Node, Comparer>, comparer?: Comparer);
  constructor(elements: T[], comparer?: IComparer<T>);
  constructor(elements?: T[] | StablePriorityQueue<T, Node, Comparer> | Node[], comparer?: Comparer) {
    super([], comparer);
    if (elements instanceof StablePriorityQueue) {
      this._elements = [...elements._elements];
      this._size = elements._size;
      this._comparer = elements._comparer;
    } else if (Array.isArray(elements)) {
      this._elements = new Array(elements.length);
      for (const element of elements) {
        this.enqueue(element as T, 0);
      }
      this._size = elements.length;
      this._comparer = comparer;
    } else {
      this._comparer = comparer;
    }

    this._compare = this.compare.bind(this);
    heapify(this._size, this._elements, this._compare);
  }

  protected override compare(a: Node, b: Node): number {
    if (this._comparer) return this._comparer(a, b);
    if (a.priority === b.priority) return a.index < b.index ? -1 : 1;
    return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
  }

  override enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;

    this._elements.push({ value, priority, index: this._index++ } as Node);
    up(this._size++, this._elements, this._compare);

    return true;
  }

  override pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return { value: element.value, priority: element.priority, index: element.index } as Node;
  }

  override get heap(): Node[] {
    return this._elements.map(({ value, priority, index: ___index }) => ({ value, priority, index: ___index } as Node));
  }

  override clone(): this {
    return new StablePriorityQueue(this, this._comparer) as this;
  }

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

  override priorityAt(index: number, dequeue = false): number {
    if (index < 0 || index >= this._size) return Number.MAX_VALUE;
    if (!dequeue) return this._elements[index].priority;
    const clone = this.clone();
    for (let i = 0; i < index; i++) {
      clone.dequeue();
    }
    return clone.pop()?.priority ?? Number.MAX_VALUE;
  }

  static from<T>(
    elements: StableHeapNode<T>[],
    comparer?: IComparer<StableHeapNode<T>>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  static from<T>(
    queue: StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>,
    comparer?: IComparer<StableHeapNode<T>>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  static from<T>(
    elements: T[],
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>;
  static from<T>(
    elements?: T[] | StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>>,
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, StableHeapNode<T>, IComparer<StableHeapNode<T>>> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new StablePriorityQueue(elements as any, comparer);
  }
}