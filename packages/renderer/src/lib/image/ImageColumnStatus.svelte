<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import type { ImageInfoUI } from './ImageInfoUI';

export let object: ImageInfoUI;
</script>

{#if object.icon}
  <StatusIcon icon={object.icon} status={object.status} />
{/if}

