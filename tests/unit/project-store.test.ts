import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { ProjectStore } from '../../services/ProjectStore';

async function createStore(): Promise<ProjectStore> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pakey-project-store-'));
  return new ProjectStore(path.join(dir, 'projects.json'));
}

describe('ProjectStore', () => {
  it('creates and retrieves projects', async () => {
    const store = await createStore();

    const created = await store.create({
      id: 'weekly',
      name: 'Weekly',
      window: {
        url: 'https://weekly.tw93.fun',
        width: 1200,
        height: 780,
      },
      build: {
        targets: ['dmg'],
      },
    });

    await expect(store.get('weekly')).resolves.toEqual(created);
    await expect(store.list()).resolves.toEqual([created]);
  });

  it('persists projects as JSON', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pakey-project-store-'));
    const filePath = path.join(dir, 'projects.json');
    const firstStore = new ProjectStore(filePath);

    const created = await firstStore.create({
      id: 'github',
      name: 'GitHub',
      window: {
        url: 'https://github.com',
        width: 1280,
        height: 800,
      },
    });

    const secondStore = new ProjectStore(filePath);

    await expect(secondStore.get('github')).resolves.toEqual(created);
  });

  it('updates projects without changing createdAt', async () => {
    const store = await createStore();
    const created = await store.create({
      id: 'docs',
      name: 'Docs',
      window: {
        url: 'https://example.com',
        width: 1000,
        height: 700,
      },
    });

    const updated = await store.update('docs', {
      name: 'Documentation',
      metadata: { owner: 'studio' },
    });

    expect(updated?.name).toBe('Documentation');
    expect(updated?.metadata).toEqual({ owner: 'studio' });
    expect(updated?.createdAt).toBe(created.createdAt);
    expect(updated?.updatedAt).not.toBe('');
  });

  it('deletes projects', async () => {
    const store = await createStore();
    await store.create({
      id: 'delete-me',
      name: 'Delete Me',
      window: {
        url: 'https://example.com',
        width: 900,
        height: 640,
      },
    });

    await expect(store.delete('delete-me')).resolves.toBe(true);
    await expect(store.get('delete-me')).resolves.toBeUndefined();
    await expect(store.delete('delete-me')).resolves.toBe(false);
  });

  it('rejects duplicate ids', async () => {
    const store = await createStore();
    const input = {
      id: 'duplicate',
      name: 'Duplicate',
      window: {
        url: 'https://example.com',
        width: 900,
        height: 640,
      },
    };

    await store.create(input);

    await expect(store.create(input)).rejects.toThrow('already exists');
  });

  it('rejects invalid persisted JSON shape', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pakey-project-store-'));
    const filePath = path.join(dir, 'projects.json');
    await fs.writeFile(filePath, JSON.stringify({ projects: [{ id: '' }] }));

    const store = new ProjectStore(filePath);

    await expect(store.list()).rejects.toThrow('Project id');
  });
});
