# pq-ts

`pq-ts` is a TypeScript library that provides efficient and flexible priority
queue implementations. It includes both standard and stable priority queues,
ensuring that elements with the same priority maintain their relative order of
insertion. Additionally, it supports typed priority queues for better type
safety.

## Features

- **Priority Queue**: A standard priority queue that orders elements based on
  their priority.
- **Stable Priority Queue**: A stable priority queue that maintains the relative
  order of elements with the same priority.
- **Typed Priority Queue**: A priority queue with type safety.
- **Stable Typed Priority Queue**: A stable priority queue with type safety.
- **Custom Comparer**: Support for custom comparison functions to define the
  order of elements.
- **Efficient Operations**: Optimized for efficient enqueue, dequeue, and heap
  operations.

## Installation

You can install `pq-ts` using npm:

```sh
npm install pq-ts
```

Or using yarn:

```sh
yarn add pq-ts
```

## Usage

### Importing the Library

```typescript
import {
  PriorityQueue,
  StablePriorityQueue,
  StableTypedPriorityQueue,
  TypedPriorityQueue,
} from "pq-ts";
```

### Priority Queue

#### Creating a Priority Queue

```typescript
const pq = new PriorityQueue<number>();
```

#### Enqueuing Elements

```typescript
pq.enqueue(1, 5);
pq.enqueue(2, 3);
pq.enqueue(3, 4);
```

#### Dequeuing Elements

```typescript
console.log(pq.dequeue()); // 2
console.log(pq.dequeue()); // 3
console.log(pq.dequeue()); // 1
```

#### Peeking the Highest Priority Element

```typescript
pq.enqueue(1, 5);
pq.enqueue(2, 3);
pq.enqueue(3, 4);

console.log(pq.peek()); // 2
```

#### Other Methods

- `clear()`: Clears all elements from the queue.
- `count`: Returns the number of elements in the queue.
- `isEmpty()`: Checks if the queue is empty.
- `values`: Returns the values in the queue (unordered).
- `toArray()`: Converts the queue to an array (prioritized).
- `remove(value)`: Removes a specific element from the queue.
- `indexOf(value, dequeue, comparer)`: Returns the index of a specific element.
- `priorityAt(index, dequeue, comparer)`: Returns the priority of an element at
  a specific index.
- `clone()`: Creates a shallow copy of the queue.
- `toString()`: Returns a string representation of the queue.

### Stable Priority Queue

#### Creating a Stable Priority Queue

```typescript
const spq = new StablePriorityQueue<number>();
```

#### Enqueuing Elements

```typescript
spq.enqueue(1, 5);
spq.enqueue(2, 3);
spq.enqueue(3, 4);
```

#### Dequeuing Elements

```typescript
console.log(spq.dequeue()); // 2
console.log(spq.dequeue()); // 3
console.log(spq.dequeue()); // 1
```

#### Peeking the Highest Priority Element

```typescript
spq.enqueue(1, 5);
spq.enqueue(2, 3);
spq.enqueue(3, 4);

console.log(spq.peek()); // 2
```

#### Other Methods

- `clear()`: Clears all elements from the queue.
- `count`: Returns the number of elements in the queue.
- `isEmpty()`: Checks if the queue is empty.
- `values`: Returns the values in the queue (unordered).
- `toArray()`: Converts the queue to an array (prioritized).
- `remove(value)`: Removes a specific element from the queue.
- `indexOf(value, dequeue, comparer)`: Returns the index of a specific element.
- `priorityAt(index, dequeue, comparer)`: Returns the priority of an element at
  a specific index.
- `clone()`: Creates a shallow copy of the queue.
- `toString()`: Returns a string representation of the queue.

### Typed Priority Queue

#### Creating a Typed Priority Queue

```typescript
const tpq = new TypedPriorityQueue<number>();
```

#### Enqueuing Elements

```typescript
tpq.enqueue(1, 5);
tpq.enqueue(2, 3);
tpq.enqueue(3, 4);
```

#### Dequeuing Elements

```typescript
console.log(tpq.dequeue()); // 2
console.log(tpq.dequeue()); // 3
console.log(tpq.dequeue()); // 1
```

#### Peeking the Highest Priority Element

```typescript
tpq.enqueue(1, 5);
tpq.enqueue(2, 3);
tpq.enqueue(3, 4);

console.log(tpq.peek()); // 2
```

#### Other Methods

- `clear()`: Clears all elements from the queue.
- `count`: Returns the number of elements in the queue.
- `isEmpty()`: Checks if the queue is empty.
- `values`: Returns the values in the queue (unordered).
- `toArray()`: Converts the queue to an array (prioritized).
- `remove(value)`: Removes a specific element from the queue.
- `indexOf(value, dequeue, comparer)`: Returns the index of a specific element.
- `priorityAt(index, dequeue, comparer)`: Returns the priority of an element at
  a specific index.
- `clone()`: Creates a shallow copy of the queue.
- `toString()`: Returns a string representation of the queue.

### Stable Typed Priority Queue

#### Creating a Stable Typed Priority Queue

```typescript
const stpq = new StableTypedPriorityQueue<number>();
```

#### Enqueuing Elements

```typescript
stpq.enqueue(1, 5);
stpq.enqueue(2, 3);
stpq.enqueue(3, 4);
```

#### Dequeuing Elements

```typescript
console.log(stpq.dequeue()); // 2
console.log(stpq.dequeue()); // 3
console.log(stpq.dequeue()); // 1
```

#### Peeking the Highest Priority Element

```typescript
stpq.enqueue(1, 5);
stpq.enqueue(2, 3);
stpq.enqueue(3, 4);

console.log(stpq.peek()); // 2
```

#### Other Methods

- `clear()`: Clears all elements from the queue.
- `count`: Returns the number of elements in the queue.
- `isEmpty()`: Checks if the queue is empty.
- `values`: Returns the values in the queue (unordered).
- `toArray()`: Converts the queue to an array (prioritized).
- `remove(value)`: Removes a specific element from the queue.
- `indexOf(value, dequeue, comparer)`: Returns the index of a specific element.
- `priorityAt(index, dequeue, comparer)`: Returns the priority of an element at
  a specific index.
- `clone()`: Creates a shallow copy of the queue.
- `toString()`: Returns a string representation of the queue.

## Examples

### Using a Custom Comparer

You can define a custom comparer to change the order of elements in the queue:

```typescript
const customComparer = (
  a: { value: number; priority: number },
  b: { value: number; priority: number },
) => {
  return b.priority - a.priority; // Max-heap
};

const pq = new PriorityQueue<number>([], customComparer);
pq.enqueue(1, 5);
pq.enqueue(2, 3);
pq.enqueue(3, 4);

console.log(pq.dequeue()); // 1
console.log(pq.dequeue()); // 3
console.log(pq.dequeue()); // 2
```

## Benchmarks

```sh
bun run bench.ts
```

### Results

The benchmark below ran on an Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz using bun
1.1.43 (x64-win32)

| Benchmark                                      | Avg (min … max) | p75 / p99 |
| ---------------------------------------------- | --------------- | --------- |
| PriorityQueue enqueue 1000000 items            | 73.97 ms/iter   | 108.20 ms |
| PriorityQueue dequeue 1000000 items            | 1.76 ms/iter    | 1.70 ms   |
| StablePriorityQueue enqueue 1000000 items      | 156.84 ms/iter  | 221.69 ms |
| StablePriorityQueue dequeue 1000000 items      | 1.94 ms/iter    | 1.93 ms   |
| TypedPriorityQueue enqueue 1000000 items       | 69.31 ms/iter   | 57.97 ms  |
| TypedPriorityQueue dequeue 1000000 items       | 1.45 ms/iter    | 1.45 ms   |
| StableTypedPriorityQueue enqueue 1000000 items | 205.20 ms/iter  | 202.10 ms |
| StableTypedPriorityQueue dequeue 1000000 items | 1.25 ms/iter    | 1.22 ms   |
| Native Array enqueue 1000000 items             | 43.05 ms/iter   | 52.73 ms  |
| Native Array dequeue 1000000 items             | 17.18 ms/iter   | 18.03 ms  |

The benchmark below ran on an Apple M1 Pro (2021) using bun 1.1.43
(aarch64-darwin)

| Benchmark                                      | Avg (min … max) | p75 / p99 |
| ---------------------------------------------- | --------------- | --------- |
| PriorityQueue enqueue 1000000 items            | 20.56 ms/iter   | 25.00 ms  |
| PriorityQueue dequeue 1000000 items            | 629.17 µs/iter  | 627.21 µs |
| StablePriorityQueue enqueue 1000000 items      | 51.82 ms/iter   | 54.80 ms  |
| StablePriorityQueue dequeue 1000000 items      | 630.16 µs/iter  | 628.88 µs |
| TypedPriorityQueue enqueue 1000000 items       | 34.00 ms/iter   | 34.59 ms  |
| TypedPriorityQueue dequeue 1000000 items       | 470.82 µs/iter  | 470.96 µs |
| StableTypedPriorityQueue enqueue 1000000 items | 112.37 ms/iter  | 112.92 ms |
| StableTypedPriorityQueue dequeue 1000000 items | 476.81 µs/iter  | 484.38 µs |
| Native Array enqueue 1000000 items             | 8.43 ms/iter    | 10.69 ms  |
| Native Array dequeue 1000000 items             | 6.59 ms/iter    | 6.57 ms   |

## Documentation

Deno is required to generate the documentation.

```sh
# Generate the docs
npm run docs:generate
# View the docs
npm run docs:serve
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on
GitHub.

## Credits

- [Behind the implementation of .NET's PriorityQueue](https://andrewlock.net/behind-the-implementation-of-dotnets-priorityqueue/)
- [DotNet's `PriorityQueue<TElement,TPriority> Class`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/PriorityQueue.cs)

## License

This project is licensed under the MIT License.
