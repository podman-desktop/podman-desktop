<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import JobIcon from '../images/JobIcon.svelte';
import type { JobUI } from './JobUI';

interface Props {
  object: JobUI;
}

let { object }: Props = $props();
</script>

<StatusIcon icon={JobIcon} status={object.status} />
