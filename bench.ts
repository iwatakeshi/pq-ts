import { PriorityQueue, StablePriorityQueue, TypedPriorityQueue, StableTypedPriorityQueue, type IPriorityNode } from "./main.ts";
import { run, bench, boxplot, summary } from "mitata";

const ITEMS_COUNT = 1000000;

// PriorityQueue Enqueue
bench(`PriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const pq = new PriorityQueue();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(i, i);
  }
});

// PriorityQueue Dequeue (Pre-fill before measuring)
const pqPreFilled = new PriorityQueue();
for (let i = 0; i < ITEMS_COUNT; i++) {
  pqPreFilled.enqueue(i, i);
}
bench(`PriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pqPreFilled.dequeue();
  }
});

// StablePriorityQueue Enqueue
bench(`StablePriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const spq = new StablePriorityQueue();
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(i, i);
  }
});

// StablePriorityQueue Dequeue
const spqPreFilled = new StablePriorityQueue();
for (let i = 0; i < ITEMS_COUNT; i++) {
  spqPreFilled.enqueue(i, i);
}
bench(`StablePriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spqPreFilled.dequeue();
  }
});

// TypedPriorityQueue Enqueue
bench(`TypedPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const tpq = new TypedPriorityQueue(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    tpq.enqueue(i, i);
  }
});

// TypedPriorityQueue Dequeue
const tpqPreFilled = new TypedPriorityQueue(Uint32Array, ITEMS_COUNT);
for (let i = 0; i < ITEMS_COUNT; i++) {
  tpqPreFilled.enqueue(i, i);
}
bench(`TypedPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    tpqPreFilled.dequeue();
  }
});

// StableTypedPriorityQueue Enqueue
bench(`StableTypedPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  const stpq = new StableTypedPriorityQueue(Uint32Array, ITEMS_COUNT);
  for (let i = 0; i < ITEMS_COUNT; i++) {
    stpq.enqueue(i, i);
  }
});

// StableTypedPriorityQueue Dequeue
const stpqPreFilled = new StableTypedPriorityQueue(Uint32Array, ITEMS_COUNT);
for (let i = 0; i < ITEMS_COUNT; i++) {
  stpqPreFilled.enqueue(i, i);
}
bench(`StableTypedPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    stpqPreFilled.dequeue();
  }
});

// Native Array Enqueue
bench(`Native Array enqueue ${ITEMS_COUNT} items`, () => {
  const arr: IPriorityNode[] = [];
  for (let i = 0; i < ITEMS_COUNT; i++) {
    arr.push({ value: i, priority: i, nindex: i });
  }
});

// Native Array Dequeue
const arrPreFilled: IPriorityNode[] = [];
for (let i = 0; i < ITEMS_COUNT; i++) {
  arrPreFilled.push({ value: i, priority: i, nindex: i });
}
arrPreFilled.sort((a, b) => a.priority - b.priority);
bench(`Native Array dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    arrPreFilled.shift();
  }
});

// Force garbage collection before running benchmarks if supported
globalThis.gc?.();

// Run benchmarks
await run();
