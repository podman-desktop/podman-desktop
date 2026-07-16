<script lang="ts">
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { extensionTableViewport } from '/@/lib/extensions/extension-table-columns.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  object: SelectableExtensionDevelopmentFolderInfoUI;
}

let { object }: Props = $props();

const location = $derived(object.path);
const compactName = $derived(extensionTableViewport.hideOrigin);
let copied = $state(false);
let copiedResetHandle: ReturnType<typeof setTimeout> | undefined;

async function copyLocation(): Promise<void> {
  await window.clipboardWriteText(location);
  copied = true;
  if (copiedResetHandle) {
    clearTimeout(copiedResetHandle);
  }
  copiedResetHandle = setTimeout(() => {
    copied = false;
    copiedResetHandle = undefined;
  }, 1500);
}
</script>

{#snippet copiedTip()}
  <span class="inline-flex items-center gap-1.5 whitespace-nowrap" aria-label="Copied">
    <Fa icon={faCheck} size="xs" class="shrink-0" />
    <span>Copied</span>
  </span>
{/snippet}

<div class="flex min-w-0 max-w-full items-center gap-1 {compactName ? 'pr-1' : 'pr-2'}">
  <!-- Truncate from the end so the path beginning stays visible; copy keeps the full location. -->
  <span
    class="min-w-0 flex-1 truncate text-left text-[var(--pd-table-body-text)]"
    title={location}
    dir="ltr">{location}</span>
  <Tooltip top tip={copied ? undefined : 'Copy location'} tipSnippet={copied ? copiedTip : undefined}>
    <span class="inline-flex shrink-0">
      <ListItemButtonIcon title={copied ? 'Copied' : 'Copy location'} icon={faCopy} onClick={copyLocation} />
    </span>
  </Tooltip>
</div>
