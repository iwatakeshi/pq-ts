// deno-lint-ignore-file no-explicit-any
import type { IPriorityQueue, IComparer, HeapNode } from "./types.ts";
import { swap, up, down, heapify } from "./primitive.ts";

export class PriorityQueue<T> implements IPriorityQueue<T> {
  private _elements: HeapNode<T>[] = [];
  private _comparer?: IComparer<HeapNode<T>>;
  private _size = 0;

  constructor();
  constructor(
    elements: HeapNode<T>[],
    comparer?: IComparer<HeapNode<T>>
  );
  constructor(
    queue: PriorityQueue<T>,
    comparer?: IComparer<HeapNode<T>>
  );
  constructor(
    elements: T[],
    comparer?: IComparer<T>
  );
  constructor(
    elements?: T[] | PriorityQueue<T>,
    comparer?: IComparer<HeapNode<T>>
  ) {
    if (elements instanceof PriorityQueue) {
      this._elements = [...elements._elements];
      this._size = elements._size;
      this._comparer = elements._comparer;
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
  /**
   * Compares two nodes based on their priority values.
   * @param a - The first node to compare.
   * @param b - The second node to compare.
   * @returns A negative value if a < b, zero if a = b, or a positive value if a > b.
   */
  protected compare(a: HeapNode<T>, b: HeapNode<T>): number {
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

    this._elements.push({ value, priority });
    up(this._size++, this._elements, this.compare.bind(this));

    return true;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const element = this._elements[0];
    this.removeRootNode();
    return element.value;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this._elements[0].value;
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

  get heap(): HeapNode<T>[] {
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

  remove(value: T): boolean {
    const index = this._elements.findIndex((node) => node.value === value);
    if (index === -1) return false;

    const removedElement = this._elements[index];
    const priority = removedElement.priority;
    const newSize = --this._size;

    if (index < newSize) {
      const lastNode = this._elements[newSize];
      this._elements[index] = lastNode;
      if (this._comparer) {
        if (this._comparer(lastNode, removedElement) < 0) {
          up(index, this._elements, this.compare.bind(this));
        } else {
          down(index, newSize, this._elements, this.compare.bind(this));
        }
      } else {
        if (lastNode.priority < priority) {
          up(index, this._elements, this.compare.bind(this));
        } else {
          down(index, newSize, this._elements, this.compare.bind(this));
        }
      }
    }

    this._elements.pop();
    return true;
  }

  indexOf(value: T): number {
    return this._elements.findIndex((node) => node.value === value);
  }

  priorityAt(index: number): number {
    console.log(this._elements[index]);
    return index < this._size ? this._elements[index].priority : Number.MAX_VALUE;
  }

  clone(): PriorityQueue<T> {
    return new PriorityQueue(this, this._comparer);
  }

  toString(): string {
    return this.toArray().join(", ");
  }

  [Symbol.iterator](): Iterator<T> {
    return this.toArray()[Symbol.iterator]();
  }

  static from<T>(
    elements: HeapNode<T>[],
    comparer?: IComparer<HeapNode<T>>
  ): PriorityQueue<T>;
  static from<T>(
    queue: PriorityQueue<T>,
    comparer?: IComparer<HeapNode<T>>
  ): PriorityQueue<T>;
  static from<T>(
    elements: T[],
    comparer?: IComparer<T>
  ): PriorityQueue<T>;
  static from<T>(
    elements?: T[] | PriorityQueue<T>,
    comparer?: IComparer<T>
  ): PriorityQueue<T> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return new PriorityQueue(elements as any, comparer as any);
  }
}