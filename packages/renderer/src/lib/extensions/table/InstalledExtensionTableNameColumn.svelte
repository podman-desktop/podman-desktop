<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import { isNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionDetailsLink from '/@/lib/extensions/ExtensionDetailsLink.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="flex flex-col gap-1 min-w-0 py-1 pr-6">
  <div class="flex flex-wrap items-center gap-2">
    <ExtensionDetailsLink
      displayIcon={false}
      class="text-[color:var(--pd-card-header-text)] font-semibold break-words"
      extension={object.extension} />
    {#if isNewlyInstalled(object.catalogExtension.id)}
      <span class="rounded bg-[var(--pd-badge-purple)] px-2 py-0.5 text-xs text-[var(--pd-card-header-text)]">New</span>
    {/if}
  </div>
  {#if object.extension.description}
    <Tooltip top tip={object.extension.description} containerClass="relative block min-w-0 w-full">
      <span class="block truncate text-sm text-[var(--pd-content-text)] min-w-0">
        {object.extension.description}
      </span>
    </Tooltip>
  {/if}
</div>
