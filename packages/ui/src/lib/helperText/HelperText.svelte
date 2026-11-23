<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Id of the paragraph. Point the `aria-describedby` of the control it explains at it.
   */
  id: string;
  children: Snippet;
}

let { id, class: className = '', children, ...restProps }: Props = $props();
</script>

<!-- Plain text, no role: it explains a precondition, which is not an error, so it must not interrupt screen readers like the alert of ErrorMessage. -->
<p {id} {...restProps} class="text-sm text-(--pd-content-text) {className}">{@render children()}</p>
