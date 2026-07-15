<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage, Tooltip } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { buildExtensionInstallingTooltip, EXTENSION_INSTALL_TOOLTIP } from '/@/lib/extensions/extension-badge-styles';
import { markNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { syncExtensionNavigationAfterInstall } from '/@/lib/extensions/extension-nav-pointer.svelte';
import {
  ensurePrototypeSidebarEntry,
  isPrototypeRemovedExtension,
  prototypeRestoreExtension,
} from '/@/lib/extensions/extension-prototype-use-cases';
import {
  getLatestAvailableVersion,
  normalizeVersionValue,
  resolveExtensionVersionOciUri,
} from '/@/lib/extensions/extension-version-update.svelte';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';
import { fetchExtensions } from '/@/stores/extensions';
import { refreshExtensionNavigationItems } from '/@/stores/navigation/navigation-registry-extension.svelte';

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

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPrototypeInstallSimulation(): Promise<void> {
  const imageRef = extension.fetchLink?.trim() ?? `ghcr.io/podman-desktop/${extension.id}:latest`;
  const steps: { msg: string; pct: string; ms: number }[] = [
    { msg: `Pulling from ${imageRef}`, pct: '0%', ms: 300 },
    { msg: 'Pulling layer sha256:a1b2c3d4… 25%', pct: '25%', ms: 500 },
    { msg: 'Pulling layer sha256:e5f6a7b8… 50%', pct: '50%', ms: 500 },
    { msg: 'Pulling layer sha256:c9d0e1f2… 75%', pct: '75%', ms: 500 },
    { msg: 'Download complete 100%', pct: '100%', ms: 400 },
    { msg: 'Extracting extension files…', pct: '100%', ms: 600 },
    { msg: 'Activating extension…', pct: '100%', ms: 400 },
  ];
  for (const step of steps) {
    await delay(step.ms);
    logs = [...logs, step.msg];
    percentage = step.pct;
  }
}

async function installExtension(): Promise<void> {
  errorInstall = '';
  logs = [];
  installInProgress = true;

  // In prototype/suggestion scope, re-installing a previously prototype-removed extension
  // simulates the real install flow (progress, logs) then restores the UI state without
  // calling the backend (which would reject the call since the extension is still installed).
  if (areExtensionsImprovementsSuggested() && isPrototypeRemovedExtension(extension.id)) {
    await runPrototypeInstallSimulation();
    prototypeRestoreExtension(extension.id, [], extension.displayName);
    logs = [...logs, '☑️ installation finished!'];
    percentage = '100%';
    installCompleted = true;
    // Ensure the sidebar entry is visible again before showing the post-install tooltip.
    refreshExtensionNavigationItems();
    await syncExtensionNavigationAfterInstall(extension.id);
    markNewlyInstalled(extension.id, extension.displayName);
    oninstall(extension.id);
    installInProgress = false;
    return;
  }

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
        errorInstall = error;
      },
      extension.id,
    );

    if (errorInstall) {
      if (areExtensionsImprovementsSuggested() && /already installed/i.test(errorInstall)) {
        await completePrototypeReinstall();
      }
      installInProgress = false;
      return;
    }

    logs = [...logs, '☑️ installation finished!'];
    percentage = '100%';
    installCompleted = true;
    await fetchExtensions();
    if (areExtensionsImprovementsSuggested()) {
      ensurePrototypeSidebarEntry(extension.id, extension.displayName);
      refreshExtensionNavigationItems();
    }
    await syncExtensionNavigationAfterInstall(extension.id);
    markNewlyInstalled(extension.id, extension.displayName);
    oninstall(extension.id);
  } catch (error) {
    const message = String(error);
    // In suggestion scope, a backend "already installed" error usually means the
    // extension was only hidden via prototype uninstall — restore UI and show the tooltip.
    if (areExtensionsImprovementsSuggested() && /already installed/i.test(message)) {
      await completePrototypeReinstall();
      errorInstall = '';
    } else {
      errorInstall = message;
    }
  }
  installInProgress = false;
}

async function completePrototypeReinstall(): Promise<void> {
  prototypeRestoreExtension(extension.id, [], extension.displayName);
  logs = [...logs, '☑️ installation finished!'];
  percentage = '100%';
  installCompleted = true;
  errorInstall = '';
  refreshExtensionNavigationItems();
  await syncExtensionNavigationAfterInstall(extension.id);
  markNewlyInstalled(extension.id, extension.displayName);
  oninstall(extension.id);
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
