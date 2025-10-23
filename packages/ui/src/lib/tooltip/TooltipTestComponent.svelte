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
}

let { tip, tipSlot, top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight, classStyle }: Props =
  $props();
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
  class={classStyle}>
  {#snippet tipSnippet()}
    {#if tipSlot}
      {tipSlot}
    {/if}
  {/snippet}
  <div>Hover me</div>
</Tooltip>
