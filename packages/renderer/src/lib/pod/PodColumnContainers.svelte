<script lang="ts">
import type { PodInfoUI } from '@podman-desktop/core-api';
import { router } from 'tinro';

import Dots from '/@/lib/ui/Dots.svelte';

export let object: PodInfoUI;

function openContainersFromPod(pod: PodInfoUI): void {
  router.goto(`/containers/?filter=${pod.shortId}`);
}
</script>

<button class:cursor-pointer={object.containers.length > 0} on:click={(): void => openContainersFromPod(object)}>
  <Dots containers={object.containers} />
</button>
