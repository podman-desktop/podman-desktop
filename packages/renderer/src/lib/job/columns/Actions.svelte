<script lang="ts">
import JobActions from '/@/lib/job/JobActions.svelte';

import type { Props } from './props';

let { object }: Props = $props();
</script>

<JobActions job={object} />
