<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';

import { extensionHasVersionUpdate } from '/@/lib/extensions/extension-onboarding-utils';
import { installedTableCallbacks } from '/@/lib/extensions/installed-extension-table-context';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const showUpdate = $derived(
  extensionHasVersionUpdate(
    true,
    object.catalogExtension.installedVersion ?? object.extension.version,
    object.catalogExtension.fetchVersion,
    object.catalogExtension.hasUpdate,
  ),
);

const installedVersionLabel = $derived(object.extension.version ? `v${object.extension.version}` : 'N/A');

const targetVersion = $derived(object.catalogExtension.fetchVersion);

function handleUpdate(): void {
  installedTableCallbacks.onChangeVersion(object.catalogExtension);
}
</script>

<div class="flex flex-col gap-1 py-1 text-sm text-[var(--pd-content-text)]">
  <span>{installedVersionLabel}</span>
  {#if showUpdate && targetVersion}
    <Link aria-label="Update to v{targetVersion}" on:click={handleUpdate}>
      Update to v{targetVersion}
    </Link>
  {/if}
</div>
