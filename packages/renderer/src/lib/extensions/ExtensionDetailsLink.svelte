<script lang="ts">
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

export let extension: CombinedExtensionInfoUI;

export let displayIcon: boolean = true;

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

let extensionLabel = resolveLabel(extension.displayName, extension.name, extension.id);
let detailsLabel = extensionLabel ? `View details for ${extensionLabel}` : 'View extension details';

$: extensionLabel = resolveLabel(extension.displayName, extension.name, extension.id);
$: detailsLabel = extensionLabel ? `View details for ${extensionLabel}` : 'View extension details';
</script>

<Tooltip top tip={detailsLabel}>
  <button aria-label={detailsLabel} type="button" on:click={openDetailsExtension}>
    <div class="flex flex-row items-center text-[var(--pd-content-header)]">
      {#if displayIcon}
        <Fa icon={faArrowUpRightFromSquare} />
      {/if}
      <div class="text-left before:{$$props.class}">
        {extensionLabel}
      </div>
    </div>
  </button>
</Tooltip>
