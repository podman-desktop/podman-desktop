<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import type { NetworkInspectInfo } from '@podman-desktop/core-api';
import { Button, Dropdown, Input } from '@podman-desktop/ui-svelte';

import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';
import type { RunOptions } from '/@/lib/image/run/run-options';

interface Props {
  options: RunOptions['networking'];
  engineNetworks: NetworkInspectInfo[];
  engineContainers: ContainerInfoUI[];
}

let { options = $bindable(), engineNetworks, engineContainers }: Props = $props();

function addDnsServer(): void {
  options.dnsServers = [...options.dnsServers, ''];
}

function deleteDnsServer(index: number): void {
  options.dnsServers = options.dnsServers.filter((_, i) => i !== index);
}

function addExtraHost(): void {
  options.extraHosts = [...options.extraHosts, { host: '', ip: '' }];
}

function deleteExtraHost(index: number): void {
  options.extraHosts = options.extraHosts.filter((_, i) => i !== index);
}
</script>

<div class="pr-4">
  <label
    for="containerHostname"
    class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Defines container hostname:</label>
  <div class="flex flex-row justify-center items-center w-full">
    <Input bind:value={options.hostname} placeholder="Must be a valid RFC 1123 hostname" class="ml-2" />
  </div>

  <label
    for="ContainerDns"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Custom DNS server(s):</label>

  {#each options.dnsServers as _, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input bind:value={options.dnsServers[index]} placeholder="IP Address" class="ml-2" />

      <Button
        type="link"
        hidden={index === options.dnsServers.length - 1}
        aria-label="Delete DNS server at index {index}"
        on:click={(): void => deleteDnsServer(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.dnsServers.length - 1}
        aria-label="Add DNS server after index {index}"
        on:click={addDnsServer}
        icon={faPlusCircle} />
    </div>
  {/each}

  <label
    for="containerExtraHosts"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Add extra hosts (appends to /etc/hosts file):</label>
  {#each options.extraHosts as extraHost, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input bind:value={extraHost.host} placeholder="Hostname" class="ml-2" />

      <Input bind:value={extraHost.ip} placeholder="IP Address" class="ml-2" />
      <Button
        type="link"
        hidden={index === options.extraHosts.length - 1}
        aria-label="Delete extra host at index {index}"
        on:click={(): void => deleteExtraHost(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.extraHosts.length - 1}
        aria-label="Add extra host after index {index}"
        on:click={addExtraHost}
        icon={faPlusCircle} />
    </div>
  {/each}

  <label
    for="containerNetwork"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Select container networking:</label>
  <div
    class="p-0 flex flex-row justify-start items-center align-middle w-full text-[var(--pd-content-card-text)]">
    <span class="text-sm w-28 inline-block align-middle whitespace-nowrap">Mode:</span>

    <Dropdown class="w-full" name="providerChoice" bind:value={options.networkingMode}>
      <option value="bridge">Creates a network stack on the default bridge (default)</option>
      <option value="none">No networking</option>
      <option value="host">Use the host networking stack</option>
      <option value="choice-container">Use another container networking stack</option>
      <option value="choice-network">User-defined network</option>
    </Dropdown>
  </div>

  {#if options.networkingMode === 'choice-network'}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <span
        class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
        >Network:</span>
      <Dropdown
        class="w-full"
        disabled={options.networkingMode !== 'choice-network'}
        name="networkingModeUserNetwork"
        bind:value={options.networkingModeUserNetwork}>
        {#each engineNetworks as network (network.Id)}
          <option value={network.Id}
            >{network.Name} (used by {Object.keys(network.Containers ?? {}).length} containers)</option>
        {/each}
      </Dropdown>
    </div>
  {/if}
  {#if options.networkingMode === 'choice-container'}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <span
        class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
        >Container:</span>
      <Dropdown
        class="w-full"
        disabled={options.networkingMode !== 'choice-container'}
        name="networkingModeUserContainer"
        bind:value={options.networkingModeUserContainer}>
        {#each engineContainers as container (container.id)}
          <option value={container.id}>{container.name} ({container.shortId})</option>
        {/each}
      </Dropdown>
    </div>
  {/if}
</div>
