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

import * as fs from 'node:fs';
import { cp, mkdir, mkdtemp, open, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import type { CancellationToken } from '@podman-desktop/api';
import type { ImageInfo, ManifestInspectInfo } from '@podman-desktop/core-api';
import * as fzstd from 'fzstd';
import * as nodeTar from 'tar';

import type { ContainerProviderRegistry } from '/@/plugin/container-registry.js';

interface DockerImageArchiveManifestEntry {
  Config: string;
  RepoTags: string[];
  Layers: string[];
}

export interface LocalExtensionImage {
  engineId: string;
  engineName: string;
  id: string;
  labels: Record<string, string> | undefined;
}

function isPathInside(parent: string, candidate: string): boolean {
  return candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
}

export function assertSafeArchiveEntry(
  destination: string,
  entryPath: string,
  entryType?: string,
  linkPath?: string,
): void {
  if (entryPath.includes('\0')) {
    throw new Error('Image archive contains an invalid path');
  }

  const destinationPath = path.resolve(destination);
  const resolvedEntryPath = path.resolve(destinationPath, entryPath);
  if (!isPathInside(destinationPath, resolvedEntryPath)) {
    throw new Error(`Image archive entry escapes the destination: ${entryPath}`);
  }

  if (!linkPath || (entryType !== 'SymbolicLink' && entryType !== 'Link')) {
    return;
  }
  if (linkPath.includes('\0')) {
    throw new Error('Image archive contains an invalid link path');
  }

  const resolvedLinkPath =
    entryType === 'SymbolicLink'
      ? path.resolve(path.dirname(resolvedEntryPath), linkPath)
      : path.resolve(destinationPath, linkPath);
  if (!isPathInside(destinationPath, resolvedLinkPath)) {
    throw new Error(`Image archive link escapes the destination: ${entryPath}`);
  }
}

function throwIfCancelled(token?: CancellationToken): void {
  if (token?.isCancellationRequested) {
    throw new Error('Extension installation canceled');
  }
}

function normalizeImageReferences(imageName: string): Set<string> {
  const references = new Set([imageName]);
  const lastSlash = imageName.lastIndexOf('/');
  const lastColon = imageName.lastIndexOf(':');
  if (!imageName.includes('@') && lastColon < lastSlash) {
    references.add(`${imageName}:latest`);
  }
  return references;
}

function parseArchiveManifest(content: string): DockerImageArchiveManifestEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid image archive manifest: ${String(error)}`);
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Invalid image archive manifest: expected a non-empty array');
  }

  return parsed.map((entry: unknown) => {
    const repoTags =
      typeof entry === 'object' && entry !== null && 'RepoTags' in entry && entry.RepoTags !== null
        ? entry.RepoTags
        : [];
    if (
      typeof entry !== 'object' ||
      entry === null ||
      !('Config' in entry) ||
      typeof entry.Config !== 'string' ||
      !Array.isArray(repoTags) ||
      !repoTags.every((tag: unknown) => typeof tag === 'string') ||
      !('Layers' in entry) ||
      !Array.isArray(entry.Layers) ||
      entry.Layers.length === 0 ||
      !entry.Layers.every((layer: unknown) => typeof layer === 'string')
    ) {
      throw new Error('Invalid image archive manifest entry');
    }
    return { ...entry, RepoTags: repoTags } as DockerImageArchiveManifestEntry;
  });
}

export class LocalExtensionImageLoader {
  constructor(
    private readonly containerRegistry: ContainerProviderRegistry,
    private readonly temporaryDirectory = os.tmpdir(),
    private readonly platformArchitecture = os.arch() === 'arm64' ? 'arm64' : 'amd64',
    private readonly platformOs = process.platform === 'win32'
      ? 'windows'
      : process.platform === 'darwin'
        ? 'darwin'
        : 'linux',
  ) {}

  isLocalImageReference(imageName: string): boolean {
    const firstSlash = imageName.indexOf('/');
    if (firstSlash <= 0) {
      return false;
    }
    const registry = imageName.slice(0, firstSlash);
    return registry === 'localhost' || registry.startsWith('localhost:');
  }

  async findLocalImage(imageName: string, token?: CancellationToken): Promise<LocalExtensionImage | undefined> {
    if (!this.isLocalImageReference(imageName)) {
      return undefined;
    }

    throwIfCancelled(token);
    const references = normalizeImageReferences(imageName);
    const images = await this.containerRegistry.listImages();
    throwIfCancelled(token);

    const matchingImages = images.filter(image =>
      [...(image.RepoTags ?? []), ...(image.RepoDigests ?? [])].some(reference => references.has(reference)),
    );
    const uniqueImages = [
      ...new Map(matchingImages.map(image => [`${image.engineId}:${image.Id}`, image] as const)).values(),
    ];

    if (uniqueImages.length > 1) {
      const engines = uniqueImages.map(image => `${image.engineName} (${image.engineId})`).join(', ');
      throw new Error(`Image ${imageName} exists in multiple running container engines: ${engines}`);
    }

    const image = uniqueImages[0];
    if (!image) {
      return undefined;
    }

    const imageId = await this.resolvePlatformImageId(image);
    throwIfCancelled(token);
    const inspect = await this.containerRegistry.getImageInspect(image.engineId, imageId);
    throwIfCancelled(token);
    const rawLabels = inspect.Config?.Labels;
    const labels =
      rawLabels && Object.values(rawLabels).every(label => typeof label === 'string')
        ? (rawLabels as Record<string, string>)
        : undefined;

    return {
      engineId: image.engineId,
      engineName: image.engineName,
      id: imageId,
      labels,
    };
  }

  async downloadAndExtractImage(
    image: LocalExtensionImage,
    imageName: string,
    destination: string,
    logger: (event: { message: string; progress: number }) => void,
    token?: CancellationToken,
  ): Promise<void> {
    const workingDirectory = await mkdtemp(path.join(this.temporaryDirectory, 'podman-desktop-extension-image-'));
    const archivePath = path.join(workingDirectory, 'image.tar');
    const archiveDirectory = path.join(workingDirectory, 'archive');

    try {
      throwIfCancelled(token);
      logger({ message: `Saving local image ${imageName} from ${image.engineName}...`, progress: 0 });
      await this.containerRegistry.saveImage(image.engineId, image.id, archivePath, token);
      throwIfCancelled(token);

      await this.extractTar(archivePath, archiveDirectory, token);
      const manifest = parseArchiveManifest(await readFile(path.join(archiveDirectory, 'manifest.json'), 'utf8'));
      const references = normalizeImageReferences(imageName);
      const matchingEntries = manifest.filter(entry => entry.RepoTags.some(reference => references.has(reference)));
      const manifestEntry = matchingEntries[0] ?? (manifest.length === 1 ? manifest[0] : undefined);
      if (!manifestEntry || matchingEntries.length > 1) {
        throw new Error(`Unable to identify image ${imageName} in the saved image archive`);
      }

      await mkdir(destination, { recursive: true });
      for (const [index, layer] of manifestEntry.Layers.entries()) {
        throwIfCancelled(token);
        const layerPath = path.resolve(archiveDirectory, layer);
        if (!isPathInside(path.resolve(archiveDirectory), layerPath) || !fs.existsSync(layerPath)) {
          throw new Error(`Invalid image layer path: ${layer}`);
        }
        await this.extractLayerTar(layerPath, destination, workingDirectory, index, token);
        const progress = Math.round(((index + 1) / manifestEntry.Layers.length) * 100);
        logger({
          message: `Extracting local image layer ${index + 1}/${manifestEntry.Layers.length} - ${progress}%`,
          progress,
        });
      }
      throwIfCancelled(token);
    } finally {
      await rm(workingDirectory, { recursive: true, force: true });
    }
  }

  private async resolvePlatformImageId(image: ImageInfo): Promise<string> {
    if (!image.isManifest) {
      return image.Id;
    }

    const manifest = await this.containerRegistry.inspectManifest(image.engineId, image.Id);
    const platformManifest = this.findBestManifest(manifest);
    if (!platformManifest) {
      throw new Error(
        `No local image for the current platform was found in manifest ${image.RepoTags?.[0] ?? image.Id}`,
      );
    }
    return platformManifest.digest;
  }

  private findBestManifest(manifest: ManifestInspectInfo): ManifestInspectInfo['manifests'][number] | undefined {
    const manifestsByOs = manifest.manifests.filter(item => item.platform.os === this.platformOs);
    const candidateManifests =
      manifestsByOs.length > 0 ? manifestsByOs : manifest.manifests.filter(item => item.platform.os === 'linux');
    return candidateManifests.find(item => item.platform.architecture === this.platformArchitecture);
  }

  private async extractTar(archivePath: string, destination: string, token?: CancellationToken): Promise<void> {
    await mkdir(destination, { recursive: true });
    await nodeTar.extract({
      file: archivePath,
      cwd: destination,
      preservePaths: false,
      strict: true,
      filter: (entryPath, entry): boolean => {
        throwIfCancelled(token);
        const entryType = 'type' in entry ? entry.type : undefined;
        const linkPath = 'linkpath' in entry ? entry.linkpath : undefined;
        assertSafeArchiveEntry(destination, entryPath, entryType, linkPath);
        return true;
      },
    });
  }

  private async extractLayerTar(
    layerPath: string,
    destination: string,
    workingDirectory: string,
    index: number,
    token?: CancellationToken,
  ): Promise<void> {
    let archivePath = layerPath;
    if (await this.isZstdArchive(layerPath)) {
      throwIfCancelled(token);
      const decompressedPath = path.join(workingDirectory, `layer-${index}.tar`);
      await writeFile(decompressedPath, fzstd.decompress(await readFile(layerPath)));
      archivePath = decompressedPath;
      throwIfCancelled(token);
    }

    const layerDirectory = path.join(workingDirectory, `layer-${index}`);
    const whiteouts: string[] = [];
    await mkdir(layerDirectory, { recursive: true });
    await nodeTar.extract({
      file: archivePath,
      cwd: layerDirectory,
      preservePaths: false,
      strict: true,
      filter: (entryPath, entry): boolean => {
        throwIfCancelled(token);
        const entryType = 'type' in entry ? entry.type : undefined;
        const linkPath = 'linkpath' in entry ? entry.linkpath : undefined;
        assertSafeArchiveEntry(layerDirectory, entryPath, entryType, linkPath);
        if (path.posix.basename(entryPath).startsWith('.wh.')) {
          whiteouts.push(entryPath);
          return false;
        }
        return true;
      },
    });

    // Whiteouts describe removals from lower layers. Apply them before copying this
    // layer so a same-layer replacement is never removed accidentally.
    for (const whiteout of whiteouts.filter(entry => path.posix.basename(entry) === '.wh..wh..opq')) {
      throwIfCancelled(token);
      const relativeDirectory = path.posix.dirname(whiteout);
      const opaqueDirectory = path.resolve(destination, relativeDirectory);
      if (!isPathInside(path.resolve(destination), opaqueDirectory)) {
        throw new Error(`Image layer whiteout escapes the destination: ${whiteout}`);
      }
      const children = await readdir(opaqueDirectory).catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return [];
        throw error;
      });
      await Promise.all(children.map(child => rm(path.join(opaqueDirectory, child), { recursive: true, force: true })));
    }
    for (const whiteout of whiteouts.filter(entry => path.posix.basename(entry) !== '.wh..wh..opq')) {
      throwIfCancelled(token);
      const basename = path.posix.basename(whiteout);
      const targetName = basename.slice('.wh.'.length);
      const relativeTarget = path.posix.join(path.posix.dirname(whiteout), targetName);
      const target = path.resolve(destination, relativeTarget);
      if (!targetName || !isPathInside(path.resolve(destination), target)) {
        throw new Error(`Image layer whiteout escapes the destination: ${whiteout}`);
      }
      await rm(target, { recursive: true, force: true });
    }

    throwIfCancelled(token);
    await cp(layerDirectory, destination, { recursive: true });
    throwIfCancelled(token);
  }

  private async isZstdArchive(archivePath: string): Promise<boolean> {
    const file = await open(archivePath, 'r');
    try {
      const magic = Buffer.alloc(4);
      const { bytesRead } = await file.read(magic, 0, magic.length, 0);
      return bytesRead === magic.length && magic.equals(Buffer.from([0x28, 0xb5, 0x2f, 0xfd]));
    } finally {
      await file.close();
    }
  }
}
