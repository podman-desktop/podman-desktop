<script lang="ts">
import type { ContainerProviderConnection } from '@podman-desktop/api';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { filesize } from 'filesize';

import SystemOverviewResourceBar from '/@/lib/dashboard/SystemOverviewResourceBar.svelte';
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

let configurationKeys: IConfigurationPropertyRecordedSchema[] = $derived(
  properties
    .filter(property => property.scope === 'ContainerConnection')
    .sort((a, b) => (a?.id ?? '').localeCompare(b?.id ?? '')),
);

let podmanConnection = $derived(connection);

let resourceConfig = $state<IProviderConnectionConfigurationPropertyRecorded[]>([]);

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

let resourceData = $derived.by((): ResourceData | undefined => {
  if (resourceConfig.length === 0) return undefined;

  const connectionConfigs = resourceConfig.filter(config => config.value !== undefined);
  if (connectionConfigs.length === 0) return undefined;

  const peerProperties = new PeerProperties('Usage');

  const cpuConfig = connectionConfigs.find(config => config.format === 'cpu');
  const cpuUsage = cpuConfig ? peerProperties.getPeerProperty(cpuConfig.id, connectionConfigs) : 0;
  const cpuTotal = cpuConfig?.value ?? 0;
  const cpuUsed = cpuTotal > 0 && cpuUsage > 0 ? ((cpuUsage / 100) * cpuTotal).toFixed(1) : '0';

  const memoryConfig = connectionConfigs.find(config => config.format === 'memory');
  const memoryUsage = memoryConfig ? peerProperties.getPeerProperty(memoryConfig.id, connectionConfigs) : 0;
  const memoryTotal = memoryConfig?.value ?? 0;
  const memoryUsed = memoryTotal > 0 && memoryUsage > 0 ? (memoryUsage / 100) * memoryTotal : 0;

  const diskConfig = connectionConfigs.find(config => config.format === 'diskSize');
  const diskUsage = diskConfig ? peerProperties.getPeerProperty(diskConfig.id, connectionConfigs) : 0;
  const diskTotal = diskConfig?.value ?? 0;
  const diskUsed = diskTotal > 0 && diskUsage > 0 ? (diskUsage / 100) * diskTotal : 0;

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
  <div class="flex flex-col gap-1 text-xs">
    <SystemOverviewResourceBar label="CPU" percent={resourceData.cpu.percent} />
    <SystemOverviewResourceBar label="Mem" percent={resourceData.memory.percent} />
    <SystemOverviewResourceBar label="Disk" percent={resourceData.disk.percent} />
  </div>
{/if}
