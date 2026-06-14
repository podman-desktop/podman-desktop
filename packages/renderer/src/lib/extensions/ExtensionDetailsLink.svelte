<script lang="ts">
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

export let extension: CombinedExtensionInfoUI;

export let displayIcon: boolean = true;

$: extensionLabel = extension.displayName || extension.name;

function openDetailsExtension(): void {
  router.goto(`/extensions/details/${encodeURIComponent(extension.id)}/`);
}
</script>

<Tooltip top tip="{extensionLabel} extension details">
  <button aria-label="{extensionLabel} extension details" type="button" on:click={openDetailsExtension}>
    <div class="flex flex-row items-center text-[var(--pd-content-header)]">
      {#if displayIcon}
        <Icon icon={faCircleInfo} />
      {/if}
      <div class="text-left before:{$$props.class}">
        {extension.displayName} extension
      </div>
    </div>
  </button>
</Tooltip>
