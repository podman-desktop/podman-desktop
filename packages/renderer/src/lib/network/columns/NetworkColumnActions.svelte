<script lang="ts">
import NetworkActions from '../NetworkActions.svelte';
import type { NetworkInfoUI } from '../NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<NetworkActions network={object} />
