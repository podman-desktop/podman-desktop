<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { showFeedbackDialog } from '/@/stores/feedbackForm';
import type { TaskInfoUI } from '/@/stores/tasks';

interface Props {
  task: TaskInfoUI;
}
const { task }: Props = $props();

async function removeTask(): Promise<void> {
  await window.clearTask(task.id);
  await showFeedbackDialog('tasks.Manager');
}
</script>

<ListItemButtonIcon
  title="Archive/delete completed task"
  onClick={removeTask}
  hidden={task?.state !== 'completed'}
  icon={faTrash} />
