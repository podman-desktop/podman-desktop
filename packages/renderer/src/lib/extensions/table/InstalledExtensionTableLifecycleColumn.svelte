<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import { getExtensionLifecyclePresentation } from '/@/lib/extensions/extension-lifecycle-status';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import StatusDotIcon from '/@/lib/ui/StatusDotIcon.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();

const presentation = $derived(getExtensionLifecyclePresentation(object.extension.state, object.extension.type));

const failureReason = $derived(object.extension.error?.message ?? 'Unknown error');
const showFailureTooltip = $derived(object.extension.state === 'failed' && !!object.extension.error?.message);
</script>

{#if showFailureTooltip}
  <Tooltip top tip={failureReason}>
    <div class="flex items-center gap-1.5 py-1 cursor-help min-w-0">
      <StatusDotIcon status={presentation.statusDotStatus} size="12" />
      <span class="text-sm truncate" style:color={presentation.textColorVar}>{presentation.label}</span>
    </div>
  </Tooltip>
{:else}
  <div class="flex items-center gap-1.5 py-1">
    <StatusDotIcon status={presentation.statusDotStatus} size="12" />
    <span class="text-sm" style:color={presentation.textColorVar}>{presentation.label}</span>
  </div>
{/if}
