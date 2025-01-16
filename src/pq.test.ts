import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { PriorityQueue } from "./pq.ts";

describe("PriorityQueue", () => {
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
    expect(pq.isEmpty).toBe(true);

    pq.enqueue(1, 5);
    expect(pq.count).toBe(1);
    expect(pq.isEmpty).toBe(false);
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

  it('should handle stress test', () => {
    const pq = new PriorityQueue<number>();
    for (let i = 0; i < 1000; i++) {
      pq.enqueue(i, Math.floor(Math.random() * 1000));
    }

    let prev = pq.dequeue();
    while (!pq.isEmpty) {
      const current = pq.dequeue();
      expect(prev).toBeLessThanOrEqual(current as number);
      prev = current;
    }
  });
});