<script lang="ts">
import Dots from '/@/lib/ui/Dots.svelte';

import type { PodUI } from './PodUI';

interface Props {
  object: PodUI;
}
let { object }: Props = $props();
</script>

<Dots containers={object.containers} />
