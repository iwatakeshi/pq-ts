import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { parent, child, up, down, swap, heapify } from "./primitive.ts";
Deno.test("primitives", () => {
  
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
      up(3, heap, (a, b) => a - b);
      expect(heap).toEqual([1, 4, 3, 7]);
    });

    it("moves an element up in a small heap", () => {
      const heap = [{ value: 3, priority: 3 }, { value: 1, priority: 1 }];
      up(1, heap, (a, b) => a.priority - b.priority);
      expect(heap).toEqual([{ value: 1, priority: 1 }, { value: 3, priority: 3 }]);
    });

    it("moves an element up in a larger heap", () => {
      const heap = [
        { value: 5, priority: 5 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 1, priority: 1 }
      ];
      up(3, heap, (a, b) => a.priority - b.priority);
      expect(heap).toEqual([
        { value: 1, priority: 1 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 5, priority: 5 }
      ]);
    });
  });

  describe.only("down", () => {
    it("moves an element down in a 4-ary heap", () => {
      const heap = [1, 4, 3, 7, 8, 9, 10];
      down(1, heap.length, heap, (a, b) => a - b);
      expect(heap).toEqual([1, 4, 3, 7, 8, 9, 10]);
    });

    it("moves an element down in a small heap", () => {
      const heap = [{ value: 1, priority: 1 }, { value: 3, priority: 3 }];
      down(0, heap.length, heap, (a, b) => a.priority - b.priority);
      expect(heap).toEqual([{ value: 1, priority: 1 }, { value: 3, priority: 3 }]);
    });

    it("moves an element down in a larger heap", () => {
      const heap = [
        { value: 1, priority: 1 },
        { value: 5, priority: 5 },
        { value: 4, priority: 4 },
        { value: 3, priority: 3 }
      ];
      down(0, heap.length, heap, (a, b) => a.priority - b.priority);
      expect(heap).toEqual([
        { value: 1, priority: 1 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 5, priority: 5 },
      ]);
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
      heapify(array.length, array, (a, b) => a.priority - b.priority);
      expect(array).toEqual([
        { value: 1, priority: 1 },
        { value: 3, priority: 3 },
        { value: 4, priority: 4 },
        { value: 5, priority: 5 }
      ]);
    });
  });
  
});
})