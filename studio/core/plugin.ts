import type { PakeyStudioProjectModel } from './project-model';

export type PakeyStudioPluginCapability =
  | 'project:read'
  | 'project:validate'
  | 'project:transform'
  | 'ui:panel'
  | 'ui:toolbar'
  | 'build:inspect';

export interface PakeyStudioPluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: PakeyStudioPluginCapability[];
}

export interface PakeyStudioValidationMessage {
  level: 'info' | 'warning' | 'error';
  code: string;
  message: string;
  path?: string;
}

export interface PakeyStudioPluginContext {
  readonly project: PakeyStudioProjectModel;
  report(message: PakeyStudioValidationMessage): void;
}

export interface PakeyStudioProjectPlugin {
  manifest: PakeyStudioPluginManifest;
  validate?(
    context: PakeyStudioPluginContext,
  ): PakeyStudioValidationMessage[] | Promise<PakeyStudioValidationMessage[]>;
  transform?(
    project: PakeyStudioProjectModel,
  ): PakeyStudioProjectModel | Promise<PakeyStudioProjectModel>;
}

export interface PakeyStudioUiContribution {
  id: string;
  title: string;
  region: 'sidebar' | 'toolbar' | 'inspector' | 'status';
}

export interface PakeyStudioUiPlugin extends PakeyStudioProjectPlugin {
  contributions: PakeyStudioUiContribution[];
}

export type PakeyStudioPlugin =
  | PakeyStudioProjectPlugin
  | PakeyStudioUiPlugin;

export function isPakeyStudioUiPlugin(
  plugin: PakeyStudioPlugin,
): plugin is PakeyStudioUiPlugin {
  return 'contributions' in plugin;
}
