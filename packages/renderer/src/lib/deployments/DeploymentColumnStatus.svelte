<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import DeploymentIcon from '../images/DeploymentIcon.svelte';
import type { DeploymentUI } from './DeploymentUI';

interface Props {
  object: DeploymentUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={DeploymentIcon} status={object.status} />
