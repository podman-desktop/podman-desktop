<script lang="ts">
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_INDICATOR_TOOLTIP,
  EXTENSION_INDICATOR_ICON_CLASS,
} from '/@/lib/extensions/extension-badge-styles';
import { shouldShowBuiltInNameIndicator } from '/@/lib/extensions/extension-origin-utils';
import ExtensionFeaturedNameLabel from '/@/lib/extensions/ExtensionFeaturedNameLabel.svelte';
import ExtensionIndicatorIcon from '/@/lib/extensions/ExtensionIndicatorIcon.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

const showBuiltIn = $derived(
  shouldShowBuiltInNameIndicator(extension.installedExtension, extension.fetchable === true),
);
</script>

<div class="flex flex-col gap-1 min-w-0 py-1">
  <span class="inline-flex min-w-0 max-w-full items-center gap-1">
    <ExtensionFeaturedNameLabel
      displayName={extension.displayName}
      isFeatured={extension.isFeatured}
      nameClass="font-semibold text-[var(--pd-content-header)]" />
    {#if showBuiltIn}
      <ExtensionIndicatorIcon
        icon={faShieldHalved}
        tip={EXTENSION_BUILTIN_INDICATOR_TOOLTIP}
        iconClass={EXTENSION_INDICATOR_ICON_CLASS} />
    {/if}
  </span>
  <ExtensionTruncatedText text={extension.shortDescription} class="text-sm text-[var(--pd-content-text)]" />
</div>
