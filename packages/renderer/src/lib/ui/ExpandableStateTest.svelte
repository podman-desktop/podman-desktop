<script lang="ts">
import { ExpandableState } from './expandable-state.svelte';

interface Props {
  configKey: string;
}

const { configKey }: Props = $props();

const expandableState = new ExpandableState(configKey);
</script>

<span data-testid="expanded">{expandableState.expanded}</span>
<span data-testid="initialized">{expandableState.initialized}</span>
<button onclick={async (): Promise<void> => { await expandableState.toggle(!expandableState.expanded); }}>toggle</button>
