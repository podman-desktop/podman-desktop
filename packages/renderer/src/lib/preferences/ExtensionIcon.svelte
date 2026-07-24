<script lang="ts">
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import IconImage from '/@/lib/appearance/IconImage.svelte';

export let extension: { icon?: string | { light: string; dark: string }; name: string; state?: string };
</script>

{#if extension.icon}
  <IconImage image={extension.icon} alt={extension.name} class="max-w-8 max-h-8" />
{:else}
  <Icon class="h-8 w-8 text-[var(--pd-content-text)] opacity-60" size="1.6x" icon={faImage} />
{/if}
