/**
 * A minimal external store for browser-only state such as localStorage.
 *
 * Components read these with React's `useSyncExternalStore` instead of calling
 * setState inside an effect. That avoids the cascading render the
 * react-hooks/set-state-in-effect rule warns about, and it stays correct under
 * static export, where the first render happens on the server with no `window`.
 *
 * Snapshots are cached because `useSyncExternalStore` compares them with
 * Object.is on every render. A reader that built a fresh object each call would
 * never compare equal and would loop forever, so `getSnapshot` must hand back
 * the same reference until something calls `invalidate`.
 */
export interface BrowserStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  /** Drop the cached snapshot and tell every subscriber to re-read. */
  invalidate: () => void;
}

export function createBrowserStore<T>(
  read: () => T,
  serverValue: T,
): BrowserStore<T> {
  // Wrapped in an object so a legitimately null or undefined value still counts
  // as cached.
  let cache: { value: T } | null = null;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      if (typeof window === "undefined") {
        return serverValue;
      }
      if (cache === null) {
        cache = { value: read() };
      }
      return cache.value;
    },
    getServerSnapshot() {
      return serverValue;
    },
    invalidate() {
      cache = null;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}
