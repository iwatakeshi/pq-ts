import { expect, describe, it } from "vitest";
import { parent, child, up, upWithPriorities, upWithPrioritiesAndIndices, down, downWithPriorities, downWithPrioritiesAndIndices, swap, heapify, heapifyWithPriorities, heapifyWithPrioritiesAndIndices, grow } from "./primitive.ts";
import type { IPriorityNode } from "./types.ts";

describe("primitives", () => {
  describe("parent", () => {
    it("returns the parent index", () => {
      expect(parent(1)).toBe(0);
      expect(parent(2)).toBe(0);
      expect(parent(3)).toBe(0);
      expect(parent(4)).toBe(0);
      expect(parent(5)).toBe(1);
      expect(parent(6)).toBe(1);
      expect(parent(7)).toBe(1);
      expect(parent(8)).toBe(1);
      expect(parent(9)).toBe(2);
      expect(parent(10)).toBe(2);
      expect(parent(11)).toBe(2);
      expect(parent(12)).toBe(2);
    });
  });

  describe("child", () => {
    it("returns the child index", () => {
      expect(child(0, 0)).toBe(1);
      expect(child(0, 1)).toBe(2);
      expect(child(0, 2)).toBe(3);
      expect(child(0, 3)).toBe(4);
      expect(child(1, 0)).toBe(5);
      expect(child(1, 1)).toBe(6);
      expect(child(1, 2)).toBe(7);
      expect(child(1, 3)).toBe(8);
      expect(child(2, 0)).toBe(9);
      expect(child(2, 1)).toBe(10);
      expect(child(2, 2)).toBe(11);
      expect(child(2, 3)).toBe(12);
    });
  });

  describe("swap", () => {
    it("swaps two elements in an array", () => {
      const array = [1, 2, 3, 4];
      swap(array, 0, 3);
      expect(array).toEqual([4, 2, 3, 1]);
    });
  });

  describe("up", () => {
    it("moves an element up in a 4-ary heap", () => {
      const heap = [1, 4, 3, 7];
      up(3, heap, (a: number, b: number) => a - b);
      expect(heap).toEqual([1, 4, 3, 7]);
    });

    it("moves an element up in a small heap", () => {
      const heap = [{ value: 3, priority: 3 }, { value: 1, priority: 1 }];
      up(1, heap, (a: IPriorityNode, b: IPriorityNode) => a.priority - b.priority);
      expect(heap).toEqual([{ value: 1, priority: 1 }, { value: 3, priority: 3 }]);
    });

    it("moves an element up in a larger heap", () => {
      const heap = [
        { value: 5, priority: 5 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 1, priority: 1 }
      ];
      up(3, heap, (a: IPriorityNode, b: IPriorityNode) => a.priority - b.priority);
      expect(heap).toEqual([
        { value: 1, priority: 1 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 5, priority: 5 }
      ]);
    });
  });

  describe("upWithPriorities", () => {
    it("moves an element up in a heap with priorities", () => {
      const heap = [1, 4, 3, 7];
      const priorities = [1, 4, 3, 0];
      upWithPriorities(3, heap, (a: number, b: number) => a - b, priorities);
      expect(heap).toEqual([7, 4, 3, 1]);
      expect(priorities).toEqual([0, 4, 3, 1]);
    });
  });

  describe("upWithPrioritiesAndIndices", () => {
    it("moves an element up in a heap with priorities and indices", () => {
      const heap = [1, 4, 3, 7];
      const priorities = [1, 4, 3, 0];
      const indices = [0n, 1n, 2n, 3n];
      upWithPrioritiesAndIndices(3, heap, (a: number, b: number) => a - b, priorities, indices);
      expect(heap).toEqual([7, 4, 3, 1]);
      expect(priorities).toEqual([0, 4, 3, 1]);
      expect(indices).toEqual([3n, 1n, 2n, 0n]);
    });
  });

  describe("down", () => {
    it("moves an element down in a 4-ary heap", () => {
      const heap = [1, 4, 3, 7, 8, 9, 10];
      down(1, heap.length, heap, (a: number, b: number) => a - b);
      expect(heap).toEqual([1, 4, 3, 7, 8, 9, 10]);
    });
  });

  describe("downWithPriorities", () => {
    it("moves an element down in a heap with priorities", () => {
      const heap = [1, 4, 3, 7, 8, 9, 10];
      const priorities = [1, 4, 3, 7, 8, 9, 10];
      downWithPriorities(1, heap.length, heap, (a: number, b: number) => a - b, priorities);
      expect(heap).toEqual([1, 4, 3, 7, 8, 9, 10]);
      expect(priorities).toEqual([1, 4, 3, 7, 8, 9, 10]);
    });
  });

  describe("downWithPrioritiesAndIndices", () => {
    it("moves an element down in a heap with priorities and indices", () => {
      const heap = [1, 4, 3, 7, 8, 9, 10];
      const priorities = [1, 4, 3, 7, 8, 9, 10];
      const indices = [0n, 1n, 2n, 3n, 4n, 5n, 6n];
      downWithPrioritiesAndIndices(1, heap.length, heap, (a: number, b: number) => a - b, priorities, indices);
      expect(heap).toEqual([1, 4, 3, 7, 8, 9, 10]);
      expect(priorities).toEqual([1, 4, 3, 7, 8, 9, 10]);
      expect(indices).toEqual([0n, 1n, 2n, 3n, 4n, 5n, 6n]);
    });
  });

  describe("heapify", () => {
    it("creates a heap from an array", () => {
      const array = [
        { value: 5, priority: 5 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 1, priority: 1 }
      ];
      heapify(array.length, array, (a: IPriorityNode, b: IPriorityNode) => a.priority - b.priority);
      expect(array).toEqual([
        { value: 1, priority: 1 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 5, priority: 5 }
      ]);
    });
  });

  describe("heapifyWithPriorities", () => {
    it("creates a heap from an array with priorities", () => {
      const array = [5, 3, 4, 1];
      const priorities = [5, 3, 4, 1];
      heapifyWithPriorities(array.length, array, (a: number, b: number) => a - b, priorities);
      expect(array).toEqual([1, 3, 4, 5]);
      expect(priorities).toEqual([1, 3, 4, 5]);
    });
  });

  describe("heapifyWithPrioritiesAndIndices", () => {
    it("creates a heap from an array with priorities and indices", () => {
      const array = [5, 3, 4, 1];
      const priorities = [5, 3, 4, 1];
      const indices = [0n, 1n, 2n, 3n];
      heapifyWithPrioritiesAndIndices(array.length, array, (a: number, b: number) => a - b, priorities, indices);
      expect(array).toEqual([1, 3, 4, 5]);
      expect(priorities).toEqual([1, 3, 4, 5]);
      expect(indices).toEqual([3n, 1n, 2n, 0n]);
    });
  });
});