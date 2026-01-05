<script lang="ts">
import { Button, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { handleNavigation } from '/@/navigation';
import { networksListInfo } from '/@/stores/networks';
import { providerInfos } from '/@/stores/providers';
import type { NetworkCreateFormInfo, NetworkCreateOptions } from '/@api/container-info';
import { NavigationPage } from '/@api/navigation-page';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

let networkInfo: NetworkCreateFormInfo = $state({
  networkName: '',
  subnet: '',
  selectedProvider: undefined,
  // Unused fields for simplified form (will be used in the future)
  labels: [],
  ipRange: '',
  gateway: '',
  ipv6Enabled: false,
  internalEnabled: false,
  driver: 'bridge',
  options: [],
});

let createError: string | undefined = $state(undefined);
let createNetworkInProgress: boolean = $state(false);

async function createNetwork(): Promise<void> {
  createError = undefined;
  createNetworkInProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
    }

    const networkOptions: NetworkCreateOptions = {
      Name: networkInfo.networkName,
      IPAM: networkInfo.subnet
        ? {
            Driver: 'default',
            Config: [
              {
                Subnet: networkInfo.subnet,
              },
            ],
          }
        : undefined,
    };

    const result = await window.createNetwork($state.snapshot(networkInfo.selectedProvider), networkOptions);

    if (!result.Id || !result.engineId) {
      throw new Error('Network creation failed: Missing network ID or engine ID');
    }

    await waitForNetworkInStore(result.Id, result.engineId);

    // Route to the network details page
    handleNavigation({
      page: NavigationPage.NETWORK,
      parameters: {
        name: networkInfo.networkName,
        engineId: result.engineId,
      },
    });
  } catch (error: unknown) {
    createError = error instanceof Error ? error.message : String(error);
    console.error('Error creating network:', error);
  } finally {
    createNetworkInProgress = false;
  }
}

/**
 * Wait for the network to appear in the store before navigating.
 */
async function waitForNetworkInStore(networkId: string, engineId: string): Promise<void> {
  return new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve();
    }, 10000);

    const unsubscribe = networksListInfo.subscribe(networks => {
      if (networks.some(network => network.Id === networkId && network.engineId === engineId)) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      }
    });
  });
}

function cancelRoute(): void {
  router.goto('/networks');
}

let providerConnections = $derived(
  $providerInfos.reduce<ProviderContainerConnectionInfo[]>((acc, provider) => {
    const startedConnections = provider.containerConnections.filter(connection => connection.status === 'started');
    return acc.concat(startedConnections);
  }, []),
);

let autoSelectedProvider = $derived(providerConnections.length > 0 ? providerConnections[0] : undefined);

$effect(() => {
  networkInfo.selectedProvider = autoSelectedProvider;
});

let hasInvalidFields = $derived(!networkInfo.networkName || !networkInfo.selectedProvider);
</script>

<EngineFormPage
  title="Create a Network"
  showEmptyScreen={providerConnections.length === 0 && !createNetworkInProgress}>
  {#snippet icon()}
    <Icon icon={NetworkIcon} class="2x" />
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">

      {#if providerConnections.length > 1}
        <div>
          <label for="providerChoice" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
            >Container engine <span class="text-red-500">*</span></label>
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={networkInfo.selectedProvider}
            connections={providerConnections} />
        </div>
      {/if}

      <div>
        <label for="networkName" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Name <span class="text-red-500">*</span></label>
        <Input
          bind:value={networkInfo.networkName}
          name="networkName"
          id="networkName"
          placeholder="Network name"
          required
          class="w-full" />
      </div>

      <div>
        <label for="subnet" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Subnet</label>
        <Input
          bind:value={networkInfo.subnet}
          name="subnet"
          id="subnet"
          placeholder="10.89.0.0/24"
          class="w-full" />
      </div>

      <div class="w-full flex flex-row space-x-4">
        <Button type="secondary" class="w-full" onclick={cancelRoute}>Cancel</Button>
        <Button
          disabled={hasInvalidFields || createNetworkInProgress}
          inProgress={createNetworkInProgress}
          class="w-full"
          onclick={createNetwork}>
          Create
        </Button>
      </div>

      {#if createError}
        <div class="text-red-500 text-sm">
          Error: {createError}
        </div>
      {/if}
    </div>
  {/snippet}
</EngineFormPage>

