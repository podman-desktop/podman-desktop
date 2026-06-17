<script lang="ts">
interface Props {
  label: string;
  onclick: () => void;
}
let { label, onclick }: Props = $props();
</script>

<button
  onclick={onclick}
  title={label}
  class="text-xs text-(--pd-action-button-primary-text) hover:text-(--pd-action-button-primary-hover-text)"
  aria-label={label}>
  <i class="fas fa-undo" aria-hidden="true"></i>
</button>
