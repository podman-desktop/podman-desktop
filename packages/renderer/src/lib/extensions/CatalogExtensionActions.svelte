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
import { context } from '/@/stores/context';
import { onboardingList } from '/@/stores/onboarding';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { buildExtensionBugReportUrl } from './extension-badge-styles';
import { isAutoUpdateEnabled, toggleAutoUpdate } from './extension-catalog-settings.svelte';
import { buildExtensionDetailsPath, type ExtensionListScreen } from './extension-list';
import { type ExtensionOnboardingStatus, resolveExtensionOnboardingStatus } from './extension-onboarding-utils';
import ExtensionDropdownMenu from './ExtensionDropdownMenu.svelte';
import ExtensionDropdownMenuItem from './ExtensionDropdownMenuItem.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  returnScreen?: ExtensionListScreen;
  onChangeVersion: () => void;
}

let { extension, returnScreen = 'catalog', onChangeVersion }: Props = $props();

const autoUpdateEnabled = $derived(isAutoUpdateEnabled(extension.id));
const installedExtension = $derived(extension.installedExtension);

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
  if (!installedExtension) {
    return;
  }
  withConfirmation(
    async () => {
      if (installedExtension.type === 'dd') {
        await window.ddExtensionDelete(installedExtension.id);
      } else {
        await window.removeExtension(installedExtension.id);
      }
    },
    `remove ${extension.displayName}`,
    { title: 'Remove extension?', variant: 'delete', buttonLabel: 'Remove' },
  );
}

function handleToggleAutoUpdate(event: Event): void {
  event.stopPropagation();
  toggleAutoUpdate(extension.id);
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
  onChangeVersion();
}
</script>

<div onclick={(event): void => event.stopPropagation()} role="presentation">
  <ExtensionDropdownMenu menuId={extension.id} title="{extension.displayName} actions">
    <ExtensionDropdownMenuItem title="View more details" icon={faCircleInfo} onClick={openDetails} />
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
      <ExtensionDropdownMenuItem title="Change version" icon={faCodeBranch} onClick={handleChangeVersion} />
      <ExtensionDropdownMenuItem
        title={autoUpdateEnabled ? 'Disable automatic updates' : 'Enable automatic updates'}
        icon={autoUpdateEnabled ? faToggleOn : faToggleOff}
        onClick={handleToggleAutoUpdate} />
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem title="Open repository" icon={faExternalLink} onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem title="Report a bug" icon={faBug} onClick={reportBug} />
      {#if extension.installedExtension?.removable !== false}
        <ExtensionDropdownMenuItem title="Remove" icon={faTrash} onClick={removeExtension} />
      {/if}
    {:else}
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem title="Open repository" icon={faExternalLink} onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem title="Report a bug" icon={faBug} onClick={reportBug} />
    {/if}
  </ExtensionDropdownMenu>
</div>
