<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Fa, type IconSize } from 'svelte-fa';

export let icon: IconDefinition;
export let loadingWidthClass: string = 'w-6';
export let loadingHeightClass: string = 'h-6';
export let loading = false;
export let iconSize: IconSize | undefined = undefined;
</script>

<div>
  <Fa size={iconSize} icon={icon} />
  <div
    aria-label="spinner"
    class="{loading
      ? ''
      : 'hidden'} {loadingWidthClass} {loadingHeightClass} rounded-full animate-spin -translate-1/2 border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent absolute left-1/2 top-1/2">
  </div>
</div>
