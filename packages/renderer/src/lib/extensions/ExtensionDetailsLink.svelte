<script lang="ts">
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { afterUpdate, onMount } from 'svelte';
import { router } from 'tinro';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

export let extension: CombinedExtensionInfoUI;

export let displayIcon: boolean = true;

$: extensionLabel = extension.displayName || extension.name;
$: displayText = `${extensionLabel} extension`;

let textElement: HTMLDivElement | undefined;
let isTruncated = false;

function updateTruncation(): void {
  if (!textElement) {
    isTruncated = false;
    return;
  }
  isTruncated = textElement.scrollWidth > textElement.clientWidth;
}

afterUpdate(() => {
  updateTruncation();
});

onMount(() => {
  const observer = new ResizeObserver(() => {
    updateTruncation();
  });

  if (textElement) {
    observer.observe(textElement);
  }

  updateTruncation();

  return (): void => {
    observer.disconnect();
  };
});

function openDetailsExtension(): void {
  router.goto(`/extensions/details/${encodeURIComponent(extension.id)}/`);
}
</script>

<Tooltip top tip={isTruncated ? displayText : undefined}>
  <button aria-label="{extensionLabel} extension details" type="button" on:click={openDetailsExtension}>
    <div class="flex flex-row items-center min-w-0 text-[var(--pd-content-header)]">
      {#if displayIcon}
        <Icon icon={faCircleInfo} />
      {/if}
      <div bind:this={textElement} class="text-left truncate min-w-0 {$$props.class}">
        {displayText}
      </div>
    </div>
  </button>
</Tooltip>
