export interface ProjectCreatedEvent {
  projectId: string;
}

export interface ProjectUpdatedEvent {
  projectId: string;
}

export interface ProjectDeletedEvent {
  projectId: string;
}

export interface TemplateImportedEvent {
  templateIds: string[];
}

export interface PluginActivatedEvent {
  pluginId: string;
}

export interface PluginDeactivatedEvent {
  pluginId: string;
}

export interface AppEventMap {
  'project:created': ProjectCreatedEvent;
  'project:updated': ProjectUpdatedEvent;
  'project:deleted': ProjectDeletedEvent;
  'template:imported': TemplateImportedEvent;
  'plugin:activated': PluginActivatedEvent;
  'plugin:deactivated': PluginDeactivatedEvent;
}

export type AppEventName = keyof AppEventMap;
