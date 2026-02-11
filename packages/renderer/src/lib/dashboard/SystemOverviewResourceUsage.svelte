<script lang="ts">
import type { ContainerProviderConnection } from '@podman-desktop/api';
import { filesize } from 'filesize';

import ResourceProgressBar from '/@/lib/dashboard/ResourceProgressBar.svelte';
import { PeerProperties } from '/@/lib/preferences/PeerProperties';
import type { IProviderConnectionConfigurationPropertyRecorded } from '/@/lib/preferences/Util';
import { configurationProperties } from '/@/stores/configurationProperties';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';
import type { ProviderInfo } from '/@api/provider-info';

interface Props {
  providers: ProviderInfo[];
}

let { providers }: Props = $props();

type ResourceData = {
  name: string;
  cpu: { value: string; percent: number };
  memory: { value: string; percent: number };
  disk: { value: string; percent: number };
};

let properties = $derived($configurationProperties);

// Get configuration keys for ContainerConnection scope
let configurationKeys: IConfigurationPropertyRecordedSchema[] = $derived(
  properties
    .filter(property => property.scope === 'ContainerConnection')
    .sort((a, b) => (a?.id ?? '').localeCompare(b?.id ?? '')),
);

let isLinux = $derived((await window.getOsPlatform()) === 'linux');

// Get Podman provider and connection
let podmanConnection = $derived.by(() => {
  const podmanProvider = providers.find(p => p.id === 'podman');
  if (!podmanProvider || podmanProvider.containerConnections.length === 0) {
    return undefined;
  }

  // Find a running connection
  const runningConnection = podmanProvider.containerConnections.find(conn => {
    if (conn.status !== 'started') return false;

    // On Linux, only use connections that have vmType
    // Skip the built-in podman connection which doesn't have vmType
    if (isLinux) {
      return conn.vmType !== undefined;
    }

    // On other platforms, any running connection is fine
    return true;
  });

  return runningConnection;
});

let resourceConfig = $state<IProviderConnectionConfigurationPropertyRecorded[]>([]);

// Fetch resource configuration values
$effect(() => {
  if (!podmanConnection || configurationKeys.length === 0) {
    resourceConfig = [];
    return;
  }

  const podmanProvider = providers.find(p => p.id === 'podman');
  if (!podmanProvider) {
    resourceConfig = [];
    return;
  }

  Promise.all(
    configurationKeys.map(async configKey => {
      return {
        ...configKey,
        value: configKey.id
          ? await window.getConfigurationValue(configKey.id, podmanConnection as unknown as ContainerProviderConnection)
          : undefined,
        connection: podmanConnection.name,
        providerId: podmanProvider.internalId,
      };
    }),
  )
    .then(value => {
      resourceConfig = value;
    })
    .catch((err: unknown) => console.error('Error fetching resource usage:', err));
});

// Compute resource data from configuration
let resourceData = $derived.by((): ResourceData | undefined => {
  if (resourceConfig.length === 0) return undefined;

  const connectionConfigs = resourceConfig.filter(config => config.value !== undefined);
  if (connectionConfigs.length === 0) return undefined;

  const peerProperties = new PeerProperties('Usage');

  // Find CPU configuration by format
  const cpuConfig = connectionConfigs.find(config => config.format === 'cpu');
  const cpuUsage = cpuConfig ? peerProperties.getPeerProperty(cpuConfig.id, connectionConfigs) : 0;
  const cpuTotal = cpuConfig?.value ?? 0;
  const cpuUsed = cpuTotal > 0 && cpuUsage > 0 ? ((cpuUsage / 100) * cpuTotal).toFixed(1) : '0';

  // Find Memory configuration by format
  const memoryConfig = connectionConfigs.find(config => config.format === 'memory');
  const memoryUsage = memoryConfig ? peerProperties.getPeerProperty(memoryConfig.id, connectionConfigs) : 0;
  const memoryTotal = memoryConfig?.value ?? 0;
  const memoryUsed = memoryTotal > 0 && memoryUsage > 0 ? (memoryUsage / 100) * memoryTotal : 0;

  // Find Disk configuration by format
  const diskConfig = connectionConfigs.find(config => config.format === 'diskSize');
  const diskUsage = diskConfig ? peerProperties.getPeerProperty(diskConfig.id, connectionConfigs) : 0;
  const diskTotal = diskConfig?.value ?? 0;
  const diskUsed = diskTotal > 0 && diskUsage > 0 ? (diskUsage / 100) * diskTotal : 0;

  // Only return data if at least one resource is configured
  if (!cpuConfig && !memoryConfig && !diskConfig) return undefined;

  return {
    name: podmanConnection?.displayName ?? 'Podman Machine',
    cpu: {
      value: `${cpuUsed}/${cpuTotal} cores`,
      percent: cpuUsage,
    },
    memory: {
      value: `${filesize(memoryUsed)}/${filesize(memoryTotal)}`,
      percent: memoryUsage,
    },
    disk: {
      value: `${filesize(diskUsed)} / ${filesize(diskTotal)}`,
      percent: diskUsage,
    },
  };
});
</script>

{#if resourceData}
  <div class="p-4 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg">
    <div class="text-nowrap text-[var(--pd-content-card-carousel-card-header-text)] font-semibold mb-3">
      {resourceData.name} Resources
    </div>
    <div class="grid grid-cols-3 gap-6">
      <ResourceProgressBar label="CPU" percent={resourceData.cpu.percent} value={resourceData.cpu.value} />
      <ResourceProgressBar label="Memory" percent={resourceData.memory.percent} value={resourceData.memory.value} />
      <ResourceProgressBar label="Disk" percent={resourceData.disk.percent} value={resourceData.disk.value} />
    </div>
  </div>
{/if}
