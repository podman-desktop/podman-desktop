/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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
import * as path from 'node:path';
import { Octokit } from 'octokit';
import type { OctokitOptions } from '@octokit/core/types';
import { hashFile } from 'hasha';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';

export enum DiskType {
  WSL = 'wsl',
  Applehv = 'applehv',
}

type Manifest = {
  digest: string;
  annotations: {
    disktype: string;
  };
  platform: {
    os: string;
    architecture: string;
  };
};

type Layers = {
  digest: string;
  size: number;
};

// Manifest response from GitHub
type ManifestsResponse = {
  layers: Layers[];
  errors: unknown;
  manifests: Manifest[];
};

export type PodmanJsonVersionGroup = {
  version: string;
  tagVersion: string;
  releaseNotes: { href: string };
};

export type PodmanJsonArchEntry = {
  versionRef: string;
  fileName: string;
};

export type PodmanJsonSchema = {
  versions: Record<string, PodmanJsonVersionGroup>;
  platform: Record<string, { arch: Record<string, PodmanJsonArchEntry> }>;
};

export type MachineOSDownloaderEntry = {
  downloader: Podman5DownloadMachineOS;
  architectures: Set<string>;
};

// to make this file a module
export class PodmanDownload {
  #downloadAndCheck: DownloadAndCheck;
  #machineOSDownloaders: MachineOSDownloaderEntry[] = [];

  #shaCheck: ShaCheck;

  #octokit: Octokit;
  #platform: string;
  #assetsFolder: string;

  #artifactsToDownload: {
    version: string;
    downloadName: string;
    artifactName: string;
  }[] = [];

  constructor(
    podmanJSON: PodmanJsonSchema,
    private airgapSupport: boolean,
  ) {
    const octokitOptions: OctokitOptions = {};
    if (process.env.GITHUB_TOKEN) {
      octokitOptions.auth = process.env.GITHUB_TOKEN;
    }
    this.#octokit = new Octokit(octokitOptions);
    this.#platform = process.platform;

    const dirname = path.dirname(fileURLToPath(import.meta.url));
    this.#assetsFolder = path.resolve(dirname, '..', 'assets');

    const platformEntry = podmanJSON.platform[this.#platform];
    if (platformEntry) {
      for (const [archKey, archEntry] of Object.entries(platformEntry.arch)) {
        const versionGroup = podmanJSON.versions[archEntry.versionRef];
        if (!versionGroup) {
          throw new Error(`Unknown versionRef "${archEntry.versionRef}" for ${this.#platform}/${archKey}`);
        }
        const tagVersion = versionGroup.tagVersion;

        let artifactName: string;
        if (this.#platform === 'win32') {
          const archSuffix = archKey === 'arm64' ? 'arm64' : 'amd64';
          artifactName = `podman-installer-windows-${archSuffix}.msi`;
        } else {
          const archSuffix = archKey === 'arm64' ? 'arm64' : 'amd64';
          artifactName = `podman-installer-macos-${archSuffix}.pkg`;
        }

        this.#artifactsToDownload.push({
          version: tagVersion,
          downloadName: archEntry.fileName,
          artifactName,
        });
      }
    }

    this.#shaCheck = new ShaCheck();
    this.#downloadAndCheck = new DownloadAndCheck(this.#octokit, this.#shaCheck, this.#assetsFolder);

    if (!fs.existsSync(this.#assetsFolder)) {
      fs.mkdirSync(this.#assetsFolder);
    }

    const versionToArchs = new Map<string, Set<string>>();
    if (platformEntry) {
      for (const [archKey, archEntry] of Object.entries(platformEntry.arch)) {
        const versionGroup = podmanJSON.versions[archEntry.versionRef];
        if (versionGroup) {
          const majorMinorVersion = versionGroup.version.split('.').slice(0, 2).join('.');
          let archSet = versionToArchs.get(majorMinorVersion);
          if (!archSet) {
            archSet = new Set<string>();
            versionToArchs.set(majorMinorVersion, archSet);
          }
          archSet.add(archKey);
        }
      }
    }

    for (const [majorMinorVersion, architectures] of versionToArchs) {
      this.#machineOSDownloaders.push({
        downloader: new Podman5DownloadMachineOS(majorMinorVersion, this.#shaCheck, this.#assetsFolder),
        architectures,
      });
    }
  }

  protected getMachineOSDownloaders(): MachineOSDownloaderEntry[] {
    return this.#machineOSDownloaders;
  }

  protected getShaCheck(): ShaCheck {
    return this.#shaCheck;
  }

  protected getArtifactsToDownload(): {
    version: string;
    downloadName: string;
    artifactName: string;
  }[] {
    return this.#artifactsToDownload;
  }

  protected getDownloadAndCheck(): DownloadAndCheck {
    return this.#downloadAndCheck;
  }

  async downloadBinaries(): Promise<void> {
    // fetch from GitHub releases
    for (const artifact of this.#artifactsToDownload) {
      await this.#downloadAndCheck.downloadAndCheckSha(artifact.version, artifact.downloadName, artifact.artifactName);
    }

    // fetch binaries in case of AirGap
    await this.downloadAirGapBinaries();
  }

  protected async downloadAirGapBinaries(): Promise<void> {
    if (!this.airgapSupport || !process.env.AIRGAP_DOWNLOAD) {
      return;
    }

    for (const entry of this.#machineOSDownloaders) {
      await entry.downloader.setAndDownload(this.#platform, entry.architectures);
    }
  }
}

export class DownloadAndCheck {
  readonly MAX_DOWNLOAD_ATTEMPT = 3;
  #downloadAttempt = 0;
  #octokit: Octokit;
  #shaCheck: ShaCheck;
  #assetsFolder: string;

  constructor(
    readonly octokit: Octokit,
    readonly shaCheck: ShaCheck,
    readonly assetsFolder: string,
  ) {
    this.#octokit = octokit;
    this.#shaCheck = shaCheck;
    this.#assetsFolder = assetsFolder;
  }

  public async downloadAndCheckSha(
    tagVersion: string,
    fileName: string,
    artifactName: string,
    owner: string = 'podman-container-tools',
    repo: string = 'podman',
  ): Promise<void> {
    if (this.#downloadAttempt >= this.MAX_DOWNLOAD_ATTEMPT) {
      console.error('Max download attempt reached, exiting...');
      process.exit(1);
    }

    const release = await this.#octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner,
      repo,
      tag: tagVersion,
    });

    let artifactRelease;
    let shasums;
    for (const asset of release.data.assets) {
      if (asset.name === artifactName) {
        artifactRelease = asset;
      }
      if (asset.name === 'shasums') {
        shasums = asset;
      }
    }

    if (!artifactRelease) {
      throw new Error(`Can't find artifact ${artifactName} for ${tagVersion}`);
    }
    if (!shasums) {
      throw new Error(`Can't find shasums asset for ${tagVersion}`);
    }

    const shasumAsset = await this.#octokit.rest.repos.getReleaseAsset({
      asset_id: shasums.id,
      owner,
      repo,
      headers: {
        accept: 'application/octet-stream',
      },
    });

    const shaFileContent = new TextDecoder().decode(shasumAsset.data as unknown as ArrayBuffer);
    const shaArr = shaFileContent.split('\n');
    let msiSha = '';

    for (const shaLine of shaArr) {
      if (shaLine.trim().endsWith(artifactName)) {
        msiSha = shaLine.split(' ')[0];
        break;
      }
    }
    if (!msiSha) {
      console.error(`Can't find SHA256 sum for ${artifactName} in:\n${shaFileContent}`);
      process.exit(1);
    }

    const destFile = path.resolve(this.#assetsFolder, fileName);
    if (!fs.existsSync(destFile)) {
      console.log(`⚡️ Downloading artifact from ${artifactRelease.browser_download_url}`);
      // await downloadFile(url, destFile);
      const artifactAsset = await this.#octokit.rest.repos.getReleaseAsset({
        asset_id: artifactRelease.id,
        owner,
        repo,
        headers: {
          accept: 'application/octet-stream',
        },
      });

      fs.appendFileSync(destFile, Buffer.from(artifactAsset.data as unknown as ArrayBuffer));
      console.log(`📔 Downloaded to ${destFile}`);
    } else {
      console.log(`⏭️  Skipping ${artifactName} (already downloaded)`);
    }

    if (!(await this.#shaCheck.checkFile(destFile, msiSha))) {
      console.warn(`❌ Invalid checksum for ${fileName} downloading again...`);
      fs.rmSync(destFile);
      this.#downloadAttempt++;
      await this.downloadAndCheckSha(tagVersion, fileName, artifactName);
    } else {
      console.log(`✅ Valid checksum for ${fileName}`);
    }

    this.#downloadAttempt = 0;
  }
}

export class ShaCheck {
  async checkFile(filePath: string, shaSum: string): Promise<boolean> {
    const sha256sum: string = await hashFile(filePath, { algorithm: 'sha256' });
    return sha256sum === shaSum;
  }
}

export class Podman5DownloadMachineOS {
  #version: string;
  #shaCheck: ShaCheck;
  #assetsFolder: string;
  #ociRegistryProjectLink: string;

  constructor(
    readonly version: string,
    readonly shaCheck: ShaCheck,
    readonly assetsFolder: string,
  ) {
    this.#version = version;
    this.#shaCheck = shaCheck;
    this.#assetsFolder = assetsFolder;
    this.#ociRegistryProjectLink = '';
  }

  async getManifest(manifestUrl: string): Promise<ManifestsResponse> {
    const response = await fetch(manifestUrl, {
      method: 'GET',
      headers: {
        'docker-distribution-api-version': 'registry/2.0',
        Accept: 'application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json',
      },
    });
    return response.json() as unknown as ManifestsResponse;
  }

  protected async pipe(
    title: string,
    total: number,
    stream: ReadableStream<Uint8Array>,
    writableStream: WritableStream<Uint8Array>,
  ) {
    let loaded = 0;
    let lastPct = -1;

    const progress = new TransformStream({
      transform(chunk, controller) {
        loaded += chunk.length;

        const pct = Math.max(0, Math.min(20, total > 0 ? Math.floor((loaded / total) * 20) : 0));
        if (pct !== lastPct) {
          lastPct = pct;
          const dots = '.'.repeat(pct);
          const empty = ' '.repeat(20 - pct);
          process.stdout.write(`\r⚡️ Downloading ${title} [${dots}${empty}] ${pct * 5}%`);
        }
        controller.enqueue(chunk);
      },
    });

    await stream.pipeThrough(progress).pipeTo(writableStream);
  }

  async downloadZstdFromManifest(
    title: string,
    filename: string,
    layer: { digest: string; size: number },
  ): Promise<void> {
    const blobURL = `${this.#ociRegistryProjectLink}/blobs/${layer.digest}`;

    const blobResponse = await fetch(blobURL);
    const total = layer.size;
    const outputFile = path.resolve(this.#assetsFolder, filename);
    // digest is using the format : sha256:checksum
    // extract the checksum
    const checksum = layer.digest.split(':')[1];

    // check if the file exists and has the expected checksum
    if (fs.existsSync(outputFile)) {
      // check now the checksum
      const valid = await this.#shaCheck.checkFile(outputFile, checksum);
      if (valid) {
        console.log(`⏭️  Skipping ${title} (already downloaded to ${filename})`);
        return;
      }
    }

    const writer = fs.createWriteStream(outputFile);
    const writableStream = Writable.toWeb(writer);

    if (!blobResponse.body) {
      throw new Error(`❌ Cannot get blob for ${title}`);
    }

    await this.pipe(title, total, blobResponse.body, writableStream);

    process.stdout.write(`\r📔 ${title} downloaded to ${filename}\n`);

    // verify the checksum
    const valid = await this.#shaCheck.checkFile(outputFile, checksum);
    if (valid) {
      console.log(`✅ Valid checksum for ${filename}`);
    } else {
      throw new Error(`❌ Invalid checksum for ${filename}`);
    }
  }

  async setAndDownload(platform: string, architectures?: Set<string>): Promise<void> {
    this.#ociRegistryProjectLink = 'https://quay.io/v2/podman/machine-os';
    // download the podman 5 machines OS
    if (platform === 'win32') {
      // Here add downloading of HyperV
      await this.download(DiskType.WSL, architectures);
    } else {
      await this.download(DiskType.Applehv, architectures);
    }
  }

  // For Windows WSL, need to grab images from quay.io/podman/machine-os-wsl repository
  // Otherwise grab images from quay.io/podman/machine-os repository
  async download(diskType: DiskType, architectures?: Set<string>): Promise<void> {
    const manifestUrl = `${this.#ociRegistryProjectLink}/manifests/${this.#version}`;

    // get first level of manifests
    const rootManifest = await this.getManifest(manifestUrl);

    if (rootManifest.errors) {
      console.error(`❌ Cannot get manifest for ${manifestUrl}`, rootManifest.errors);
      throw new Error(`❌ Cannot get manifest for ${manifestUrl}`);
    }

    const manifests = rootManifest.manifests;

    // grab applehv as annotations / disktype
    const keepManifests = manifests.filter(manifest => {
      const annotations = manifest.annotations;
      return (
        annotations &&
        ((diskType === DiskType.WSL && annotations.disktype === 'wsl') ||
          (diskType === DiskType.Applehv && annotations.disktype === 'applehv'))
      );
    });

    const wantAmd64 = !architectures || architectures.has('x64');
    const wantArm64 = !architectures || architectures.has('arm64');

    const amd64Manifest = wantAmd64
      ? keepManifests.find(manifest => manifest.platform.architecture === 'x86_64' && manifest.platform.os === 'linux')
      : undefined;
    const arm64Manifest = wantArm64
      ? keepManifests.find(manifest => manifest.platform.architecture === 'aarch64' && manifest.platform.os === 'linux')
      : undefined;

    if (wantAmd64 && !amd64Manifest) {
      throw new Error('❌ Cannot find amd64 manifest');
    }
    if (wantArm64 && !arm64Manifest) {
      throw new Error('❌ Cannot find arm64 manifest');
    }

    if (arm64Manifest) {
      const arm64ZstdManifest = await this.getManifest(
        `${this.#ociRegistryProjectLink}/manifests/${arm64Manifest.digest}`,
      );
      await this.downloadZstdFromManifest(
        `${manifestUrl} for arm64`,
        'podman-image-arm64.zst',
        arm64ZstdManifest.layers[0],
      );
    }

    if (amd64Manifest) {
      const amd64ZstdManifest = await this.getManifest(
        `${this.#ociRegistryProjectLink}/manifests/${amd64Manifest.digest}`,
      );
      await this.downloadZstdFromManifest(
        `${manifestUrl} for amd64`,
        'podman-image-x64.zst',
        amd64ZstdManifest.layers[0],
      );
    }
  }
}
