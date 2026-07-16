<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';

interface Props {
  name?: string;
  tip?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  role?: string;
  capitalize?: boolean;
  children?: Snippet;
  containerClass?: string;
}

let {
  name = '',
  tip = '',
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  role,
  capitalize = false,
  containerClass,
  children,
}: Props = $props();
</script>

<Tooltip containerClass={containerClass} {top}
  {bottom}
  {left}
  {right}
  {topLeft}
  {topRight}
  {bottomLeft}
  {bottomRight} tip={tip}>
  <div
    role={role}
    class="flex items-center bg-[var(--pd-label-bg)] py-1 px-[calc(0.25rem+2pt)] rounded-full text-sm text-[var(--pd-label-text)] gap-x-1 w-full select-none">
    {@render children?.()}
    <span class:capitalize={capitalize} class="overflow-x-hidden text-ellipsis w-full">
      {name}
    </span>
  </div>
</Tooltip>
