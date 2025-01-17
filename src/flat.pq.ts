import type { IPriorityQueue, IComparer, INode, IEqualityComparator, TypedArray, TypedArrayConstructor } from "./types.ts";
import { up, down, heapify, grow } from "./primitive.ts";

export class FlatPriorityQueue<
  T extends number = number,
  Node extends INode<T> = INode<T>,
  Comparer extends IComparer<Node> = IComparer<Node>,
  Heap extends TypedArray = Uint32Array,
> implements IPriorityQueue<T, Node> {
  protected _elements: Heap;
  protected _priorities: typeof this._elements;
  protected _size = 0;
  protected _comparer?: Comparer;
  protected _backend: TypedArrayConstructor<Heap>;
  protected readonly _defaultSize: number;

  constructor(
    backend: TypedArrayConstructor<Heap>,
    size: number,
    comparer?: Comparer) {
    this._backend = backend;
    this._defaultSize = size;
    this._elements = new backend()
    this._priorities = new backend();
    this._comparer = comparer;

    heapify(size, this._elements, this.compare.bind(this));
  }
  get heap(): Node[] {
    return Array.from(this._elements) as unknown as Node[];
  }

  pop(): Node | undefined {
    throw new Error("Method not implemented.");
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
    const clone = new FlatPriorityQueue<T, Node, Comparer, Heap>(this._backend, this._elements.length, this._comparer);
    clone._elements.set(this._elements);
    clone._priorities.set(this._priorities);
    clone._size = this._size;
    return clone as this;
  }

  remove(value: T, comparer?: IEqualityComparator<T>): boolean {
    const index = this.indexOf(value, false, comparer);
    if (index === -1) return false;
    this._elements[index] = this._elements[--this._size];
    down(index, this._size, this._elements, this.compare.bind(this));
    return true;
  }

  indexOf(value: T, dequeue = false, comparer?: IEqualityComparator<T>): number {
    for (let i = 0; i < this._size; i++) {
      if ((comparer?.(this._elements[i] as T, value)) || this._elements[i] === value) {
        if (dequeue) {
          this._elements[i] = this._elements[--this._size];
          down(i, this._size, this._elements, this.compare.bind(this));
        }
        return i;
      }
    }
    return -1;
  }

  priorityAt(index: number, dequeue = false): number {
    if (index < 0 || index >= this._size) throw new Error("Index out of bounds");
    const priority = this._priorities[index];
    if (dequeue) {
      this._elements[index] = this._elements[--this._size];
      down(index, this._size, this._elements, this.compare.bind(this));
    }
    return priority;
  }

  toString(): string {
    return `FlatPriorityQueue(${this.toArray().join(", ")})`;
  }

  comparer?: IComparer<Node> | undefined;

  enqueue(value: T, priority: number): boolean {
    if (this._size >= this._elements.length) {
      this.grow(this._elements.length * 2);
    }
    this._elements[this._size] = value;
    this._priorities[this._size] = priority;
    up(this._size++, this._elements, this.compare.bind(this));
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
    const lastNode = this._elements[--this._size];
    if (this._size > 0) {
      this._elements[0] = lastNode;
      down(0, this._size, this._elements, this.compare.bind(this));
    }
  }

  protected grow(newSize: number): void {
    this._elements = grow(this._elements, newSize);
    this._priorities = grow(this._priorities, newSize);
  }

  protected compare(a: number, b: number): number {
    const priorityA = this._priorities[a];
    const priorityB = this._priorities[b];
    return priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;
  }
}