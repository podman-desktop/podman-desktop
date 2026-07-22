/*********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 ********************************************************************/

import podmanJSON from '/@/podman.json' with { type: 'json' };

type PlatformKey = keyof typeof podmanJSON.platform;
type ArchKey<P extends PlatformKey> = keyof (typeof podmanJSON.platform)[P]['arch'];

function getArchEntry(os: string, architecture: string): { versionRef: string; fileName: string } {
  const platformEntry = podmanJSON.platform[os as PlatformKey];
  if (!platformEntry) {
    throw new Error(`No bundled podman for platform ${os}`);
  }
  const archEntry = platformEntry.arch[architecture as ArchKey<typeof os & PlatformKey>];
  if (!archEntry) {
    throw new Error(`No bundled podman for ${os}/${architecture}`);
  }
  return archEntry as { versionRef: string; fileName: string };
}

export function getBundledPodmanVersion(os: string = process.platform, architecture: string = process.arch): string {
  const platformEntry = podmanJSON.platform[os as PlatformKey];
  if (!platformEntry) {
    // On platforms where we don't ship a bundled installer (e.g. linux), callers still use this
    // for messaging/version comparisons. Fall back to the newest known bundled version.
    if (os === process.platform) {
      const fallback = podmanJSON.versions.v6 ?? Object.values(podmanJSON.versions)[0];
      if (!fallback) {
        throw new Error('No bundled podman versions configured');
      }
      return fallback.version;
    }
    throw new Error(`No bundled podman for platform ${os}`);
  }

  const archEntry = getArchEntry(os, architecture);
  const versionGroup = podmanJSON.versions[archEntry.versionRef as keyof typeof podmanJSON.versions];
  if (!versionGroup) {
    throw new Error(`Unknown versionRef "${archEntry.versionRef}" for ${os}/${architecture}`);
  }
  return versionGroup.version;
}

export function getBundledReleaseNotesHref(os: string = process.platform, architecture: string = process.arch): string {
  const platformEntry = podmanJSON.platform[os as PlatformKey];
  if (!platformEntry) {
    if (os === process.platform) {
      const fallback = podmanJSON.versions.v6 ?? Object.values(podmanJSON.versions)[0];
      if (!fallback) {
        throw new Error('No bundled podman versions configured');
      }
      return fallback.releaseNotes.href;
    }
    throw new Error(`No bundled podman for platform ${os}`);
  }

  const archEntry = getArchEntry(os, architecture);
  const versionGroup = podmanJSON.versions[archEntry.versionRef as keyof typeof podmanJSON.versions];
  if (!versionGroup) {
    throw new Error(`Unknown versionRef "${archEntry.versionRef}" for ${os}/${architecture}`);
  }
  return versionGroup.releaseNotes.href;
}

export function getBundledFileName(os: string = process.platform, architecture: string = process.arch): string {
  return getArchEntry(os, architecture).fileName;
}

export function getBundledTagVersion(os: string = process.platform, architecture: string = process.arch): string {
  const archEntry = getArchEntry(os, architecture);
  const versionGroup = podmanJSON.versions[archEntry.versionRef as keyof typeof podmanJSON.versions];
  if (!versionGroup) {
    throw new Error(`Unknown versionRef "${archEntry.versionRef}" for ${os}/${architecture}`);
  }
  return versionGroup.tagVersion;
}
