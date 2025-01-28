<script lang="ts">
import ExtensionBanner from '/@/lib/recommendation/ExtensionBanner.svelte';
import { extensionBannerInfos } from '/@/stores/extensionBanners';

import type { ExtensionBanner as ExtensionBannerInfo } from '../../../../main/src/plugin/recommendations/recommendations-api';
import { isDark } from '../../stores/appearance';
import { providerInfos } from '../../stores/providers';
import { ContextUI } from '../context/context';
import { ContextKeyExpr } from '../context/contextKey';

let banners: ExtensionBannerInfo[] = $derived.by(() =>
  $extensionBannerInfos.filter(banner => !banner.when || isBannerVisible(banner)),
);

function isBannerVisible(banner: ExtensionBannerInfo): boolean | undefined {
  const context: ContextUI = new ContextUI();
  $providerInfos.forEach(provider => {
    context.setValue(`provider.${provider.id}.status`, provider.status);
  });
  const whenDeserialized = ContextKeyExpr.deserialize(banner.when);
  return whenDeserialized?.evaluate(context);
}
</script>

{#each banners as banner (banner.extensionId)}  
  <ExtensionBanner banner={banner} isDark={$isDark} />
{/each}
