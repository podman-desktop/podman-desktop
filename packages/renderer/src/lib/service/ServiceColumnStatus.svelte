<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import ServiceIcon from '../images/ServiceIcon.svelte';
import type { ServiceUI } from './ServiceUI';

interface Props {
  object: ServiceUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={ServiceIcon} status={object.status} />
