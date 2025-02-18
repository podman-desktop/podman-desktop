<script lang="ts">
import type { DeploymentUI } from './DeploymentUI';

interface Props {
  object: DeploymentUI;
}
let { object }: Props = $props();

async function openDetails(): Promise<void> {
  await window.navigateToRoute('kubernetes', [{ kind: 'Deployment', name: object.name, namespace: object.namespace }]);
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if object.namespace}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</button>
