<script lang="ts">
import Tooltip from './Tooltip.svelte';

interface Props {
  tip?: string;
  tipSlot?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  classStyle?: string;
  containerClass?: string;
}

let {
  tip,
  tipSlot,
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  classStyle,
  containerClass,
}: Props = $props();
</script>

<Tooltip
  tip={tip}
  {top}
  {bottom}
  {left}
  {right}
  {topLeft}
  {topRight}
  {bottomLeft}
  {bottomRight}
  {containerClass}
  class={classStyle}>
  {#snippet tipSnippet()}
    {#if tipSlot}
      {tipSlot}
    {/if}
  {/snippet}
  <div>Hover me</div>
</Tooltip>
