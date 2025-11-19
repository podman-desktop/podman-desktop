<script lang="ts">
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

interface Props {
  extension: CombinedExtensionInfoUI;
  displayIcon?: boolean;
  class?: string;
}

let { extension, displayIcon = true, class: className = '' }: Props = $props();

function openDetailsExtension(): void {
  router.goto(`/extensions/details/${encodeURIComponent(extension.id)}/`);
}

function resolveLabel(...candidates: Array<string | undefined | null>): string {
  for (const candidate of candidates) {
    if (candidate && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return '';
}

function getExtensionLabel(): string {
  return resolveLabel(extension.displayName, extension.name, extension.id);
}

const detailsLabel = $derived(getExtensionLabel() ? `View details for ${getExtensionLabel()}` : 'View extension details');
</script>

<Tooltip top tip={detailsLabel}>
  <button aria-label={detailsLabel} type="button" onclick={openDetailsExtension}>
    <div class="flex flex-row items-center text-[var(--pd-content-header)]">
      {#if displayIcon}
        <Fa icon={faArrowUpRightFromSquare} />
      {/if}
      <div class={`text-left ${className}`}>
        {getExtensionLabel()}
      </div>
    </div>
  </button>
</Tooltip>
