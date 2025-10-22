<script lang="ts">
import ProviderInfo from '../../ui/ProviderInfo.svelte';
import type { NetworkInfoUI } from '../NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<ProviderInfo provider={object.engineName} context={object.engineId} />
