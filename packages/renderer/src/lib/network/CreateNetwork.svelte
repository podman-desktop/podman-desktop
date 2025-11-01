<script lang="ts">
import { faMinusCircle, faNetworkWired, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import type { NetworkCreateFormInfo, NetworkCreateOptions } from '/@api/container-info';
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
let createNetworkInProgress: boolean = $state(false);
let createNetworkFinished: boolean = $state(false);

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
  createNetworkInProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
    }

    // Parse driver options
    const parsedOptions = parseKeyValueArray(networkInfo.options);
    const parsedLabels = parseKeyValueArray(networkInfo.labels);

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

    await window.createNetwork($state.snapshot(networkInfo.selectedProvider), networkOptions);

    createNetworkFinished = true;
  } catch (error: unknown) {
    createError = error instanceof Error ? error.message : String(error);
    console.error('Error creating network:', error);
  } finally {
    createNetworkInProgress = false;
  }
}

function parseKeyValueArray(list: string[]): Record<string, string> | undefined {
  const validPairs: [string, string][] = [];
  for (const entry of list.map(s => s.trim()).filter(Boolean)) {
    const [key, value] = entry.split('=');
    if (key && value) validPairs.push([key.trim(), value.trim()]);
  }
  return validPairs.length > 0 ? Object.fromEntries(validPairs) : undefined;
}

function end(): void {
  // redirect to the networks page
  router.goto('/networks');
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
  inProgress={createNetworkInProgress}
  showEmptyScreen={providerConnections.length === 0 && !createNetworkInProgress}>
  {#snippet icon()}
    <Icon icon={faNetworkWired} class="fa-2x" />
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      <div hidden={createNetworkInProgress}>
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

      <div hidden={createNetworkInProgress}>
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
        <div hidden={createNetworkInProgress}>
          <label for="providerChoice" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
            >Container engine</label>
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={networkInfo.selectedProvider}
            connections={providerConnections} />
        </div>
      {/if}

      <div hidden={createNetworkInProgress}>
        <label for="subnet" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Subnet</label>
        <Input
          bind:value={networkInfo.subnet}
          name="subnet"
          id="subnet"
          placeholder="Subnet (e.g., 10.89.0.0/24)"
          class="w-full" />
      </div>

      <div hidden={createNetworkInProgress}>
        <label for="ipv6" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">IPv6</label>
        <SlideToggle id="ipv6" name="ipv6" bind:checked={networkInfo.ipv6Enabled} />
      </div>

      <div hidden={createNetworkInProgress}>
        <label for="ipRange" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">IP range</label>
        <Input
          bind:value={networkInfo.ipRange}
          name="ipRange"
          id="ipRange"
          placeholder="IP range (e.g., 10.89.0.0/25)"
          class="w-full" />
      </div>

      <div hidden={createNetworkInProgress}>
        <label for="gateway" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Gateway</label>
        <Input
          bind:value={networkInfo.gateway}
          name="gateway"
          id="gateway"
          placeholder="Gateway (e.g., 10.89.0.1)"
          class="w-full" />
      </div>

      <div hidden={createNetworkInProgress}>
        <label for="internal" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
          >Internal</label>
        <SlideToggle id="internal" name="internal" bind:checked={networkInfo.internalEnabled} />
      </div>

        <div hidden={createNetworkInProgress}>
        <label for="driver" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">Driver</label>
        <Dropdown
          id="driver"
          name="driver"
          bind:value={networkInfo.driver}
          options={availableDrivers}
          class="w-full" />
      </div>

      <div hidden={createNetworkInProgress}>
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
        <Button
          disabled={hasInvalidFields || createNetworkInProgress || createNetworkFinished}
          inProgress={createNetworkInProgress}
          class="w-full"
          hidden={createNetworkFinished}
          icon={faNetworkWired}
          onclick={createNetwork}>
          Create
        </Button>
      
        <Button
          on:click={end}
          class="w-full"
          hidden={!createNetworkFinished}
          onclick={end}>
          Done
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

