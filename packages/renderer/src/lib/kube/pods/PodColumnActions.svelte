<script lang="ts">
import PodActions from './PodActions.svelte';
import type { PodUI } from './PodUI';

let {
  object,
}: {
  object: PodUI;
} = $props();
</script>

<PodActions pod={object} dropdownMenu={true} on:update />
