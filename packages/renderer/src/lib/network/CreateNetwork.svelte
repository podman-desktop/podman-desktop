<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, Dropdown, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import { handleNavigation } from '/@/navigation';
import Route from '/@/Route.svelte';
import { networksListInfo } from '/@/stores/networks';
import { providerInfos } from '/@/stores/providers';
import type { NetworkCreateFormInfo, NetworkCreateOptions } from '/@api/container-info';
import { NavigationPage } from '/@api/navigation-page';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

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
let driverOptions: string[] = $state([]);

// Fetch available network drivers when the selected provider changes
$effect(() => {
  const provider = networkInfo.selectedProvider;
  if (provider) {
    window
      .getNetworkDrivers($state.snapshot(provider))
      .then(drivers => {
        driverOptions = drivers;
        // Reset driver to 'bridge' on provider change
        if (drivers.includes('bridge')) {
          networkInfo.driver = 'bridge';
        } else if (drivers.length > 0) {
          networkInfo.driver = drivers[0];
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch network drivers:', error);
        driverOptions = [];
      });
  } else {
    driverOptions = [];
  }
});

// Detect if the selected provider is Podman (for DNS server feature)
let isPodman = $derived(networkInfo.selectedProvider?.type === 'podman');

// DNS should be available for bridge driver and only for Podman
let dnsAvailable = $derived(isPodman && networkInfo.driver === 'bridge');

// Check if subnet is required (for ipvlan and macvlan)
let requiresSubnet = $derived(networkInfo.driver === 'ipvlan' || networkInfo.driver === 'macvlan');

async function createNetwork(): Promise<void> {
  createError = undefined;
  createNetworkInProgress = true;

  try {
    if (!networkInfo.selectedProvider) {
      throw new Error('There is no container engine available.');
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
  handleNavigation({ page: NavigationPage.NETWORKS });
}

let providerConnections = $derived(
  $providerInfos.reduce<ProviderContainerConnectionInfo[]>((acc, provider) => {
    const startedConnections = provider.containerConnections.filter(connection => connection.status === 'started');
    return acc.concat(startedConnections);
  }, []),
);

// Select default provider connection on mount only (not on tab switches)
onMount(() => {
  networkInfo.selectedProvider ??= providerConnections.length > 0 ? providerConnections[0] : undefined;
});

// Redirect to basic tab if landing on base path without a specific tab
$effect(() => {
  const currentPath = $router.path;
  if (currentPath.endsWith('/create') || currentPath.endsWith('/create/')) {
    router.goto(`${currentPath.replace(/\/$/, '')}/basic`);
  }
});

let hasInvalidFields = $derived(
  !networkInfo.networkName || !networkInfo.selectedProvider || (requiresSubnet && !networkInfo.subnet),
);

// DNS server management functions
function addDnsServer(): void {
  networkInfo.dnsServers = [...networkInfo.dnsServers, ''];
}

function removeDnsServer(index: number): void {
  networkInfo.dnsServers = networkInfo.dnsServers.filter((_, i) => i !== index);
}
</script>

<Route path="/*">
  <EngineFormPage
    title="Create a Network"
    showEmptyScreen={providerConnections.length === 0 && !createNetworkInProgress}>
    {#snippet icon()}
      <Icon icon={NetworkIcon} class="2x" />
    {/snippet}
    {#snippet content()}
      <div class="space-y-2">
        <div class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]">
          <Button type="tab" on:click={(): void => router.goto(getTabUrl($router.path, 'basic'))} selected={isTabSelected($router.path, 'basic')}>Basic</Button>
          <Button type="tab" on:click={(): void => router.goto(getTabUrl($router.path, 'advanced'))} selected={isTabSelected($router.path, 'advanced')}>Advanced</Button>
        </div>
        <div>
          <Route path="/basic" breadcrumb="Basic" navigationHint="tab">
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
            </div>
          </Route>
          <Route path="/advanced" breadcrumb="Advanced" navigationHint="tab">
            <div class="h-96 overflow-y-auto pr-4 space-y-6">
              <!-- Network Driver -->
              <div>
                <label for="driver" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                  >Network Driver</label>
                <Dropdown class="w-full" name="driver" bind:value={networkInfo.driver}>
                  {#each driverOptions as option (option)}
                    <option value={option}>{option}</option>
                  {/each}
                </Dropdown>
              </div>

              <!-- Subnet -->
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
                  placeholder="e.g. 10.89.0.0/24"
                  required={requiresSubnet}
                  class="w-full" />
              </div>

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
                  Disable external connections
                </Checkbox>
              </div>

              <!-- IP Range (IPAM) -->
              <div>
                <label for="ipRange" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                  >IP Range</label>
                <Input
                  bind:value={networkInfo.ipRange}
                  name="ipRange"
                  id="ipRange"
                  placeholder="10.89.0.0/25 or fd00::/80"
                  class="w-full" />
              </div>

              <!-- Gateway -->
              <div>
                <label for="gateway" class="block mb-2 font-semibold text-[var(--pd-content-card-header-text)]"
                  >Gateway</label>
                <Input
                  bind:value={networkInfo.gateway}
                  name="gateway"
                  id="gateway"
                  placeholder="10.89.0.1 or fd00::1"
                  class="w-full" />
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
                    Enable DNS
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
          </Route>
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
          <ErrorMessage class="text-sm" error={createError} />
        {/if}
      </div>
    {/snippet}
  </EngineFormPage>
</Route>
