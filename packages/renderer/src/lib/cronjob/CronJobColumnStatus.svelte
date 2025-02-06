<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import CronJobIcon from '../images/CronJobIcon.svelte';
import type { CronJobUI } from './CronJobUI';

interface Props {
  object: CronJobUI;
}

let { object }: Props = $props();
</script>

<StatusIcon icon={CronJobIcon} status={object.status} />
