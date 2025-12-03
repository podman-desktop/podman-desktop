<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, Dropdown, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import type { NetworkCreateFormInfo, NetworkCreateOptions } from '/@api/container-info';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import { networksListInfo } from '../../stores/networks';
import { providerInfos } from '../../stores/providers';
import EngineFormPage from '../ui/EngineFormPage.svelte';

// Network driver options
const DRIVER_OPTIONS = [
  { label: 'Bridge', value: 'bridge' },
  { label: 'IPvlan', value: 'ipvlan' },
  { label: 'Macvlan', value: 'macvlan' },
];

// Tab state - using state-based switching for better testability
let activeTab: 'basic' | 'advanced' = $state('basic');

let networkInfo: NetworkCreateFormInfo = $state({
  networkName: '',
  subnet: '',
  selectedProvider: undefined,
  labels: [],
  ipRange: '',
  gateway: '',
  ipv6Enabled: false,
  internalEnabled: false,
  driver: 'bridge',
  options: [],
  dnsEnabled: true,
  dnsServers: [''],
});

let createError: string | undefined = $state(undefined);
let createNetworkInProgress: boolean = $state(false);

// Detect if the selected provider is Podman (for DNS server feature)
let isPodman = $derived(networkInfo.selectedProvider?.type === 'podman');

// DNS should be available for bridge driver and only for Podman
let dnsAvailable = $derived(isPodman && networkInfo.driver === 'bridge');

// Check if subnet is required (for ipvlan and macvlan)
let requiresSubnet = $derived(networkInfo.driver === 'ipvlan' || networkInfo.driver === 'macvlan');
let subnetMissing = $derived(requiresSubnet && !networkInfo.subnet);

async function createNetwork(): Promise<void> {
  createError = undefined;
  createNetworkInProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
    }

    // Validate subnet for ipvlan/macvlan
    if (requiresSubnet && !networkInfo.subnet) {
      throw new Error(`Subnet is required for ${networkInfo.driver} networks.`);
    }

    // Build IPAM config if subnet is provided
    const ipamConfig: { Subnet?: string; IPRange?: string; Gateway?: string }[] = [];
    if (networkInfo.subnet) {
      const config: { Subnet?: string; IPRange?: string; Gateway?: string } = {
        Subnet: networkInfo.subnet,
      };
      if (networkInfo.ipRange) {
        config.IPRange = networkInfo.ipRange;
      }
      if (networkInfo.gateway) {
        config.Gateway = networkInfo.gateway;
      }
      ipamConfig.push(config);
    }

    // Build network options
    // For ipvlan/macvlan, we must provide IPAM config with subnet
    // For bridge, IPAM is optional
    const networkOptions: NetworkCreateOptions = {
      Name: networkInfo.networkName,
      Driver: networkInfo.driver,
      EnableIPv6: networkInfo.ipv6Enabled,
      Internal: networkInfo.internalEnabled,
      IPAM:
        ipamConfig.length > 0
          ? {
              Driver: 'default',
              Config: ipamConfig,
            }
          : undefined,
    };

    // Add DNS servers for Podman if DNS is enabled and servers are specified
    if (isPodman && dnsAvailable && networkInfo.dnsEnabled) {
      const dnsServers = networkInfo.dnsServers.filter(dns => dns.trim() !== '');
      if (dnsServers.length > 0) {
        networkOptions.Options = {
          ...networkOptions.Options,
          dns: dnsServers.join(','),
        };
      }
    }

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

let hasInvalidFields = $derived(!networkInfo.networkName || !networkInfo.selectedProvider || subnetMissing);

// DNS server management functions
function addDnsServer(): void {
  networkInfo.dnsServers = [...networkInfo.dnsServers, ''];
}

function removeDnsServer(index: number): void {
  networkInfo.dnsServers = networkInfo.dnsServers.filter((_, i) => i !== index);
}
</script>

<EngineFormPage
  title="Create a Network"
  showEmptyScreen={providerConnections.length === 0 && !createNetworkInProgress}>
  {#snippet icon()}
    <Icon icon={NetworkIcon} class="2x" />
  {/snippet}
  {#snippet content()}
    <div class="space-y-2">
      <div class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]">
        <button
          type="button"
          class="pb-1 border-b-[3px] whitespace-nowrap hover:cursor-pointer px-4 py-2 text-[var(--pd-tab-text)] {activeTab === 'basic' ? 'border-[var(--pd-tab-highlight)] text-[var(--pd-tab-text-highlight)]' : 'border-transparent hover:border-[var(--pd-tab-hover)]'}"
          aria-label="Basic"
          onclick={(): void => { activeTab = 'basic'; }}>
          Basic
        </button>
        <button
          type="button"
          class="pb-1 border-b-[3px] whitespace-nowrap hover:cursor-pointer px-4 py-2 text-[var(--pd-tab-text)] {activeTab === 'advanced' ? 'border-[var(--pd-tab-highlight)] text-[var(--pd-tab-text-highlight)]' : 'border-transparent hover:border-[var(--pd-tab-hover)]'}"
          aria-label="Advanced"
          onclick={(): void => { activeTab = 'advanced'; }}>
          Advanced
        </button>
      </div>
      <div>
        {#if activeTab === 'basic'}
          <div class="h-96 overflow-y-auto pr-4 space-y-6">
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

            <!-- Network Driver - moved to Basic tab for better UX -->
            <div>
              <label for="driver" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                >Network Driver</label>
              <Dropdown class="w-full" name="driver" bind:value={networkInfo.driver}>
                {#each DRIVER_OPTIONS as option (option.value)}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </Dropdown>
              {#if networkInfo.driver === 'bridge'}
                <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                  Bridge is the most common driver for container networking.
                </p>
              {:else if networkInfo.driver === 'ipvlan'}
                <p class="text-sm text-amber-500 mt-1">
                  IPvlan requires a subnet to be specified below.
                </p>
              {:else if networkInfo.driver === 'macvlan'}
                <p class="text-sm text-amber-500 mt-1">
                  Macvlan requires a subnet to be specified below.
                </p>
              {/if}
            </div>

            <div>
              <label for="subnet" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">
                Subnet
                {#if requiresSubnet}
                  <span class="text-red-500">*</span>
                {/if}
              </label>
              <Input
                bind:value={networkInfo.subnet}
                name="subnet"
                id="subnet"
                placeholder="10.89.0.0/24"
                required={requiresSubnet}
                class="w-full"
                error={subnetMissing ? 'Subnet is required for ' + networkInfo.driver + ' networks' : ''} />
              {#if !requiresSubnet}
                <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                  Optional for bridge networks. Leave empty for auto-assignment.
                </p>
              {/if}
            </div>
          </div>
        {:else if activeTab === 'advanced'}
          <div class="h-96 overflow-y-auto pr-4 space-y-6">
            <!-- IPv6 (dual stack) -->
            <div>
              <label for="ipv6" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                >IPv6 (Dual Stack)</label>
              <Checkbox bind:checked={networkInfo.ipv6Enabled} title="Enable IPv6">
                Enable IPv6 networking alongside IPv4
              </Checkbox>
            </div>

            <!-- Internal Network -->
            <div>
              <label for="internal" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                >Internal Network</label>
              <Checkbox bind:checked={networkInfo.internalEnabled} title="Internal network">
                Restrict external access to the network
              </Checkbox>
              <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                Internal networks are isolated and cannot communicate with external hosts.
              </p>
            </div>

            <!-- IP Range (IPAM) -->
            <div>
              <label for="ipRange" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                >IP Range</label>
              <Input
                bind:value={networkInfo.ipRange}
                name="ipRange"
                id="ipRange"
                placeholder="10.89.0.0/25"
                class="w-full" />
              <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                Allocate container IPs from a sub-range of the subnet.
              </p>
            </div>

            <!-- Gateway -->
            <div>
              <label for="gateway" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                >Gateway</label>
              <Input
                bind:value={networkInfo.gateway}
                name="gateway"
                id="gateway"
                placeholder="10.89.0.1"
                class="w-full" />
              <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                IPv4 or IPv6 gateway for the network.
              </p>
            </div>

            <!-- DNS Servers (Podman only) -->
            <div class:opacity-50={!dnsAvailable}>
              <label for="dns" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]">
                DNS Servers
                {#if !isPodman}
                  <span class="text-sm font-normal text-[var(--pd-content-card-text)]">(Podman only)</span>
                {/if}
              </label>
              
              {#if dnsAvailable}
                <Checkbox bind:checked={networkInfo.dnsEnabled} title="Enable DNS" class="mb-2">
                  Enable DNS for this network
                </Checkbox>
              {/if}
              
              {#if networkInfo.dnsEnabled && dnsAvailable}
                {#each networkInfo.dnsServers as _, index (index)}
                  <div class="flex flex-row items-center w-full py-1">
                    <Input
                      bind:value={networkInfo.dnsServers[index]}
                      placeholder="8.8.8.8"
                      disabled={!dnsAvailable}
                      class="w-full" />
                    <Button
                      type="link"
                      hidden={index === networkInfo.dnsServers.length - 1}
                      onclick={(): void => removeDnsServer(index)}
                      icon={faMinusCircle}
                      disabled={!dnsAvailable} />
                    <Button
                      type="link"
                      hidden={index < networkInfo.dnsServers.length - 1}
                      onclick={addDnsServer}
                      icon={faPlusCircle}
                      disabled={!dnsAvailable} />
                  </div>
                {/each}
              {/if}
              
              {#if !isPodman}
                <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                  Custom DNS servers are only available for Podman networks.
                </p>
              {:else if networkInfo.driver !== 'bridge'}
                <p class="text-sm text-[var(--pd-content-card-text)] mt-1">
                  DNS is only available for bridge networks.
                </p>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <div class="w-full flex flex-row space-x-4 pt-4">
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
