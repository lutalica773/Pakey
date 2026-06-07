import fs from 'fs/promises';
import path from 'path';
import {
  CreateProjectInput,
  Project,
  ProjectId,
  UpdateProjectInput,
  assertProject,
  createProject,
  updateProject,
} from '../models/Project';

interface PersistedProjectCollection {
  projects: Project[];
}

export class ProjectStore {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const projects = await this.readAll();
    const project = createProject(input);

    if (projects.some((item) => item.id === project.id)) {
      throw new Error(`Project "${project.id}" already exists.`);
    }

    await this.writeAll([...projects, project]);
    return project;
  }

  async list(): Promise<Project[]> {
    return this.readAll();
  }

  async get(id: ProjectId): Promise<Project | undefined> {
    const projects = await this.readAll();
    return projects.find((project) => project.id === id);
  }

  async update(
    id: ProjectId,
    input: UpdateProjectInput,
  ): Promise<Project | undefined> {
    const projects = await this.readAll();
    const index = projects.findIndex((project) => project.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated = updateProject(projects[index], input);
    const nextProjects = [...projects];
    nextProjects[index] = updated;

    await this.writeAll(nextProjects);
    return updated;
  }

  async delete(id: ProjectId): Promise<boolean> {
    const projects = await this.readAll();
    const nextProjects = projects.filter((project) => project.id !== id);

    if (nextProjects.length === projects.length) {
      return false;
    }

    await this.writeAll(nextProjects);
    return true;
  }

  private async readAll(): Promise<Project[]> {
    let raw: string;

    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }

    const parsed = JSON.parse(raw) as unknown;
    const projects = parsePersistedProjects(parsed);
    return projects.map((project) => ({ ...project }));
  }

  private async writeAll(projects: Project[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const payload: PersistedProjectCollection = { projects };
    await fs.writeFile(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
  }
}

function parsePersistedProjects(value: unknown): Project[] {
  if (!isRecord(value) || !Array.isArray(value.projects)) {
    throw new Error('Project store JSON must contain a projects array.');
  }

  for (const project of value.projects) {
    assertProject(project);
  }

  return value.projects;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}
