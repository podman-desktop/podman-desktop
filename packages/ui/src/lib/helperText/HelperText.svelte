<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  /**
   * Id of the paragraph. Point the `aria-describedby` of the control it explains at it.
   */
  id: string;
  class?: string;
  children: Snippet;
}

let { id, class: className, children }: Props = $props();
</script>

<!-- Plain text, no role: it explains a precondition, which is not an error, so it must not interrupt screen readers like the alert of ErrorMessage. -->
<p id={id} class={['text-sm text-[var(--pd-content-text)]', className]}>{@render children()}</p>
