<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage, Tooltip } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from '/@/lib/extensions/catalog-extension-info-ui';
import ChangeVersionModal from '/@/lib/extensions/ChangeVersionModal.svelte';
import { buildExtensionInstallingTooltip, EXTENSION_INSTALL_TOOLTIP } from '/@/lib/extensions/extension-badge-styles';
import { markNewlyInstalled, setAutoUpdateEnabled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { syncExtensionNavigationAfterInstall } from '/@/lib/extensions/extension-nav-pointer.svelte';
import {
  normalizeVersionValue,
  resolveExtensionVersionOciUri,
} from '/@/lib/extensions/extension-version-update.svelte';
import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';

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
let logs: string[] = [];
let errorInstall = '';
let percentage = '0%';
let showInstallVersionModal = false;

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

function openInstallVersionModal(): void {
  showInstallVersionModal = true;
}

function closeInstallVersionModal(): void {
  showInstallVersionModal = false;
}

async function installExtension(targetVersion?: string, autoUpdateEnabled?: boolean): Promise<void> {
  errorInstall = '';
  console.log('User asked to install the extension with the following properties', extension, targetVersion);
  logs = [];

  installInProgress = true;

  const catalog = buildCatalogExtensionForInstall();
  const normalizedTarget = targetVersion ? normalizeVersionValue(targetVersion) : undefined;
  const ociImage =
    (normalizedTarget ? resolveExtensionVersionOciUri(catalog, normalizedTarget) : undefined) ??
    extension?.fetchLink?.trim();

  if (!ociImage) {
    console.log('No image to install');
    errorInstall = 'No image to install';
    installInProgress = false;
    return;
  }

  if (autoUpdateEnabled !== undefined) {
    setAutoUpdateEnabled(extension.id, autoUpdateEnabled);
  }

  try {
    const percentageMatchRegexp = RegExp(/(\d+)%/);
    await window.extensionInstallFromImage(
      ociImage,
      (data: string) => {
        logs = [...logs, data];
        console.log('data', data);

        const percentageMatch = percentageMatchRegexp.exec(data);

        if (percentageMatch) {
          percentage = percentageMatch[1] + '%';
        }
      },
      (error: string) => {
        console.log(`got an error when installing ${extension.id}`, error);
        installInProgress = false;
        errorInstall = error;
      },
      extension.id,
    );
    logs = [...logs, '☑️ installation finished!'];
    percentage = '100%';
    console.log(`[DTUX-2854] Installation completed, marking as newly installed: ${extension.id}`);
    await syncExtensionNavigationAfterInstall(extension.id);
    markNewlyInstalled(extension.id);
    oninstall(extension.id);
  } catch (error) {
    console.log('error', error);
    errorInstall = String(error);
  }
  installInProgress = false;
}

function handleInstallClick(event: MouseEvent): void {
  event.stopPropagation();
  openInstallVersionModal();
}

function handleInstallFromModal(version: string, autoUpdateEnabled: boolean): void {
  closeInstallVersionModal();
  installExtension(version, autoUpdateEnabled).catch((error: unknown) => {
    console.error('Unable to install extension', error);
  });
}
</script>

<ErrorMessage icon wrapMessage class="-top-[15px] right-0 absolute" error={errorInstall}/>
{#if extension.fetchable}
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

{#if showInstallVersionModal}
  <ChangeVersionModal
    mode="install"
    extension={buildCatalogExtensionForInstall()}
    closeCallback={closeInstallVersionModal}
    onInstall={handleInstallFromModal} />
{/if}
