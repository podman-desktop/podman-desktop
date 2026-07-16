<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage, Tooltip } from '@podman-desktop/ui-svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { buildExtensionInstallingTooltip, EXTENSION_INSTALL_TOOLTIP } from '/@/lib/extensions/extension-badge-styles';
import { markNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { setExtensionInstallInProgress } from '/@/lib/extensions/extension-install-progress.svelte';
import { syncExtensionNavigationAfterInstall } from '/@/lib/extensions/extension-nav-pointer.svelte';
import {
  ensurePrototypeSidebarEntry,
  isPrototypeRemovedExtension,
  prototypeRestoreExtension,
  shouldEnsurePrototypeSidebarEntry,
} from '/@/lib/extensions/extension-prototype-use-cases';
import {
  getLatestAvailableVersion,
  normalizeVersionValue,
  resolveExtensionVersionOciUri,
} from '/@/lib/extensions/extension-version-update.svelte';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import FilledPieProgress from '/@/lib/ui/FilledPieProgress.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';
import { fetchExtensions } from '/@/stores/extensions';
import { refreshExtensionNavigationItems } from '/@/stores/navigation/navigation-registry-extension.svelte';

interface ExtensionInstallTarget {
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
  iconHref?: string;
}

interface Props {
  extension: ExtensionInstallTarget;
  catalogExtension?: CatalogExtensionInfoUI;
  oninstall?: (extensionId: string) => void;
}

let { extension, catalogExtension = undefined, oninstall = (): void => {} }: Props = $props();

let installInProgress = $state(false);
let installCompleted = $state(false);
/** Once the parent has reported installed, ignore installCompleted so uninstall can show Install again. */
let sawInstalled = $state(false);
let logs = $state<string[]>([]);
let errorInstall = $state('');
let percentage = $state('0%');

const suggestionScope = $derived(areExtensionsImprovementsSuggested());
const percentValue = $derived(Number.parseInt(percentage, 10) || 0);
const installTooltip = $derived(
  installInProgress ? buildExtensionInstallingTooltip(percentage) : EXTENSION_INSTALL_TOOLTIP,
);
const showInstallButton = $derived(
  extension.fetchable && !extension.isInstalled && (!installCompleted || sawInstalled),
);
const installButtonLabel = $derived(`Install ${extension.id} Extension`);

$effect(() => {
  if (extension.isInstalled) {
    sawInstalled = true;
  }
});

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
  // Start above 0% so the filled pie is visible immediately on click.
  percentage = '8%';
  const steps: { msg: string; pct: string; ms: number }[] = [
    { msg: `Pulling from ${imageRef}`, pct: '8%', ms: 200 },
    { msg: 'Pulling layer sha256:a1b2c3d4… 25%', pct: '25%', ms: 450 },
    { msg: 'Pulling layer sha256:e5f6a7b8… 50%', pct: '50%', ms: 450 },
    { msg: 'Pulling layer sha256:c9d0e1f2… 75%', pct: '75%', ms: 450 },
    { msg: 'Download complete 100%', pct: '100%', ms: 350 },
    { msg: 'Extracting extension files…', pct: '100%', ms: 500 },
    { msg: 'Activating extension…', pct: '100%', ms: 350 },
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
  percentage = suggestionScope ? '8%' : '0%';
  installInProgress = true;
  setExtensionInstallInProgress(extension.id, true);

  try {
    // In prototype/suggestion scope, re-installing a previously prototype-removed extension
    // simulates the real install flow (progress, logs) then restores the UI state without
    // calling the backend (which would reject the call since the extension is still installed).
    if (suggestionScope && isPrototypeRemovedExtension(extension.id)) {
      await runPrototypeInstallSimulation();
      prototypeRestoreExtension(extension.id, [], extension.displayName, resolveInstallIconHref());
      logs = [...logs, '☑️ installation finished!'];
      percentage = '100%';
      installCompleted = true;
      refreshExtensionNavigationItems();
      // Show the post-install tooltip immediately; upgrade the nav target in the background
      // when a webview/contrib appears (e.g. Developer Sandbox).
      markNewlyInstalled(extension.id, extension.displayName);
      oninstall(extension.id);
      syncExtensionNavigationAfterInstall(extension.id).catch((error: unknown) => {
        console.error(error);
      });
      return;
    }

    const catalog = buildCatalogExtensionForInstall();
    const latestVersion = normalizeVersionValue(getLatestAvailableVersion(catalog));
    const ociImage = resolveExtensionVersionOciUri(catalog, latestVersion) ?? extension?.fetchLink?.trim();

    if (!ociImage) {
      errorInstall = 'No image to install';
      return;
    }

    try {
      const percentageMatchRegexp = RegExp(/(\d+)%/);
      // Suggestion scope: keep a visible pie even when the backend emits sparse progress.
      const suggestionProgress = suggestionScope
        ? (async (): Promise<void> => {
            const ticks = ['15%', '35%', '55%', '75%', '90%'];
            for (const pct of ticks) {
              if (!installInProgress) {
                return;
              }
              await delay(400);
              if (!installInProgress) {
                return;
              }
              // Don't overwrite a higher value already parsed from backend logs.
              if ((Number.parseInt(percentage, 10) || 0) < (Number.parseInt(pct, 10) || 0)) {
                percentage = pct;
              }
            }
          })()
        : Promise.resolve();

      await Promise.all([
        suggestionProgress,
        window.extensionInstallFromImage(
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
        ),
      ]);

      if (errorInstall) {
        if (suggestionScope && /already installed/i.test(errorInstall)) {
          await completePrototypeReinstall();
        }
        return;
      }

      logs = [...logs, '☑️ installation finished!'];
      percentage = '100%';
      installCompleted = true;
      await fetchExtensions();
      if (suggestionScope) {
        // Do not invent sidebar items for every install — only extensions that
        // normally have a webview may get a synthetic anchor when it's missing.
        if (shouldEnsurePrototypeSidebarEntry(extension.id)) {
          ensurePrototypeSidebarEntry(extension.id, extension.displayName, resolveInstallIconHref());
        }
        refreshExtensionNavigationItems();
      }
      // Tooltip first — do not wait on webview registration (can take many seconds).
      markNewlyInstalled(extension.id, extension.displayName);
      oninstall(extension.id);
      syncExtensionNavigationAfterInstall(extension.id).catch((error: unknown) => {
        console.error(error);
      });
    } catch (error) {
      const message = String(error);
      // In suggestion scope, a backend "already installed" error usually means the
      // extension was only hidden via prototype uninstall — restore UI and show the tooltip.
      if (suggestionScope && /already installed/i.test(message)) {
        await completePrototypeReinstall();
        errorInstall = '';
      } else {
        errorInstall = message;
      }
    }
  } finally {
    installInProgress = false;
    setExtensionInstallInProgress(extension.id, false);
  }
}

async function completePrototypeReinstall(): Promise<void> {
  prototypeRestoreExtension(extension.id, [], extension.displayName, resolveInstallIconHref());
  logs = [...logs, '☑️ installation finished!'];
  percentage = '100%';
  installCompleted = true;
  errorInstall = '';
  refreshExtensionNavigationItems();
  markNewlyInstalled(extension.id, extension.displayName);
  oninstall(extension.id);
  syncExtensionNavigationAfterInstall(extension.id).catch((error: unknown) => {
    console.error(error);
  });
}

function resolveInstallIconHref(): string | undefined {
  return catalogExtension?.iconHref ?? extension.iconHref;
}

function handleInstallClick(): void {
  installExtension().catch((error: unknown) => {
    console.error('Unable to install extension', error);
  });
}
</script>

<ErrorMessage icon wrapMessage class="-top-[15px] right-0 absolute" error={errorInstall}/>
{#if showInstallButton}
  {#if suggestionScope}
    <!-- Images-page pattern: icon-only action; pie replaces the icon while installing. -->
    <Tooltip top tip={installTooltip} class="inline-flex shrink-0">
      {#if installInProgress}
        <button
          type="button"
          aria-label={installButtonLabel}
          disabled
          class="text-[var(--pd-action-button-disabled-text)] font-medium rounded-full inline-flex items-center justify-center px-2 py-2 text-center cursor-not-allowed"
          onclick={(event): void => event.stopPropagation()}>
          <FilledPieProgress percent={percentValue} size={16} />
        </button>
      {:else}
        <ListItemButtonIcon
          title={installButtonLabel}
          icon={faDownload}
          enabled={true}
          onClick={(): void => {
            handleInstallClick();
          }} />
      {/if}
    </Tooltip>
  {:else}
    <Tooltip top tip={installTooltip} class="inline-flex shrink-0">
      <button
        type="button"
        aria-label={installButtonLabel}
        onclick={(event): void => {
          event.stopPropagation();
          handleInstallClick();
        }}
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
{/if}
