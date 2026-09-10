<script lang="ts">
import VolumeActions from './VolumeActions.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  object: VolumeInfoUI;
}

let { object }: Props = $props();
</script>

<VolumeActions volume={object} on:update />
