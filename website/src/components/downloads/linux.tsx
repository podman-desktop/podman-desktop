/**********************************************************************
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
 ***********************************************************************/

import { usePluginData } from '@docusaurus/useGlobalData';
import { faLinux } from '@fortawesome/free-brands-svg-icons';
import { OSDownloadCard } from '@site/src/components/downloads/OSDownloadCard';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';
import React from 'react';

interface LinuxDownloadsProps {
  readonly defaultExpanded?: boolean;
  readonly highlighted?: boolean;
}

export function LinuxDownloads({ defaultExpanded = false, highlighted = false }: LinuxDownloadsProps): JSX.Element {
  const {
    latestRelease: { linux, version },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  const otherDownloads = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-linux"
        to={linux.amd64}>
        AMD64 binary
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-linux"
        to={linux.arm64}>
        ARM64 binary
      </TelemetryLink>
    </div>
  );

  return (
    <OSDownloadCard
      osName="Linux"
      osIcon={faLinux}
      defaultExpanded={defaultExpanded}
      highlighted={highlighted}
      primaryDownload={{
        url: linux.flatpak,
        eventTitle: 'download-linux',
        caption: `Linux *.flatpak, version ${version}`,
      }}
      otherDownloads={otherDownloads}
      installCommand={{
        icon: faLinux,
        label: (
          <a
            className="underline text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
            href="https://flathub.org/apps/details/io.podman_desktop.PodmanDesktop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={event => event.stopPropagation()}>
            Flathub
          </a>
        ),
        command: 'flatpak install flathub io.podman_desktop.PodmanDesktop',
      }}
    />
  );
}
