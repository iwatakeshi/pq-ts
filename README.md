# pq-ts

`pq-ts` is a TypeScript library that provides efficient and flexible priority queue implementations. It includes both a standard priority queue and a stable priority queue, ensuring that elements with the same priority maintain their relative order of insertion.

## Features

- **Priority Queue**: A standard priority queue that orders elements based on their priority.
- **Stable Priority Queue**: A stable priority queue that maintains the relative order of elements with the same priority.
- **Custom Comparer**: Support for custom comparison functions to define the order of elements.
- **Efficient Operations**: Optimized for efficient enqueue, dequeue, and heap operations.

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
import { PriorityQueue, StablePriorityQueue } from 'pq-ts';
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

- `clear()` - Clears all elements from the queue.
- `count`  - Returns the number of elements in the queue.
- `isEmpty()`  - Checks if the queue is empty.
- `values`  - Returns the values in the queue (unordered).
- `toArray()`  - Converts the queue to an array (prioritized).
- `remove(value)`  - Removes a specific element from the queue.
- `indexOf(value, dequeue, comparer)`  - Returns the index of a specific element.
- `priorityAt(index, dequeue, comparer)`  - Returns the priority of an element at a specific index.
- `clone()`  - Creates a shallow copy of the queue.
- `toString()`  - Returns a string representation of the queue.

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
- `indexOf(value, dequeue)`: Returns the index of a specific element.
- `priorityAt(index, dequeue)`: Returns the priority of an element at a specific index.
- `clone()`: Creates a shallow copy of the queue.
- `toString()`: Returns a string representation of the queue.

## Examples

### Using a Custom Comparer

You can define a custom comparer to change the order of elements in the queue:

```typescript
const customComparer = (a: { value: number; priority: number }, b: { value: number; priority: number }) => {
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

## Documentation

Deno is required to generate the documentation.
```sh
# Generate the docs
npm run docs:generate
# View the docs
npm run docs:serve
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
