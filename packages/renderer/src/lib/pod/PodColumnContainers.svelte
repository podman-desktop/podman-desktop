<script lang="ts">
import { router } from 'tinro';

import Dots from '/@/lib/ui/Dots.svelte';

import type { PodInfoUI } from './PodInfoUI';

interface Props {
  object: PodInfoUI;
}

let { object }: Props = $props();

function openContainersFromPod(pod: PodInfoUI): void {
  router.goto(`/containers/?filter=${pod.shortId}`);
}
</script>

<button class:cursor-pointer={object.containers.length > 0} onclick={(): void => openContainersFromPod(object)}>
  <Dots containers={object.containers} />
</button>