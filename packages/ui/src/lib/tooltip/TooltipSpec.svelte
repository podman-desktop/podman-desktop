<script lang="ts">
import Tooltip from './Tooltip.svelte';

interface Props {
  tipProp?: string;
  tipSlot?: string;
  top?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  right?: boolean;
  bottom?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  left?: boolean;
  classStyle?: string;
}

let {
  tipProp = undefined,
  tipSlot = undefined,
  top = false,
  topLeft = false,
  topRight = false,
  right = false,
  bottom = false,
  bottomLeft = false,
  bottomRight = false,
  left = false,
  classStyle = '',
}: Props = $props();
</script>

<Tooltip
  tip={tipProp}
  top={top}
  topLeft={topLeft}
  topRight={topRight}
  right={right}
  bottom={bottom}
  bottomLeft={bottomLeft}
  bottomRight={bottomRight}
  left={left}
  class={classStyle}>
  {#snippet tipSnippet()}
    {#if tipSlot}
      {tipSlot}
    {/if}
  {/snippet}
</Tooltip>
