<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';

interface Props {
  name?: string;
  tip?: string;
  role?: string;
  capitalize?: boolean;
  children?: Snippet;
}

let { name = '', tip = '', role, capitalize = false, children }: Props = $props();
</script>

<Tooltip top tip={tip}>
  <div
    role={role}
    class="flex items-center bg-[var(--pd-label-bg)] p-1 rounded-md text-sm text-[var(--pd-label-text)] gap-x-1">
    {@render children?.()}
    <span class:capitalize={capitalize}>
      {name}
    </span>
  </div>
</Tooltip>
