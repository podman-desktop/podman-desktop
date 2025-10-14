<script lang="ts">
import { onMount } from 'svelte';

import type { NetworkInspectInfo } from '/@api/network-info';

import MonacoEditor from '../editor/MonacoEditor.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  network: NetworkInfoUI;
}

let { network }: Props = $props();

let inspectDetails: string = $state();

onMount(async () => {
  // grab inspect result from the container
  let inspectResult = (await window.inspectNetwork(network.engineId, network.id)) as Partial<NetworkInspectInfo>;
  // remove engine* properties from the inspect result as it's more internal
  delete inspectResult.engineId;
  delete inspectResult.engineName;

  inspectDetails = JSON.stringify(inspectResult, undefined, 2);
});
</script>

{#if inspectDetails}
  <MonacoEditor content={inspectDetails} language="json" />
{/if}
