<script lang="ts">
import Button from '/@/lib/button/Button.svelte';
import ButtonRow from './ButtonRow.svelte';

type InitialFocus = 'first' | 'last' | 'none';

interface Props {
  initialFocus?: InitialFocus;
  disabledCancel?: boolean;
  disabledPrimary?: boolean;
  ariaHiddenCancel?: boolean;
  hiddenCancel?: boolean;
  includeNonButtons?: boolean;
}

let {
  initialFocus,
  disabledCancel = false,
  disabledPrimary = false,
  ariaHiddenCancel = false,
  hiddenCancel = false,
  includeNonButtons = false,
}: Props = $props();
</script>

<ButtonRow {initialFocus}>
  {#if includeNonButtons}
    <a href="#link">Link</a>
  {/if}
  <div aria-hidden={ariaHiddenCancel ? 'true' : undefined}>
    <Button type="secondary" disabled={disabledCancel} hidden={hiddenCancel}>Cancel</Button>
  </div>
  <Button type="primary" disabled={disabledPrimary}>Save</Button>
  {#if includeNonButtons}
    <input aria-label="field" />
  {/if}
</ButtonRow>
