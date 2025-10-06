<script lang="ts">
import { faMinusCircle, faNetworkWired, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

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
  labels: [''] as string[],
  subnet: '',
  ipRange: '',
  gateway: '',
  ipv6Enabled: false,
  internalEnabled: false,
  driver: 'bridge',
  options: [''] as string[],
  selectedProvider: undefined,
});

let createError: string | undefined = $state(undefined);
let inProgress: boolean = $state(false);

let availableDrivers = $state<{ label: string; value: string }[]>([
  { label: 'bridge', value: 'bridge' },
  { label: 'macvlan', value: 'macvlan' },
  { label: 'ipvlan', value: 'ipvlan' },
]);

function addOption(): void {
  networkInfo.options.push('');
}

function deleteOption(index: number): void {
  networkInfo.options.splice(index, 1);
}

function addLabel(): void {
  networkInfo.labels.push('');
}

function deleteLabel(index: number): void {
  networkInfo.labels.splice(index, 1);
}

async function createNetwork(): Promise<void> {
  createError = undefined;
  inProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
    }

    // Parse driver-specific options with validation
    let parsedOptions: Record<string, string> | undefined;
    if (networkInfo.options) {
      const pairs = networkInfo.options.map(option => option.trim()).filter(option => option.length > 0);
      const validOptions: [string, string][] = [];
      const malformedOptions: string[] = [];

      for (const pair of pairs) {
        if (!pair.includes('=')) {
          malformedOptions.push(pair);
          continue;
        }
        const [key, value] = pair.split('=', 2);
        const trimmedKey = key?.trim();
        const trimmedValue = value?.trim();

        if (trimmedKey && trimmedValue) {
          validOptions.push([trimmedKey, trimmedValue]);
        } else {
          malformedOptions.push(pair);
        }
      }

      if (malformedOptions.length > 0) {
        console.warn(`Malformed network options ignored (expected key=value format): ${malformedOptions.join(', ')}`);
      }

      parsedOptions = validOptions.length > 0 ? Object.fromEntries(validOptions) : undefined;
    }

    // Parse labels (key=value)
    let parsedLabels: Record<string, string> | undefined;
    if (networkInfo.labels && Array.isArray(networkInfo.labels)) {
      const validLabels: [string, string][] = [];
      const malformedLabels: string[] = [];

      for (const label of networkInfo.labels) {
        const trimmed = label.trim();
        if (!trimmed) continue;

        if (!trimmed.includes('=')) {
          malformedLabels.push(trimmed);
          continue;
        }

        const [key, value] = trimmed.split('=', 2);
        const trimmedKey = key?.trim();
        const trimmedValue = value?.trim();

        if (trimmedKey && trimmedValue) {
          validLabels.push([trimmedKey, trimmedValue]);
        } else {
          malformedLabels.push(trimmed);
        }
      }

      if (malformedLabels.length > 0) {
        console.warn(`Malformed labels ignored (expected key=value format): ${malformedLabels.join(', ')}`);
      }

      parsedLabels = validLabels.length > 0 ? Object.fromEntries(validLabels) : undefined;
    }

    // Build the network create options - Docker/Podman API will ignore undefined fields
    const networkOptions: NetworkCreateOptions = {
      Name: networkInfo.networkName,
      Driver: networkInfo.driver || undefined,
      Labels: parsedLabels,
      EnableIPv6: networkInfo.ipv6Enabled || undefined,
      Internal: networkInfo.internalEnabled || undefined,
      IPAM: networkInfo.subnet
        ? {
            Config: [
              {
                Subnet: networkInfo.subnet,
                IPRange: networkInfo.ipRange || undefined,
                Gateway: networkInfo.gateway || undefined,
              },
            ],
          }
        : undefined,
      Options: parsedOptions,
    };

    const result: NetworkCreateResult = await window.createNetwork(
      $state.snapshot(networkInfo.selectedProvider),
      networkOptions,
    );

    // Verify network was created successfully
    if (!result?.Id) {
      throw new Error('Network creation failed: No network ID returned');
    }

    console.log('Network created successfully:', result.Id);

    // Navigate back or show success
    handleNavigation({ page: NavigationPage.IMAGES }); // TODO: Navigate to networks page when it exists
  } catch (error: unknown) {
    createError = error instanceof Error ? error.message : String(error);
    console.error('Error creating network:', error);
  } finally {
    inProgress = false;
  }
}

function navigateBack(): void {
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
    <Icon icon={faNetworkWired} class="fa-2x" />
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
        <label
          for="labels"
          class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Labels (key=value):</label
        >
      
        {#each networkInfo.labels as _, index (index)}
          <div class="flex flex-row justify-center items-center w-full py-1">
            <Input
              bind:value={networkInfo.labels[index]}
              placeholder="e.g., env=prod or app=backend"
              class="ml-2 w-full" />
      
            <Button
              type="link"
              hidden={index === networkInfo.labels.length - 1}
              on:click={(): void => deleteLabel(index)}
              icon={faMinusCircle} />
      
            <Button
              type="link"
              hidden={index < networkInfo.labels.length - 1}
              on:click={addLabel}
              icon={faPlusCircle} />
          </div>
        {/each}
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
          class="w-full" />
      </div>

      <div hidden={inProgress}>
        <label
          for="options"
          class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Advanced Options (driver-specific):</label
        >
      
        {#each networkInfo.options as _, index (index)}
          <div class="flex flex-row justify-center items-center w-full py-1">
            <Input
              bind:value={networkInfo.options[index]}
              placeholder="e.g., com.docker.network.bridge.name=mybr0"
              class="ml-2 w-full" />
      
            <Button
              type="link"
              hidden={index === networkInfo.options.length - 1}
              on:click={(): void => deleteOption(index)}
              icon={faMinusCircle} />
      
            <Button
              type="link"
              hidden={index < networkInfo.options.length - 1}
              on:click={addOption}
              icon={faPlusCircle} />
          </div>
        {/each}
      </div>

      <div class="w-full flex flex-row space-x-4">
        {#if !inProgress}
          <Button on:click={createNetwork} disabled={hasInvalidFields} class="w-full" icon={faNetworkWired}>
            Create
          </Button>
          <Button on:click={navigateBack} class="w-full">Cancel</Button>
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

