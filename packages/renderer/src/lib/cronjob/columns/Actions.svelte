<script lang="ts">
import CronJobActions from '../CronJobActions.svelte';
import type { Props } from './props';

let { object }: Props = $props();
</script>

<CronJobActions cronjob={object} />
