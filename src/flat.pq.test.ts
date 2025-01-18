import { expect, describe, it } from "vitest";
import { FlatPriorityQueue } from "./flat.pq.ts";

describe("FlatPriorityQueue", () => {
  it("should enqueue elements with priorities", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.count).toBe(3);
    expect(pq.peek()).toBe(2);
  });

  it("should dequeue elements in priority order", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.dequeue()).toBe(2);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBeUndefined();
  });

  it("should peek the highest priority element without removing it", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.peek()).toBe(2);
    expect(pq.count).toBe(3);
  });

  it("should clear all elements", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    pq.clear();
    expect(pq.count).toBe(0);
    expect(pq.peek()).toBeUndefined();
  });

  it("should return the correct count and isEmpty status", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    expect(pq.count).toBe(0);
    expect(pq.isEmpty()).toBe(true);

    pq.enqueue(1, 5);
    expect(pq.count).toBe(1);
    expect(pq.isEmpty()).toBe(false);
  });

  it("should return values in the queue (unordered)", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(new Set(pq.values)).toEqual(new Set([
      1, 2, 3, 0 // 0 comes from the empty slots in the array
    ]));
  });

  it("should convert to array (prioritized)", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.toArray()).toEqual([2, 3, 1]);
  });

  it("should remove a specific element", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.count).toBe(3);
    expect(pq.remove(2)).toBe(true);
    expect(pq.count).toBe(2);
    expect(new Set(pq.values)).toEqual(new Set([
      1, 3, 0
    ]));
    expect(pq.toArray()).toEqual([3, 1]);
  });

  it("should clone the queue", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const clone = pq.clone();
    expect(clone.count).toBe(3);
    expect(pq.values).toEqual(clone.values);
  });

  it("should return a string representation of the queue (prioritized)", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.toString()).toBe("FlatPriorityQueue(2, 3, 1)");
  });

  it("should iterate over the queue (prioritized)", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const values = [];
    for (const value of pq) {
      values.push(value);
    }

    expect(values).toEqual([2, 3, 1]);
  });

  it("should return the index of a specific element", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    const result = pq.values;

    expect(pq.indexOf(1)).toBe(result.findIndex((node) => node === 1));
    expect(pq.indexOf(2)).toBe(result.findIndex((node) => node === 2));
    expect(pq.indexOf(3)).toBe(result.findIndex((node) => node === 3));
    expect(pq.indexOf(4)).toBe(-1);
  });

  it('should return the index of a specific element by dequeuing elements', () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const result = pq.toArray();
    expect(pq.indexOf(1, true)).toBe(result.findIndex((node) => node === 1));
    expect(pq.indexOf(2, true)).toBe(result.findIndex((node) => node === 2));
    expect(pq.indexOf(3, true)).toBe(result.findIndex((node) => node === 3));
    expect(pq.indexOf(4, true)).toBe(-1);
  });

  it("should return the priority of an element at a specific index", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    const result = pq.heap.map((node) => node.priority);

    expect(pq.priorityAt(0)).toBe(result[0]);
    expect(pq.priorityAt(1)).toBe(result[1]);
    expect(pq.priorityAt(2)).toBe(result[2]);
    expect(pq.priorityAt(3)).toBe(Number.MAX_VALUE);
  });

  it('should return the priority of an element at a specific index by dequeuing elements', () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.priorityAt(0, true)).toBe(3);
    expect(pq.priorityAt(1, true)).toBe(4);
    expect(pq.priorityAt(2, true)).toBe(5);
    expect(pq.priorityAt(4, true)).toBe(Number.MAX_VALUE);
  });

  it("should handle stress test", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10000);
    for (let i = 0; i < 10000; i++) {
      pq.enqueue(i, Math.floor(Math.random() * 1000));
    }
    let prevIndex = 0;
    let prevPriority = pq.priorityAt(prevIndex, true);
    pq.dequeue();

    while (!pq.isEmpty()) {
      const currentPriority = pq.priorityAt(prevIndex + 1, true);
      pq.dequeue();

      expect(prevPriority).toBeLessThanOrEqual(currentPriority);
      prevPriority = currentPriority;
      prevIndex++;
    }

    expect(pq.isEmpty()).toBe(true);
    expect(pq.count).toBe(0);
  });

  it("should maintain the same priority sequence when dequeue is enabled", () => {
    const pq = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const dequeuedItems = [];
    while (!pq.isEmpty()) {
      dequeuedItems.push(pq.dequeue());
    }

    const pq2 = new FlatPriorityQueue<number>(Uint32Array, 10);
    pq2.enqueue(1, 5);
    pq2.enqueue(2, 3);
    pq2.enqueue(3, 4);

    const priorities = dequeuedItems.map((_, index) => pq2.priorityAt(index, true));
    expect(priorities).toEqual([3, 4, 5]);
  });
});