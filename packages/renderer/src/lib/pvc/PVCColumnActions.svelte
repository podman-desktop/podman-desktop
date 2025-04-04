<script lang="ts">
import PVCActions from './PVCActions.svelte';
import type { PVCUI } from './PVCUI';

interface Props {
  object: PVCUI;
}
let { object }: Props = $props();
</script>

<PVCActions pvc={object} />
