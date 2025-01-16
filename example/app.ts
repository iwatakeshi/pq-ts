import { PriorityQueue } from "../src/pq";

const pq = new PriorityQueue<number>();

const inputs = {
  value: document.getElementById('input-value') as HTMLInputElement,
  priority: document.getElementById('input-priority') as HTMLInputElement,
};

export function enqueue() {
  const value = inputs.value.value;
  const priority = inputs.priority.value;
  if (value && priority) {
    pq.enqueue(Number.parseInt(value), Number.parseInt(priority));
    updateQueue();
  }
}

export function enqueueRandom() {
  const value = Math.floor(Math.random() * 100);
  const priority = Math.floor(Math.random() * 100);
  pq.enqueue(value, priority);
  updateQueue();
}

export function dequeue() {
  const priority = pq.priorityAt(0);
  const dequeuedValue = pq.dequeue();
  if (dequeuedValue !== undefined) {
    updateDequeued(dequeuedValue, priority);
  }
  updateQueue();
}

export function updateQueue() {
  const queueList = document.getElementById('queue-list');
  if (queueList) {
    queueList.innerHTML = '';
    for (const element of pq.heap) {
      const li = document.createElement('li');
      li.textContent = `${element.value} (Priority: ${element.priority})`;
      queueList.appendChild(li);
    }
  }
}

export function updateDequeued(value: number, priority: number) {
  const dequeuedList = document.getElementById('dequeued-list');
  if (dequeuedList) {
    const li = document.createElement('li');
    li.textContent = `${value} (Priority: ${priority})`;
    dequeuedList.appendChild(li);
  }
}

window.enqueue = enqueue;
window.enqueueRandom = enqueueRandom;
window.dequeue = dequeue;
window.pq = pq;

declare global {
  interface Window {
    enqueue: () => void;
    enqueueRandom: () => void;
    dequeue: () => void;
    pq: PriorityQueue<number>;
  }
}