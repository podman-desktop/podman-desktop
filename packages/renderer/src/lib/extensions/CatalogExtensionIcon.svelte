<script lang="ts">
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  iconHref?: string;
  displayName: string;
  class?: string;
}

let { iconHref, displayName, class: className = '' }: Props = $props();
</script>

<div class="flex items-center shrink-0 {className}">
  {#if iconHref}
    <img src={iconHref} alt="{displayName} logo" class="max-w-10 max-h-10 object-contain" />
  {:else}
    <Icon icon={faImage} class="h-10 w-10 text-[var(--pd-content-text)] opacity-60" size="1.6x" />
  {/if}
</div>
