import {  parent, child, swap, up, upWithPriorities, upWithPrioritiesAndIndices, down, downWithPriorities, downWithPrioritiesAndIndices, heapify, heapifyWithPriorities, heapifyWithPrioritiesAndIndices, grow } from './primitive';
import { describe, it, expect } from 'vitest';

describe('Primitive Functions', () => {
  it('should return correct parent index', () => {
    expect(parent(1)).to.equal(0);
    expect(parent(4)).to.equal(0);
    expect(parent(5)).to.equal(1);
  });

  it('should return correct child index', () => {
    expect(child(0)).to.equal(1);
    expect(child(0, 1)).to.equal(2);
    expect(child(1)).to.equal(5);
  });

  it('should swap elements in an array', () => {
    const arr = [1, 2, 3];
    swap(arr, 0, 2);
    expect(arr).to.deep.equal([3, 2, 1]);
  });

  it('should move element up in a 4-ary heap', () => {
    const heap = [{ value: 4, priority: 4, nindex: 0 }, { value: 3, priority: 3, nindex: 1 }, { value: 2, priority: 2, nindex: 2 }, { value: 1, priority: 1, nindex: 3 }];
    up(heap)(heap[3], 3, (a, b) => a.priority - b.priority);
    expect(heap[0].value).to.equal(1);
  });

  it('should move element up in a 4-ary heap with priorities', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    upWithPriorities(heap, priorities)({ value: 1, priority: 1, nindex: 3 }, 3, (a, b) => a.priority - b.priority);
    expect(heap[0]).to.equal(1);
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
    expect(heap[0]).to.equal(1);
  });

  it('should move element down in a 4-ary heap', () => {
    const heap = [{ value: 1, priority: 1, nindex: 0 }, { value: 4, priority: 4, nindex: 1 }, { value: 3, priority: 3, nindex: 2 }, { value: 2, priority: 2, nindex: 3 }];
    down(heap, heap.length)(heap[0], 0, (a, b) => a.priority - b.priority);
    expect(heap[0].value).to.equal(1);
  });

  it('should move element down in a 4-ary heap with priorities', () => {
    const heap = [1, 4, 3, 2];
    const priorities = [1, 4, 3, 2];
    downWithPriorities(heap, priorities, heap.length)({ value: 1, priority: 1, nindex: 0 }, 0, (a, b) => a.priority - b.priority);
    expect(heap[0]).to.equal(1);
  });

  it('should move element down in a 4-ary heap with priorities and indices', () => {
    const heap = [1, 4, 3, 2];
    const priorities = [1, 4, 3, 2];
    const indices = [0n, 1n, 2n, 3n];
    downWithPrioritiesAndIndices(heap, priorities, indices, heap.length)({ 
      value: 1, 
      priority: 1, 
      nindex: 0, 
      sindex: 0n,
      index: 0n
    }, 0, (a, b) => a.priority - b.priority);
    expect(heap[0]).to.equal(1);
  });

  it('should heapify an array', () => {
    const heap = [{ value: 4, priority: 4, nindex: 0 }, { value: 3, priority: 3, nindex: 1 }, { value: 2, priority: 2, nindex: 2 }, { value: 1, priority: 1, nindex: 3 }];
    heapify(heap, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0].value).to.equal(1);
  });

  it('should heapify an array with priorities', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    heapifyWithPriorities(heap, priorities, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0]).to.equal(1);
  });

  it('should heapify an array with priorities and indices', () => {
    const heap = [4, 3, 2, 1];
    const priorities = [4, 3, 2, 1];
    const indices = [0n, 1n, 2n, 3n];
    heapifyWithPrioritiesAndIndices(heap, priorities, indices, heap.length)((a, b) => a.priority - b.priority);
    expect(heap[0]).to.equal(1);
  });

  it('should grow an array', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const grownArr = grow(arr, 5, Uint8Array);
    expect(grownArr.length).to.equal(5);
    expect(grownArr[0]).to.equal(1);
    expect(grownArr[1]).to.equal(2);
    expect(grownArr[2]).to.equal(3);
  });
});