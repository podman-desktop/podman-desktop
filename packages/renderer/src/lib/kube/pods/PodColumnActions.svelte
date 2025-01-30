<script lang="ts">
import PodActions from './PodActions.svelte';
import type { PodUI } from './PodUI';

interface Props {
  object: PodUI;
}
let { object }: Props = $props();
</script>

<PodActions pod={object} dropdownMenu={true} on:update />
