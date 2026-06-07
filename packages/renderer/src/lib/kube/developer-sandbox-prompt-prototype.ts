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

import { type PrototypeConfig, registerPrototype } from '/@/stores/prototype';

export interface MockDashboardMetrics {
  nodes: number;
  deployments: number;
  pods: number;
  services: number;
  ingresses: number;
  routes: number;
  persistentvolumeclaims: number;
  configmaps: number;
  secrets: number;
  jobs: number;
  cronjobs: number;
  activeNodes: number;
  activeDeployments: number;
}

export interface DeveloperSandboxPromptOverride {
  /** When true, use live app state (today's production behavior). */
  useLiveState?: boolean;
  showPrompt?: boolean;
  extensionInstalled?: boolean;
  showEmptyPage?: boolean;
  mockContextName?: string;
  mockConnected?: boolean;
  mockMetrics?: MockDashboardMetrics;
}

const developerSandboxMetrics: MockDashboardMetrics = {
  nodes: 1,
  deployments: 3,
  pods: 8,
  services: 4,
  ingresses: 1,
  routes: 0,
  persistentvolumeclaims: 2,
  configmaps: 4,
  secrets: 2,
  jobs: 0,
  cronjobs: 0,
  activeNodes: 1,
  activeDeployments: 2,
};

const activeClusterMetrics: MockDashboardMetrics = {
  nodes: 1,
  deployments: 6,
  pods: 18,
  services: 8,
  ingresses: 2,
  routes: 0,
  persistentvolumeclaims: 3,
  configmaps: 6,
  secrets: 4,
  jobs: 2,
  cronjobs: 1,
  activeNodes: 1,
  activeDeployments: 5,
};

export const developerSandboxPromptPrototypeConfig: PrototypeConfig<DeveloperSandboxPromptOverride> = {
  name: 'Developer Sandbox prompt',
  screens: [
    { value: 'current', label: 'Current' },
    { value: 'no-cluster-not-signed-up', label: 'No cluster · Not signed up' },
    { value: 'no-cluster-extension-installed', label: 'No cluster · Extension installed' },
    { value: 'hidden-already-connected', label: 'Hidden · Sandbox connected' },
    { value: 'hidden-has-cluster', label: 'Hidden · Local cluster active' },
  ],
  overrides: {
    current: {
      useLiveState: true,
    },
    'no-cluster-not-signed-up': {
      showPrompt: true,
      extensionInstalled: false,
      showEmptyPage: true,
    },
    'no-cluster-extension-installed': {
      showPrompt: true,
      extensionInstalled: true,
      showEmptyPage: true,
    },
    'hidden-already-connected': {
      showPrompt: false,
      extensionInstalled: true,
      showEmptyPage: false,
      mockContextName: 'Developer Sandbox',
      mockConnected: true,
      mockMetrics: developerSandboxMetrics,
    },
    'hidden-has-cluster': {
      showPrompt: false,
      extensionInstalled: false,
      showEmptyPage: false,
      mockContextName: 'kind-kind-cluster',
      mockConnected: true,
      mockMetrics: activeClusterMetrics,
    },
  },
};

export const developerSandboxPromptPrototypeName = developerSandboxPromptPrototypeConfig.name;

export function registerDeveloperSandboxPromptPrototype(
  initialScreen?: string,
): ReturnType<typeof registerPrototype<DeveloperSandboxPromptOverride>> {
  return registerPrototype(developerSandboxPromptPrototypeConfig, { initialScreen });
}
