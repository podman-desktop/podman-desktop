<script lang="ts">
import CronJobActions from './CronJobActions.svelte';
import type { CronJobUI } from './CronJobUI';

interface Props {
  object: CronJobUI;
}

let { object }: Props = $props();
</script>

<CronJobActions cronjob={object} />
