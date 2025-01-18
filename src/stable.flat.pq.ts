import type { IComparer, IEqualityComparator, TypedArray, TypedArrayConstructor, IStableNode } from "./types.ts";
import { FlatPriorityQueue } from "./flat.pq.ts";
import { down, downWithPrioritiesAndIndices, up, upWithPrioritiesAndIndices } from "./primitive.ts";

export class StableFlatPriorityQueue<
  T extends number = number,
  Node extends IStableNode<T> = IStableNode<T>,
  Comparer extends IComparer<number> = IComparer<number>,
  Heap extends TypedArray = Uint32Array,
> extends FlatPriorityQueue<T, Node, Comparer, Heap> {
  // Track insertion order
  private _indices: bigint[];
  private _nextIndex = 0n;

  constructor(backend: TypedArrayConstructor<Heap>, size: number, comparer?: Comparer);
  constructor(elements: T[], priorities: number[], backend: TypedArrayConstructor<Heap>, comparer?: Comparer);
  constructor(queue: StableFlatPriorityQueue<T, Node, Comparer, Heap>, comparer?: Comparer);
  constructor(
    backendOrElements: TypedArrayConstructor<Heap> | T[] | StableFlatPriorityQueue<T, Node, Comparer, Heap>,
    sizeOrPriorities?: number | number[],
    comparerOrBackend?: Comparer | TypedArrayConstructor<Heap>,
    comparer?: Comparer
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    super(backendOrElements as any, sizeOrPriorities as any, comparerOrBackend as any, comparer);

    // Initialize indices array
    this._indices = [];

    if (backendOrElements instanceof StableFlatPriorityQueue) {
      this._indices = [...backendOrElements._indices];
      this._nextIndex = backendOrElements._nextIndex;
    }

    // Override default comparer to consider insertion order
    if (!this.compare) {
      this.compare = ((a: number, b: number, [i, j]: readonly [number, number]) => {
        if (a === b) {
          return this._indices[i] < this._indices[j] ? -1 : 1;
        }
        return a - b;
      }) as Comparer;
    }
  }

  override enqueue(value: T, priority: number): boolean {
    if (this._size >= this._elements.length) {
      this.grow(this._elements.length * 2);
    }
    // Store value, priority, and insertion order
    this._elements[this._size] = value;
    this._priorities[this._size] = priority;
    this._indices[this._size] = this._nextIndex++;

    upWithPrioritiesAndIndices(this._size++, this._elements, this.compare as Comparer, this._priorities, this._indices);
    return true;
  }

  override remove(value: T, comparer: IEqualityComparator<T> = (a, b) => a === b): boolean {
    const index = this._elements.findIndex((v) => comparer(value, v as T));
    if (index === -1) return false;  // Element not found.

    const newSize = --this._size;

    // If the element is not the last one, replace it with the last element.
    if (index < newSize) {
      const lastElement = this._elements[newSize];
      const lastPriority = this._priorities[newSize];
      const lastIndex = this._indices[newSize];

      // Swap the element with the last element
      this._elements[index] = lastElement;
      this._priorities[index] = lastPriority;
      this._indices[index] = lastIndex;

      // If the last element should be "bubbled up" (preserve heap property)
      if (this.compare && this.compare(this._priorities[newSize], this._priorities[index], [newSize, index]) < 0) {
        upWithPrioritiesAndIndices(index, this._elements, this.compare as Comparer, this._priorities, this._indices);
      } else {
        // Otherwise, it should "bubble down"
        downWithPrioritiesAndIndices(index, newSize, this._elements, this.compare as Comparer, this._priorities, this._indices);
      }
    } else {
      // If the element is the last one, just clear it
      this._elements[index] = 0;
      this._priorities[index] = 0;
      this._indices[index] = 0n;
    }
    return true;
  }

  override pop(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const value = this._elements[0];
    const priority = this._priorities[0];
    const index = this._indices[0];
    this.removeRootNode();
    return { value, priority, index } as Node;
  }

  protected override grow(newSize: number): void {
    super.grow(newSize);
    // Grow indices array
    const newIndices = new Array(newSize);
    for (let i = 0; i < this._indices.length; i++) {
      newIndices[i] = this._indices[i];
    }
    this._indices = newIndices;
  }

  protected override removeRootNode(): void {
    if (this.isEmpty()) return;
    this._size = Math.max(0, this._size - 1);

    if (this._size > 0) {
      this._elements[0] = this._elements[this._size];
      this._priorities[0] = this._priorities[this._size];
      this._indices[0] = this._indices[this._size];

      downWithPrioritiesAndIndices(0, this._size, this._elements, this.compare as Comparer, this._priorities, this._indices);
    }

    this._elements[this._size] = undefined as unknown as Heap[0];
    this._priorities[this._size] = undefined as unknown as Heap[0];
    this._indices[this._size] = undefined as unknown as bigint;
  }

  override clone(): this {
    return new StableFlatPriorityQueue<T, Node, Comparer, Heap>(this) as this;
  }

  override get heap(): Node[] {
    return Array.from(this._elements)
      .map((value, i) => ({
        value,
        priority: this._priorities[i],
        index: this._indices[i]
      } as Node));
  }

  override clear(): void {
    super.clear();
    this._indices = [];
    this._nextIndex = 0n;
  }
}