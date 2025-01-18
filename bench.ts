import { PriorityQueue, StablePriorityQueue, FlatPriorityQueue } from "./main";
import { run, bench, boxplot, summary } from "mitata";

const pq = new PriorityQueue<number>();
const spq = new StablePriorityQueue<number>();
const fpq = new FlatPriorityQueue<number>(Uint32Array, 1000);

const ITEMS_COUNT = 1000000;

bench(`PriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.enqueue(Math.random(), Math.random());
  }
});

bench(`PriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pq.dequeue();
  }
});

bench(`StablePriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.enqueue(Math.random(), Math.random());
  }
});

bench(`StablePriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    spq.dequeue();
  }
});

bench(`FlatPriorityQueue enqueue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.enqueue(Math.random(), Math.random());
  }
});

bench(`FlatPriorityQueue dequeue ${ITEMS_COUNT} items`, () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fpq.dequeue();
  }
});

await run();