<script lang="ts">
import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';
import { isNewBadgeActive } from './extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import { isBuiltInExtension } from './extension-origin-utils';
import ExtensionNewBadge from './ExtensionNewBadge.svelte';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  /** When true, origin chips render before catalog meta chips (table layout). */
  originFirst?: boolean;
  /** When false, hides the Update chip (cards show update in the version row). */
  showUpdateChip?: boolean;
  /** When true, prevents wrapping (for table layout). */
  nowrap?: boolean;
  /** When false, hides the New chip (table shows it in the name column). */
  showNewBadge?: boolean;
  class?: string;
}

let {
  extension,
  originFirst = false,
  showUpdateChip = true,
  nowrap = false,
  showNewBadge = true,
  class: className = '',
}: Props = $props();

const installed = $derived(extension.installedExtension);
const showUpdate = $derived(extensionRequiresManualUpdate(extension));

const isNew = $derived(isNewBadgeActive(extension.id));
</script>

<div
  class="m-0 p-0 {nowrap
    ? 'inline-flex flex-nowrap items-center gap-x-2'
    : 'flex flex-wrap items-center gap-x-2 gap-y-1'} {className}">
  {#if originFirst}
    {#if installed?.type === 'dd'}
      <Badge
        label="Docker Desktop extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    {:else if installed?.devMode}
      <Badge
        label="DevMode extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {:else if installed && isBuiltInExtension(installed)}
      <Badge
        label={EXTENSION_BUILTIN_CHIP_LABEL}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
    {:else}
      <Badge
        label="Community"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.communityOrigin} ${EXTENSION_CHIP_TEXT_CLASS}`} />
      {#if extension.isVerified}
        <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
      {/if}
    {/if}
    {#if extension.isFeatured}
      <Badge
        label="Featured"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.featured} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if showUpdateChip && showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if showNewBadge && isNew}
      <ExtensionNewBadge />
    {/if}
  {:else}
    {#if extension.isFeatured}
      <Badge
        label="Featured"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.featured} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if showUpdateChip && showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if installed?.type === 'dd'}
      <Badge
        label="Docker Desktop extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    {:else if installed?.devMode}
      <Badge
        label="DevMode extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {:else if installed && isBuiltInExtension(installed)}
      <Badge
        label={EXTENSION_BUILTIN_CHIP_LABEL}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
    {:else}
      <Badge
        label="Community"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.communityOrigin} ${EXTENSION_CHIP_TEXT_CLASS}`} />
      {#if extension.isVerified}
        <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
      {/if}
    {/if}
    {#if showNewBadge && isNew}
      <ExtensionNewBadge />
    {/if}
  {/if}
</div>
