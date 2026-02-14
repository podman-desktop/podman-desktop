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

import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

// System Overview display states
export type SystemOverviewState =
  | 'live'
  | 'machine-stopped'
  | 'machine-error'
  | 'multiple-errors'
  | 'starting'
  | 'onboarding'
  | 'all-running';

// Status types matching provider connection statuses
export type MachineStatus = 'running' | 'stopped' | 'starting' | 'error';

// Resource metric data structure
export interface SystemStat {
  label: string;
  value: number | null; // null for N/A
  detail: string;
  status: 'normal' | 'warning' | 'critical';
}

// System overview data structure
export interface SystemOverviewData {
  podmanStatus: MachineStatus;
  podmanMachineName?: string;
  podmanVersion?: string;
  podmanError?: string;
  kindStatus?: MachineStatus;
  kindClusterName?: string;
  kindError?: string;
  kindRequirements?: string; // e.g. "Requires Podman" badge
  kindInfo?: string; // e.g. "Start to deploy Kubernetes workloads locally"
  kindSubtitle?: string; // e.g. "Local Kubernetes"
  sandboxStatus?: MachineStatus;
  sandboxSubtitle?: string; // e.g. "Connected cluster"
  sandboxError?: string;
  systemStats?: SystemStat[];
  showOnboarding?: boolean;
  statusMessage?: string; // e.g. "Some systems are stopped"
  statusMessageType?: 'info' | 'error' | 'success'; // Type of status message
  showCompactClusters?: boolean; // Use compact button-like display for K8s clusters
  showOnlyResources?: boolean; // Show only resources section without machine header
  useDemoValues?: boolean; // Flag to indicate using demo values instead of real API data
}

// State labels for toggle buttons
export const stateLabels: Record<SystemOverviewState, string> = {
  live: 'Dashboard test: Live Podman Desktop State',
  'machine-stopped': 'Machine Stopped',
  'machine-error': 'Machine Error',
  'multiple-errors': 'Multiple Errors',
  starting: 'Starting',
  onboarding: 'Onboarding',
  'all-running': 'All Running',
};

// Current selected state (defaults to 'live' - don't persist across reloads)
// Using a reactive state object in svelte.ts file
const state = $state<{ current: SystemOverviewState }>({ current: 'live' });

export function getCurrentState(): SystemOverviewState {
  return state.current;
}

export function setCurrentState(newState: SystemOverviewState): void {
  state.current = newState;
}

// Mock data generators for each state

function getMachineStoppedData(): SystemOverviewData {
  return {
    podmanStatus: 'stopped',
    podmanMachineName: 'Podman Machine',
    podmanVersion: 'WSL · v5.7.0',
    kindStatus: 'running',
    kindClusterName: 'kind-dev',
    sandboxStatus: 'running',
    statusMessage: 'Some systems are stopped',
    statusMessageType: 'info',
    showCompactClusters: true, // Use compact button-like display
  };
}

function getMachineErrorData(): SystemOverviewData {
  return {
    podmanStatus: 'error',
    podmanMachineName: 'Podman Machine',
    podmanVersion: 'WSL · v5.7.0',
    podmanError: 'Connection failed — WSL distribution \'podman-machine-default\' not responding',
    kindStatus: 'stopped',
    kindClusterName: 'kind-dev',
    kindSubtitle: 'Local Kubernetes',
    kindRequirements: 'Requires Podman',
    kindInfo: 'Start to deploy Kubernetes workloads locally',
    sandboxStatus: 'running',
    statusMessage: 'Podman machine error detected',
    statusMessageType: 'error',
  };
}

function getMultipleErrorsData(): SystemOverviewData {
  return {
    podmanStatus: 'error',
    podmanMachineName: 'Podman Machines',
    podmanVersion: '2 machines · 2 error',
    podmanError: "Connection failed — WSL distribution 'podman-machine-default' not responding",
    kindStatus: 'error',
    kindClusterName: '',
    kindSubtitle: 'Local Kubernetes',
    kindRequirements: 'Requires Podman',
    kindError: 'Kind cluster requires Podman machine to be running. Start Podman first.',
    sandboxStatus: 'error',
    sandboxSubtitle: 'Connected cluster',
    sandboxError: 'Unable to connect to cluster. Verify network connectivity and credentials.',
    statusMessage: 'Multiple system errors detected',
    statusMessageType: 'error',
  };
}

function getStartingData(): SystemOverviewData {
  return {
    podmanStatus: 'starting',
    podmanMachineName: 'Podman Machine',
    podmanVersion: 'WSL · v5.7.0',
    kindStatus: 'stopped',
    kindClusterName: '',
    kindSubtitle: 'Local Kubernetes',
    kindRequirements: 'Requires Podman',
    kindInfo: 'Start to deploy Kubernetes workloads locally',
    sandboxStatus: 'running',
    statusMessage: 'Starting up...',
    statusMessageType: 'info',
  };
}

function getOnboardingData(): SystemOverviewData {
  return {
    podmanStatus: 'running',
    systemStats: [
      { label: 'CPU', value: 40, detail: '6.4 / 16 cores', status: 'normal' },
      { label: 'Memory', value: 70, detail: '23.3 / 33.2 GB', status: 'normal' },
      { label: 'Disk', value: 20, detail: '216 GB / 1.08 TB', status: 'normal' },
    ],
    statusMessage: 'All systems running',
    statusMessageType: 'success',
    showOnlyResources: true, // Show only resources, hide machine header
  };
}

function getAllRunningData(): SystemOverviewData {
  return {
    podmanStatus: 'running',
    systemStats: [
      { label: 'CPU', value: 40, detail: '6.4 / 16 cores', status: 'normal' },
      { label: 'Memory', value: 70, detail: '23.3 / 33.2 GB', status: 'normal' },
      { label: 'Disk', value: 20, detail: '216 GB / 1.08 TB', status: 'normal' },
    ],
    statusMessage: 'All systems running',
    statusMessageType: 'success',
    showOnlyResources: true, // Hide machine header, show only resources
  };
}

// Get data for Live mode from Podman Desktop providers
function getLiveData(providers: ProviderInfo[]): SystemOverviewData {
  // Find Podman provider
  const podmanProvider = providers.find(p => p.name.toLowerCase().includes('podman'));

  if (!podmanProvider) {
    // No provider available - show onboarding state
    return {
      podmanStatus: 'stopped',
      showOnboarding: true,
    };
  }

  // Get first container connection (usually the main machine)
  const containerConnection = podmanProvider.containerConnections?.[0];

  if (!containerConnection) {
    return {
      podmanStatus: 'stopped',
      podmanMachineName: 'Podman Machine',
    };
  }

  // Map connection status to our status type
  let status: MachineStatus = 'stopped';
  if (containerConnection.status === 'started') {
    status = 'running';
  } else if (containerConnection.status === 'starting') {
    status = 'starting';
  } else if (containerConnection.status === 'stopped') {
    status = 'stopped';
  }

  // Check for Kind/Kubernetes connections
  let kindStatus: MachineStatus | undefined;
  let kindClusterName: string | undefined;
  const kubernetesConnection = podmanProvider.kubernetesConnections?.[0];
  if (kubernetesConnection) {
    kindStatus = kubernetesConnection.status === 'started' ? 'running' : 'stopped';
    kindClusterName = kubernetesConnection.name;
  }

  // Resource metrics are not available in current Podman Desktop API
  // Show demo values instead
  const systemStats: SystemStat[] | undefined =
    status === 'running'
      ? [
          { label: 'CPU', value: 40, detail: '6.4 / 16 cores', status: 'normal' },
          { label: 'Memory', value: 70, detail: '23.3 / 33.2 GB', status: 'normal' },
          { label: 'Disk', value: 20, detail: '216 GB / 1.08 TB', status: 'normal' },
        ]
      : undefined;

  return {
    podmanStatus: status,
    podmanMachineName: containerConnection.name,
    podmanVersion: podmanProvider.version ? `v${podmanProvider.version}` : undefined,
    kindStatus,
    kindClusterName,
    systemStats,
    statusMessage: status === 'running' ? 'All systems running' : undefined,
    statusMessageType: status === 'running' ? 'success' : undefined,
    useDemoValues: status === 'running', // Flag to show demo values notice
  };
}

// Function to get data based on current state
// This should be called reactively in components using $derived
export function getSystemOverviewData(providers: ProviderInfo[]): SystemOverviewData {
  const current = state.current; // Access state to trigger reactivity
  switch (current) {
    case 'live':
      return getLiveData(providers);
    case 'machine-stopped':
      return getMachineStoppedData();
    case 'machine-error':
      return getMachineErrorData();
    case 'multiple-errors':
      return getMultipleErrorsData();
    case 'starting':
      return getStartingData();
    case 'onboarding':
      return getOnboardingData();
    case 'all-running':
      return getAllRunningData();
    default:
      return getLiveData(providers);
  }
}

// Helper to get provider and connection for Live mode actions
export function getLiveProviderConnection(
  providers: ProviderInfo[],
): { provider: ProviderInfo; connection: ProviderContainerConnectionInfo } | null {
  const podmanProvider = providers.find(p => p.name.toLowerCase().includes('podman'));
  if (!podmanProvider) return null;

  const connection = podmanProvider.containerConnections?.[0];
  if (!connection) return null;

  return { provider: podmanProvider, connection };
}
