type ObserverRecord = {
  callback: IntersectionObserverCallback;
  targets: Set<Element>;
  observer: IntersectionObserver;
};

const observerRecords: ObserverRecord[] = [];

export function installIntersectionObserver() {
  observerRecords.length = 0;

  class FakeIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: number[] = [];
    private readonly record: ObserverRecord;

    constructor(callback: IntersectionObserverCallback) {
      this.record = {
        callback,
        targets: new Set(),
        observer: this as unknown as IntersectionObserver,
      };
      observerRecords.push(this.record);
    }

    observe(target: Element) {
      this.record.targets.add(target);
    }

    unobserve(target: Element) {
      this.record.targets.delete(target);
    }

    disconnect() {
      this.record.targets.clear();
    }

    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver =
    FakeIntersectionObserver as unknown as typeof IntersectionObserver;
}

export function triggerIntersection(target: Element, isIntersecting: boolean) {
  for (const record of observerRecords) {
    if (!record.targets.has(target)) continue;
    const entry = { target, isIntersecting } as IntersectionObserverEntry;
    record.callback([entry], record.observer);
  }
}
