<script lang="ts">
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import { clearNotifications } from '/@/stores/tasks';
const featureName = "Task Manager"
</script>

<Button icon={faTrashCan} on:click={async () => {clearNotifications(); await window.showMessageBox({
    title: `Share Your Feedback`,
    message: `We are testing something new!\nHow's your experience so far with ${featureName}? Let us know on GitHub!`,
    type: `feedback`
  });
  
  }}>Clear all</Button>
