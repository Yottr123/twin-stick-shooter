export interface Poolable {
  alive: boolean;
}

export interface Pool<T extends Poolable> {
  items: T[];
  get(): T;
  living(): T[];
  clear(): void;
}

/**
 * Creates a generic object pool.
 * Objects are reused when dead rather than garbage-collected.
 * `create` must return a fresh default object (alive flag is managed by pool).
 */
export function makePool<T extends Poolable>(create: () => Omit<T, "alive">): Pool<T> {
  const items: T[] = [];

  return {
    items,

    get(): T {
      const dead = items.find((i) => !i.alive);
      if (dead) {
        Object.assign(dead, create());
        dead.alive = true;
        return dead;
      }
      const fresh = { ...create(), alive: true } as T;
      items.push(fresh);
      return fresh;
    },

    living(): T[] {
      return items.filter((i) => i.alive);
    },

    clear(): void {
      items.forEach((i) => (i.alive = false));
    },
  };
}
