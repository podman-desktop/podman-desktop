<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import IngressRouteIcon from '../images/IngressRouteIcon.svelte';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

interface Props {
  object: IngressUI | RouteUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={IngressRouteIcon} status={object.status} />
