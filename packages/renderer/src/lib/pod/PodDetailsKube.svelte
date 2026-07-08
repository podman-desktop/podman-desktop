<script lang="ts">
import type { PodInfoUI } from '@podman-desktop/core-api';
import { onMount } from 'svelte';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';

export let pod: PodInfoUI;

let kubeDetails: string;

onMount(async () => {
  // grab kube result from the pod
  kubeDetails = await window.generatePodmanKube(pod.engineId, [pod.id]);
});
</script>

{#if kubeDetails}
  <MonacoEditor content={kubeDetails} language="yaml" />
{/if}
