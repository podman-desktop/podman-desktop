<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';

import { extensionRequiresManualUpdate } from '/@/lib/extensions/extension-onboarding-utils';
import ExtensionVersionUpdateStatus from '/@/lib/extensions/ExtensionVersionUpdateStatus.svelte';
import { installedTableCallbacks } from '/@/lib/extensions/installed-extension-table-context';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const showUpdate = $derived(extensionRequiresManualUpdate(object.catalogExtension));

const installedVersionLabel = $derived(object.extension.version ? `v${object.extension.version}` : 'N/A');

const targetVersion = $derived(object.catalogExtension.fetchVersion);

function handleUpdate(): void {
  if (targetVersion) {
    installedTableCallbacks.onChangeVersion(object.catalogExtension, targetVersion);
    return;
  }
  installedTableCallbacks.onChangeVersion(object.catalogExtension);
}
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-1 py-1 text-sm text-[var(--pd-content-text)]">
  <span>{installedVersionLabel}</span>
  {#if showUpdate && targetVersion}
    <Link class="inline-flex shrink-0" aria-label="Update to v{targetVersion}" on:click={handleUpdate}>
      Update to v{targetVersion}
    </Link>
  {/if}
  <ExtensionVersionUpdateStatus extensionId={object.extension.id} />
</div>
