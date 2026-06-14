<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  closeCallback: () => void;
}

let { extension, closeCallback }: Props = $props();

let selectedVersion = $state('');
let autoUpdateEnabled = $state(false);

$effect.pre(() => {
  selectedVersion = extension.installedVersion ?? extension.fetchVersion;
  autoUpdateEnabled = isAutoUpdateEnabled(extension.id);
});
let changeInProgress = $state(false);
let statusMessage = $state('');
let errorMessage = $state('');

const sortedVersions = $derived(
  [...extension.availableVersions].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true })),
);

function isCurrentVersion(version: string): boolean {
  return version === (extension.installedVersion ?? extension.fetchVersion);
}

async function applyVersionChange(): Promise<void> {
  if (isCurrentVersion(selectedVersion)) {
    closeCallback();
    return;
  }

  const target = extension.availableVersions.find(version => version.version === selectedVersion);
  if (!target?.ociUri) {
    errorMessage = 'Selected version is not available for installation.';
    return;
  }

  changeInProgress = true;
  errorMessage = '';
  statusMessage = 'Version update...';

  try {
    await window.extensionInstallFromImage(
      target.ociUri,
      () => {
        statusMessage = 'Version update...';
      },
      (error: string) => {
        errorMessage = error;
        statusMessage = '';
      },
      extension.id,
    );

    setAutoUpdateEnabled(extension.id, autoUpdateEnabled);
    closeCallback();
  } catch (error) {
    errorMessage = String(error);
    statusMessage = '';
  } finally {
    changeInProgress = false;
  }
}

function handleAutoUpdateToggle(checked: boolean): void {
  autoUpdateEnabled = checked;
  setAutoUpdateEnabled(extension.id, checked);
}
</script>

<Dialog title="Change version" onclose={closeCallback}>
  {#snippet content()}
    <div class="flex flex-col gap-4 min-w-[420px]">
      <div>
        <div class="text-sm text-[var(--pd-content-text)]">Extension</div>
        <div class="font-semibold text-[var(--pd-content-header)]">{extension.displayName}</div>
      </div>

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
              disabled={changeInProgress}
              class="flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--pd-content-card-bg)] disabled:opacity-60 {selectedVersion === version.version
                ? 'bg-[var(--pd-content-card-bg)] border-l-2 border-[var(--pd-content-card-border-selected)]'
                : ''}"
              onclick={(): void => {
                selectedVersion = version.version;
              }}>
              <span class="font-medium">v{version.version}</span>
              {#if isCurrentVersion(version.version)}
                <span class="text-xs text-[var(--pd-content-text)]">Current</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <SlideToggle
        id="auto-update-{extension.id}"
        checked={autoUpdateEnabled}
        disabled={changeInProgress}
        on:checked={(event): void => handleAutoUpdateToggle(event.detail)}
        aria-label="Enable automatic updates for {extension.displayName}">
        Enable automatic updates for this extension
      </SlideToggle>

      {#if statusMessage}
        <div class="text-sm text-[var(--pd-content-text)]">{statusMessage}</div>
      {/if}

      {#if errorMessage}
        <div class="text-sm text-[var(--pd-status-error)]" role="alert">{errorMessage}</div>
      {/if}
    </div>
  {/snippet}

  {#snippet buttons()}
    <Button type="secondary" disabled={changeInProgress} on:click={closeCallback}>Cancel</Button>
    <Button
      type="primary"
      inProgress={changeInProgress}
      disabled={isCurrentVersion(selectedVersion) || changeInProgress}
      on:click={applyVersionChange}>
      Change v{selectedVersion}
    </Button>
  {/snippet}
</Dialog>
