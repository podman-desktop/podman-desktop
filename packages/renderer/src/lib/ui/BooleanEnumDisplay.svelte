<script lang="ts">
interface Props {
  value: boolean;
  options: string[];
  description?: string;
  id?: string;
}

const { value, options, description, id }: Props = $props();

const displayText = $derived.by(() => {
  if (options.length !== 2) {
    return undefined;
  }
  return options[value ? 1 : 0];
});
</script>

{#if displayText}
 <span aria-label="{description ?? id}: {displayText}">
  {displayText}
 </span>
{/if}
