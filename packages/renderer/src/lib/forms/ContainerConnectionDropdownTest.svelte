<script lang="ts">
import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

interface Props {
  connections: ProviderContainerConnectionInfo[];
}

let { connections }: Props = $props();

let selected: undefined | ProviderContainerConnectionInfo = $state(undefined);
</script>

<ContainerConnectionDropdown
  id="providerChoice"
  name="providerChoice"
  bind:value={selected}
  connections={connections}/>
{#if selected}
  <div role="alert">{selected.name}</div>
{/if}
