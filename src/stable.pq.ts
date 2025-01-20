import type { IComparer, IEqualityComparator, IStableNode } from "./types.ts";
import { heapify } from "./primitive.ts";
import { PriorityQueue } from "./pq.ts";

export class StablePriorityQueue<
  T,
  Node extends IStableNode<T> = IStableNode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> extends PriorityQueue<T, Node, Comparer> {
  protected override _elements: Node[] = [];
  private _index = 0n;
  protected override compare?: Comparer;

  constructor();
  constructor(elements: Node[], comparer?: Comparer);
  constructor(queue: StablePriorityQueue<T, Node, Comparer>, comparer?: Comparer);
  constructor(elements: T[], comparer?: IComparer<T>);
  constructor(elements?: T[] | StablePriorityQueue<T, Node, Comparer> | Node[], comparer?: Comparer) {
    super([]);
    if (elements instanceof StablePriorityQueue) {
      this._elements = [...elements._elements];
      this._size = elements._size;
      this.compare = elements.compare;
    } else if (Array.isArray(elements)) {
      this._elements = new Array(elements.length);
      for (const element of elements) {
        this.enqueue(element as T, 0);
      }
      this._size = elements.length;
      this.compare = comparer;
    } else {
      this.compare = comparer ?? ((a, b) => {
        if (a.priority === b.priority) return a.sindex < b.sindex ? -1 : 1;
        return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
      }) as Comparer
    }

    this._heapify(this._size);
  }

  override enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;
    const currentSize = this._size;
    if (this._elements.length === currentSize) {
      this._grow(currentSize + 1);
    }
    const element = {
      value,
      priority,
      nindex: currentSize,
      sindex: this._index
    } as Node;

    this._size = currentSize + 1;
    this._index += 1n;
    this._up(element, currentSize);

    return true;
  }

  override pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element as Node;
  }

  override get heap(): Node[] {
    return this._elements;
  }

  override clone(): this {
    return new StablePriorityQueue(this, this.compare) as this;
  }

  override indexOf(value: T, dequeue = false, comparer: IEqualityComparator<T> = (a, b) => a === b): number {
    if (!dequeue) return this._elements.findIndex((node: Node | undefined) => node && comparer(node.value, value));
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
    elements: IStableNode<T>[],
    comparer?: IComparer<IStableNode<T>>
  ): StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>>;
  static from<T>(
    queue: StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>>,
    comparer?: IComparer<IStableNode<T>>
  ): StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>>;
  static from<T>(
    elements: T[],
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>>;
  static from<T>(
    elements?: T[] | StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>>,
    comparer?: IComparer<T>
  ): StablePriorityQueue<T, IStableNode<T>, IComparer<IStableNode<T>>> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new StablePriorityQueue(elements as any, comparer);
  }
}