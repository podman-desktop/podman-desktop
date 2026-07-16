<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';

import { providerInfos } from '/@/stores/providers';

import Label from './Label.svelte';
import ProviderInfoIcon from './ProviderInfoIcon.svelte';

// provider: name of the provider (e.g. podman, docker, kubernetes)
// context: engineId (used for Kubernetes tip and connection status lookup)
interface Props {
  provider?: string;
  context?: string;
}
let { provider = '', context = '' }: Props = $props();

const connection = $derived.by(() => {
  if (!context) {
    return undefined;
  }
  const [providerId, connectionName] = context.split('.');
  return $providerInfos
    .find(providerInfo => providerInfo.id === providerId)
    ?.containerConnections?.find(({ name }) => name === connectionName);
});

const connectionStatus: ProviderConnectionStatus = $derived(connection ? connection.status : 'unknown');
const tip = $derived(provider === 'Kubernetes' ? context : '');
</script>

<Label containerClass="w-full" tip={tip} name={provider} capitalize>
  <ProviderInfoIcon status={connectionStatus} />
</Label>
