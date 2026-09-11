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

import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { faMicrosoft, faWindows } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OSDownloadCard } from '@site/src/components/downloads/OSDownloadCard';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';
import React from 'react';

interface WindowsDownloadsProps {
  readonly defaultExpanded?: boolean;
  readonly highlighted?: boolean;
}

export function WindowsDownloads({ defaultExpanded = false, highlighted = false }: WindowsDownloadsProps): JSX.Element {
  const {
    latestRelease: { windows, version },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  const otherDownloads = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-windows"
        to={windows.setupArm64}>
        Arm64 installer
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-windows"
        to={windows.binaryX64}>
        Portable x64
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-windows"
        to={windows.binaryArm64}>
        Portable arm64
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-windows"
        to={windows.airgapsetupX64}>
        Air-gapped x64
      </TelemetryLink>
      <TelemetryLink
        className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
        eventPath="download"
        eventTitle="download-windows"
        to={windows.airgapsetupArm64}>
        Air-gapped arm64
      </TelemetryLink>
    </div>
  );

  const additionalContent = (
    <div>
      <Link
        className="underline inline-flex items-center dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 py-1 font-semibold text-sm"
        href="docs/installation/windows-install"
        onClick={event => event.stopPropagation()}>
        <FontAwesomeIcon size="1x" icon={faWindows} className="mr-2" />
        Package Managers Guide
      </Link>
    </div>
  );

  return (
    <OSDownloadCard
      osName="Windows"
      osIcon={faWindows}
      defaultExpanded={defaultExpanded}
      highlighted={highlighted}
      primaryDownload={{
        url: windows.setupX64,
        eventTitle: 'download-windows',
        caption: `Windows installer x64, version ${version}`,
      }}
      otherDownloads={otherDownloads}
      installCommand={{
        icon: faMicrosoft,
        label: 'winget',
        command: 'winget install -e --id RedHat.Podman-Desktop',
      }}
      additionalContent={additionalContent}
    />
  );
}
