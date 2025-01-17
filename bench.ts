import { PriorityQueue, StablePriorityQueue, type IPriorityQueue } from './main';
import { FlatPriorityQueue } from './src/flat.pq';

function bench<T extends IPriorityQueue<number>>(queue: T, operations: number) {
  console.time(`${queue.constructor.name} enqueue`);
  for (let i = 0; i < operations; i++) {
    const value = Math.random();
    const priority = Math.random(); // Generate a priority for each enqueue operation
    queue.enqueue(value, priority);
  }
  console.timeEnd(`${queue.constructor.name} enqueue`);

  console.time(`${queue.constructor.name} dequeue`);
  for (let i = 0; i < operations; i++) {
    queue.dequeue();
  }
  console.timeEnd(`${queue.constructor.name} dequeue`);
}

const run = (queue: IPriorityQueue<number>, operations: number[], count: number) => {
  console.log(`Running benchmarks for ${queue.constructor.name}`);
  for (let i = 0; i < count; i++) {
    console.log(`Run ${i + 1}`);
    for (let j = 0; j < operations.length; j++) {
      bench(queue, operations[j]);
    }
  }
}

// const operations = 1_000_000;
const priorityQueue = new PriorityQueue<number>();
const stablePriorityQueue = new StablePriorityQueue<number>();
const flatPriorityQueue = new FlatPriorityQueue<number>(Uint32Array, 10000);
const operations = [10, 100, 1000, 10000, 100000, 1000000, 10000000];
const count = 100;

const operation = operations[5];

console.log(`Running benchmarks for ${operation} operations`);
bench(priorityQueue, operation);
bench(stablePriorityQueue, operation);
bench(flatPriorityQueue as IPriorityQueue<number>, operation);

// run(priorityQueue, operations, count);
// run(stablePriorityQueue, operations, count);
