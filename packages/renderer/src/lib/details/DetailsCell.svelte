<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLTdAttributes } from 'svelte/elements';

interface Props extends HTMLTdAttributes {
  children?: Snippet;
}

let { class: className, children, ...restProps }: Props = $props();
</script>

<!-- wrap-anywhere, because a details cell holds values nobody chose the length
     of: a container command, an image digest, a secret, a config map entry. A
     value with no spaces in it cannot wrap, so without this the table takes its
     width from that one value and the whole card scrolls sideways — at which
     point the label column and every other field are off-screen.

     Not break-all: that breaks ordinary words too, so prose and hyphenated names
     get chopped mid-word even when they would have fitted. overflow-wrap:
     anywhere breaks only what would otherwise overflow. -->
<td class="{['pt-1', 'pl-3', 'wrap-anywhere', className]}" {...restProps}>
  {@render children?.()}
</td>
