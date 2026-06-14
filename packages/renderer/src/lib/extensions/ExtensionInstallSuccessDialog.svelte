<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import Dialog from '/@/lib/dialogs/Dialog.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { clearNewBadge } from './extension-catalog-settings.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  installedVersion: string;
  closeCallback: () => void;
}

let { extension, installedVersion, closeCallback }: Props = $props();

function openExtensionDetails(): void {
  closeCallback();
  router.goto(`/extensions/details/${extension.id}/`);
}

function openOnboarding(): void {
  closeCallback();
  router.goto(`/preferences/onboarding/${extension.id}`);
}

function openPreferences(): void {
  closeCallback();
  router.goto(`/preferences/default/preferences.${extension.id}`);
}

function dismissNewBadge(): void {
  clearNewBadge(extension.id);
}
</script>

<Dialog title="Extension installed" onclose={closeCallback}>
  {#snippet content()}
    <div class="flex flex-col gap-4 min-w-[420px]">
      <p class="text-[var(--pd-content-text)]">
        <span class="font-semibold text-[var(--pd-content-header)]">{extension.displayName}</span>
        version {installedVersion} was installed successfully.
      </p>

      <div class="rounded-md bg-[var(--pd-content-card-bg)] p-3 text-sm text-[var(--pd-content-text)]">
        <div class="font-medium text-[var(--pd-content-header)] mb-2">Next steps</div>
        <ul class="list-disc pl-5 space-y-1">
          <li>Open extension details to review capabilities and documentation.</li>
          <li>Complete onboarding if the extension provides a getting started guide.</li>
          <li>Configure preferences before first use.</li>
        </ul>
      </div>
    </div>
  {/snippet}

  {#snippet buttons()}
    <Button
      type="secondary"
      on:click={(): void => {
        dismissNewBadge();
        closeCallback();
      }}>Dismiss</Button>
    <Button type="secondary" on:click={openPreferences}>View settings</Button>
    <Button type="secondary" on:click={openOnboarding}>Get started</Button>
    <Button
      type="primary"
      on:click={(): void => {
        dismissNewBadge();
        openExtensionDetails();
      }}>Open extension</Button>
  {/snippet}
</Dialog>
