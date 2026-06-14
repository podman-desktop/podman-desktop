<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { tick } from 'svelte';

interface Props {
  text: string;
  class?: string;
}

let { text, class: className = '' }: Props = $props();

let textElement = $state<HTMLElement>();
let isTruncated = $state(false);

function updateTruncation(): void {
  if (!textElement) {
    isTruncated = false;
    return;
  }
  isTruncated = textElement.scrollWidth > textElement.clientWidth;
}

$effect(() => {
  text;
  tick().then(updateTruncation).catch(console.error);
});

$effect(() => {
  const element = textElement;
  if (!element) {
    return undefined;
  }

  const observer = new ResizeObserver(() => {
    updateTruncation();
  });
  observer.observe(element);
  updateTruncation();

  return (): void => {
    observer.disconnect();
  };
});
</script>

<Tooltip top tip={isTruncated ? text : undefined} containerClass="relative block min-w-0 w-full">
  <span bind:this={textElement} class="block truncate {className}">{text}</span>
</Tooltip>
