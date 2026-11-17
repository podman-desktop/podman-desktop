<script lang="ts">
import { NavigationPage } from '@desktop-framework/api';
import { Button } from '@podman-desktop/ui-svelte';

import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';
import { t } from '/@/lib/i18n/translations.svelte';
import { handleNavigation } from '/@/navigation';
import { recommendedRegistries } from '/@/stores/recommendedRegistries';

interface Props {
  imageError?: string;
  imageName?: string;
}

let { imageError = $bindable(), imageName }: Props = $props();
let registriesFilteredByIds = $derived($recommendedRegistries.filter(reg => imageName?.includes(reg.id)));
let recommendedRegistriesToInstall = $derived(
  registriesFilteredByIds.filter(registry =>
    registry.errors.some(registryMatchingError => imageError?.includes(registryMatchingError)),
  ),
);

function goToAuthPage(): void {
  handleNavigation({
    page: NavigationPage.AUTHENTICATION,
  });
}
</script>

{#each recommendedRegistriesToInstall as registry (registry.id)}
  {@const action = registry.isInstalled ? (t('resources.check') ?? 'Check') : (t('resources.install') ?? 'Install')}
  {@const explanation = t('resources.extension-action', { registry: registry.id, action })}
  <div class="text-[var(--pd-state-warning)] flex flex-row min-h-10 items-center pt-2 space-x-2">
    {#if !registry.isInstalled}
      <FeaturedExtensionDownload extension={registry.extensionDetails} />
    {/if}
    <p>
      {explanation ?? `${registry.isInstalled ? 'Check' : 'Install'} the`} &nbsp;<a
        class="text-[var(--pd-state-warning)] underline"
        href="/extensions/details/{registry.extensionId}">{t('resources.extension-name', { name: registry.name }) ?? `${registry.name} extension`}</a>
      {#if explanation === undefined}to manage {registry.id}{/if}
    </p>

    {#if registry.isInstalled}
      <Button on:click={goToAuthPage}>{t('resources.sign-in') ?? 'Sign in...'}</Button>
    {/if}
  </div>
{/each}
