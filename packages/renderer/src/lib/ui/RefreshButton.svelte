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
  class="text-xs text-[var(--pd-button-primary-bg)] hover:text-[var(--pd-button-primary-hover-bg)]"
  aria-label={label}>
  <i class="fas fa-undo" aria-hidden="true"></i>
</button>
