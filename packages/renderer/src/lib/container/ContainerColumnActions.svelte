<script lang="ts">
import { ContainerUtils } from './container-utils';
import ContainerColumnActionsCompose from './ContainerColumnActionsCompose.svelte';
import ContainerColumnActionsContainer from './ContainerColumnActionsContainer.svelte';
import ContainerColumnActionsPod from './ContainerColumnActionsPod.svelte';
import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';
import { ContainerGroupInfoTypeUI } from './ContainerInfoUI';

interface Props {
  object: ContainerInfoUI | ContainerGroupInfoUI;
}

let { object }: Props = $props();

const containerUtils = new ContainerUtils();
</script>

{#if containerUtils.isContainerGroupInfoUI(object)}
  {#if object.type === ContainerGroupInfoTypeUI.POD}
    <ContainerColumnActionsPod object={object} />
  {:else if object.type === ContainerGroupInfoTypeUI.COMPOSE}
    <ContainerColumnActionsCompose object={object} />
  {/if}
{:else if containerUtils.isContainerInfoUI(object)}
  <ContainerColumnActionsContainer object={object} />
{/if}
