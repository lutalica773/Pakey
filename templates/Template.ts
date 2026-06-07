export type TemplateId = string;

export interface TemplateWindowDefaults {
  width: number;
  height: number;
  title?: string;
  hideTitleBar?: boolean;
  resizable?: boolean;
}

export interface TemplateRuntimeDefaults {
  incognito?: boolean;
  enableFind?: boolean;
  enableDragDrop?: boolean;
  newWindow?: boolean;
}

export interface TemplateBuildDefaults {
  targets: string[];
  debug?: boolean;
}

export interface Template {
  schemaVersion: 1;
  id: TemplateId;
  name: string;
  description?: string;
  window: TemplateWindowDefaults;
  runtime: TemplateRuntimeDefaults;
  build: TemplateBuildDefaults;
  tags: string[];
}

export interface CreateTemplateInput {
  id: TemplateId;
  name: string;
  description?: string;
  window: TemplateWindowDefaults;
  runtime?: TemplateRuntimeDefaults;
  build: TemplateBuildDefaults;
  tags?: string[];
}

export type UpdateTemplateInput = Partial<
  Pick<Template, 'name' | 'description' | 'window' | 'runtime' | 'build' | 'tags'>
>;

export interface TemplateJsonDocument {
  templates: Template[];
}

export const TEMPLATE_SCHEMA_VERSION = 1 as const;

export function createTemplate(input: CreateTemplateInput): Template {
  const template: Template = {
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    id: input.id,
    name: input.name,
    description: input.description,
    window: input.window,
    runtime: input.runtime ?? {},
    build: input.build,
    tags: input.tags ?? [],
  };

  assertTemplate(template);
  return template;
}

export function updateTemplate(
  template: Template,
  input: UpdateTemplateInput,
): Template {
  const updated: Template = {
    ...template,
    ...input,
    window: input.window ?? template.window,
    runtime: input.runtime ?? template.runtime,
    build: input.build ?? template.build,
    tags: input.tags ?? template.tags,
  };

  assertTemplate(updated);
  return updated;
}

export function assertTemplate(value: unknown): asserts value is Template {
  if (!isRecord(value)) {
    throw new Error('Template must be an object.');
  }

  if (value.schemaVersion !== TEMPLATE_SCHEMA_VERSION) {
    throw new Error(`Template schemaVersion must be ${TEMPLATE_SCHEMA_VERSION}.`);
  }

  assertString(value.id, 'Template id');
  assertString(value.name, 'Template name');
  if (value.description !== undefined) {
    assertString(value.description, 'Template description');
  }

  assertWindowDefaults(value.window);
  assertRuntimeDefaults(value.runtime);
  assertBuildDefaults(value.build);

  if (!Array.isArray(value.tags)) {
    throw new Error('Template tags must be an array.');
  }
  for (const tag of value.tags) {
    assertString(tag, 'Template tag');
  }
}

export function parseTemplateJson(raw: string): TemplateJsonDocument {
  const parsed = JSON.parse(raw) as unknown;

  if (!isRecord(parsed) || !Array.isArray(parsed.templates)) {
    throw new Error('Template JSON must contain a templates array.');
  }

  for (const template of parsed.templates) {
    assertTemplate(template);
  }

  return { templates: parsed.templates };
}

export function stringifyTemplateJson(templates: Template[]): string {
  for (const template of templates) {
    assertTemplate(template);
  }

  const document: TemplateJsonDocument = { templates };
  return `${JSON.stringify(document, null, 2)}\n`;
}

function assertWindowDefaults(value: unknown): asserts value is TemplateWindowDefaults {
  if (!isRecord(value)) {
    throw new Error('Template window must be an object.');
  }

  assertPositiveNumber(value.width, 'Template window width');
  assertPositiveNumber(value.height, 'Template window height');
  if (value.title !== undefined) {
    assertString(value.title, 'Template window title');
  }
  assertOptionalBoolean(value.hideTitleBar, 'Template window hideTitleBar');
  assertOptionalBoolean(value.resizable, 'Template window resizable');
}

function assertRuntimeDefaults(value: unknown): asserts value is TemplateRuntimeDefaults {
  if (!isRecord(value)) {
    throw new Error('Template runtime must be an object.');
  }

  assertOptionalBoolean(value.incognito, 'Template runtime incognito');
  assertOptionalBoolean(value.enableFind, 'Template runtime enableFind');
  assertOptionalBoolean(value.enableDragDrop, 'Template runtime enableDragDrop');
  assertOptionalBoolean(value.newWindow, 'Template runtime newWindow');
}

function assertBuildDefaults(value: unknown): asserts value is TemplateBuildDefaults {
  if (!isRecord(value)) {
    throw new Error('Template build must be an object.');
  }

  if (!Array.isArray(value.targets)) {
    throw new Error('Template build targets must be an array.');
  }
  for (const target of value.targets) {
    assertString(target, 'Template build target');
  }
  assertOptionalBoolean(value.debug, 'Template build debug');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertPositiveNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

function assertOptionalBoolean(value: unknown, label: string): void {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new Error(`${label} must be a boolean.`);
  }
}
