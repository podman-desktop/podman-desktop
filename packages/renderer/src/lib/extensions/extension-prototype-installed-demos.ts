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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

export const PROTOTYPE_INSTALLED_DEMO_PREFIX = 'prototype-demo-';

let prototypeInstalledDemosEnabled = true;

export function setPrototypeInstalledDemosEnabled(enabled: boolean): void {
  prototypeInstalledDemosEnabled = enabled;
}

export function arePrototypeInstalledDemosEnabled(): boolean {
  return prototypeInstalledDemosEnabled;
}

export const PROTOTYPE_LONG_DESCRIPTION =
  'A comprehensive integration for managing container workloads across hybrid cloud environments with advanced networking, volume persistence, and observability features built for platform teams.';

const prototypeBase = {
  path: '/prototype/demo',
  readme: '',
  version: '1.0.0',
};

export function getPrototypeInstalledDemos(): CombinedExtensionInfoUI[] {
  return [
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}community-active`,
      name: 'prototype-community-active',
      displayName: 'Prototype Community Active',
      description: PROTOTYPE_LONG_DESCRIPTION,
      publisher: 'Community Contributor',
      removable: true,
      devMode: false,
      state: 'started',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}community-failed`,
      name: 'prototype-community-failed',
      displayName: 'Prototype Community Failed',
      description: 'Extension failed to start after installation.',
      publisher: 'Community Contributor',
      removable: true,
      devMode: false,
      state: 'failed',
      error: {
        message: 'Failed to activate extension: connection timeout while contacting registry.local:5000.',
      },
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}builtin`,
      name: 'prototype-builtin',
      displayName: 'Prototype Built-in',
      description: 'Pre-installed Podman Desktop extension.',
      publisher: 'Podman Desktop',
      removable: false,
      devMode: false,
      state: 'started',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}devmode`,
      name: 'prototype-devmode',
      displayName: 'Prototype DevMode',
      description: 'Local extension loaded from a development folder.',
      publisher: 'Local Developer',
      removable: true,
      devMode: true,
      state: 'stopped',
    },
    {
      ...prototypeBase,
      type: 'dd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}docker-desktop`,
      name: 'prototype-docker-desktop',
      displayName: 'Prototype Docker Desktop',
      description: 'Docker Desktop extension running inside Podman Desktop.',
      publisher: 'Docker Inc.',
      removable: true,
      devMode: false,
      state: 'started',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}verified`,
      name: 'prototype-verified',
      displayName: 'Prototype Verified Red Hat',
      description: 'Verified extension supported by Red Hat.',
      publisher: 'Red Hat',
      removable: true,
      devMode: false,
      state: 'started',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}starting`,
      name: 'prototype-starting',
      displayName: 'Prototype Starting',
      description: 'Extension is currently activating.',
      publisher: 'Community Contributor',
      removable: true,
      devMode: false,
      state: 'starting',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}stopping`,
      name: 'prototype-stopping',
      displayName: 'Prototype Stopping',
      description: 'Extension is currently disabling.',
      publisher: 'Community Contributor',
      removable: true,
      devMode: false,
      state: 'stopping',
    },
    {
      ...prototypeBase,
      type: 'pd',
      id: `${PROTOTYPE_INSTALLED_DEMO_PREFIX}community-disabled`,
      name: 'prototype-community-disabled',
      displayName: 'Prototype Community Disabled',
      description: 'Installed community extension in disabled state.',
      publisher: 'Community Contributor',
      removable: true,
      devMode: false,
      state: 'stopped',
    },
  ];
}

export function isPrototypeInstalledDemo(id: string): boolean {
  return id.startsWith(PROTOTYPE_INSTALLED_DEMO_PREFIX);
}
