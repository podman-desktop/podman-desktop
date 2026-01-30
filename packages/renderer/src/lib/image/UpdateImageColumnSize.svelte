<script lang="ts">
import type { UpdateImageInfoUI } from './UpdateImages.svelte';

interface Props {
  object: UpdateImageInfoUI;
}

let { object }: Props = $props();
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={object.image.humanSize}>{object.image.humanSize}</span>
</div>
