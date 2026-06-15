<script lang="ts">
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import { confirmExtensionAutoUpdateChange } from '/@/lib/extensions/extension-auto-update-confirm';
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  applyExtensionVersionChange,
  getLatestAvailableVersion,
  getVersionChangeLinkLabel,
  normalizeVersionValue,
} from './extension-version-update.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  closeCallback: () => void;
  preferredVersion?: string;
  mode?: 'change' | 'install';
  onInstall?: (version: string, autoUpdate: boolean) => void;
}

let { extension, closeCallback, preferredVersion, mode = 'change', onInstall }: Props = $props();

const isInstallMode = $derived(mode === 'install');

let selectedVersion = $state<string | undefined>(undefined);
let autoUpdateEnabled = $state(false);

$effect.pre(() => {
  autoUpdateEnabled = isAutoUpdateEnabled(extension.id);

  if (isInstallMode) {
    const latest = getLatestAvailableVersion(extension);
    selectedVersion = latest || undefined;
    return;
  }

  const preferred = normalizeVersionValue(preferredVersion);
  const current = normalizeVersionValue(extension.installedVersion ?? extension.fetchVersion);
  selectedVersion = preferred && preferred !== current ? preferred : undefined;
});

const versionOptions = $derived.by((): CatalogExtensionVersionUI[] => {
  if (extension.availableVersions.length > 0) {
    return extension.availableVersions;
  }

  const fetchVersion = normalizeVersionValue(extension.fetchVersion);
  if (!fetchVersion) {
    return [];
  }

  return [
    {
      version: fetchVersion,
      ociUri: extension.fetchLink,
      preview: false,
    },
  ];
});

const sortedVersions = $derived(
  [...versionOptions].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true })),
);

const latestVersion = $derived(getLatestAvailableVersion(extension));

const dialogTitle = $derived(
  isInstallMode ? `Install ${extension.displayName}` : `Change version for ${extension.displayName}`,
);

function getCurrentVersion(): string | undefined {
  return normalizeVersionValue(extension.installedVersion ?? extension.fetchVersion);
}

function isCurrentVersion(version: string): boolean {
  const current = getCurrentVersion();
  return current !== undefined && normalizeVersionValue(version) === current;
}

function isUpgrade(version: string): boolean {
  const current = getCurrentVersion();
  if (!current) {
    return false;
  }
  return normalizeVersionValue(version).localeCompare(current, undefined, { numeric: true }) > 0;
}

function isHighlighted(version: CatalogExtensionVersionUI): boolean {
  const normalized = normalizeVersionValue(version.version);
  if (selectedVersion !== undefined) {
    return normalized === selectedVersion;
  }
  return isCurrentVersion(normalized);
}

const hasSelectedChange = $derived(selectedVersion !== undefined && !isCurrentVersion(selectedVersion));

const primaryButtonLabel = $derived.by(() => {
  if (isInstallMode) {
    return selectedVersion ? `Install v${selectedVersion}` : 'Install';
  }
  if (hasSelectedChange && selectedVersion) {
    return getVersionChangeLinkLabel(extension.installedVersion, selectedVersion);
  }
  return 'Change';
});

const primaryButtonEnabled = $derived(isInstallMode ? !!selectedVersion : hasSelectedChange);

function selectVersion(version: CatalogExtensionVersionUI): void {
  const normalized = normalizeVersionValue(version.version);
  if (isInstallMode) {
    selectedVersion = normalized;
    return;
  }

  if (isCurrentVersion(normalized)) {
    selectedVersion = undefined;
    return;
  }
  selectedVersion = normalized;
}

function applyPrimaryAction(): void {
  if (!selectedVersion) {
    return;
  }

  if (isInstallMode) {
    onInstall?.(selectedVersion, autoUpdateEnabled);
    closeCallback();
    return;
  }

  if (!hasSelectedChange) {
    return;
  }

  applyExtensionVersionChange(extension, selectedVersion, autoUpdateEnabled);
  closeCallback();
}

async function handleAutoUpdateToggle(checked: boolean): Promise<void> {
  if (checked === autoUpdateEnabled) {
    return;
  }

  const confirmed = await confirmExtensionAutoUpdateChange(extension, checked);
  if (!confirmed) {
    return;
  }

  autoUpdateEnabled = checked;
  setAutoUpdateEnabled(extension.id, checked);
}
</script>

<Dialog
  title={dialogTitle}
  onclose={closeCallback}
  contentClass="relative overflow-hidden text-[var(--pd-modal-text)] px-10 py-4">
  {#snippet content()}
    <div class="flex flex-col gap-4 min-w-[420px]">
      {#if !isInstallMode}
        <div class="shrink-0">
          <div class="text-sm text-[var(--pd-content-text)] mb-1">Currently installed</div>
          <div class="font-medium">v{extension.installedVersion ?? 'Not installed'}</div>
        </div>
      {/if}

      <div class="flex min-h-0 flex-col gap-2">
        <label class="shrink-0 text-sm text-[var(--pd-content-text)]" for="version-select">Available versions</label>
        <div
          id="version-select"
          class="flex h-52 flex-col gap-1 overflow-y-auto border border-[var(--pd-content-divider)] rounded-md">
          {#each sortedVersions as version (version.version)}
            <button
              type="button"
              class="flex shrink-0 items-center justify-between px-3 py-2 text-left hover:bg-[var(--pd-content-card-bg)] {isHighlighted(version)
                ? 'bg-[var(--pd-content-card-bg)] border-l-2 border-[var(--pd-content-card-border-selected)]'
                : ''}"
              onclick={(): void => selectVersion(version)}>
              <span class="font-medium">v{version.version}</span>
              <span class="inline-flex items-center gap-1 text-xs text-[var(--pd-content-text)]">
                {#if isInstallMode}
                  {#if normalizeVersionValue(version.version) === latestVersion}
                    Latest
                  {/if}
                {:else if isCurrentVersion(version.version)}
                  Current
                {:else if isUpgrade(version.version)}
                  <Icon icon={faArrowUp} size="sm" /> Upgrade
                {:else}
                  <Icon icon={faArrowDown} size="sm" /> Downgrade
                {/if}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <div class="shrink-0">
        <SlideToggle
          id="auto-update-{extension.id}"
          checked={autoUpdateEnabled}
          on:checked={(event): void => handleAutoUpdateToggle(event.detail)}
          aria-label="Enable automatic updates for {extension.displayName}">
          Enable automatic updates for this extension
        </SlideToggle>
      </div>
    </div>
  {/snippet}

  {#snippet buttons()}
    <Button type="secondary" on:click={closeCallback}>Cancel</Button>
    <Button type="primary" disabled={!primaryButtonEnabled} on:click={applyPrimaryAction}>
      {primaryButtonLabel}
    </Button>
  {/snippet}
</Dialog>
