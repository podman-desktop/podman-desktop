<script lang="ts">
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import ContainerActions from './ContainerActions.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  object: ContainerInfoUI;
}

let { object }: Props = $props();
</script>

{#if object.actionError}
  <ErrorMessage error={object.actionError} icon wrapMessage />
{/if}
<ContainerActions container={object} dropdownMenu={true} on:update />
