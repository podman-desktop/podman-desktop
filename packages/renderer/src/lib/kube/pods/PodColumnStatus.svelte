<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import PodIcon from '../../images/PodIcon.svelte';
import type { PodUI } from './PodUI';

interface Props {
  object: PodUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={PodIcon} status={object.status} />
