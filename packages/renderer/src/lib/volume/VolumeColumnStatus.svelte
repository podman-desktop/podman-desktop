<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  object: VolumeInfoUI;
}

let { object }: Props = $props();
</script>

<StatusIcon icon={VolumeIcon} status={object.status} />
