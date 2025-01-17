import type { IPriorityQueue, IComparer, INode, IEqualityComparator } from "./types.ts";
import { up, down, heapify } from "./primitive.ts";

export class PriorityQueue<
  T,
  Node extends INode<T> = INode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>
> implements IPriorityQueue<T, Node> {
  protected _elements: Node[] = [];
  protected _comparer?: Comparer;
  protected _size = 0;

  constructor();
  constructor(
    elements: Node[],
    comparer?: Comparer
  );
  constructor(
    queue: PriorityQueue<T, Node>,
    comparer?: Comparer
  );
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

    heapify(this._size, this._elements, this.compare.bind(this));
  }

  protected compare(a: Node, b: Node): number {
    if (this._comparer) return this._comparer(a, b);
    return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
  }

  protected removeRootNode(): void {
    if (this.isEmpty()) return;
    const lastNode = this._elements[--this._size];
    if (this._size > 0) {
      this._elements[0] = lastNode;
      down(0, this._size, this._elements, this.compare.bind(this));
    }
    this._elements.pop();
  }

  enqueue(value: T, priority: number): boolean {
    if (typeof priority !== "number") return false;

    this._elements.push({ value, priority } as Node);
    up(this._size++, this._elements, this.compare.bind(this));

    return true;
  }

  dequeue(): T | undefined {
    return this.pop()?.value;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this._elements[0].value;
  }

  pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element;
  }

  clear(): void {
    this._elements = [];
    this._size = 0;
  }

  get count(): number {
    return this._size;
  }

  get values(): T[] {
    return this._elements.map((node) => node.value);
  }

  get heap(): Node[] {
    return this._elements;
  }

  toArray(): T[] {
    const clone = this.clone();
    const result: T[] = [];
    while (!clone.isEmpty()) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      result.push(clone.dequeue()!);
    }
    return result;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  remove(value: T, comparer: IEqualityComparator<T> = (a, b) => a === b): boolean {
    const index = this._elements.findIndex((node) => comparer(node.value, value));
    if (index === -1) return false;

    const removedElement = this._elements[index];
    const newSize = --this._size;

    if (index < newSize) {
      const lastNode = this._elements[newSize];
      this._elements[index] = lastNode;
      if (this.compare(lastNode, removedElement) < 0) {
        up(index, this._elements, this.compare.bind(this));
      } else {
        down(index, newSize, this._elements, this.compare.bind(this));
      }
    }

    this._elements.pop();
    return true;
  }

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

  clone(): PriorityQueue<T, Node> {
    return new PriorityQueue(this, this._comparer);
  }

  toString(): string {
    return this.toArray().join(", ");
  }

  [Symbol.iterator](): Iterator<T> {
    return this.toArray()[Symbol.iterator]();
  }

  static from<T, Node extends INode<T> = INode<T>>(
    elements: INode<T>[],
    comparer?: IComparer<INode<T>>
  ): PriorityQueue<T, Node>;
  static from<T, Node extends INode<T> = INode<T>>(
    queue: PriorityQueue<T, Node>,
    comparer?: IComparer<INode<T>>
  ): PriorityQueue<T, Node>;
  static from<T, Node extends INode<T> = INode<T>>(
    elements: T[],
    comparer?: IComparer<T>
  ): PriorityQueue<T, Node>;
  static from<T, Node extends INode<T> = INode<T>>(
    elements?: T[] | PriorityQueue<T, Node>,
    comparer?: IComparer<T>
  ): PriorityQueue<T, Node> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new PriorityQueue(elements as any, comparer as any);
  }
}