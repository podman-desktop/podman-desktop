<script lang="ts">
import { router } from 'tinro';

import type { NodeUI } from './NodeUI';

interface Props {
  object: NodeUI;
}
let { object }: Props = $props();

function openDetails(): void {
  router.goto(`/kubernetes/nodes/${encodeURI(object.name)}/summary`);
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
</button>
