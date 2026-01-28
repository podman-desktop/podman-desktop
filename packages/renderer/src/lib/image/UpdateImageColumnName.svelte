<script lang="ts">
import { formatImageDisplayName, getFullImageRef } from './update-image-util';
import type { UpdateImageInfoUI } from './UpdateImages.svelte';

interface Props {
  object: UpdateImageInfoUI;
}

let { object }: Props = $props();

let displayName = $derived(formatImageDisplayName(object.image.name, object.image.tag));
let fullRef = $derived(getFullImageRef(object.image.name, object.image.tag));
</script>

<div class="flex flex-col max-w-full">
  <div class="text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap" title={fullRef}>
    {displayName}
  </div>
  <div class="flex flex-row text-sm gap-1 w-full">
    <div class="text-[var(--pd-table-body-text-sub-secondary)]">{object.image.shortId}</div>
    <div class="font-extra-light text-[var(--pd-table-body-text)] overflow-hidden text-ellipsis">{object.image.tag}</div>
  </div>
</div>
