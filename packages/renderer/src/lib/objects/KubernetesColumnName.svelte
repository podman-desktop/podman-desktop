<script lang="ts">
import type { KubernetesNamespacedObjectUI, KubernetesObjectUI } from './KubernetesObjectUI';

interface Props {
  object: KubernetesObjectUI;
}

let { object }: Props = $props();

function isNamespaced(object: KubernetesObjectUI): object is KubernetesNamespacedObjectUI {
  return 'namespace' in object;
}

async function openDetails(): Promise<void> {
  if (isNamespaced(object)) {
    await window.navigateToRoute('kubernetes', [{ kind: object.kind, name: object.name, namespace: object.namespace }]);
  } else {
    await window.navigateToRoute('kubernetes', [{ kind: object.kind, name: object.name }]);
  }
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if isNamespaced(object)}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</button>
