/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import type { CancellationToken } from '@podman-desktop/api';
import type { ImageInfo, ImageInspectInfo, ManifestInspectInfo } from '@podman-desktop/core-api';
import * as fzstd from 'fzstd';
import * as nodeTar from 'tar';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ContainerProviderRegistry } from '/@/plugin/container-registry.js';

import { assertSafeArchiveEntry, LocalExtensionImageLoader } from './local-extension-image-loader.js';

vi.mock(import('fzstd'), async importOriginal => {
  const original = await importOriginal();
  return { ...original, decompress: vi.fn(original.decompress) };
});

const listImagesMock = vi.fn<ContainerProviderRegistry['listImages']>();
const getImageInspectMock = vi.fn<ContainerProviderRegistry['getImageInspect']>();
const inspectManifestMock = vi.fn<ContainerProviderRegistry['inspectManifest']>();
const saveImageMock = vi.fn<ContainerProviderRegistry['saveImage']>();

const containerRegistry = {
  listImages: listImagesMock,
  getImageInspect: getImageInspectMock,
  inspectManifest: inspectManifestMock,
  saveImage: saveImageMock,
} as unknown as ContainerProviderRegistry;

let testDirectory: string;
let loaderTemporaryDirectory: string;
let loader: LocalExtensionImageLoader;

function image(overrides: Partial<ImageInfo> = {}): ImageInfo {
  return {
    Id: 'sha256:image',
    RepoTags: ['localhost/example/extension:latest'],
    RepoDigests: [],
    engineId: 'podman-machine',
    engineName: 'Podman Machine',
    engineType: 'podman',
    ...overrides,
  } as ImageInfo;
}

function inspect(labels: Record<string, unknown> | undefined): ImageInspectInfo {
  return {
    Config: { Labels: labels },
  } as ImageInspectInfo;
}

interface SavedImageArchiveOptions {
  manifest?: unknown;
  gzipLayer?: boolean;
  transformLayer?: (content: Buffer) => Buffer;
}

async function createSavedImageArchive(options: SavedImageArchiveOptions = {}): Promise<string> {
  const archiveSource = await mkdtemp(path.join(testDirectory, 'archive-source-'));
  const layerSource = await mkdtemp(path.join(testDirectory, 'layer-source-'));
  await mkdir(path.join(layerSource, 'extension'), { recursive: true });
  await writeFile(path.join(layerSource, 'extension', 'package.json'), '{"name":"local-extension"}');
  await mkdir(archiveSource, { recursive: true });
  const layerPath = path.join(archiveSource, 'layer.tar');
  await nodeTar.create({ cwd: layerSource, file: layerPath, gzip: options.gzipLayer }, ['extension']);
  if (options.transformLayer) {
    await writeFile(layerPath, options.transformLayer(await readFile(layerPath)));
  }
  await writeFile(
    path.join(archiveSource, 'manifest.json'),
    JSON.stringify(
      options.manifest ?? [
        {
          Config: 'config.json',
          RepoTags: ['localhost/example/extension:latest'],
          Layers: ['layer.tar'],
        },
      ],
    ),
  );
  await writeFile(path.join(archiveSource, 'config.json'), '{}');

  const archivePath = path.join(archiveSource, 'saved-image.tar');
  await nodeTar.create({ cwd: archiveSource, file: archivePath }, ['manifest.json', 'config.json', 'layer.tar']);
  return archivePath;
}

async function createWhiteoutImageArchive(): Promise<string> {
  const archiveSource = await mkdtemp(path.join(testDirectory, 'whiteout-archive-source-'));
  const lowerLayerSource = await mkdtemp(path.join(testDirectory, 'lower-layer-source-'));
  const upperLayerSource = await mkdtemp(path.join(testDirectory, 'upper-layer-source-'));

  await mkdir(path.join(lowerLayerSource, 'extension', 'opaque'), { recursive: true });
  await writeFile(path.join(lowerLayerSource, 'extension', 'package.json'), '{"name":"local-extension"}');
  await writeFile(path.join(lowerLayerSource, 'extension', 'removed.txt'), 'remove me');
  await writeFile(path.join(lowerLayerSource, 'extension', 'kept.txt'), 'keep me');
  await writeFile(path.join(lowerLayerSource, 'extension', 'opaque', 'old.txt'), 'remove opaque child');

  await mkdir(path.join(upperLayerSource, 'extension', 'opaque'), { recursive: true });
  await writeFile(path.join(upperLayerSource, 'extension', '.wh.removed.txt'), '');
  await writeFile(path.join(upperLayerSource, 'extension', 'added.txt'), 'new file');
  await writeFile(path.join(upperLayerSource, 'extension', 'opaque', '.wh..wh..opq'), '');
  await writeFile(path.join(upperLayerSource, 'extension', 'opaque', 'new.txt'), 'new opaque child');

  await nodeTar.create({ cwd: lowerLayerSource, file: path.join(archiveSource, 'lower.tar') }, ['extension']);
  await nodeTar.create({ cwd: upperLayerSource, file: path.join(archiveSource, 'upper.tar') }, ['extension']);
  await writeFile(
    path.join(archiveSource, 'manifest.json'),
    JSON.stringify([
      {
        Config: 'config.json',
        RepoTags: ['localhost/example/extension:latest'],
        Layers: ['lower.tar', 'upper.tar'],
      },
    ]),
  );
  await writeFile(path.join(archiveSource, 'config.json'), '{}');

  const archivePath = path.join(archiveSource, 'saved-image.tar');
  await nodeTar.create({ cwd: archiveSource, file: archivePath }, [
    'manifest.json',
    'config.json',
    'lower.tar',
    'upper.tar',
  ]);
  return archivePath;
}

beforeEach(async () => {
  vi.resetAllMocks();
  testDirectory = await mkdtemp(path.join(os.tmpdir(), 'local-extension-image-loader-test-'));
  loaderTemporaryDirectory = path.join(testDirectory, 'loader-temporary');
  await mkdir(loaderTemporaryDirectory);
  loader = new LocalExtensionImageLoader(containerRegistry, loaderTemporaryDirectory, 'arm64', 'darwin');
  listImagesMock.mockResolvedValue([]);
});

afterEach(async () => {
  await rm(testDirectory, { recursive: true, force: true });
});

describe('local image lookup', () => {
  test('does not inspect the container engines for a remote registry image', async () => {
    await expect(loader.findLocalImage('quay.io/example/extension:latest')).resolves.toBeUndefined();
    expect(listImagesMock).not.toHaveBeenCalled();
  });

  test('finds an exact localhost image and normalizes the latest tag', async () => {
    listImagesMock.mockResolvedValue([image()]);
    getImageInspectMock.mockResolvedValue(
      inspect({
        'org.opencontainers.image.title': 'Local extension',
        'io.podman-desktop.api.version': '1.0.0',
      }),
    );

    await expect(loader.findLocalImage('localhost/example/extension')).resolves.toEqual({
      engineId: 'podman-machine',
      engineName: 'Podman Machine',
      id: 'sha256:image',
      labels: {
        'org.opencontainers.image.title': 'Local extension',
        'io.podman-desktop.api.version': '1.0.0',
      },
    });
    expect(getImageInspectMock).toHaveBeenCalledWith('podman-machine', 'sha256:image');
  });

  test('does not treat a similarly named registry as localhost', async () => {
    await expect(loader.findLocalImage('localhost.example.com/extension:latest')).resolves.toBeUndefined();
    expect(listImagesMock).not.toHaveBeenCalled();
  });

  test('returns undefined when no running engine has the image', async () => {
    await expect(loader.findLocalImage('localhost/example/missing:latest')).resolves.toBeUndefined();
  });

  test('rejects an image that is ambiguous across engines', async () => {
    listImagesMock.mockResolvedValue([
      image(),
      image({ Id: 'sha256:other', engineId: 'docker', engineName: 'Docker' }),
    ]);

    await expect(loader.findLocalImage('localhost/example/extension:latest')).rejects.toThrow(
      'exists in multiple running container engines: Podman Machine (podman-machine), Docker (docker)',
    );
    expect(getImageInspectMock).not.toHaveBeenCalled();
  });

  test('uses the arm64 image from a multi-architecture manifest', async () => {
    listImagesMock.mockResolvedValue([image({ isManifest: true })]);
    inspectManifestMock.mockResolvedValue({
      manifests: [
        { digest: 'sha256:amd64', mediaType: '', platform: { architecture: 'amd64', os: 'linux' }, size: 1 },
        { digest: 'sha256:arm64', mediaType: '', platform: { architecture: 'arm64', os: 'linux' }, size: 1 },
      ],
    } as ManifestInspectInfo);
    getImageInspectMock.mockResolvedValue(inspect({ label: 'value' }));

    await expect(loader.findLocalImage('localhost/example/extension:latest')).resolves.toMatchObject({
      id: 'sha256:arm64',
    });
    expect(getImageInspectMock).toHaveBeenCalledWith('podman-machine', 'sha256:arm64');
  });

  test('rejects a multi-architecture manifest without the host architecture', async () => {
    listImagesMock.mockResolvedValue([image({ isManifest: true })]);
    inspectManifestMock.mockResolvedValue({
      manifests: [{ digest: 'sha256:amd64', mediaType: '', platform: { architecture: 'amd64', os: 'linux' }, size: 1 }],
    } as ManifestInspectInfo);

    await expect(loader.findLocalImage('localhost/example/extension:latest')).rejects.toThrow(
      'No local image for the current platform was found',
    );
    expect(getImageInspectMock).not.toHaveBeenCalled();
  });

  test('treats malformed label values as missing labels', async () => {
    listImagesMock.mockResolvedValue([image()]);
    getImageInspectMock.mockResolvedValue(inspect({ invalid: 42 }));

    await expect(loader.findLocalImage('localhost/example/extension:latest')).resolves.toMatchObject({
      labels: undefined,
    });
  });

  test('checks cancellation before querying the engines', async () => {
    const token = { isCancellationRequested: true } as CancellationToken;

    await expect(loader.findLocalImage('localhost/example/extension:latest', token)).rejects.toThrow(
      'Extension installation canceled',
    );
    expect(listImagesMock).not.toHaveBeenCalled();
  });
});

describe('saved image extraction', () => {
  test('extracts the saved image layers and removes its private temporary directory', async () => {
    const savedImageArchive = await createSavedImageArchive();
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));
    const destination = path.join(testDirectory, 'destination');

    await loader.downloadAndExtractImage(
      { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
      'localhost/example/extension:latest',
      destination,
      vi.fn(),
    );

    await expect(readFile(path.join(destination, 'extension', 'package.json'), 'utf8')).resolves.toContain(
      'local-extension',
    );
    await expect(readdir(loaderTemporaryDirectory)).resolves.toEqual([]);
  });

  test('rejects a malformed saved-image manifest and still cleans up', async () => {
    const savedImageArchive = await createSavedImageArchive({ manifest: { invalid: true } });
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));

    await expect(
      loader.downloadAndExtractImage(
        { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
        'localhost/example/extension:latest',
        path.join(testDirectory, 'destination'),
        vi.fn(),
      ),
    ).rejects.toThrow('Invalid image archive manifest');
    await expect(readdir(loaderTemporaryDirectory)).resolves.toEqual([]);
  });

  test('extracts a single saved image whose platform-specific archive has no repository tag', async () => {
    const savedImageArchive = await createSavedImageArchive({
      manifest: [{ Config: 'config.json', RepoTags: null, Layers: ['layer.tar'] }],
    });
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));
    const destination = path.join(testDirectory, 'untagged-destination');

    await loader.downloadAndExtractImage(
      { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
      'localhost/example/extension:latest',
      destination,
      vi.fn(),
    );

    await expect(readFile(path.join(destination, 'extension', 'package.json'), 'utf8')).resolves.toContain(
      'local-extension',
    );
  });

  test('passes cancellation to saveImage and cleans up when canceled', async () => {
    let cancellationRequested = false;
    const token = {
      get isCancellationRequested() {
        return cancellationRequested;
      },
    } as CancellationToken;
    saveImageMock.mockImplementation(async () => {
      cancellationRequested = true;
    });

    await expect(
      loader.downloadAndExtractImage(
        { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
        'localhost/example/extension:latest',
        path.join(testDirectory, 'destination'),
        vi.fn(),
        token,
      ),
    ).rejects.toThrow('Extension installation canceled');
    expect(saveImageMock).toHaveBeenCalledWith(
      'podman-machine',
      'sha256:image',
      expect.stringMatching(/image\.tar$/),
      token,
    );
    await expect(readdir(loaderTemporaryDirectory)).resolves.toEqual([]);
  });

  test('extracts a gzip-compressed image layer', async () => {
    const savedImageArchive = await createSavedImageArchive({ gzipLayer: true });
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));
    const destination = path.join(testDirectory, 'gzip-destination');

    await loader.downloadAndExtractImage(
      { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
      'localhost/example/extension:latest',
      destination,
      vi.fn(),
    );

    await expect(readFile(path.join(destination, 'extension', 'package.json'), 'utf8')).resolves.toContain(
      'local-extension',
    );
  });

  test('extracts a zstd-compressed image layer', async () => {
    let uncompressedLayer: Buffer | undefined;
    const savedImageArchive = await createSavedImageArchive({
      transformLayer: content => {
        uncompressedLayer = content;
        return Buffer.from([0x28, 0xb5, 0x2f, 0xfd, 0x00]);
      },
    });
    vi.mocked(fzstd.decompress).mockReturnValue(uncompressedLayer ?? Buffer.alloc(0));
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));
    const destination = path.join(testDirectory, 'zstd-destination');

    await loader.downloadAndExtractImage(
      { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
      'localhost/example/extension:latest',
      destination,
      vi.fn(),
    );

    expect(fzstd.decompress).toHaveBeenCalled();
    await expect(readFile(path.join(destination, 'extension', 'package.json'), 'utf8')).resolves.toContain(
      'local-extension',
    );
  });

  test('applies file and opaque-directory whiteouts without leaving marker files', async () => {
    const savedImageArchive = await createWhiteoutImageArchive();
    saveImageMock.mockImplementation(async (_engineId, _id, file) => copyFile(savedImageArchive, file));
    const destination = path.join(testDirectory, 'whiteout-destination');

    await loader.downloadAndExtractImage(
      { engineId: 'podman-machine', engineName: 'Podman Machine', id: 'sha256:image', labels: {} },
      'localhost/example/extension:latest',
      destination,
      vi.fn(),
    );

    await expect(readFile(path.join(destination, 'extension', 'kept.txt'), 'utf8')).resolves.toBe('keep me');
    await expect(readFile(path.join(destination, 'extension', 'added.txt'), 'utf8')).resolves.toBe('new file');
    await expect(readFile(path.join(destination, 'extension', 'removed.txt'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
    await expect(readFile(path.join(destination, 'extension', 'opaque', 'old.txt'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
    await expect(readFile(path.join(destination, 'extension', 'opaque', 'new.txt'), 'utf8')).resolves.toBe(
      'new opaque child',
    );
    await expect(readdir(path.join(destination, 'extension'))).resolves.not.toContain('.wh.removed.txt');
    await expect(readdir(path.join(destination, 'extension', 'opaque'))).resolves.not.toContain('.wh..wh..opq');
  });
});

describe('archive path validation', () => {
  const destination = path.join(os.tmpdir(), 'extension-destination');

  test.each(['../escape', 'extension/../../escape', path.resolve(destination, '..', 'escape')])(
    'rejects traversal path %s',
    entryPath => {
      expect(() => assertSafeArchiveEntry(destination, entryPath)).toThrow('escapes the destination');
    },
  );

  test('rejects an escaping symbolic link', () => {
    expect(() => assertSafeArchiveEntry(destination, 'extension/link', 'SymbolicLink', '../../escape')).toThrow(
      'link escapes the destination',
    );
  });

  test('rejects an escaping hard link', () => {
    expect(() => assertSafeArchiveEntry(destination, 'extension/link', 'Link', '../escape')).toThrow(
      'link escapes the destination',
    );
  });

  test('accepts normal files and internal links', () => {
    expect(() => assertSafeArchiveEntry(destination, 'extension/package.json')).not.toThrow();
    expect(() => assertSafeArchiveEntry(destination, 'extension/link', 'SymbolicLink', 'package.json')).not.toThrow();
  });
});
