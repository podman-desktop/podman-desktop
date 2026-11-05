<script lang="ts">
import type { Port } from '@desktop-framework/extension-api';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  ports: Port[];
}

let { ports }: Props = $props();

function portUrl(port: Port): string {
  return `http://localhost:${port.PublicPort}`;
}

function openPort(port: Port): void {
  const url = portUrl(port);
  window.openExternal(url).catch((err: unknown) => console.error(`Error opening URL ${url}`, err));
}
</script>

{#each ports as port (port.PublicPort)}
  <button
    type="button"
    role="menuitem"
    title={portUrl(port)}
    class="block w-full p-2.5 text-left text-[var(--pd-dropdown-item-text)] hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] hover:rounded-md hover:cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--pd-button-focus-ring)"
    onclick={openPort.bind(undefined, port)}>
    <span class="flex items-center whitespace-nowrap h-4">
      <Icon class="w-4 text-md" icon={faExternalLinkSquareAlt} />
      <span class="ml-2">{portUrl(port)}</span>
    </span>
  </button>
{/each}
