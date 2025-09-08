<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

import { clearNotifications } from '/@/stores/tasks';
</script>

<Button icon={faTrash} on:click={clearNotifications}>Clear all</Button>
