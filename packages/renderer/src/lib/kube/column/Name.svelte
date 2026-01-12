<script lang="ts">
import { isNamespaced } from '/@/lib/kube/kube-utils';

import type { Props } from './props';

let { object }: Props = $props();

async function openDetails(): Promise<void> {
  if (isNamespaced(object)) {
    await window.navigateToRoute('kubernetes', { kind: object.kind, name: object.name, namespace: object.namespace });
  } else {
    await window.navigateToRoute('kubernetes', { kind: object.kind, name: object.name });
  }
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full text-left" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis">
    {object.name}
  </div>
  {#if isNamespaced(object)}
    <div class="text-[var(--pd-table-body-text)] font-extra-light text-sm overflow-hidden text-ellipsis">
      {object.namespace}
    </div>
  {/if}
</button>
