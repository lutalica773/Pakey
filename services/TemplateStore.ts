import fs from 'fs/promises';
import path from 'path';
import {
  CreateTemplateInput,
  Template,
  TemplateId,
  UpdateTemplateInput,
  createTemplate,
  parseTemplateJson,
  stringifyTemplateJson,
  updateTemplate,
} from '../templates/Template';

export class TemplateStore {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async create(input: CreateTemplateInput): Promise<Template> {
    const templates = await this.readAll();
    const template = createTemplate(input);

    if (templates.some((item) => item.id === template.id)) {
      throw new Error(`Template "${template.id}" already exists.`);
    }

    await this.writeAll([...templates, template]);
    return template;
  }

  async list(): Promise<Template[]> {
    return this.readAll();
  }

  async get(id: TemplateId): Promise<Template | undefined> {
    const templates = await this.readAll();
    return templates.find((template) => template.id === id);
  }

  async update(
    id: TemplateId,
    input: UpdateTemplateInput,
  ): Promise<Template | undefined> {
    const templates = await this.readAll();
    const index = templates.findIndex((template) => template.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated = updateTemplate(templates[index], input);
    const nextTemplates = [...templates];
    nextTemplates[index] = updated;

    await this.writeAll(nextTemplates);
    return updated;
  }

  async delete(id: TemplateId): Promise<boolean> {
    const templates = await this.readAll();
    const nextTemplates = templates.filter((template) => template.id !== id);

    if (nextTemplates.length === templates.length) {
      return false;
    }

    await this.writeAll(nextTemplates);
    return true;
  }

  async importFromJson(raw: string): Promise<Template[]> {
    const imported = parseTemplateJson(raw).templates;
    const existing = await this.readAll();
    const byId = new Map(existing.map((template) => [template.id, template]));

    for (const template of imported) {
      byId.set(template.id, template);
    }

    const nextTemplates = [...byId.values()];
    await this.writeAll(nextTemplates);
    return imported;
  }

  async exportToJson(ids?: TemplateId[]): Promise<string> {
    const templates = await this.readAll();
    const selected =
      ids === undefined
        ? templates
        : templates.filter((template) => ids.includes(template.id));

    return stringifyTemplateJson(selected);
  }

  private async readAll(): Promise<Template[]> {
    let raw: string;

    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }

    return parseTemplateJson(raw).templates.map((template) => ({
      ...template,
      tags: [...template.tags],
      build: {
        ...template.build,
        targets: [...template.build.targets],
      },
      runtime: { ...template.runtime },
      window: { ...template.window },
    }));
  }

  private async writeAll(templates: Template[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, stringifyTemplateJson(templates));
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}
