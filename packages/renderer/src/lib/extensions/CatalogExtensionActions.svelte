<script lang="ts">
import {
  faBug,
  faCircleInfo,
  faCodeBranch,
  faExternalLink,
  faGear,
  faGraduationCap,
  faToggleOff,
  faToggleOn,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';

import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { context } from '/@/stores/context';
import { extensionInfos } from '/@/stores/extensions';
import { onboardingList } from '/@/stores/onboarding';
import { webviews } from '/@/stores/webviews';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { buildExtensionBugReportUrl } from './extension-badge-styles';
import { extensionInstallInProgressIds, isExtensionInstallInProgress } from './extension-install-progress.svelte';
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
  getPrototypeTransientLifecycleState,
  prototypeLifecycleOverlayRevisionStore,
} from './extension-prototype-lifecycle-overlay.svelte';
import {
  buildExtensionPreferencesRoute,
  getExtensionRemoveBlockedReasonShort,
  removeExtensionWithConfirmation,
} from './extension-remove-preference';
import { resolveExtensionRuntimeId, toCatalogIdentities } from './extension-runtime-id';
import { extensionHasVersionChoices, shouldShowExtensionVersionPreference } from './extension-version-preference';
import ExtensionDropdownMenu from './ExtensionDropdownMenu.svelte';
import ExtensionDropdownMenuItem from './ExtensionDropdownMenuItem.svelte';
import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

interface Props {
  extension: CatalogExtensionInfoUI;
  returnScreen?: ExtensionListScreen;
  onChangeVersion?: () => void;
  /** Hide "View more details" when the actions menu is rendered on the details page. */
  onDetailsPage?: boolean;
}

let { extension, returnScreen = 'catalog', onChangeVersion, onDetailsPage = false }: Props = $props();

const installedExtension = $derived(extension.installedExtension);
const suggestionScope = $derived(areExtensionsImprovementsSuggested());
const actionsLocked = $derived(isExtensionInstallInProgress(extension.id, $extensionInstallInProgressIds));

const onboardingStatus = $derived.by(() => {
  get(onboardingList);
  get(context);
  return resolveCatalogExtensionOnboardingStatus(extension);
});

let lifecycleToggleInProgress = $state(false);

const lifecycleToggleLabel = $derived(
  installedExtension ? getExtensionLifecycleToggleLabel(installedExtension.state) : 'Enable',
);
const lifecycleInFlight = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  if (lifecycleToggleInProgress) {
    return true;
  }
  const state = installedExtension?.state;
  if (state === 'starting' || state === 'stopping') {
    return true;
  }
  if (!installedExtension) {
    return false;
  }
  const transient = getPrototypeTransientLifecycleState(installedExtension.id);
  return transient === 'starting' || transient === 'stopping';
});
const canToggleLifecycle = $derived(
  !!installedExtension && canToggleExtensionLifecycle(installedExtension.state) && !actionsLocked && !lifecycleInFlight,
);
const lifecycleToggleIcon = $derived(
  installedExtension && isExtensionLifecycleEnabled(installedExtension.state) ? faToggleOn : faToggleOff,
);

const canUninstall = $derived(
  !!installedExtension && isExtensionRemovableInUi(installedExtension, extension.fetchable === true),
);
const isRemovable = $derived(canUninstall && !actionsLocked);

const showChangeVersion = $derived(
  !!extension.isInstalled && shouldShowExtensionVersionPreference(extension) && !!onChangeVersion,
);

const hasOtherVersions = $derived(extensionHasVersionChoices(extension));

const showPrimaryLifecycle = $derived(suggestionScope && !!extension.isInstalled && !!installedExtension);
const showPrimaryUninstall = $derived(suggestionScope && !!extension.isInstalled && !!installedExtension);
/** Hover tip: "Uninstall" when available; built-in / blocked copy otherwise. */
const uninstallTooltip = $derived(
  canUninstall ? 'Uninstall' : (getExtensionRemoveBlockedReasonShort(extension) ?? 'Cannot be uninstalled'),
);
const menuTooltip = $derived(actionsLocked ? 'Actions unavailable while installing' : 'More actions');

function openDetails(event: Event): void {
  event.stopPropagation();
  if (actionsLocked) {
    return;
  }
  router.goto(buildExtensionDetailsPath(extension.id, returnScreen));
}

function openOnboarding(event: Event): void {
  event.stopPropagation();
  if (actionsLocked || !onboardingStatus.enabled) {
    return;
  }
  router.goto(`/preferences/onboarding/${resolveOnboardingRouteExtensionId(extension.id)}`);
}

function openPreferences(event: Event): void {
  event.stopPropagation();
  if (actionsLocked) {
    return;
  }
  router.goto(buildExtensionPreferencesRoute(extension.id));
}

async function toggleExtensionLifecycle(event?: Event): Promise<void> {
  event?.stopPropagation();
  if (!installedExtension || !canToggleLifecycle || actionsLocked || lifecycleToggleInProgress) {
    return;
  }

  lifecycleToggleInProgress = true;
  try {
    const runtimeExtensionId = resolveExtensionRuntimeId(
      installedExtension,
      $extensionInfos,
      $webviews,
      toCatalogIdentities($catalogExtensionInfos),
    );

    if (isExtensionLifecycleEnabled(installedExtension.state)) {
      await window.stopExtension(runtimeExtensionId);
      markExtensionUserDisabled(runtimeExtensionId);
      return;
    }

    await window.startExtension(runtimeExtensionId);
    markExtensionUserEnabled(runtimeExtensionId);
  } finally {
    lifecycleToggleInProgress = false;
  }
}

async function removeExtension(event?: Event): Promise<void> {
  event?.stopPropagation();
  if (actionsLocked || !isRemovable) {
    return;
  }
  removeExtensionWithConfirmation(extension);
}

async function reportBug(event: Event): Promise<void> {
  event.stopPropagation();
  if (actionsLocked) {
    return;
  }
  await window.openExternal(buildExtensionBugReportUrl(extension.repositoryUrl));
}

async function openRepository(event: Event): Promise<void> {
  event.stopPropagation();
  if (actionsLocked) {
    return;
  }
  if (extension.repositoryUrl) {
    await window.openExternal(extension.repositoryUrl);
  }
}

function handleChangeVersion(event: Event): void {
  event.stopPropagation();
  if (actionsLocked || !onChangeVersion) {
    return;
  }
  onChangeVersion();
}
</script>

<div class="flex items-center justify-end gap-0.5" onclick={(event): void => event.stopPropagation()} role="presentation">
  {#if showPrimaryLifecycle}
    <Tooltip top tip={lifecycleInFlight ? `${lifecycleToggleLabel} in progress` : lifecycleToggleLabel}>
      <span class="inline-flex {canToggleLifecycle ? '' : '[&_button]:pointer-events-none'}">
        <ListItemButtonIcon
          title={lifecycleToggleLabel}
          icon={lifecycleToggleIcon}
          enabled={canToggleLifecycle}
          inProgress={lifecycleInFlight}
          onClick={(): void => {
            toggleExtensionLifecycle().catch((error: unknown) => {
              console.error(error);
            });
          }} />
      </span>
    </Tooltip>
  {/if}
  {#if showPrimaryUninstall}
    <!-- Wrapper keeps hover/tooltip working when the trash button is disabled (e.g. built-in). -->
    <Tooltip top tip={uninstallTooltip}>
      <span class="inline-flex {isRemovable ? '' : '[&_button]:pointer-events-none'}">
        <ListItemButtonIcon
          title={uninstallTooltip}
          icon={faTrash}
          enabled={isRemovable}
          onClick={(): void => {
            removeExtension().catch((error: unknown) => {
              console.error(error);
            });
          }} />
      </span>
    </Tooltip>
  {/if}
  <Tooltip top tip={menuTooltip}>
    <ExtensionDropdownMenu menuId={extension.id} title={menuTooltip} disabled={actionsLocked}>
    <ExtensionDropdownMenuItem
      title="View more details"
      icon={faCircleInfo}
      hidden={onDetailsPage}
      enabled={!actionsLocked}
      onClick={openDetails} />
    {#if extension.isInstalled}
      <ExtensionDropdownMenuItem
        title="Onboarding"
        detail={onboardingStatus.enabled ? '' : onboardingStatus.detail}
        icon={faGraduationCap}
        enabled={onboardingStatus.enabled && !actionsLocked}
        onClick={openOnboarding} />
      {#if !suggestionScope}
        <ExtensionDropdownMenuItem
          title={lifecycleToggleLabel}
          icon={lifecycleToggleIcon}
          enabled={canToggleLifecycle}
          onClick={toggleExtensionLifecycle} />
      {/if}
      {#if showChangeVersion}
        <ExtensionDropdownMenuItem
          title="Change version"
          detail={hasOtherVersions ? '' : 'No other versions available'}
          icon={faCodeBranch}
          enabled={!actionsLocked}
          onClick={handleChangeVersion} />
      {/if}
      <ExtensionDropdownMenuItem
        title="Preferences"
        icon={faGear}
        enabled={!actionsLocked}
        onClick={openPreferences} />
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem
          title="Open repository"
          icon={faExternalLink}
          enabled={!actionsLocked}
          onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem
        title="Report a bug"
        icon={faBug}
        enabled={!actionsLocked}
        onClick={reportBug} />
      {#if !suggestionScope}
        <ExtensionDropdownMenuItem
          title="Uninstall"
          detail={canUninstall ? '' : (getExtensionRemoveBlockedReasonShort(extension) ?? 'Cannot be uninstalled')}
          icon={faTrash}
          enabled={isRemovable}
          onClick={removeExtension} />
      {/if}
    {:else}
      {#if extension.repositoryUrl}
        <ExtensionDropdownMenuItem
          title="Open repository"
          icon={faExternalLink}
          enabled={!actionsLocked}
          onClick={openRepository} />
      {/if}
      <ExtensionDropdownMenuItem
        title="Report a bug"
        icon={faBug}
        enabled={!actionsLocked}
        onClick={reportBug} />
    {/if}
  </ExtensionDropdownMenu>
  </Tooltip>
</div>
