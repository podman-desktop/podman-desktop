<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import PodIcon from '../../images/PodIcon.svelte';
import type { PodUI } from './PodUI';

let {
  object,
}: {
  object: PodUI;
} = $props();
</script>

<StatusIcon icon={PodIcon} status={object.status} />
