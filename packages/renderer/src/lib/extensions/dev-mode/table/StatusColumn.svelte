<script lang="ts">
import { onMount } from 'svelte';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { getExtensionEffectiveLifecycleState } from '/@/lib/extensions/extension-effective-lifecycle-state';
import { EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT } from '/@/lib/extensions/extension-lifecycle-user-toggle';
import { prototypeLifecycleOverlayRevisionStore } from '/@/lib/extensions/extension-prototype-lifecycle-overlay.svelte';
import ExtensionLifecycleStatus from '/@/lib/extensions/ExtensionLifecycleStatus.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

interface Props {
  object: SelectableExtensionDevelopmentFolderInfoUI;
}

let { object }: Props = $props();

/** Local bump so Status updates even when the Table row object identity is stale. */
let localRevision = $state(0);

onMount(() => {
  const handleLifecycleToggle = (): void => {
    localRevision += 1;
  };
  window.addEventListener(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT, handleLifecycleToggle);
  return (): void => {
    window.removeEventListener(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT, handleLifecycleToggle);
  };
});

const displayExtension = $derived.by((): CombinedExtensionInfoUI | undefined => {
  // Same overlay source Catalog uses for Enabling / Disabling labels.
  $prototypeLifecycleOverlayRevisionStore;
  localRevision;

  const base = object.installedExtension;
  const extensionId = base?.id ?? object.extension?.id;
  const baseState = base?.state ?? object.extension?.state;
  if (!extensionId || !baseState) {
    return undefined;
  }

  const state = getExtensionEffectiveLifecycleState(extensionId, baseState);
  if (base) {
    return state === base.state ? base : { ...base, state, error: undefined };
  }

  return {
    id: extensionId,
    name: object.extension?.name ?? extensionId,
    displayName: object.extension?.name ?? extensionId,
    description: '',
    publisher: '',
    state,
    version: '',
    path: object.path,
    removable: false,
    devMode: true,
    type: 'pd',
    readme: '',
  };
});

const statusKey = $derived(`${displayExtension?.id ?? ''}:${displayExtension?.state ?? 'none'}:${localRevision}`);
</script>

<div class="py-1 min-w-0">
  {#if displayExtension}
    {#key statusKey}
      <ExtensionLifecycleStatus extension={displayExtension} />
    {/key}
  {:else}
    <span class="text-[var(--pd-table-body-text)]">Not loaded</span>
  {/if}
</div>
