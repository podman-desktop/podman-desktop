<script lang="ts">
import type { ContainerProviderConnection } from '@podman-desktop/api';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { filesize } from 'filesize';

import ResourceProgressBar from '/@/lib/dashboard/ResourceProgressBar.svelte';
import { PeerProperties } from '/@/lib/preferences/PeerProperties';
import type { IProviderConnectionConfigurationPropertyRecorded } from '/@/lib/preferences/Util';
import { configurationProperties } from '/@/stores/configurationProperties';

interface Props {
  provider: ProviderInfo;
  connection: ProviderContainerConnectionInfo;
}

let { provider, connection }: Props = $props();

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

// Get Podman provider and connection
let podmanConnection = $derived(connection);

let resourceConfig = $state<IProviderConnectionConfigurationPropertyRecorded[]>([]);

// Fetch resource configuration values
$effect(() => {
  if (!podmanConnection || configurationKeys.length === 0) {
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
        providerId: provider.internalId,
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
    name: podmanConnection?.displayName,
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
<div class="border-t border-[var(--pd-content-divider)] pt-3">
  <div class="px-3 grid grid-cols-3 gap-6 ">
    <ResourceProgressBar label="CPU" percent={resourceData.cpu.percent} value={resourceData.cpu.value} />
    <ResourceProgressBar label="Memory" percent={resourceData.memory.percent} value={resourceData.memory.value} />
    <ResourceProgressBar label="Disk" percent={resourceData.disk.percent} value={resourceData.disk.value} />
  </div>
</div>
{/if}
