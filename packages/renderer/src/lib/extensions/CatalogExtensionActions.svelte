<script lang="ts">
import {
  faBug,
  faCircleInfo,
  faCodeBranch,
  faExternalLink,
  faGear,
  faGraduationCap,
  faPlay,
  faStop,
  faToggleOff,
  faToggleOn,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { derived, type Unsubscriber } from 'svelte/store';
import { router } from 'tinro';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { confirmExtensionAutoUpdateChange } from '/@/lib/extensions/extension-auto-update-confirm';
import { context } from '/@/stores/context';
import { onboardingList } from '/@/stores/onboarding';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { buildExtensionBugReportUrl } from './extension-badge-styles';
import { clearNewBadge, isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { buildExtensionDetailsPath, type ExtensionListScreen } from './extension-list';
import {
  extensionHasOtherVersions,
  type ExtensionOnboardingStatus,
  extensionRequiresManualUpdate,
  resolveExtensionOnboardingStatus,
} from './extension-onboarding-utils';
import {
  applyExtensionVersionChange,
  getLatestAvailableVersion,
  normalizeVersionValue,
} from './extension-version-update.svelte';
import ExtensionDropdownMenu from './ExtensionDropdownMenu.svelte';
import ExtensionDropdownMenuItem from './ExtensionDropdownMenuItem.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  returnScreen?: ExtensionListScreen;
  onChangeVersion: () => void;
  /** Hide "View more details" when the actions menu is rendered on the details page. */
  onDetailsPage?: boolean;
}

let { extension, returnScreen = 'catalog', onChangeVersion, onDetailsPage = false }: Props = $props();

const autoUpdateEnabled = $derived(isAutoUpdateEnabled(extension.id));
const installedExtension = $derived(extension.installedExtension);
const requiresManualUpdate = $derived(extensionRequiresManualUpdate(extension));
const autoUpdateDetail = $derived(
  autoUpdateEnabled
    ? 'New updates will be automatically installed'
    : requiresManualUpdate
      ? 'An update is available — install manually or enable automatic updates'
      : 'Manual version installation is required',
);

let onboardingStatus = $state<ExtensionOnboardingStatus>({ enabled: false, detail: 'Not configured' });

let onboardingUnsubscribe: Unsubscriber | undefined;

$effect(() => {
  onboardingUnsubscribe?.();
  const onboardingReadable = derived([onboardingList, context], () =>
    resolveExtensionOnboardingStatus(installedExtension),
  );
  onboardingUnsubscribe = onboardingReadable.subscribe(status => {
    onboardingStatus = status;
  });

  return (): void => {
    onboardingUnsubscribe?.();
  };
});

const showStop = $derived(installedExtension?.state === 'started' || installedExtension?.state === 'starting');
const showReactivate = $derived(installedExtension?.state === 'stopped' || installedExtension?.state === 'failed');
const hasOtherVersions = $derived(extensionHasOtherVersions(extension));

// Catalog/fetchable extensions should always be removable, even if backend says removable: false
// True built-in extensions (like Compose, Docker, Podman) are NOT fetchable
const isRemovable = $derived(extension.installedExtension?.removable !== false || extension.fetchable === true);

function openDetails(event: Event): void {
  event.stopPropagation();
  router.goto(buildExtensionDetailsPath(extension.id, returnScreen));
}

function openOnboarding(event: Event): void {
  event.stopPropagation();
  if (!onboardingStatus.enabled) {
    return;
  }
  router.goto(`/preferences/onboarding/${extension.id}`);
}

function openPreferences(event: Event): void {
  event.stopPropagation();
  router.goto(`/preferences/default/preferences.${extension.id}`);
}

async function reactivateExtension(event: Event): Promise<void> {
  event.stopPropagation();
  if (!installedExtension) {
    return;
  }
  await window.startExtension(installedExtension.id);
}

async function stopExtension(event: Event): Promise<void> {
  event.stopPropagation();
  if (!installedExtension) {
    return;
  }
  await window.stopExtension(installedExtension.id);
}

async function removeExtension(event: Event): Promise<void> {
  event.stopPropagation();
  console.log(
    '[DTUX-2854] Remove clicked for:',
    extension.displayName,
    'installedExtension:',
    installedExtension,
    'isRemovable:',
    isRemovable,
  );
  if (!installedExtension) {
    console.error('[DTUX-2854] No installedExtension found, cannot remove');
    return;
  }
  withConfirmation(
    async () => {
      console.log('[DTUX-2854] Confirmed removal, removing extension:', installedExtension.id);
      if (installedExtension.type === 'dd') {
        await window.ddExtensionDelete(installedExtension.id);
      } else {
        await window.removeExtension(installedExtension.id);
      }
      // Remove from newly installed set
      clearNewBadge(extension.id);
    },
    `remove ${extension.displayName}`,
    { title: 'Remove extension?', variant: 'delete', buttonLabel: 'Remove' },
  );
}

async function handleToggleAutoUpdate(event: Event): Promise<void> {
  event.stopPropagation();
  const enabling = !autoUpdateEnabled;

  const confirmed = await confirmExtensionAutoUpdateChange(extension, enabling);
  if (!confirmed) {
    return;
  }

  setAutoUpdateEnabled(extension.id, enabling);

  if (enabling) {
    const targetVersion = getLatestAvailableVersion(extension);
    const installed = normalizeVersionValue(extension.installedVersion);
    const target = normalizeVersionValue(targetVersion);
    if (targetVersion && installed && target && target !== installed) {
      applyExtensionVersionChange(extension, targetVersion, true);
    }
  }
}

async function reportBug(event: Event): Promise<void> {
  event.stopPropagation();
  await window.openExternal(buildExtensionBugReportUrl(extension.repositoryUrl));
}

async function openRepository(event: Event): Promise<void> {
  event.stopPropagation();
  if (extension.repositoryUrl) {
    await window.openExternal(extension.repositoryUrl);
  }
}

function handleChangeVersion(event: Event): void {
  event.stopPropagation();
  if (!hasOtherVersions) {
    return;
  }
  onChangeVersion();
}
</script>

<div onclick={(event): void => event.stopPropagation()} role="presentation">
  <ExtensionDropdownMenu menuId={extension.id} title="{extension.displayName} actions">
    <ExtensionDropdownMenuItem
      title="View more details"
      icon={faCircleInfo}
      hidden={onDetailsPage}
      onClick={openDetails} />
    {#if extension.isInstalled}
      <ExtensionDropdownMenuItem
        title="Onboarding"
        detail={onboardingStatus.enabled ? '' : onboardingStatus.detail}
        icon={faGraduationCap}
        enabled={onboardingStatus.enabled}
        onClick={openOnboarding} />
      <ExtensionDropdownMenuItem
        title="Stop"
        icon={faStop}
        hidden={!showStop}
        onClick={stopExtension} />
      <ExtensionDropdownMenuItem
        title="Reactivate"
        icon={faPlay}
        hidden={!showReactivate}
        onClick={reactivateExtension} />
      <ExtensionDropdownMenuItem title="Preferences" icon={faGear} onClick={openPreferences} />
      <ExtensionDropdownMenuItem
        title="Change version"
        detail={hasOtherVersions ? '' : 'No other versions available'}
        icon={faCodeBranch}
        enabled={hasOtherVersions}
        onClick={handleChangeVersion} />
      <ExtensionDropdownMenuItem
        title={autoUpdateEnabled ? 'Disable automatic updates' : 'Enable automatic updates'}
        detail={autoUpdateDetail}
        icon={autoUpdateEnabled ? faToggleOn : faToggleOff}
        onClick={handleToggleAutoUpdate} />
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem title="Open repository" icon={faExternalLink} onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem title="Report a bug" icon={faBug} onClick={reportBug} />
      <ExtensionDropdownMenuItem
        title="Remove"
        detail={!isRemovable ? 'Built-in extension cannot be removed' : ''}
        icon={faTrash}
        enabled={isRemovable}
        onClick={removeExtension} />
    {:else}
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem title="Open repository" icon={faExternalLink} onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem title="Report a bug" icon={faBug} onClick={reportBug} />
    {/if}
  </ExtensionDropdownMenu>
</div>
