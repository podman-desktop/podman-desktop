<script lang="ts">
import {
  faBug,
  faCircleInfo,
  faExternalLink,
  faGear,
  faGraduationCap,
  faPlay,
  faStop,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { get } from 'svelte/store';
import { router } from 'tinro';

import { context } from '/@/stores/context';
import { onboardingList } from '/@/stores/onboarding';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { buildExtensionBugReportUrl } from './extension-badge-styles';
import {
  canToggleExtensionLifecycle,
  getExtensionLifecycleToggleLabel,
  isExtensionLifecycleEnabled,
} from './extension-lifecycle-toggle';
import { markExtensionUserDisabled, markExtensionUserEnabled } from './extension-lifecycle-user-toggle';
import { buildExtensionDetailsPath, type ExtensionListScreen } from './extension-list';
import {
  resolveCatalogExtensionOnboardingStatus,
  resolveOnboardingRouteExtensionId,
} from './extension-onboarding-utils';
import { isExtensionRemovableInUi } from './extension-origin-utils';
import {
  buildExtensionPreferencesRoute,
  getExtensionRemoveBlockedReasonShort,
  removeExtensionWithConfirmation,
} from './extension-remove-preference';
import ExtensionDropdownMenu from './ExtensionDropdownMenu.svelte';
import ExtensionDropdownMenuItem from './ExtensionDropdownMenuItem.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  returnScreen?: ExtensionListScreen;
  /** Hide "View more details" when the actions menu is rendered on the details page. */
  onDetailsPage?: boolean;
}

let { extension, returnScreen = 'catalog', onDetailsPage = false }: Props = $props();

const installedExtension = $derived(extension.installedExtension);

const onboardingStatus = $derived.by(() => {
  get(onboardingList);
  get(context);
  return resolveCatalogExtensionOnboardingStatus(extension);
});

const lifecycleToggleLabel = $derived(
  installedExtension ? getExtensionLifecycleToggleLabel(installedExtension.state) : 'Enable',
);
const canToggleLifecycle = $derived(!!installedExtension && canToggleExtensionLifecycle(installedExtension.state));
const lifecycleToggleIcon = $derived(
  installedExtension && isExtensionLifecycleEnabled(installedExtension.state) ? faStop : faPlay,
);

const isRemovable = $derived(
  !!installedExtension && isExtensionRemovableInUi(installedExtension, extension.fetchable === true),
);

function openDetails(event: Event): void {
  event.stopPropagation();
  router.goto(buildExtensionDetailsPath(extension.id, returnScreen));
}

function openOnboarding(event: Event): void {
  event.stopPropagation();
  if (!onboardingStatus.enabled) {
    return;
  }
  router.goto(`/preferences/onboarding/${resolveOnboardingRouteExtensionId(extension.id)}`);
}

function openPreferences(event: Event): void {
  event.stopPropagation();
  router.goto(buildExtensionPreferencesRoute(extension.id));
}

async function toggleExtensionLifecycle(event: Event): Promise<void> {
  event.stopPropagation();
  if (!installedExtension || !canToggleLifecycle) {
    return;
  }

  if (isExtensionLifecycleEnabled(installedExtension.state)) {
    await window.stopExtension(installedExtension.id);
    markExtensionUserDisabled(installedExtension.id);
    return;
  }

  await window.startExtension(installedExtension.id);
  markExtensionUserEnabled(installedExtension.id);
}

async function removeExtension(event: Event): Promise<void> {
  event.stopPropagation();
  removeExtensionWithConfirmation(extension);
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
        title={lifecycleToggleLabel}
        icon={lifecycleToggleIcon}
        enabled={canToggleLifecycle}
        onClick={toggleExtensionLifecycle} />
      <ExtensionDropdownMenuItem title="Preferences" icon={faGear} onClick={openPreferences} />
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem title="Open repository" icon={faExternalLink} onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem title="Report a bug" icon={faBug} onClick={reportBug} />
      <ExtensionDropdownMenuItem
        title="Uninstall"
        detail={isRemovable ? '' : (getExtensionRemoveBlockedReasonShort(extension) ?? 'Cannot be uninstalled')}
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
