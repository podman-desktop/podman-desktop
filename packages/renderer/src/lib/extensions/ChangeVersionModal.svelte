<script lang="ts">
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import { confirmExtensionAutoUpdateChange } from '/@/lib/extensions/extension-auto-update-confirm';
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';

import type { CatalogExtensionInfoUI, CatalogExtensionVersionUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { applyExtensionVersionChange, normalizeVersionValue } from './extension-version-update.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  closeCallback: () => void;
  preferredVersion?: string;
}

let { extension, closeCallback, preferredVersion }: Props = $props();

let selectedVersion = $state<string | undefined>(undefined);
let autoUpdateEnabled = $state(false);

$effect.pre(() => {
  const preferred = normalizeVersionValue(preferredVersion);
  const current = normalizeVersionValue(extension.installedVersion ?? extension.fetchVersion);
  selectedVersion = preferred && preferred !== current ? preferred : undefined;
  autoUpdateEnabled = isAutoUpdateEnabled(extension.id);
});

const sortedVersions = $derived(
  [...extension.availableVersions].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true })),
);

const dialogTitle = $derived(`Change version for ${extension.displayName}`);

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

const changeButtonLabel = $derived(hasSelectedChange && selectedVersion ? `Change to v${selectedVersion}` : 'Change');

function selectVersion(version: CatalogExtensionVersionUI): void {
  const normalized = normalizeVersionValue(version.version);
  if (isCurrentVersion(normalized)) {
    selectedVersion = undefined;
    return;
  }
  selectedVersion = normalized;
}

function applyVersionChange(): void {
  if (!hasSelectedChange || !selectedVersion) {
    return;
  }

  applyExtensionVersionChange(extension, selectedVersion, autoUpdateEnabled).catch(console.error);
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

<Dialog title={dialogTitle} onclose={closeCallback}>
  {#snippet content()}
    <div class="flex flex-col gap-4 min-w-[420px]">
      <div>
        <div class="text-sm text-[var(--pd-content-text)] mb-1">Currently installed</div>
        <div class="font-medium">v{extension.installedVersion ?? 'Not installed'}</div>
      </div>

      <div>
        <label class="text-sm text-[var(--pd-content-text)] mb-2 block" for="version-select">Available versions</label>
        <div id="version-select" class="flex flex-col gap-1 max-h-48 overflow-y-auto border border-[var(--pd-content-divider)] rounded-md">
          {#each sortedVersions as version (version.version)}
            <button
              type="button"
              class="flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--pd-content-card-bg)] {isHighlighted(version)
                ? 'bg-[var(--pd-content-card-bg)] border-l-2 border-[var(--pd-content-card-border-selected)]'
                : ''}"
              onclick={(): void => selectVersion(version)}>
              <span class="font-medium">v{version.version}</span>
              <span class="inline-flex items-center gap-1 text-xs text-[var(--pd-content-text)]">
                {#if isCurrentVersion(version.version)}
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

      <SlideToggle
        id="auto-update-{extension.id}"
        checked={autoUpdateEnabled}
        on:checked={(event): void => handleAutoUpdateToggle(event.detail)}
        aria-label="Enable automatic updates for {extension.displayName}">
        Enable automatic updates for this extension
      </SlideToggle>
    </div>
  {/snippet}

  {#snippet buttons()}
    <Button type="secondary" on:click={closeCallback}>Cancel</Button>
    <Button type="primary" disabled={!hasSelectedChange} on:click={applyVersionChange}>
      {changeButtonLabel}
    </Button>
  {/snippet}
</Dialog>
