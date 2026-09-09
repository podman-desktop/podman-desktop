<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

export let extension: { type: 'dd' | 'pd'; removable: boolean; devMode: boolean };
</script>

<div class="flex flex-row gap-1 items-center {$$props.class}" role="region" aria-label="Extension Badge">
  {#if extension.type === 'dd'}
    <Tooltip right tip="Docker Desktop extension">
      <Badge class="text-[8px] text-[var(--pd-badge-dd-extension-text)]" color="bg-[var(--pd-badge-dd-extension-bg)]" label="Docker Desktop extension" />
    </Tooltip>
  {:else if extension.devMode}
    <Tooltip right tip="In Development Mode Extension">
      <Badge class="text-[8px] text-[var(--pd-badge-text)]" color="bg-[var(--pd-badge-devmode-extension-bg)]" label="devMode Extension" />
    </Tooltip>
  {:else if !extension.removable}
    <Tooltip right tip="bundled Extension">
      <Badge class="text-[8px] text-[var(--pd-badge-text)]" color="bg-[var(--pd-badge-bundled-extension-bg)]" label="bundled Extension" />
    </Tooltip>
  {/if}
</div>
