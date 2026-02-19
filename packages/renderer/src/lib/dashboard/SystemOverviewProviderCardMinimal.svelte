<script lang="ts">
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import StatusDotGlow from '/@/lib/dashboard/StatusDotGlow.svelte';
import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import {
  type ConnectionCallback,
  eventCollect,
  registerConnectionCallback,
} from '/@/lib/preferences/preferences-connection-rendering-task';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { getConnectionDisplayName, getSystemOverviewStatus } from '/@/stores/dashboard/system-overview.svelte';

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
}

let { connection, provider }: Props = $props();

let connectionName = $derived(getConnectionDisplayName(connection));
let canStart = $derived(connection.status === 'stopped' && (connection.lifecycleMethods ?? []).includes('start'));
let connectionStatus = $derived(getSystemOverviewStatus(connection.status));

function navigateToProvider(): void {
  router.goto(`/preferences/resources?focus=${provider.id}`);
}

function getLoggerHandler(): ConnectionCallback {
  return { log: (): void => {}, warn: (): void => {}, error: (): void => {}, onEnd: (): void => {} };
}

async function handleStart(): Promise<void> {
  const loggerHandlerKey = registerConnectionCallback(getLoggerHandler());
  await window.startProviderConnectionLifecycle(
    provider.internalId,
    $state.snapshot(connection),
    loggerHandlerKey,
    eventCollect,
  );
}
</script>

<div class="inline-flex items-center rounded-lg overflow-hidden ring-1 ring-[var(--pd-content-divider)] bg-[var(--pd-content-card-carousel-card-bg)]">
  <button
    class="inline-flex items-center gap-2 px-3 py-2 transition-colors cursor-pointer hover:bg-[var(--pd-content-card-carousel-card-hover-bg)]"
    onclick={navigateToProvider}
    aria-label="Navigate to {connectionName}"
    title="Navigate to {connectionName}">
    <Icon icon={KubernetesIcon} size={20} />
    <span class="text-sm font-medium text-[var(--pd-content-card-text)]">{connectionName}</span>
    {#if connectionStatus.status === 'progressing'}
      {#key connection.status}
        <Icon icon={connectionStatus.icon} size="1em" />
      {/key}
    {:else}
      <StatusDotGlow status={connection.status} />
    {/if}
  </button>

  {#if canStart}
    <div class="flex items-center py-1 px-1 border-l border-[var(--pd-content-divider)]">
      <ListItemButtonIcon
        title="Start {connectionName}"
        tooltip="Start {connectionName}"
        icon={faPlay}
        onClick={handleStart} />
    </div>
  {/if}
</div>
