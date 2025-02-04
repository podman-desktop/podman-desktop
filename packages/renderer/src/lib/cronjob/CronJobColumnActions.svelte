<script lang="ts">
import CronJobActions from './CronJobActions.svelte';
import type { CronJobUI } from './CronJobUI';

export let object: CronJobUI;
</script>

<CronJobActions cronjob={object} on:update />
