export type EventHandler<Payload> = (payload: Payload) => void;

export type Unsubscribe = () => void;

export class EventBus<Events extends object> {
  private readonly handlers = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>();

  subscribe<Name extends keyof Events>(
    name: Name,
    handler: EventHandler<Events[Name]>,
  ): Unsubscribe {
    const handlers = this.getHandlers(name);
    const typedHandler = handler as EventHandler<Events[keyof Events]>;
    handlers.add(typedHandler);

    return () => {
      handlers.delete(typedHandler);
      if (handlers.size === 0) {
        this.handlers.delete(name);
      }
    };
  }

  publish<Name extends keyof Events>(name: Name, payload: Events[Name]): void {
    const handlers = this.handlers.get(name);
    if (!handlers) {
      return;
    }

    for (const handler of [...handlers]) {
      handler(payload);
    }
  }

  clear<Name extends keyof Events>(name?: Name): void {
    if (name === undefined) {
      this.handlers.clear();
      return;
    }

    this.handlers.delete(name);
  }

  listenerCount<Name extends keyof Events>(name: Name): number {
    return this.handlers.get(name)?.size ?? 0;
  }

  private getHandlers<Name extends keyof Events>(
    name: Name,
  ): Set<EventHandler<Events[keyof Events]>> {
    const existing = this.handlers.get(name);
    if (existing) {
      return existing;
    }

    const handlers = new Set<EventHandler<Events[keyof Events]>>();
    this.handlers.set(name, handlers);
    return handlers;
  }
}
