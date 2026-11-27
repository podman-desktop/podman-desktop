<script lang="ts">
import { tooltip as tooltipAttachment } from '@podman-desktop/ui-svelte';

interface Props {
  label: string;
  onclick: () => void;
}
let { label, onclick }: Props = $props();
</script>

<button
  onclick={onclick}
  class="text-xs text-(--pd-button-icon-primary-text) hover:text-(--pd-button-icon-primary-hover-text)"
  aria-label={label}
  {@attach tooltipAttachment(() => label)}>
  <i class="fas fa-undo" aria-hidden="true"></i>
</button>
