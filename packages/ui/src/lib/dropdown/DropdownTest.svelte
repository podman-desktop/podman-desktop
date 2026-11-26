<script lang="ts">
import Dropdown from './Dropdown.svelte';

interface Props {
  truncate?: boolean;
  hiddenLeft?: boolean;
}

let { truncate = false, hiddenLeft = false }: Props = $props();
</script>

<Dropdown value="initial value" truncate={truncate}>
  <option value="a">A</option>
  <option value="b">B</option>
  <option value="c">C</option>
  {#snippet left()}
  <span class:sr-only={hiddenLeft}>Left:</span>
  {/snippet}
</Dropdown>
