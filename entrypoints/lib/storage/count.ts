import { storage } from '#imports';

export interface CountStorage {
  count: number;
}

export const countStorage = storage.defineItem<CountStorage>(
    'local:count',
    {
        fallback: {
            count: 0
        }
    }
);