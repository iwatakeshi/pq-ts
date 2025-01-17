import { describe, it, expect, beforeEach } from 'vitest';
import { FlatPriorityQueue } from './flat.pq';

describe('FlatPriorityQueue', () => {
  let queue: FlatPriorityQueue<number>;

  beforeEach(() => {
    queue = new FlatPriorityQueue(Uint32Array, 10);
  });

  it('should enqueue elements with priorities', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.count).toBe(3);
    expect(queue.peek()).toBe(2);
  });

  it('should dequeue elements in priority order', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
  });

  it('should peek the highest priority element', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.peek()).toBe(2);
    queue.dequeue();
    expect(queue.peek()).toBe(1);
  });

  it('should remove elements by value', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.remove(2)).toBe(true);
    expect(queue.count).toBe(2);
    expect(queue.peek()).toBe(1);
  });

  it('should clear the queue', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    queue.clear();
    expect(queue.count).toBe(0);
    expect(queue.peek()).toBeUndefined();
  });

  it('should convert the queue to an array', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.toArray()).toEqual([2, 1, 3]);
  });

  it('should clone the queue', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    const clone = queue.clone();
    expect(clone.toArray()).toEqual([2, 1, 3]);
    expect(clone.count).toBe(3);
  });

  it('should return the correct priority at a given index', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.priorityAt(0)).toBe(5);
    expect(queue.priorityAt(1)).toBe(10);
    expect(queue.priorityAt(2)).toBe(15);
  });

  it('should return the correct index of a value', () => {
    queue.enqueue(1, 10);
    queue.enqueue(2, 5);
    queue.enqueue(3, 15);

    expect(queue.indexOf(2)).toBe(0);
    expect(queue.indexOf(1)).toBe(1);
    expect(queue.indexOf(3)).toBe(2);
    expect(queue.indexOf(4)).toBe(-1);
  });
});