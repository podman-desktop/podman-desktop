<script lang="ts">
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { ChevronExpander, Link, Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import DetailsCell from '/@/lib/details/DetailsCell.svelte';
import DetailsTable from '/@/lib/details/DetailsTable.svelte';
import DetailsTitle from '/@/lib/details/DetailsTitle.svelte';

import type { ContainerInfoUI } from './ContainerInfoUI';

export let container: ContainerInfoUI;
let labelsDropdownOpen: boolean = false;
let startedTime: Date = new Date(container.startedAt);
let createdTime: Date | undefined;
if (container.groupInfo.created) {
  createdTime = new Date(container.groupInfo.created);
}

function portUrl(port: number): string {
  return `http://localhost:${port}`;
}

function openPort(port: number): void {
  window.openExternal(portUrl(port)).catch((err: unknown) => console.error(`Error opening port ${port}`, err));
}
</script>

<DetailsTable>
  <tr>
    <DetailsTitle>Details</DetailsTitle>
  </tr>
  <tr>
    <DetailsCell>Name</DetailsCell>
    <DetailsCell>{container.name}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>ID</DetailsCell>
    <DetailsCell>{container.id}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Engine type</DetailsCell>
    <DetailsCell>{container.engineType}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Engine ID</DetailsCell>
    <DetailsCell>{container.engineId}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Image</DetailsCell>
    <DetailsCell>
      <Link on:click={(): void => router.goto(container.imageHref ?? $router.path)}>{container.image}</Link>
    </DetailsCell>
  </tr>
  {#if container.command}
    <tr>
      <DetailsCell>Command</DetailsCell>
      <DetailsCell>{container.command}</DetailsCell>
    </tr>
  {/if}
  <tr>
    <DetailsCell>Ports</DetailsCell>
    {#if container.hasPublicPort}
      <DetailsCell>
        {#each container.ports as port, i (port.PublicPort)}
          {#if i > 0},&nbsp;{/if}
          <Tooltip tip={portUrl(port.PublicPort)} bottom>
            <Link on:click={(): void => openPort(port.PublicPort)}>
              <span class="inline-flex items-center">{port.PublicPort}<Fa icon={faExternalLink} class="ml-1" size="0.7x" /></span>
            </Link>
          </Tooltip>
        {/each}
      </DetailsCell>
    {:else}
      <DetailsCell>N/A</DetailsCell>
    {/if}
  </tr>
  <tr>
    <DetailsCell>State</DetailsCell>
    <DetailsCell>{container.state.toLowerCase()}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Uptime</DetailsCell>
    <DetailsCell>{container.uptime === '' ? 'N/A' : container.uptime}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Started at</DetailsCell>
    <DetailsCell>{startedTime}</DetailsCell>
  </tr>
  {#if Object.entries(container.labels).length > 0}
    <tr>
      <DetailsCell style="cursor-pointer flex items-center" onClick={(): boolean => (labelsDropdownOpen = !labelsDropdownOpen)}>
        Labels
        <ChevronExpander expanded={labelsDropdownOpen} size="0.9x" class="ml-1" />
      </DetailsCell>
      <DetailsCell>
        {#if labelsDropdownOpen}
          {#each Object.entries(container.labels) as [key, value] (key)}
            {key}: {value}
            <br />
          {/each}
        {:else}
          ...
        {/if}
      </DetailsCell>
    </tr>
  {/if}
  <tr>
    <DetailsTitle>Group</DetailsTitle>
  </tr>
  <tr>
    <DetailsCell>Name</DetailsCell>
    <DetailsCell>{container.groupInfo.name}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Type</DetailsCell>
    <DetailsCell>{container.groupInfo.type}</DetailsCell>
  </tr>
  {#if container.groupInfo.id}
    <tr>
      <DetailsCell>Id</DetailsCell>
      <DetailsCell>{container.groupInfo.id}</DetailsCell>
    </tr>
  {/if}
  {#if container.groupInfo.engineName}
    <tr>
      <DetailsCell>Engine name</DetailsCell>
      <DetailsCell>{container.groupInfo.engineName}</DetailsCell>
    </tr>
  {/if}
  {#if container.groupInfo.engineType}
    <tr>
      <DetailsCell>Engine type</DetailsCell>
      <DetailsCell>{container.groupInfo.engineType}</DetailsCell>
    </tr>
  {/if}
  {#if container.groupInfo.engineId}
    <tr>
      <DetailsCell>Engine Id</DetailsCell>
      <DetailsCell>{container.groupInfo.engineId}</DetailsCell>
    </tr>
  {/if}
  {#if container.groupInfo.status}
    <tr>
      <DetailsCell>status</DetailsCell>
      <DetailsCell>{container.groupInfo.status.toLowerCase()}</DetailsCell>
    </tr>
  {/if}
  {#if createdTime}
    <tr>
      <DetailsCell>Created</DetailsCell>
      <DetailsCell>{createdTime}</DetailsCell>
    </tr>
  {/if}
</DetailsTable>
