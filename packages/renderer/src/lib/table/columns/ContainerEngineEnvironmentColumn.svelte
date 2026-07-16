<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';

import Label from '/@/lib/ui/Label.svelte';
import ProviderInfoIcon from '/@/lib/ui/ProviderInfoIcon.svelte';
import { containerConnectionCount, providerInfos } from '/@/stores/providers';

interface Props {
  object: {
    engineId: string;
  };
}

let { object }: Props = $props();

const connection = $derived.by(() => {
  const [providerId, connectionName] = object.engineId.split('.');
  return $providerInfos
    .find(provider => provider.id === providerId)
    ?.containerConnections?.find(({ name }) => name === connectionName);
});

const displayName = $derived.by(() => {
  if (!connection) {
    return object.engineId;
  }
  if ($containerConnectionCount[connection.type] > 1) {
    return connection.displayName;
  }
  return connection.type;
});

const connectionStatus: ProviderConnectionStatus = $derived(connection ? connection.status : 'unknown');
const tip = $derived.by(() => {
  if (!connection?.endpoint) {
    return '';
  }
  return connection.endpoint.socketPath;
});
</script>

<Label tip={tip} name={displayName}>
  <ProviderInfoIcon status={connectionStatus} />
</Label>
