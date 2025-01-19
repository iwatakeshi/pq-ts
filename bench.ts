import { PriorityQueue, StablePriorityQueue, TypedPriorityQueue, StableFlatPriorityQueue } from "./main";
import { run, bench, boxplot, summary } from "mitata";

const ITEMS_COUNT = 1000000;

bench(`PriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const pq = new PriorityQueue<number>(); // Reset queue
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(i, i); // Use integer priorities instead of Math.random()
  }
});

bench(`PriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const pq = new PriorityQueue<number>();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.dequeue();
  }
});

bench(`StablePriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const spq = new StablePriorityQueue<number>();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(i, i);
  }
});

bench(`StablePriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const spq = new StablePriorityQueue<number>();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.dequeue();
  }
});

bench(`FlatPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const fpq = new TypedPriorityQueue<number>(Uint32Array, ITEMS_COUNT); // Preallocate capacity
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(i, i);
  }
});

bench(`FlatPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const fpq = new TypedPriorityQueue<number>(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.dequeue();
  }
});

bench(`StableFlatPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const sfpq = new StableFlatPriorityQueue<number>(Uint32Array, ITEMS_COUNT); // Preallocate
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.enqueue(i, i);
  }
});

bench(`StableFlatPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  const sfpq = new StableFlatPriorityQueue<number>(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.enqueue(i, i);
  }
  for (let i = 0; i < ITEMS_COUNT; i++) {
    sfpq.dequeue();
  }
});

// Force garbage collection before running benchmarks if supported
globalThis.gc?.();

// Run benchmarks
await run();