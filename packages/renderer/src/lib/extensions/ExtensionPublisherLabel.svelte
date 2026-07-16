<script lang="ts">
import { faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';

import { EXTENSION_INDICATOR_ICON_CLASS, EXTENSION_VERIFIED_INDICATOR_ICON_CLASS } from './extension-badge-styles';
import ExtensionFeaturedChip from './ExtensionFeaturedChip.svelte';
import ExtensionIndicatorIcon from './ExtensionIndicatorIcon.svelte';
import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

interface Props {
  publisherName: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  class?: string;
}

let { publisherName, isVerified = false, isFeatured = false, class: className = '' }: Props = $props();

const verifiedTooltip = 'Verified extension';
const featuredTooltip = 'Featured extension';
const suggestionScope = $derived(areExtensionsImprovementsSuggested());
</script>

<span class="inline-flex min-w-0 items-center gap-1 font-normal {className}">
  <span class="truncate">{publisherName}</span>
  {#if isVerified}
    <span class="relative top-px">
      <ExtensionIndicatorIcon
        icon={faCircleCheck}
        tip={verifiedTooltip}
        iconClass={EXTENSION_VERIFIED_INDICATOR_ICON_CLASS} />
    </span>
  {/if}
  {#if isFeatured}
    <span class="relative top-px">
      {#if suggestionScope}
        <ExtensionFeaturedChip />
      {:else}
        <ExtensionIndicatorIcon
          icon={faStar}
          tip={featuredTooltip}
          iconClass={EXTENSION_INDICATOR_ICON_CLASS} />
      {/if}
    </span>
  {/if}
</span>
