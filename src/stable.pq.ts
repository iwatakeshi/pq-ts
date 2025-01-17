import type { IComparer, IEqualityComparator, StableHeapNode } from "./types.ts";
import { up, heapify } from "./primitive.ts";
import { PriorityQueue } from "./pq.ts";

export class StablePriorityQueue<T> extends PriorityQueue<T, StableHeapNode<T>> {
  protected override _elements: StableHeapNode<T>[] = [];
  private _index = 0n;
  protected override _comparer?: IComparer<StableHeapNode<T>> | undefined;

  constructor();
  constructor(
    elements: StableHeapNode<T>[],
    comparer?: IComparer<StableHeapNode<T>>
  );
  constructor(
    queue: StablePriorityQueue<T>,
    comparer?: IComparer<StableHeapNode<T>>
  );
  constructor(
    elements: T[],
    comparer?: IComparer<T>
  );
  constructor(
    elements?: T[] | StablePriorityQueue<T> | StableHeapNode<T>[],
    comparer?: IComparer<StableHeapNode<T>>
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

  protected override compare(a: StableHeapNode<T>, b: StableHeapNode<T>): number {
    if (this._comparer) return this._comparer(a, b);
    // If the priorities are the same, compare by index
    if (a.priority === b.priority) return a.___index < b.___index ? -1 : 1;

    return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
  }

  override enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;

    this._elements.push({ value, priority, ___index: this._index++ });
    up(this._size++, this._elements, this.compare.bind(this));

    return true;
  }

  override pop(): StableHeapNode<T> | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return { value: element.value, priority: element.priority, ___index: element.___index };
  }

  override get heap(): StableHeapNode<T>[] {
    return this._elements.map(({ value, priority, ___index }) => ({ value, priority, ___index }));
  }

  override clone(): StablePriorityQueue<T> {
    return new StablePriorityQueue(this, this._comparer);
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
}