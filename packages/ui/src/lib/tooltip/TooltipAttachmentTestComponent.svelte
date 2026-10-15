<script lang="ts">
import { tooltip } from './tooltip-attachment.svelte';

interface Props {
  tip: string;
  describedBy?: string;
  ariaLabel?: string;
}

let { tip, describedBy, ariaLabel }: Props = $props();
</script>

<button aria-describedby={describedBy} aria-label={ariaLabel} {@attach tooltip(() => tip)}>trigger</button>
