<script lang="ts">
import { ContainerUtils } from './container-utils';
import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerInfoUI | ContainerGroupInfoUI;
}

let { object }: Props = $props();

const containerUtils = new ContainerUtils();
</script>

{#if containerUtils.isContainerInfoUI(object)}
  <div class="text-[var(--pd-table-body-text)] overflow-hidden text-ellipsis" title={object.image}>
    {object.shortImage}
  </div>
{/if}
