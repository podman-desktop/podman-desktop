<script lang="ts">
import SimpleColumn from '@podman-desktop/ui-svelte/TableSimpleColumn';

import type { NetworkInfoUI } from '../NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<SimpleColumn object={object.driver} />
