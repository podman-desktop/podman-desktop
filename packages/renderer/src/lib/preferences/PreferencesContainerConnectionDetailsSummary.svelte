<script lang="ts">
import type { ContainerProviderConnection } from '@podman-desktop/api';
import type { ProviderContainerConnectionInfo } from '@podman-desktop/core-api';
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { filesize } from 'filesize';

import Donut from '/@/lib/donut/Donut.svelte';

import { extractConnectionResourceMetrics, RESOURCE_FORMATS } from './ConnectionResourceMetrics';
import type { IProviderConnectionConfigurationPropertyRecorded } from './Util';

interface Props {
  properties?: IConfigurationPropertyRecordedSchema[];
  providerInternalId?: string;
  containerConnectionInfo?: ProviderContainerConnectionInfo;
}

const { properties = [], providerInternalId, containerConnectionInfo }: Props = $props();

let providerContainerConfiguration: IProviderConnectionConfigurationPropertyRecorded[] = $state([]);
let resourceMetrics = $derived(extractConnectionResourceMetrics(providerContainerConfiguration));

$effect(() => {
  Promise.all(
    properties.map(async configurationKey => ({
      ...configurationKey,
      value: configurationKey.id
        ? await window.getConfigurationValue(
            configurationKey.id,
            containerConnectionInfo as unknown as ContainerProviderConnection,
          )
        : undefined,
      connection: containerConnectionInfo?.name ?? '',
      providerId: providerInternalId ?? '',
    })),
  )
    .then(result => {
      providerContainerConfiguration = result.filter(configurationKey => configurationKey.value !== undefined);
    })
    .catch((err: unknown) => console.error('Error collecting providers', err));
});
</script>

<div class="h-full text-[var(--pd-details-body-text)]">
  {#if containerConnectionInfo}
    <div class="flex pl-8 py-4 flex-col w-full text-sm">
      <div class="flex flex-row mt-5">
        <span class="font-semibold min-w-[150px]">Name</span>
        <span aria-label={containerConnectionInfo.name}>{containerConnectionInfo.name}</span>
      </div>
      {#if resourceMetrics?.cpu}
        <div class="flex flex-row mt-5">
          <span class="font-semibold min-w-[150px]">{resourceMetrics.cpu.description}</span>
          <Donut title={resourceMetrics.cpu.description} value={resourceMetrics.cpu.total} percent={resourceMetrics.cpu.usagePercent} />
        </div>
      {/if}
      {#if resourceMetrics?.memory}
        <div class="flex flex-row mt-5">
          <span class="font-semibold min-w-[150px]">{resourceMetrics.memory.description}</span>
          <Donut title={resourceMetrics.memory.description} value={filesize(resourceMetrics.memory.total)} percent={resourceMetrics.memory.usagePercent} />
        </div>
      {/if}
      {#if resourceMetrics?.disk}
        <div class="flex flex-row mt-5">
          <span class="font-semibold min-w-[150px]">{resourceMetrics.disk.description}</span>
          <Donut title={resourceMetrics.disk.description} value={filesize(resourceMetrics.disk.total)} percent={resourceMetrics.disk.usagePercent} />
        </div>
      {/if}
      {#each providerContainerConfiguration.filter(conf => !RESOURCE_FORMATS.has(conf.format ?? '') && !conf.hidden) as connectionSetting (connectionSetting.id)}
        <div class="flex flex-row mt-5">
          <span class="font-semibold min-w-[150px]">{connectionSetting.description}</span>
          <span>{connectionSetting.value}</span>
        </div>
      {/each}
      <div class="flex flex-row mt-5">
        <span class="font-semibold min-w-[150px]">Type</span>
        <span aria-label={containerConnectionInfo.type}
          >{#if containerConnectionInfo.type === 'docker'}Docker{:else if containerConnectionInfo.type === 'podman'}Podman{/if}</span>
      </div>
      <div class="flex flex-row mt-5">
        <span class="font-semibold min-w-[150px]">Endpoint</span>
        <span aria-label={containerConnectionInfo.endpoint.socketPath}
          >{containerConnectionInfo.endpoint.socketPath}</span>
      </div>
    </div>
  {/if}
</div>
