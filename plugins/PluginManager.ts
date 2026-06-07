import { normalizePluginId, validatePluginManifest } from './Plugin';
import type { Plugin, PluginContext, RegisteredPlugin } from './Plugin';

export interface PluginManagerOptions {
  metadata?: Readonly<Record<string, unknown>>;
}

export class PluginManager {
  private readonly plugins = new Map<string, RegisteredPlugin>();
  private readonly metadata: Readonly<Record<string, unknown>>;

  constructor(options: PluginManagerOptions = {}) {
    this.metadata = Object.freeze({ ...(options.metadata ?? {}) });
  }

  register(plugin: Plugin): void {
    validatePluginManifest(plugin.manifest);

    const id = normalizePluginId(plugin.manifest.id);
    if (this.plugins.has(id)) {
      throw new Error(`Plugin "${id}" is already registered.`);
    }

    this.plugins.set(id, { plugin, active: false });
  }

  unregister(pluginId: string): void {
    const id = normalizePluginId(pluginId);
    const existing = this.plugins.get(id);

    if (!existing) {
      return;
    }

    if (existing.active) {
      throw new Error(`Plugin "${id}" must be deactivated before unregistering.`);
    }

    this.plugins.delete(id);
  }

  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(normalizePluginId(pluginId))?.plugin;
  }

  list(): RegisteredPlugin[] {
    return [...this.plugins.values()];
  }

  isActive(pluginId: string): boolean {
    return this.plugins.get(normalizePluginId(pluginId))?.active ?? false;
  }

  async activate(pluginId: string): Promise<void> {
    const id = normalizePluginId(pluginId);
    const registered = this.requireRegistered(id);

    if (registered.active) {
      return;
    }

    await registered.plugin.activate?.(this.createContext(id));
    this.plugins.set(id, { plugin: registered.plugin, active: true });
  }

  async deactivate(pluginId: string): Promise<void> {
    const id = normalizePluginId(pluginId);
    const registered = this.requireRegistered(id);

    if (!registered.active) {
      return;
    }

    await registered.plugin.deactivate?.(this.createContext(id));
    this.plugins.set(id, { plugin: registered.plugin, active: false });
  }

  private requireRegistered(pluginId: string): RegisteredPlugin {
    const registered = this.plugins.get(pluginId);

    if (!registered) {
      throw new Error(`Plugin "${pluginId}" is not registered.`);
    }

    return registered;
  }

  private createContext(pluginId: string): PluginContext {
    return {
      pluginId,
      metadata: this.metadata,
    };
  }
}
