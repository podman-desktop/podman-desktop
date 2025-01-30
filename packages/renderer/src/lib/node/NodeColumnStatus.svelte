<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import NodeIcon from '../images/NodeIcon.svelte';
import type { NodeUI } from './NodeUI';

interface Props {
  object: NodeUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={NodeIcon} status={object.status} />
