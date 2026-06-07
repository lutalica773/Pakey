import { describe, expect, it, vi } from 'vitest';
import { PluginManager } from '../../plugins/PluginManager';
import type { Plugin } from '../../plugins/Plugin';

function createPlugin(id: string, hooks: Partial<Plugin> = {}): Plugin {
  return {
    manifest: {
      id,
      name: `${id} plugin`,
      version: '1.0.0',
    },
    ...hooks,
  };
}

describe('PluginManager', () => {
  it('registers and lists plugins without activating them', () => {
    const manager = new PluginManager();
    const plugin = createPlugin('studio.preview');

    manager.register(plugin);

    expect(manager.get('studio.preview')).toBe(plugin);
    expect(manager.list()).toEqual([{ plugin, active: false }]);
    expect(manager.isActive('studio.preview')).toBe(false);
  });

  it('normalizes plugin ids for lookup', () => {
    const manager = new PluginManager();
    const plugin = createPlugin('Studio.Tools');

    manager.register(plugin);

    expect(manager.get(' studio.tools ')).toBe(plugin);
  });

  it('prevents duplicate plugin registration', () => {
    const manager = new PluginManager();

    manager.register(createPlugin('studio.preview'));

    expect(() => manager.register(createPlugin('STUDIO.PREVIEW'))).toThrow(
      'already registered',
    );
  });

  it('activates and deactivates plugin hooks explicitly', async () => {
    const activate = vi.fn();
    const deactivate = vi.fn();
    const manager = new PluginManager({ metadata: { source: 'test' } });

    manager.register(createPlugin('studio.preview', { activate, deactivate }));

    await manager.activate('studio.preview');
    expect(manager.isActive('studio.preview')).toBe(true);
    expect(activate).toHaveBeenCalledWith({
      pluginId: 'studio.preview',
      metadata: { source: 'test' },
    });

    await manager.deactivate('studio.preview');
    expect(manager.isActive('studio.preview')).toBe(false);
    expect(deactivate).toHaveBeenCalledWith({
      pluginId: 'studio.preview',
      metadata: { source: 'test' },
    });
  });

  it('requires deactivation before unregistering active plugins', async () => {
    const manager = new PluginManager();

    manager.register(createPlugin('studio.preview'));
    await manager.activate('studio.preview');

    expect(() => manager.unregister('studio.preview')).toThrow(
      'must be deactivated',
    );

    await manager.deactivate('studio.preview');
    manager.unregister('studio.preview');

    expect(manager.get('studio.preview')).toBeUndefined();
  });

  it('rejects invalid manifests', () => {
    const manager = new PluginManager();
    const plugin = createPlugin(' ');

    expect(() => manager.register(plugin)).toThrow(
      'Plugin manifest id is required.',
    );
  });
});
