<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import { isBuiltInExtension } from './extension-origin-utils';

interface Props {
  extension: CatalogExtensionInfoUI;
  /** When false, hides the Update chip (cards show update in the version row). */
  showUpdateChip?: boolean;
  /** When true, prevents wrapping (for table layout). */
  nowrap?: boolean;
  class?: string;
}

let { extension, showUpdateChip = true, nowrap = false, class: className = '' }: Props = $props();

const installed = $derived(extension.installedExtension);
const showUpdate = $derived(extensionRequiresManualUpdate(extension));
</script>

<div
  class="m-0 p-0 {nowrap
    ? 'inline-flex flex-nowrap items-center gap-x-2'
    : 'flex flex-wrap items-center gap-x-2 gap-y-1'} {className}">
  {#if showUpdateChip && showUpdate}
    <Badge
      label="Update"
      color=""
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
  {#if installed?.type === 'dd'}
    <Badge
      label="Docker Desktop extension"
      color=""
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
  {:else if installed?.devMode}
    <Badge
      label="DevMode extension"
      color=""
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {:else if installed && isBuiltInExtension(installed)}
    <Badge
      label={EXTENSION_BUILTIN_CHIP_LABEL}
      color=""
      class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_CHIP_TEXT_CLASS}`} />
  {/if}
</div>
