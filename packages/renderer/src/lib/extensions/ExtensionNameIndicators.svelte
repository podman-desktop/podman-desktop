<script lang="ts">
import { faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';

import { EXTENSION_INDICATOR_ICON_CLASS, EXTENSION_VERIFIED_INDICATOR_ICON_CLASS } from './extension-badge-styles';
import ExtensionFeaturedChip from './ExtensionFeaturedChip.svelte';
import ExtensionIndicatorIcon from './ExtensionIndicatorIcon.svelte';
import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

interface Props {
  isFeatured?: boolean;
  isVerified?: boolean;
  class?: string;
}

let { isFeatured = false, isVerified = false, class: className = '' }: Props = $props();

const featuredTooltip = 'Featured extension';
const verifiedTooltip = 'Verified extension';
const suggestionScope = $derived(areExtensionsImprovementsSuggested());
</script>

{#if isFeatured || isVerified}
  <span class="inline-flex shrink-0 items-center gap-1 {className}">
    {#if isFeatured}
      {#if suggestionScope}
        <ExtensionFeaturedChip />
      {:else}
        <ExtensionIndicatorIcon icon={faStar} tip={featuredTooltip} iconClass={EXTENSION_INDICATOR_ICON_CLASS} />
      {/if}
    {/if}
    {#if isVerified}
      <ExtensionIndicatorIcon
        icon={faCircleCheck}
        tip={verifiedTooltip}
        iconClass={EXTENSION_VERIFIED_INDICATOR_ICON_CLASS} />
    {/if}
  </span>
{/if}
