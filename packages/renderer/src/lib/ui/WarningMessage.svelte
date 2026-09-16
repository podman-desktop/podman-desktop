<script lang="ts">
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  error?: string;
  icon?: boolean;
  class?: string;
}

let { error, icon = false, class: className }: Props = $props();
</script>

{#if icon}
  {#if error !== undefined && error !== ''}
    <Tooltip top tip={error}>
      <Icon size="1.125x" class="cursor-pointer text-[var(--pd-state-warning)]" icon={faTriangleExclamation} />
    </Tooltip>
  {/if}
{:else}
  <div
    class="text-[var(--pd-state-warning)] p-1 flex flex-row items-center {className}"
    class:opacity-0={error === undefined || error === ''}>
    <Icon size="1.125x" class="cursor-pointer text-[var(--pd-state-warning)]" icon={faTriangleExclamation} />
    <div role="alert" class="ml-2">{error}</div>
  </div>
{/if}
