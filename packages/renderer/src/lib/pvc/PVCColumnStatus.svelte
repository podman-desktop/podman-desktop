<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import PVCIcon from '../images/PVCIcon.svelte';
import type { PVCUI } from './PVCUI';

interface Props {
  object: PVCUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={PVCIcon} status={object.status} />
