export type ProjectId = string;

export interface ProjectWindow {
  url: string;
  width: number;
  height: number;
  title?: string;
}

export interface ProjectBuildSettings {
  targets: string[];
  debug: boolean;
}

export interface ProjectTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Project extends ProjectTimestamps {
  id: ProjectId;
  name: string;
  window: ProjectWindow;
  build: ProjectBuildSettings;
  metadata: Record<string, unknown>;
}

export interface CreateProjectInput {
  id?: ProjectId;
  name: string;
  window: ProjectWindow;
  build?: Partial<ProjectBuildSettings>;
  metadata?: Record<string, unknown>;
}

export type UpdateProjectInput = Partial<
  Pick<Project, 'name' | 'window' | 'build' | 'metadata'>
>;

export function createProject(
  input: CreateProjectInput,
  now: Date = new Date(),
): Project {
  const timestamp = now.toISOString();

  return {
    id: input.id ?? createProjectId(input.name, timestamp),
    name: input.name,
    window: input.window,
    build: {
      targets: input.build?.targets ?? [],
      debug: input.build?.debug ?? false,
    },
    metadata: input.metadata ?? {},
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateProject(
  project: Project,
  input: UpdateProjectInput,
  now: Date = new Date(),
): Project {
  return {
    ...project,
    ...input,
    build: input.build ?? project.build,
    metadata: input.metadata ?? project.metadata,
    window: input.window ?? project.window,
    updatedAt: now.toISOString(),
  };
}

export function assertProject(value: unknown): asserts value is Project {
  if (!isRecord(value)) {
    throw new Error('Project must be an object.');
  }

  assertString(value.id, 'Project id');
  assertString(value.name, 'Project name');
  assertString(value.createdAt, 'Project createdAt');
  assertString(value.updatedAt, 'Project updatedAt');

  if (!isRecord(value.window)) {
    throw new Error('Project window must be an object.');
  }
  assertString(value.window.url, 'Project window url');
  assertNumber(value.window.width, 'Project window width');
  assertNumber(value.window.height, 'Project window height');
  if (value.window.title !== undefined) {
    assertString(value.window.title, 'Project window title');
  }

  if (!isRecord(value.build)) {
    throw new Error('Project build must be an object.');
  }
  if (!Array.isArray(value.build.targets)) {
    throw new Error('Project build targets must be an array.');
  }
  for (const target of value.build.targets) {
    assertString(target, 'Project build target');
  }
  if (typeof value.build.debug !== 'boolean') {
    throw new Error('Project build debug must be a boolean.');
  }

  if (!isRecord(value.metadata)) {
    throw new Error('Project metadata must be an object.');
  }
}

function createProjectId(name: string, timestamp: string): ProjectId {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = timestamp.replace(/[^0-9]/g, '');

  return `${slug || 'project'}-${suffix}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}
