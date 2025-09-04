<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  object: ImageInfoUI;
}

let { object }: Props = $props();
</script>

<StatusIcon icon={object.icon} status={object.status} />
