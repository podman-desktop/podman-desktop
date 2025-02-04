<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import CronJobIcon from '../images/CronJobIcon.svelte';
import type { CronJobUI } from './CronJobUI';

export let object: CronJobUI;
</script>

<StatusIcon icon={CronJobIcon} status={object.status} />
