<script lang="ts">
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { EXTENSION_VERIFIED_INDICATOR_ICON_CLASS } from './extension-badge-styles';
import ExtensionIndicatorIcon from './ExtensionIndicatorIcon.svelte';

interface Props {
  publisherName: string;
  isVerified?: boolean;
  class?: string;
}

let { publisherName, isVerified = false, class: className = '' }: Props = $props();

const verifiedTooltip = 'Verified extension';
</script>

<span class="inline-flex min-w-0 items-center gap-1 font-normal {className}">
  <span class="truncate">{publisherName}</span>
  {#if isVerified}
    <ExtensionIndicatorIcon
      icon={faCircleCheck}
      tip={verifiedTooltip}
      iconClass={EXTENSION_VERIFIED_INDICATOR_ICON_CLASS} />
  {/if}
</span>
