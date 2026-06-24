<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage, Tooltip } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { buildExtensionInstallingTooltip, EXTENSION_INSTALL_TOOLTIP } from '/@/lib/extensions/extension-badge-styles';
import { markNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { syncExtensionNavigationAfterInstall } from '/@/lib/extensions/extension-nav-pointer.svelte';
import {
  getLatestAvailableVersion,
  normalizeVersionValue,
  resolveExtensionVersionOciUri,
} from '/@/lib/extensions/extension-version-update.svelte';
import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';
import { fetchExtensions } from '/@/stores/extensions';

export let extension: {
  id: string;
  fetchLink?: string;
  fetchVersion?: string;
  displayName: string;
  fetchable: boolean;
  availableVersions?: CatalogExtensionVersionUI[];
  isInstalled?: boolean;
  installedVersion?: string;
  publisherDisplayName?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isSupportedByRedHat?: boolean;
  categories?: string[];
  keywords?: string[];
};
export let catalogExtension: CatalogExtensionInfoUI | undefined = undefined;
export let oninstall: (extensionId: string) => void = () => {};

let installInProgress = false;
let installCompleted = false;
let logs: string[] = [];
let errorInstall = '';
let percentage = '0%';

$: showInstallButton = extension.fetchable && !extension.isInstalled && !installCompleted;
$: installTooltip = installInProgress ? buildExtensionInstallingTooltip(percentage) : EXTENSION_INSTALL_TOOLTIP;

function buildCatalogExtensionForInstall(): CatalogExtensionInfoUI {
  if (catalogExtension) {
    return catalogExtension;
  }

  const availableVersions: CatalogExtensionVersionUI[] =
    extension.availableVersions && extension.availableVersions.length > 0
      ? extension.availableVersions
      : extension.fetchVersion
        ? [
            {
              version: extension.fetchVersion,
              ociUri: extension.fetchLink ?? '',
              preview: false,
            },
          ]
        : [];

  return {
    id: extension.id,
    displayName: extension.displayName,
    isFeatured: extension.isFeatured ?? false,
    fetchable: extension.fetchable,
    fetchLink: extension.fetchLink ?? '',
    fetchVersion: extension.fetchVersion ?? '',
    publisherDisplayName: extension.publisherDisplayName ?? '',
    isInstalled: extension.isInstalled ?? false,
    installedVersion: extension.installedVersion,
    shortDescription: extension.shortDescription ?? '',
    categories: extension.categories ?? [],
    keywords: extension.keywords ?? [],
    availableVersions,
    hasUpdate: false,
    isVerified: extension.isVerified ?? false,
    isSupportedByRedHat: extension.isSupportedByRedHat ?? false,
  };
}

async function installExtension(): Promise<void> {
  errorInstall = '';
  logs = [];
  installInProgress = true;

  const catalog = buildCatalogExtensionForInstall();
  const latestVersion = normalizeVersionValue(getLatestAvailableVersion(catalog));
  const ociImage = resolveExtensionVersionOciUri(catalog, latestVersion) ?? extension?.fetchLink?.trim();

  if (!ociImage) {
    errorInstall = 'No image to install';
    installInProgress = false;
    return;
  }

  try {
    const percentageMatchRegexp = RegExp(/(\d+)%/);
    await window.extensionInstallFromImage(
      ociImage,
      (data: string) => {
        logs = [...logs, data];
        const percentageMatch = percentageMatchRegexp.exec(data);
        if (percentageMatch) {
          percentage = percentageMatch[1] + '%';
        }
      },
      (error: string) => {
        installInProgress = false;
        errorInstall = error;
      },
      extension.id,
    );
    logs = [...logs, '☑️ installation finished!'];
    percentage = '100%';
    installCompleted = true;
    await fetchExtensions();
    await syncExtensionNavigationAfterInstall(extension.id);
    markNewlyInstalled(extension.id);
    oninstall(extension.id);
  } catch (error) {
    errorInstall = String(error);
  }
  installInProgress = false;
}

function handleInstallClick(event: MouseEvent): void {
  event.stopPropagation();
  installExtension().catch((error: unknown) => {
    console.error('Unable to install extension', error);
  });
}
</script>

<ErrorMessage icon wrapMessage class="-top-[15px] right-0 absolute" error={errorInstall}/>
{#if showInstallButton}
  <Tooltip top tip={installTooltip} class="inline-flex shrink-0">
    <button
      aria-label="Install {extension.id} Extension"
      on:click={handleInstallClick}
      disabled={installInProgress}
      class="border-2 relative rounded-sm border-[var(--pd-button-secondary-border)] text-[var(--pd-button-secondary-text)] hover:bg-[var(--pd-button-secondary-hover-bg)] w-10 p-2 text-center cursor-pointer flex flex-row justify-center disabled:opacity-60 disabled:cursor-not-allowed">
      <LoadingIcon
        icon={faDownload}
        iconSize="1x"
        loading={installInProgress} />
      <span
        class:hidden={!installInProgress}
        class="absolute -top-[15px] right-0 text-[var(--pd-action-button-spinner)]"
        style="font-size: 8px">{percentage}</span>
    </button>
  </Tooltip>
{/if}
