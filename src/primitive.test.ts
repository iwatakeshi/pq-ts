import { parent, child, up, upWithPriorities, upWithPrioritiesAndIndices, down, downWithPriorities, heapify, heapifyWithPriorities, heapifyWithPrioritiesAndIndices, growTyped } from './primitive';
import { describe, it, expect } from 'vitest';

describe('Primitive Functions', () => {
  it('should return correct parent index', () => {
    expect(parent(1)).toBe(0);
    expect(parent(4)).toBe(0);
    expect(parent(5)).toBe(1);
  });

  it('should return correct child index', () => {
    expect(child(0)).toBe(1);
    expect(child(0, 1)).toBe(2);
    expect(child(1)).toBe(5);
  });

  it('should move element up in a 4-ary heap', () => {
    const heap = [{ value: 4, priority: 4, nindex: 0 }, { value: 3, priority: 3, nindex: 1 }, { value: 2, priority: 2, nindex: 2 }, { value: 1, priority: 1, nindex: 3 }];
    up(heap)(heap[3], 3, (a, b) => a.priority - b.priority);
    expect(heap[0].value).toBe(1);
  });

  it('should move element up in a 4-ary heap with priorities', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    upWithPriorities(heap, priorities)({ value: 1, priority: 1, nindex: 3 }, 3, (a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  it('should move element up in a 4-ary heap with priorities and indices', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    const indices = [0n, 1n, 2n, 3n];
    upWithPrioritiesAndIndices(heap, priorities, indices)({
      value: 1,
      priority: 1,
      nindex: 3, sindex: 3n,
      index: 3n
    }, 3, (a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  it('should move element down in a 4-ary heap', () => {
    const heap = [{ value: 1, priority: 1, nindex: 0 }, { value: 4, priority: 4, nindex: 1 }, { value: 3, priority: 3, nindex: 2 }, { value: 2, priority: 2, nindex: 3 }];
    down(heap, heap.length)(heap[0], 0, (a, b) => a.priority - b.priority);
    expect(heap[0].value).toBe(1);
  });

  it('should move element down in a 4-ary heap with priorities', () => {
    const heap = [1, 4, 3, 2];
    const priorities = [1, 4, 3, 2];
    downWithPriorities(heap, priorities, heap.length)({ value: 1, priority: 1, nindex: 0 }, 0, (a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  it('should move element down in a 4-ary heap with priorities and indices', () => {
    const heap = [1, 4, 3, 2];
    const priorities = [1, 4, 3, 2];
    const indices = [0n, 1n, 2n, 3n];
    downWithPriorities(heap, priorities, heap.length, indices)({
      value: 1,
      priority: 1,
      nindex: 0,
      sindex: 0n,
      index: 0n
    }, 0, (a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  it('should heapify an array', () => {
    const heap = [{ value: 4, priority: 4, nindex: 0 }, { value: 3, priority: 3, nindex: 1 }, { value: 2, priority: 2, nindex: 2 }, { value: 1, priority: 1, nindex: 3 }];
    heapify(heap, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0].value).toBe(1);
  });

  it('should heapify an array with priorities', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    heapifyWithPriorities(heap, priorities, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  it('should heapify an array with priorities and indices', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    const indices = [0n, 1n, 2n, 3n];
    heapifyWithPrioritiesAndIndices(heap, priorities, indices, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0]).toBe(1);
  });

  describe('growTyped', () => {
    it('should grow a Uint8Array', () => {
      const arr = new Uint8Array([1, 2, 3]);
      const grownArr = growTyped(arr, 7, Uint8Array);
      expect(grownArr.length).toBe(7);
      expect(grownArr[0]).toBe(1);
      expect(grownArr[1]).toBe(2);
      expect(grownArr[2]).toBe(3);
      expect(grownArr[3]).toBe(0); // Default value for Uint8Array
      expect(grownArr[4]).toBe(0); // Default value for Uint8Array
      expect(grownArr[5]).toBe(0); // Default value for Uint8Array
      expect(grownArr[6]).toBe(0); // Default value for Uint8Array
    });

    it('should grow a BigInt64Array', () => {
      const arr = new BigInt64Array([1n, 2n, 3n]);
      const grownArr = growTyped(arr, 7, BigInt64Array);
      expect(grownArr.length).toBe(7);
      expect(grownArr[0]).toBe(1n);
      expect(grownArr[1]).toBe(2n);
      expect(grownArr[2]).toBe(3n);
      expect(grownArr[3]).toBe(0n); // Default value for BigInt64Array
      expect(grownArr[4]).toBe(0n); // Default value for BigInt64Array
      expect(grownArr[5]).toBe(0n); // Default value for BigInt64Array
      expect(grownArr[6]).toBe(0n); // Default value for BigInt64Array
    });

    it('should grow a Float32Array', () => {
      const arr = new Float32Array([1.1, 2.2, 3.3]);
      const grownArr = growTyped(arr, 7, Float32Array);
      expect(grownArr.length).toBe(7);
      expect(String(grownArr[0])).toContain('1.');
      expect(String(grownArr[1])).toContain('2.');
      expect(String(grownArr[2])).toContain('3.');
      expect(grownArr[3]).toBe(0); // Default value for Float32Array
      expect(grownArr[4]).toBe(0); // Default value for Float32Array
      expect(grownArr[5]).toBe(0); // Default value for Float32Array
      expect(grownArr[6]).toBe(0); // Default value for Float32Array
    });

    it('should grow an Int16Array with a custom grow factor', () => {
      const arr = new Int16Array([1, 2, 3]);
      const grownArr = growTyped(arr, 10, Int16Array, 3);
      expect(grownArr.length).toBe(10);
      expect(grownArr[0]).toBe(1);
      expect(grownArr[1]).toBe(2);
      expect(grownArr[2]).toBe(3);
      expect(grownArr[3]).toBe(0); // Default value for Int16Array
      expect(grownArr[4]).toBe(0); // Default value for Int16Array
      expect(grownArr[5]).toBe(0); // Default value for Int16Array
      expect(grownArr[6]).toBe(0); // Default value for Int16Array
      expect(grownArr[7]).toBe(0); // Default value for Int16Array
      expect(grownArr[8]).toBe(0); // Default value for Int16Array
      expect(grownArr[9]).toBe(0); // Default value for Int16Array
    });
  });
});