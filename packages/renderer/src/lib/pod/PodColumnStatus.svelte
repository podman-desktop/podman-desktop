<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import PodIcon from '/@/lib/images/PodIcon.svelte';

import type { PodInfoUI } from './PodInfoUI';

interface Props {
  object: PodInfoUI;
}

let { object }: Props = $props();
</script>

<StatusIcon icon={PodIcon} status={object.status} />
