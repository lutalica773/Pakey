export type PluginCapability =
  | 'project:read'
  | 'project:validate'
  | 'project:transform'
  | 'ui:contribute'
  | 'build:inspect';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities?: PluginCapability[];
}

export interface PluginContext {
  readonly pluginId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface Plugin {
  readonly manifest: PluginManifest;
  activate?(context: PluginContext): void | Promise<void>;
  deactivate?(context: PluginContext): void | Promise<void>;
}

export interface RegisteredPlugin {
  readonly plugin: Plugin;
  readonly active: boolean;
}

export function normalizePluginId(id: string): string {
  return id.trim().toLowerCase();
}

export function validatePluginManifest(manifest: PluginManifest): void {
  const id = normalizePluginId(manifest.id);

  if (!id) {
    throw new Error('Plugin manifest id is required.');
  }

  if (!manifest.name.trim()) {
    throw new Error(`Plugin "${id}" manifest name is required.`);
  }

  if (!manifest.version.trim()) {
    throw new Error(`Plugin "${id}" manifest version is required.`);
  }
}
