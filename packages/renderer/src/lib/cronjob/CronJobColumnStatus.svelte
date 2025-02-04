<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import CronJobIcon from '../images/CronJobIcon.svelte';

let { object } = $props();
</script>

<StatusIcon icon={CronJobIcon} status={object.status} />
