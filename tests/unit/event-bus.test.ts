import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '../../core/EventBus';
import type { AppEventMap } from '../../core/Events';

describe('EventBus', () => {
  it('publishes events to subscribers', () => {
    const bus = new EventBus<AppEventMap>();
    const handler = vi.fn();

    bus.subscribe('project:created', handler);
    bus.publish('project:created', { projectId: 'weekly' });

    expect(handler).toHaveBeenCalledWith({ projectId: 'weekly' });
  });

  it('supports multiple subscribers for one event', () => {
    const bus = new EventBus<AppEventMap>();
    const first = vi.fn();
    const second = vi.fn();

    bus.subscribe('project:updated', first);
    bus.subscribe('project:updated', second);
    bus.publish('project:updated', { projectId: 'docs' });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes handlers', () => {
    const bus = new EventBus<AppEventMap>();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe('project:deleted', handler);
    unsubscribe();
    bus.publish('project:deleted', { projectId: 'old-project' });

    expect(handler).not.toHaveBeenCalled();
    expect(bus.listenerCount('project:deleted')).toBe(0);
  });

  it('does not call subscribers added during the current publish', () => {
    const bus = new EventBus<AppEventMap>();
    const lateHandler = vi.fn();

    bus.subscribe('plugin:activated', () => {
      bus.subscribe('plugin:activated', lateHandler);
    });

    bus.publish('plugin:activated', { pluginId: 'studio.preview' });

    expect(lateHandler).not.toHaveBeenCalled();

    bus.publish('plugin:activated', { pluginId: 'studio.preview' });

    expect(lateHandler).toHaveBeenCalledTimes(1);
  });

  it('clears one event or all events', () => {
    const bus = new EventBus<AppEventMap>();
    const projectHandler = vi.fn();
    const pluginHandler = vi.fn();

    bus.subscribe('project:created', projectHandler);
    bus.subscribe('plugin:deactivated', pluginHandler);

    bus.clear('project:created');
    bus.publish('project:created', { projectId: 'weekly' });
    bus.publish('plugin:deactivated', { pluginId: 'studio.preview' });

    expect(projectHandler).not.toHaveBeenCalled();
    expect(pluginHandler).toHaveBeenCalledTimes(1);

    bus.clear();
    bus.publish('plugin:deactivated', { pluginId: 'studio.preview' });

    expect(pluginHandler).toHaveBeenCalledTimes(1);
  });

  it('ignores publishes without subscribers', () => {
    const bus = new EventBus<AppEventMap>();

    expect(() =>
      bus.publish('template:imported', { templateIds: ['starter'] }),
    ).not.toThrow();
  });
});
