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
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { OSDownloadCard } from '@site/src/components/downloads/OSDownloadCard';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';
import React from 'react';

interface MacOSDownloadsProps {
  readonly defaultExpanded?: boolean;
  readonly highlighted?: boolean;
}

export function MacOSDownloads({ defaultExpanded = false, highlighted = false }: MacOSDownloadsProps): JSX.Element {
  const {
    latestRelease: { macos, version },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  const otherDownloads = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-mac"
        to={macos.x64}>
        Intel
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-mac"
        to={macos.arm64}>
        Apple silicon
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-mac"
        to={macos.airgapsetupX64}>
        Air-gapped Intel
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-mac"
        to={macos.airgapsetupArm64}>
        Air-gapped Apple silicon
      </TelemetryLink>
    </div>
  );

  return (
    <OSDownloadCard
      osName="macOS"
      osIcon={faApple}
      defaultExpanded={defaultExpanded}
      highlighted={highlighted}
      primaryDownload={{
        url: macos.universal,
        eventTitle: 'download-mac',
        caption: `Universal *.dmg, version ${version}`,
      }}
      otherDownloads={otherDownloads}
      installCommand={{
        icon: faBeer,
        label: 'Brew',
        command: 'brew install --cask podman-desktop',
      }}
    />
  );
}
