<script lang="ts">
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import { showFeedbackDialog } from '/@/stores/feedbackForm';
import { clearNotifications } from '/@/stores/tasks';
</script>

<Button icon={faTrashCan} on:click={async (): Promise<void> => {
  await clearNotifications(); 
  await showFeedbackDialog('tasks.Manager');
  }}> Clear all </Button>