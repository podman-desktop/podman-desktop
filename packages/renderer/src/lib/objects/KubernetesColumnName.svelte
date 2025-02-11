<script lang="ts">
import { handleNavigation } from '/@/navigation';
import { NavigationPage } from '/@api/navigation-page';

import type { KubernetesObjectUI } from './KubernetesObjectUI';

export interface Props {
  object: KubernetesObjectUI;
}
let { object }: Props = $props();

function openDetails(): void {
  handleNavigation({
    page: NavigationPage.KUBERNETES_RESOURCE,
    parameters: {
      kind: object.kind ?? 'Pod',
      name: encodeURI(object.name),
      namespace: encodeURI(object.namespace ?? ''),
    },
  });
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  {#if object.namespace}
    <div class="flex flex-row text-sm gap-1">
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    </div>
  {/if}
</button>
