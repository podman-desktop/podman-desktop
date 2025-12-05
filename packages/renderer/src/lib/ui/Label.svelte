<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';

interface Props {
  name?: string;
  tip?: string;
  role?: string;
  capitalize?: boolean;
  children?: Snippet;
  containerClass?: string;
}

let { name = '', tip = '', role, capitalize = false, containerClass, children }: Props = $props();
</script>

<Tooltip containerClass={containerClass} top tip={tip}>
  <div
    role={role}
    class="flex items-center bg-[var(--pd-label-bg)] p-1 rounded-md text-sm text-[var(--pd-label-text)] gap-x-1 w-full">
    {@render children?.()}
    <span class:capitalize={capitalize} class="overflow-x-hidden text-ellipsis w-full">
      {name}
    </span>
  </div>
</Tooltip>
