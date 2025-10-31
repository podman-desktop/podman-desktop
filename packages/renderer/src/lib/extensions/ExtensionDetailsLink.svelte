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

function getExtensionLabel(): string {
  return resolveLabel(extension.displayName, extension.name, extension.id);
}

function getDetailsLabel(): string {
  const label = getExtensionLabel();
  return label ? `View details for ${label}` : 'View extension details';
}
</script>

<Tooltip top tip={getDetailsLabel()}>
  <button aria-label={getDetailsLabel()} type="button" on:click={openDetailsExtension}>
    <div class="flex flex-row items-center text-[var(--pd-content-header)]">
      {#if displayIcon}
        <Fa icon={faArrowUpRightFromSquare} />
      {/if}
      <div class="text-left before:{$$props.class}">
        {getExtensionLabel()}
      </div>
    </div>
  </button>
</Tooltip>
