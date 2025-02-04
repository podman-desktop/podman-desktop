<script lang="ts">
import CronJobActions from './CronJobActions.svelte';

let { object } = $props();
</script>

<CronJobActions cronjob={object} on:update />
