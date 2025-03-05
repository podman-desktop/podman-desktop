<script lang="ts">
import JobActions from './JobActions.svelte';
import type { JobUI } from './JobUI';

interface Props {
  object: JobUI;
}

let { object }: Props = $props();
</script>

<JobActions job={object} />
