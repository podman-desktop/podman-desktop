<script lang="ts">
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { EXTENSION_INDICATOR_ICON_CLASS } from './extension-badge-styles';
import ExtensionIndicatorIcon from './ExtensionIndicatorIcon.svelte';

interface Props {
  displayName: string;
  isFeatured?: boolean;
  nameClass?: string;
  class?: string;
}

let { displayName, isFeatured = false, nameClass = '', class: className = '' }: Props = $props();

const featuredTooltip = 'Featured extension';
</script>

<span class="inline-flex min-w-0 max-w-full items-center gap-1 font-normal {className}">
  <span class="truncate {nameClass}">{displayName}</span>
  {#if isFeatured}
    <ExtensionIndicatorIcon icon={faStar} tip={featuredTooltip} iconClass={EXTENSION_INDICATOR_ICON_CLASS} />
  {/if}
</span>
