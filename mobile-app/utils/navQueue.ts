const queue: string[] = [];

export function navQueuePush(screen: string): void {
  if (queue.length > 0 && queue[queue.length - 1] === screen) return;
  queue.push(screen);
  if (queue.length > 5) {
    queue.shift();
  }
}


export function navQueueBack(): string | null {
  queue.pop();
  return queue.length > 0 ? queue[queue.length - 1] : null;
}

export function navQueueReset(): void {
  queue.length = 0;
}
