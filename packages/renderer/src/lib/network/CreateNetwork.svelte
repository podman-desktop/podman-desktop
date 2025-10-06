<script lang="ts">
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, Input } from '@podman-desktop/ui-svelte';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import { handleNavigation } from '/@/navigation';
import type { NetworkCreateFormInfo, NetworkCreateOptions, NetworkCreateResult } from '/@api/container-info';
import { NavigationPage } from '/@api/navigation-page';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import { providerInfos } from '../../stores/providers';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import SlideToggle from '../ui/SlideToggle.svelte';

let networkInfo: NetworkCreateFormInfo = $state({
  networkName: '',
  label: '',
  subnet: '',
  ipRange: '',
  gateway: '',
  ipv6Enabled: false,
  internalEnabled: false,
  driver: 'bridge',
  options: '',
  selectedProvider: undefined,
});

let createError: string | undefined = $state(undefined);
let inProgress: boolean = $state(false);

let availableDrivers = $state<{ label: string; value: string }[]>([
  { label: 'bridge', value: 'bridge' },
  { label: 'macvlan', value: 'macvlan' },
  { label: 'ipvlan', value: 'ipvlan' },
]);

async function createNetwork(): Promise<void> {
  createError = undefined;
  inProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
    }

    // Build the network create options using Dockerode API
    const networkOptions: NetworkCreateOptions = {
      Name: networkInfo.networkName,
    };

    // Add optional fields only if they have values
    if (networkInfo.label) {
      networkOptions.Labels = { label: networkInfo.label };
    }

    if (networkInfo.driver) {
      networkOptions.Driver = networkInfo.driver;
    }

    if (networkInfo.ipv6Enabled) {
      networkOptions.EnableIPv6 = true;
    }

    if (networkInfo.internalEnabled) {
      networkOptions.Internal = true;
    }

    // IPAM Configuration
    if (networkInfo.subnet) {
      const ipamConfig: { Subnet?: string; IPRange?: string; Gateway?: string } = {
        Subnet: networkInfo.subnet,
      };
      if (networkInfo.ipRange) {
        ipamConfig.IPRange = networkInfo.ipRange;
      }
      if (networkInfo.gateway) {
        ipamConfig.Gateway = networkInfo.gateway;
      }
      networkOptions.IPAM = {
        Config: [ipamConfig],
      };
    }

    // Driver-specific options (for advanced use cases)
    // Parse options string (expected format: key=value,key2=value2)
    if (networkInfo.options) {
      const optionsObj: Record<string, string> = {};
      const optPairs = networkInfo.options.split(',').map(pair => pair.trim());
      for (const pair of optPairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
          optionsObj[key.trim()] = value.trim();
        }
      }
      if (Object.keys(optionsObj).length > 0) {
        networkOptions.Options = optionsObj;
      }
    }

    const result: NetworkCreateResult = await window.createNetwork(
      $state.snapshot(networkInfo.selectedProvider),
      networkOptions,
    );

    // Verify network was created successfully
    if (!result?.Id) {
      throw new Error('Network creation failed: No network ID returned');
    }

    // Log any warnings from the API
    if (result.Warning) {
      console.warn('Network created with warning:', result.Warning);
    }

    console.log('Network created successfully:', result.Id);

    // Navigate back or show success
    handleNavigation({ page: NavigationPage.IMAGES }); // TODO: Navigate to networks page when it exists
  } catch (error) {
    createError = String(error);
    console.error('Error creating network:', error);
  } finally {
    inProgress = false;
  }
}

function cleanupNetwork(): void {
  handleNavigation({ page: NavigationPage.IMAGES });
}

let providerConnections = $derived(
  $providerInfos.reduce<ProviderContainerConnectionInfo[]>((acc, provider) => {
    const startedConnections = provider.containerConnections.filter(connection => connection.status === 'started');
    return acc.concat(startedConnections);
  }, []),
);
let selectedProvider = $derived(providerConnections.length > 0 ? providerConnections[0] : undefined);
$effect(() => {
  networkInfo.selectedProvider = selectedProvider;
});

let hasInvalidFields = $derived(!networkInfo.networkName || !networkInfo.selectedProvider);
</script>

<EngineFormPage
  title="Create a Network"
  inProgress={inProgress}
  showEmptyScreen={providerConnections.length === 0 && !inProgress}>
  {#snippet icon()}
    <i class="fas fa-network-wired fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      <div hidden={inProgress}>
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

      <div hidden={inProgress}>
        <label for="label" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Label</label>
        <Input bind:value={networkInfo.label} name="label" id="label" placeholder="Label" class="w-full" />
      </div>

      {#if providerConnections.length > 1}
        <div hidden={inProgress}>
          <label for="providerChoice" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
            >Container engine</label>
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={networkInfo.selectedProvider}
            connections={providerConnections} />
        </div>
      {/if}

      <div hidden={inProgress}>
        <label for="subnet" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Subnet</label>
        <Input
          bind:value={networkInfo.subnet}
          name="subnet"
          id="subnet"
          placeholder="Subnet (e.g., 10.89.0.0/24)"
          class="w-full" />
      </div>

      <div hidden={inProgress}>
        <label for="ipv6" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">IPv6</label>
        <SlideToggle id="ipv6" name="ipv6" bind:checked={networkInfo.ipv6Enabled} />
      </div>

      <div hidden={inProgress}>
        <label for="ipRange" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">IP range</label>
        <Input
          bind:value={networkInfo.ipRange}
          name="ipRange"
          id="ipRange"
          placeholder="IP range (e.g., 10.89.0.0/25)"
          class="w-full" />
      </div>

      <div hidden={inProgress}>
        <label for="gateway" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Gateway</label>
        <Input
          bind:value={networkInfo.gateway}
          name="gateway"
          id="gateway"
          placeholder="Gateway (e.g., 10.89.0.1)"
          class="w-full" />
      </div>

      <div hidden={inProgress}>
        <label for="internal" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Internal</label>
        <SlideToggle id="internal" name="internal" bind:checked={networkInfo.internalEnabled} />
      </div>

      <div hidden={inProgress}>
        <label for="driver" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Driver</label>
        <Dropdown
          id="driver"
          name="driver"
          bind:value={networkInfo.driver}
          options={availableDrivers}
          class="w-full"
          onChange={(value): void => {
            networkInfo.driver = String(value);
          }} />
      </div>

      <div hidden={inProgress}>
        <label for="options" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Advanced Options</label>
        <Input
          bind:value={networkInfo.options}
          name="options"
          id="options"
          placeholder="Driver-specific options (e.g., com.docker.network.bridge.name=mybr0)"
          class="w-full" />
      </div>

      <div class="w-full flex flex-row space-x-4">
        {#if !inProgress}
          <Button on:click={createNetwork} disabled={hasInvalidFields} class="w-full" icon={faNetworkWired}>
            Create
          </Button>
          <Button on:click={cleanupNetwork} class="w-full">Cancel</Button>
        {/if}
      </div>

      {#if createError}
        <div class="text-red-500 text-sm">
          Error: {createError}
        </div>
      {/if}
    </div>
  {/snippet}
</EngineFormPage>

