<script lang="ts">
import { onMount } from 'svelte';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';

import type { ComposeInfoUI } from './ComposeInfoUI';

interface Props {
  compose: ComposeInfoUI;
}

let { compose }: Props = $props();

let kubeDetails: string = $state('');

onMount(async () => {
  // Grab all the container ID's from compose.containers
  const containerIds = compose.containers.map(container => container.id);

  // Generate the kube yaml using the generatePodmanKube function which
  // only has to take in the engineID and an array of container ID's to generate from
  const kubeResult = await window.generatePodmanKube(compose.engineId, containerIds);
  kubeDetails = kubeResult;
});
</script>

{#if kubeDetails}
  <MonacoEditor content={kubeDetails} language="yaml" />
{/if}
