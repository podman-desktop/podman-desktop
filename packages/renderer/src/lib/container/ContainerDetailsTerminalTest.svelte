<script lang="ts">
import ContainerDetailsTerminal from './ContainerDetailsTerminal.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI | undefined;
}

let { container }: Props = $props();
</script>

<!-- Mirrors how ContainerDetails.svelte renders the terminal: the container comes from a
     store lookup, so it becomes undefined once the container is removed, and the terminal
     is torn down at that moment. -->
{#if container}
  <ContainerDetailsTerminal container={container} screenReaderMode={true} />
{/if}
