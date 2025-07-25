<script>
import Tooltip from './Tooltip.svelte';
</script>

<Tooltip>
  <span slot="tip">slot-tip-content</span>
  <button data-testid="trigger">trigger</button>
</Tooltip>
