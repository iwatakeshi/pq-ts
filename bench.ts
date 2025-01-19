import { PriorityQueue, StablePriorityQueue, TypedPriorityQueue, StableTypedPriorityQueue } from "./main";
import { run, bench, boxplot, summary } from "mitata";

const ITEMS_COUNT = 1000000;

bench(`PriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const pq = new PriorityQueue(); // Reset queue
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(i, i); // Use integer priorities instead of Math.random()
  }
});

bench(`PriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const pq = new PriorityQueue();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.dequeue();
  }
});

bench(`StablePriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const spq = new StablePriorityQueue();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(i, i);
  }
});

bench(`StablePriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const spq = new StablePriorityQueue();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.dequeue();
  }
});

bench(`FlatPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const fpq = new TypedPriorityQueue(Uint32Array, ITEMS_COUNT); // Preallocate capacity
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(i, i);
  }
});

bench(`FlatPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const fpq = new TypedPriorityQueue(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.dequeue();
  }
});

bench(`StableTypedPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const sfpq = new StableTypedPriorityQueue(Uint32Array, ITEMS_COUNT); // Preallocate
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.enqueue(i, i);
  }
});

bench(`StableTypedPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const sfpq = new StableTypedPriorityQueue(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.dequeue();
  }
});

bench(`Native Array enqueue ${ITEMS_COUNT} items`, () => {
  const arr = [];
  for (let i = 0; i < ITEMS_COUNT; i++) {
    arr.push({ value: i, priority: i });
  }
});

bench(`Native Array dequeue ${ITEMS_COUNT} items`, () => {
  const arr = [];
  for (let i = 0; i < ITEMS_COUNT; i++) {
    arr.push({ value: i, priority: i });
  }
  arr.sort((a, b) => a.priority - b.priority);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    arr.shift();
  }
});

// Force garbage collection before running benchmarks if supported
globalThis.gc?.();

// Run benchmarks
await run();