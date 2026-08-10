<script lang="ts">
import { onMount, type Snippet } from 'svelte';

type InitialFocus = 'first' | 'last' | 'none';

interface Props {
  /**
   * Which enabled action should receive focus when the row is mounted.
   * Use `last` for a primary action and `first` for a cancel action in a destructive dialog.
   */
  initialFocus?: InitialFocus;
  class?: string;
  children?: Snippet;
}

let { initialFocus = 'none', class: classNames, children }: Props = $props();

let buttonRow: HTMLDivElement;

function focusInitialAction(): void {
  if (initialFocus === 'none') {
    return;
  }

  const focusableActions = Array.from(
    buttonRow.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(action => !action.hidden && action.getAttribute('aria-hidden') !== 'true');
  const action = initialFocus === 'first' ? focusableActions[0] : focusableActions[focusableActions.length - 1];
  action?.focus();
}

onMount(focusInitialAction);
</script>

<div class="flex flex-row flex-wrap justify-end gap-2 {classNames}" bind:this={buttonRow}>
  {@render children?.()}
</div>
