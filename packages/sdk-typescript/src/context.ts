import { AsyncLocalStorage } from 'node:async_hooks';
import type { TaskContext } from './types.js';

const storage = new AsyncLocalStorage<TaskContext>();

export function getTaskContext(): TaskContext | undefined {
  return storage.getStore();
}

export function runWithTask<T>(ctx: TaskContext, fn: () => T | Promise<T>): T | Promise<T> {
  return storage.run(ctx, fn);
}
