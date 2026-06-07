import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { TemplateStore } from '../../services/TemplateStore';
import { stringifyTemplateJson } from '../../templates/Template';
import type { CreateTemplateInput } from '../../templates/Template';

async function createStore(): Promise<TemplateStore> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pakey-template-store-'));
  return new TemplateStore(path.join(dir, 'templates.json'));
}

function createInput(id: string): CreateTemplateInput {
  return {
    id,
    name: `${id} template`,
    window: {
      width: 1200,
      height: 780,
      title: 'Template App',
    },
    runtime: {
      enableFind: true,
    },
    build: {
      targets: ['dmg'],
      debug: false,
    },
    tags: ['starter'],
  };
}

describe('TemplateStore', () => {
  it('creates and retrieves templates', async () => {
    const store = await createStore();

    const created = await store.create(createInput('weekly'));

    await expect(store.get('weekly')).resolves.toEqual(created);
    await expect(store.list()).resolves.toEqual([created]);
  });

  it('updates templates', async () => {
    const store = await createStore();
    await store.create(createInput('docs'));

    const updated = await store.update('docs', {
      name: 'Documentation Template',
      tags: ['docs', 'starter'],
    });

    expect(updated?.name).toBe('Documentation Template');
    expect(updated?.tags).toEqual(['docs', 'starter']);
  });

  it('deletes templates', async () => {
    const store = await createStore();
    await store.create(createInput('delete-me'));

    await expect(store.delete('delete-me')).resolves.toBe(true);
    await expect(store.get('delete-me')).resolves.toBeUndefined();
    await expect(store.delete('delete-me')).resolves.toBe(false);
  });

  it('rejects duplicate template ids', async () => {
    const store = await createStore();
    const input = createInput('duplicate');

    await store.create(input);

    await expect(store.create(input)).rejects.toThrow('already exists');
  });

  it('imports templates from JSON and replaces matching ids', async () => {
    const store = await createStore();
    await store.create(createInput('starter'));

    const importedTemplate = {
      ...createInput('starter'),
      schemaVersion: 1 as const,
      name: 'Imported Starter',
    };

    const imported = await store.importFromJson(
      stringifyTemplateJson([importedTemplate]),
    );

    expect(imported).toEqual([importedTemplate]);
    await expect(store.get('starter')).resolves.toMatchObject({
      name: 'Imported Starter',
    });
  });

  it('exports all templates as JSON', async () => {
    const store = await createStore();
    const weekly = await store.create(createInput('weekly'));
    const github = await store.create(createInput('github'));

    const exported = await store.exportToJson();

    expect(JSON.parse(exported)).toEqual({ templates: [weekly, github] });
  });

  it('exports selected templates as JSON', async () => {
    const store = await createStore();
    await store.create(createInput('weekly'));
    const github = await store.create(createInput('github'));

    const exported = await store.exportToJson(['github']);

    expect(JSON.parse(exported)).toEqual({ templates: [github] });
  });

  it('validates imported JSON', async () => {
    const store = await createStore();

    await expect(
      store.importFromJson(JSON.stringify({ templates: [{ id: 'bad' }] })),
    ).rejects.toThrow('schemaVersion');
  });
});
