<script lang="ts">
import SimpleColumn from '@podman-desktop/ui-svelte/TableSimpleColumn';

import type { NetworkInfoUI } from '/@/lib/network/NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<SimpleColumn object={object.driver} />
