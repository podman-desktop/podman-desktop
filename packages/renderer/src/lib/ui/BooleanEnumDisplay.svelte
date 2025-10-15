<script lang="ts">
interface Props {
  value: boolean;
  options: string[];
  ariaLabel?: string;
}

const { value, options, ariaLabel }: Props = $props();

/**
 * The display text is the second option if the value is true, otherwise the first option
 * Convention: options[0] = false label, options[1] = true label
 */
const displayText = $derived.by(() => {
  if (typeof value !== 'boolean') {
    console.warn('BooleanEnumDisplay: value must be boolean, got:', typeof value, value);
    return undefined;
  }
  if (options.length !== 2) {
    console.warn('BooleanEnumDisplay: options must have 2 values');
    return undefined;
  }
  return options[value ? 1 : 0];
});
</script>

{#if displayText}
 <span aria-label="{ariaLabel ?? displayText}">
  {displayText}
 </span>
{/if}
