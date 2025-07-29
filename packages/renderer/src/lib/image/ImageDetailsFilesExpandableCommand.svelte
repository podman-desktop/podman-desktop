<script lang="ts">
import { onMount } from 'svelte';

interface Props {
  command?: string;
}

let { command = '' }: Props = $props();

let formatted: string = $state('');
let header: string = $state('');
let short: boolean = $state(false);
let moreDisplayed: boolean = $state(false);

onMount(() => {
  // add a newline before a tab or several spaces
  formatted = command.replaceAll(/( {2,}|\t+)/g, '\n$1') || '';
  const lines = formatted.split('\n');
  const headerLines = lines.slice(0, 2);
  header = headerLines.join('\n');
  short = headerLines.length < lines.length;
});
</script>

<div class="font-mono whitespace-pre-wrap break-all">{moreDisplayed ? formatted : header}</div>
{#if short}
  <button
    class="text-xs underline decoration-dashed"
    onclick={(): void => {
      moreDisplayed = !moreDisplayed;
    }}>{moreDisplayed ? 'show less' : 'show more'}</button>
{/if}
