import { expect, describe, it } from "vitest";
import { StableFlatPriorityQueue } from "./stable.flat.pq.ts";

describe("StableFlatPriorityQueue", () => {
  it("should enqueue elements with priorities", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.count).toBe(3);
    expect(pq.peek()).toBe(2);
  });

  it("should dequeue elements in priority order", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    expect(pq.dequeue()).toBe(2);
    expect(pq.dequeue()).toBe(4);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBeUndefined();
  });

  it("should peek the highest priority element without removing it", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.peek()).toBe(2);
    expect(pq.count).toBe(3);
  });

  it("should clear all elements", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    pq.clear();
    expect(pq.count).toBe(0);
    expect(pq.peek()).toBeUndefined();
  });

  it("should return the correct count and isEmpty status", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    expect(pq.count).toBe(0);
    expect(pq.isEmpty()).toBe(true);

    pq.enqueue(1, 5);
    expect(pq.count).toBe(1);
    expect(pq.isEmpty()).toBe(false);
  });

  it("should return values in the queue (unordered)", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(new Set(pq.values)).toEqual(new Set([1, 2, 3]));
  });

  it("should convert to array (prioritized)", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    expect(pq.toArray()).toEqual([2, 4, 3, 1]);
  });

  it("should remove a specific element", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    expect(pq.remove(2)).toBe(true);
    expect(pq.count).toBe(3);
    expect(new Set(pq.values)).toEqual(new Set([1, 3, 4]));
    expect(pq.toArray()).toEqual([4, 3, 1]);
  });

  it("should clone the queue", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    const clone = pq.clone();
    expect(clone.count).toBe(4);
    expect(pq.values).toEqual(clone.values);
    expect(clone.toArray()).toEqual([2, 4, 3, 1]);
  });

  it("should return a string representation of the queue (prioritized)", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    expect(pq.toString()).toBe("2, 4, 3, 1");
  });

  it("should iterate over the queue (prioritized)", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);

    const values = [];
    for (const value of pq) {
      values.push(value);
    }

    expect(values).toEqual([2, 4, 3, 1]);
  });

  it("should return the index of a specific element", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);
    pq.enqueue(5, 4);

    const values = pq.heap.map(e => e.value);

    expect(values).toContain(1);
    expect(values).toContain(2);
    expect(values).toContain(3);
    expect(values).toContain(4);
    expect(values).toContain(5);

    expect(pq.indexOf(1, false)).toBeGreaterThanOrEqual(0);
    expect(pq.indexOf(2, false)).toBeGreaterThanOrEqual(0);
    expect(pq.indexOf(3, false)).toBeGreaterThanOrEqual(0);
    expect(pq.indexOf(4, false)).toBeGreaterThanOrEqual(0);
    expect(pq.indexOf(5, false)).toBeGreaterThanOrEqual(0);

    expect(pq.indexOf(99, false)).toBe(-1);
  });

  it("should return the index of a specific element by dequeuing elements", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);

    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);
    pq.enqueue(5, 4);

    expect(pq.indexOf(2, true)).toBe(0);
    expect(pq.indexOf(4, true)).toBe(1);
    expect(pq.indexOf(3, true)).toBe(2);
    expect(pq.indexOf(5, true)).toBe(3);
    expect(pq.indexOf(1, true)).toBe(4);
    expect(pq.indexOf(99, true)).toBe(-1);
  });

  it("should return the priority of an element at a specific index", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);
    pq.enqueue(5, 4);

    const priorities = pq.heap.map(e => e.priority);

    expect(pq.priorityAt(0, false)).toBe(Math.min(...priorities));

    expect(priorities).toContain(3);
    expect(priorities).toContain(4);
    expect(priorities).toContain(5);

    expect(pq.priorityAt(99, false)).toBe(Number.MAX_VALUE);
  });

  it("should return the priority of an element at a specific index by dequeuing elements", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);

    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3);
    pq.enqueue(5, 4);

    expect(pq.priorityAt(0, true)).toBe(3);
    expect(pq.priorityAt(1, true)).toBe(3);
    expect(pq.priorityAt(2, true)).toBe(4);
    expect(pq.priorityAt(3, true)).toBe(4);
    expect(pq.priorityAt(4, true)).toBe(5);
    expect(pq.priorityAt(99, true)).toBe(Number.MAX_VALUE);
  });

  it("should handle stress test", () => {
    const SIZE = 10000;
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, SIZE);
    for (let i = 0; i < SIZE; i++) {
      pq.enqueue(i, Math.floor(Math.random() * 1000));
    }
    let { priority } = pq.pop() ?? { priority: 0 };
  
    while (!pq.isEmpty()) {
      const { priority: currentPriority } = pq.pop() ?? { priority: 0 };
      expect(currentPriority).toBeGreaterThanOrEqual(priority);
      priority = currentPriority;
    }

    expect(pq.isEmpty()).toBe(true);
    expect(pq.count).toBe(0);
  });

  it("should maintain the same priority sequence and stability when dequeue is enabled", () => {
    const pq = new StableFlatPriorityQueue<number>(Uint32Array, 10);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    pq.enqueue(4, 3); // Adding another element with the same priority as 2

    const dequeuedItems = [];
    while (!pq.isEmpty()) {
      dequeuedItems.push(pq.pop());
    }

    // Check if the priorities are in the correct order
    const priorities = dequeuedItems.map((item) => item?.priority);
    expect(priorities).toEqual([3, 3, 4, 5]);

    // Check if the elements with the same priority are dequeued in the order they were enqueued
    const elements = dequeuedItems.map((item) => item?.value);
    expect(elements).toEqual([2, 4, 3, 1]);
  });
});