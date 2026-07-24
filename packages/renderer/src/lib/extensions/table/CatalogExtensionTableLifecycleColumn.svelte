<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import ExtensionLifecycleStatus from '/@/lib/extensions/ExtensionLifecycleStatus.svelte';

interface Props {
  object: CatalogExtensionInfoUI;
}

let { object }: Props = $props();
</script>

<div class="py-1">
  {#if object.isInstalled && object.installedExtension}
    <ExtensionLifecycleStatus extension={object.installedExtension} catalogExtension={object} />
  {:else}
    <span class="text-sm text-[var(--pd-content-text)]">—</span>
  {/if}
</div>
