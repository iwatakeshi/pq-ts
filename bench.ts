import { PriorityQueue, StablePriorityQueue, FlatPriorityQueue } from "./main";
import { run, bench, boxplot, summary } from "mitata";

const pq = new PriorityQueue<number>();
const spq = new StablePriorityQueue<number>();
const fpq = new FlatPriorityQueue<number>(Uint32Array, 1000);

const ITEMS_COUNT = 100000;

bench("PriorityQueue enqueue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(Math.random(), Math.random());
  }
});

bench("PriorityQueue dequeue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.dequeue();
  }
});

bench("StablePriorityQueue enqueue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(Math.random(), Math.random());
  }
});

bench("StablePriorityQueue dequeue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.dequeue();
  }
});

bench("FlatPriorityQueue enqueue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(Math.random(), Math.random());
  }
});

bench("FlatPriorityQueue dequeue 100000 items", () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.dequeue();
  }
});

await run();