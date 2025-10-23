<script lang="ts">
interface Props {
  text: string;
  query: string;
}

let { text, query }: Props = $props();

let highlightedParts = $derived(highlightText(text, query));

function highlightText(
  text: string | undefined,
  searchTerm: string | undefined,
): Array<{ text: string; hasMatch: boolean }> {
  if (!searchTerm || !text) {
    return [{ text: text ?? '', hasMatch: false }];
  }

  const escapedSearchTerm = searchTerm.replace(/[.\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

  return text
    .split(regex)
    .filter(part => part.length > 0)
    .map(part => ({
      text: part,
      hasMatch: regex.test(part),
    }));
}
</script>

{#each highlightedParts as part, i (i)}
  {#if part.hasMatch}
    <mark class="text-[var(--pd-label-primary-text)] font-semibold bg-transparent">{part.text}</mark>
  {:else}
    {part.text}
  {/if}
{/each}

