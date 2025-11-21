<script lang="ts">
import Label from '/@/lib/ui/Label.svelte';
import ProviderInfoCircle from '/@/lib/ui/ProviderInfoCircle.svelte';
import { providerInfos } from '/@/stores/providers';

interface Props {
  object: {
    engineId: string;
  };
}

let { object }: Props = $props();

const [providerId, connectionName] = $derived(object.engineId.split('.'));

const connection = $derived(
  $providerInfos
    .find(provider => provider.id === providerId)
    ?.containerConnections?.find(({ name }) => name === connectionName),
);
</script>

<Label tip={connection?.endpoint.socketPath} name={connection?.displayName}>
  <ProviderInfoCircle type="podman" />
</Label>
