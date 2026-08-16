<script lang="ts">
import type { TaskInfoUI } from '/@/stores/tasks';

import TaskManagerActions from './action/TaskManagerActions.svelte';

interface Props {
  object: TaskInfoUI;
}

let { object }: Props = $props();
</script>

<TaskManagerActions task={object} />
