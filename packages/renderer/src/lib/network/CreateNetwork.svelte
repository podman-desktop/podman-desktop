<script lang="ts">
import { Button, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import type { NetworkCreateFormInfo, NetworkCreateOptions } from '/@api/container-info';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import { networksListInfo } from '../../stores/networks';
import { providerInfos } from '../../stores/providers';
import EngineFormPage from '../ui/EngineFormPage.svelte';

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

    if (!result.Id) {
      throw new Error('Network creation failed: No network ID returned');
    }

    // Wait for the network store to be updated with the new network
    await waitForNetworkInStore(result.Id, networkInfo.networkName);

    // Route back to networks list
    router.goto('/networks');
  } catch (error: unknown) {
    createError = error instanceof Error ? error.message : String(error);
    console.error('Error creating network:', error);
  } finally {
    createNetworkInProgress = false;
  }
}
/**
 * Wait for the network to be created and added to the store
 * This is a temporary function to wait for network creation before routing back to the networks list
 * Eventually we will want to route back to the network details page
 */
async function waitForNetworkInStore(networkId: string, networkName: string): Promise<void> {
  return new Promise<void>(resolve => {
    // Set a timeout to avoid waiting indefinitely
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve();
    }, 10000); // 10 second timeout

    const unsubscribe = networksListInfo.subscribe(networks => {
      // Check both ID and name to handle cases where Docker and Podman might have overlapping IDs
      if (networks.some(network => network.Id === networkId && network.Name === networkName)) {
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

