<script lang="ts">
import Dots from '../../ui/Dots.svelte';
import type { PodUI } from './PodUI';

let {
  object,
}: {
  object: PodUI;
} = $props();
</script>

<Dots containers={object.containers} />
