<script lang="ts">
import type { ProviderConnectionInfo, ProviderInfo, ProviderVmConnectionInfo } from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import { Tab } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import { router } from 'tinro';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import ConnectionErrorIndicator from '/@/lib/ui/ConnectionErrorIndicator.svelte';
import ConnectionErrorInfoButton from '/@/lib/ui/ConnectionErrorInfoButton.svelte';
import ConnectionStatus from '/@/lib/ui/ConnectionStatus.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import { handleNavigation } from '/@/navigation';
import Route from '/@/Route.svelte';
import { providerInfos } from '/@/stores/providers';

import PreferencesConnectionActions from './PreferencesConnectionActions.svelte';
import PreferencesConnectionDetailsTerminal from './PreferencesConnectionDetailsTerminal.svelte';
import { getProviderConnectionName, type IConnectionStatus } from './Util';

export let providerInternalId: string | undefined = undefined;
export let connectionName = '';

let connectionStatus: IConnectionStatus;
let connectionInfo: ProviderVmConnectionInfo | undefined;
let providerInfo: ProviderInfo | undefined;

let providersUnsubscribe: Unsubscriber;
onMount(async () => {
  providersUnsubscribe = providerInfos.subscribe(providerInfosValue => {
    const providers = providerInfosValue;
    providerInfo = providers.find(provider => provider.internalId === providerInternalId);

    connectionInfo = providerInfo?.vmConnections?.find(connection => connection.name === connectionName);
    if (!connectionInfo) {
      handleNavigation({
        page: NavigationPage.RESOURCES,
      });
      return;
    }
    if (!providerInfo) {
      return;
    }
    const vmConnectionName = getProviderConnectionName(providerInfo, connectionInfo);
    if (vmConnectionName && connectionStatus?.status !== connectionInfo.status) {
      connectionStatus = {
        inProgress: false,
        action: undefined,
        status: connectionInfo.status,
      };
    }
    connectionStatus = connectionStatus;
  });
});

onDestroy(() => {
  if (providersUnsubscribe) {
    providersUnsubscribe();
  }
});

function updateConnectionStatus(
  _: ProviderInfo,
  connectionInfo: ProviderConnectionInfo,
  action?: string,
  error?: string,
): void {
  if (error) {
    if (connectionStatus) {
      connectionStatus = {
        ...connectionStatus,
        inProgress: false,
        error,
      };
    }
  } else if (action) {
    connectionStatus = {
      inProgress: true,
      action: action,
      status: connectionInfo.status,
    };
  }
  connectionStatus = connectionStatus;
}
</script>

{#if connectionInfo}
  <DetailsPage title={connectionInfo.name}>
    {#snippet subtitleSnippet()}
      {#if connectionInfo}
        <div class="flex flex-row">
          <ConnectionStatus status={connectionInfo.status} />
          <ConnectionErrorIndicator error={connectionInfo.error} />
          <ConnectionErrorInfoButton status={connectionStatus} />
        </div>
      {/if}
    {/snippet}
    {#snippet actionsSnippet()}
      {#if providerInfo && connectionInfo}
        <div class="flex justify-end">
          <PreferencesConnectionActions
            provider={providerInfo}
            connection={connectionInfo}
            connectionStatus={connectionStatus}
            updateConnectionStatus={updateConnectionStatus} />
        </div>
      {/if}
    {/snippet}
    {#snippet iconSnippet()}
      <IconImage image={providerInfo?.images?.icon} alt={providerInfo?.name} class="max-h-10" />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab
        title="Terminal"
        selected={isTabSelected($router.path, 'terminal')}
        url={getTabUrl($router.path, 'terminal')} />
    {/snippet}
    {#snippet contentSnippet()}
      <div class="h-full">
        {#if providerInfo && connectionInfo}
          <Route path="/terminal" breadcrumb="Terminal" navigationHint="tab">
            <PreferencesConnectionDetailsTerminal
              provider={providerInfo}
              connectionInfo={connectionInfo}
              screenReaderMode={true} />
          </Route>
        {/if}
      </div>
    {/snippet}
  </DetailsPage>
{/if}
