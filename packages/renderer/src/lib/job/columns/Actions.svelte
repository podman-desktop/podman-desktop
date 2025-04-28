<script lang="ts">
import JobActions from '../JobActions.svelte';
import type { Props } from './props';

let { object }: Props = $props();
</script>

<JobActions job={object} />
