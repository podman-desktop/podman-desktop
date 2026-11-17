<script lang="ts">
import type { V1NodeStatus } from '@kubernetes/client-node';

import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';

import ConditionsTable from './ConditionsTable.svelte';

interface Props {
  artifact?: V1NodeStatus;
}

let { artifact }: Props = $props();
</script>

{#if artifact}
  {#if artifact.nodeInfo}
    <tr>
      <Title>{t('workloads.nodeInfo') ?? 'Node Info'}</Title>
    </tr>
    <tr>
      <Cell>{t('workloads.architecture') ?? 'Architecture'}</Cell>
      <Cell>{artifact.nodeInfo.architecture}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.bootId') ?? 'Boot ID'}</Cell>
      <Cell>{artifact.nodeInfo.bootID}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.containerRuntimeVersion') ?? 'Container Runtime Version'}</Cell>
      <Cell>{artifact.nodeInfo.containerRuntimeVersion}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.kernelVersion') ?? 'Kernel Version'}</Cell>
      <Cell>{artifact.nodeInfo.kernelVersion}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.kubeletVersion') ?? 'Kubelet Version'}</Cell>
      <Cell>{artifact.nodeInfo.kubeletVersion}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.kubeProxyVersion') ?? 'Kube Proxy Version'}</Cell>
      <Cell>{artifact.nodeInfo.kubeProxyVersion}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.machineId') ?? 'Machine ID'}</Cell>
      <Cell>{artifact.nodeInfo.machineID}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.operatingSystem') ?? 'Operating System'}</Cell>
      <Cell>{artifact.nodeInfo.operatingSystem}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.osImage') ?? 'OS Image'}</Cell>
      <Cell>{artifact.nodeInfo.osImage}</Cell>
    </tr>
    <tr>
      <Cell>{t('workloads.systemUuid') ?? 'System UUID'}</Cell>
      <Cell>{artifact.nodeInfo.systemUUID}</Cell>
    </tr>
  {/if}
  <tr>
    <Title>{t('workloads.status') ?? 'Status'}</Title>
  </tr>
  {#if artifact.conditions}
    <tr>
      <Title>{t('workloads.conditions') ?? 'Conditions'}</Title>
    </tr>
    <ConditionsTable conditions={artifact.conditions} />
  {/if}
  {#if artifact.addresses}
    <tr>
      <Title>{t('workloads.addresses') ?? 'Addresses'}</Title>
    </tr>
    {#each artifact.addresses as address, index (index)}
      <tr>
        <Cell>{address.type}</Cell>
        <Cell>{address.address}</Cell>
      </tr>
    {/each}
  {/if}
  {#if artifact.capacity}
    <tr>
      <Title>{t('workloads.capacity') ?? 'Capacity'}</Title>
    </tr>
    {#each Object.entries(artifact.capacity) as [key, value] (key)}
      <tr>
        <Cell>{key}</Cell>
        <Cell>{value}</Cell>
      </tr>
    {/each}
  {/if}
  {#if artifact.allocatable}
    <tr>
      <Title>{t('workloads.allocatable') ?? 'Allocatable'}</Title>
    </tr>
    {#each Object.entries(artifact.allocatable) as [key, value] (key)}
      <tr>
        <Cell>{key}</Cell>
        <Cell>{value}</Cell>
      </tr>
    {/each}
  {/if}
{/if}
