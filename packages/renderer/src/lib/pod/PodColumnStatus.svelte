<script lang="ts">
import type { PodInfoUI } from '@podman-desktop/core-api';
import { StatusIcon } from '@podman-desktop/ui-svelte';

import PodIcon from '/@/lib/images/PodIcon.svelte';

export let object: PodInfoUI;
</script>

<StatusIcon icon={PodIcon} status={object.status} />
