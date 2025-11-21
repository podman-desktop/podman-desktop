<script lang="ts">
import ProviderInfo from '/@/lib/ui/ProviderInfo.svelte';

interface Props {
  object: {
    engineId: string;
    engineName: string;
  };
}

let { object }: Props = $props();
</script>

<ProviderInfo provider={object.engineName} context={object.engineId} />
