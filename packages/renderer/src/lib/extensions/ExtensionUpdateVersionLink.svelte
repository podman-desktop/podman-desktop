<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';

interface Props {
  extension: CatalogExtensionInfoUI;
  onUpdate: (extension: CatalogExtensionInfoUI, version: string) => void;
}

let { extension, onUpdate }: Props = $props();

const showUpdate = $derived(extensionRequiresManualUpdate(extension));

const targetVersion = $derived(extension.fetchVersion);

function handleUpdate(event: Event): void {
  event.stopPropagation();
  if (targetVersion) {
    onUpdate(extension, targetVersion);
  }
}
</script>

{#if showUpdate && targetVersion}
  <Link class="inline-flex shrink-0" aria-label="Update to v{targetVersion}" on:click={handleUpdate}>
    Update to v{targetVersion}
  </Link>
{/if}
