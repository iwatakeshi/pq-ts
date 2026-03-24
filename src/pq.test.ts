import { expect, describe, it } from "vitest";
import { PriorityQueue } from "./pq.ts";

describe("PriorityQueue", () => {

  it("should create a priority queue from an existing queue", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const pq2 = PriorityQueue.from(pq);
    expect(pq2.count).toBe(3);
    expect(pq2.values).toEqual(pq.values);
  });

  it("should create a priority queue from an array", () => {
    const pq = PriorityQueue.from([1, 2, 3]);
    expect(pq.count).toBe(3);
    expect(pq.values).toEqual([1, 2, 3]);
  });

  it("should create an empty priority queue", () => {
    const pq = new PriorityQueue<number>();
    expect(pq.count).toBe(0);
    expect(pq.isEmpty()).toBe(true);
    expect(pq.peek()).toBeUndefined();
  });
  it("should enqueue elements with priorities", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.count).toBe(3);
    expect(pq.peek()).toBe(2);
  });

  it("should dequeue elements in priority order", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);
    expect(pq.dequeue()).toBe(2);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBeUndefined();
  });

  it("should peek the highest priority element without removing it", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.peek()).toBe(2);
    expect(pq.count).toBe(3);
  });

  it("should clear all elements", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    pq.clear();
    expect(pq.count).toBe(0);
    expect(pq.peek()).toBeUndefined();
  });

  it("should return the correct count and isEmpty status", () => {
    const pq = new PriorityQueue<number>();
    expect(pq.count).toBe(0);
    expect(pq.isEmpty()).toBe(true);

    pq.enqueue(1, 5);
    expect(pq.count).toBe(1);
    expect(pq.isEmpty()).toBe(false);
  });

  it("should return values in the queue (unordered)", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(new Set(pq.values)).toEqual(new Set([1, 2, 3]));
  });

  it("should convert to array (prioritized)", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.toArray()).toEqual([2, 3, 1]);
  });

  it("should remove a specific element", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.remove(2)).toBe(true);
    expect(pq.count).toBe(2);
    expect(new Set(pq.values)).toEqual(new Set([1, 3]));
    expect(pq.toArray()).toEqual([3, 1]);
  });

  it("should not crash when remove() is called after dequeue()", () => {
    const pq = new PriorityQueue<{ id: string }>();
    pq.enqueue({ id: "a" }, 1);
    pq.enqueue({ id: "b" }, 2);

    pq.dequeue();

    expect(pq.remove({ id: "b" }, (a, b) => a.id === b.id)).toBe(true);
    expect(pq.count).toBe(0);
  });

  it("should return false when remove() targets a nonexistent element after dequeue()", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 1);
    pq.enqueue(2, 2);

    pq.dequeue();

    expect(pq.remove(99)).toBe(false);
    expect(pq.count).toBe(1);
  });

  it("should clone the queue", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const clone = pq.clone();
    expect(clone.count).toBe(3);
    expect(pq.values).toEqual(clone.values);
  });

  it("should return a string representation of the queue (prioritized)", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.toString()).toBe("2, 3, 1");
  });

  it("should iterate over the queue (prioritized)", () => {
    const pq = new PriorityQueue<number>();
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
    const pq = new PriorityQueue<number>();
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
    const pq = new PriorityQueue<number>();
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
    const pq = new PriorityQueue<number>();
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
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.priorityAt(0, true)).toBe(3);
    expect(pq.priorityAt(1, true)).toBe(4);
    expect(pq.priorityAt(2, true)).toBe(5);
    expect(pq.priorityAt(4, true)).toBe(Number.MAX_VALUE);
  });

  it("should accept a custom compare function", () => {
    const pq = new PriorityQueue<number>((a, b) => b.priority - a.priority);
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(2);
  });

  it("should handle stress test", () => {
    const pq = new PriorityQueue<number>();
    for (let i = 0; i < 10; i++) {
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

  it("should maintain the same priority sequence when dequeue is enabled", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1, 5);
    pq.enqueue(2, 3);
    pq.enqueue(3, 4);

    const dequeuedItems = [];
    while (!pq.isEmpty()) {
      dequeuedItems.push(pq.dequeue());
    }

    const pq2 = new PriorityQueue<number>();
    pq2.enqueue(1, 5);
    pq2.enqueue(2, 3);
    pq2.enqueue(3, 4);

    const priorities = dequeuedItems.map((_, index) => pq2.priorityAt(index, true));
    expect(priorities).toEqual([3, 4, 5]);
  });

  // Regression: remove() with many elements should preserve heap order
  // (Bug: up/down directions were swapped in remove(), causing heap corruption
  // when the last element needed to bubble in the opposite direction)
  it("should maintain heap order after removing an internal element (regression)", () => {
    const pq = new PriorityQueue<number>();
    // This specific priority pattern triggers the bug: after removing value 0
    // (pri=50), the last node (pri=25) must bubble UP past its new parent (pri=30),
    // but the buggy code called _down instead, leaving it in the wrong position.
    const priorities = [50, 10, 90, 20, 80, 30, 70, 40, 60, 5, 95, 15, 85, 25];
    for (let i = 0; i < priorities.length; i++) {
      pq.enqueue(i, priorities[i]);
    }

    expect(pq.remove(0)).toBe(true);

    // Verify the heap invariant: parent priority <= child priority
    const heap = pq.heap;
    const size = pq.count;
    for (let i = 1; i < size; i++) {
      const parentIdx = (i - 1) >> 2;
      expect(heap[i].priority).toBeGreaterThanOrEqual(heap[parentIdx].priority);
    }

    // Also verify dequeue order
    let prev = pq.pop()!;
    while (!pq.isEmpty()) {
      const curr = pq.pop()!;
      expect(curr.priority).toBeGreaterThanOrEqual(prev.priority);
      prev = curr;
    }
  });

  // Regression: remove() should preserve heap for all removals (stress test)
  it("should maintain heap order after removing any element (regression)", () => {
    const priorities = [50, 10, 90, 20, 80, 30, 70, 40, 60, 5, 95, 15, 85, 25];
    for (let removeIdx = 0; removeIdx < priorities.length; removeIdx++) {
      const pq = new PriorityQueue<number>();
      for (let i = 0; i < priorities.length; i++) {
        pq.enqueue(i, priorities[i]);
      }

      pq.remove(removeIdx);

      let prev = pq.pop()!;
      while (!pq.isEmpty()) {
        const curr = pq.pop()!;
        expect(curr.priority).toBeGreaterThanOrEqual(prev.priority);
        prev = curr;
      }
    }
  });
});
