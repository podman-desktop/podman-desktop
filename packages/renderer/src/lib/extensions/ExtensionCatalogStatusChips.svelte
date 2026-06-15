<script lang="ts">
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';
import { newlyInstalled } from './extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  /** When true, origin chips render before catalog meta chips (table layout). */
  originFirst?: boolean;
  /** When false, hides the Update chip (cards show update in the version row). */
  showUpdateChip?: boolean;
  /** When true, prevents wrapping (for table layout). */
  nowrap?: boolean;
  class?: string;
}

let { extension, originFirst = false, showUpdateChip = true, nowrap = false, class: className = '' }: Props = $props();

const installed = $derived(extension.installedExtension);
const showUpdate = $derived(extensionRequiresManualUpdate(extension));

// Reactive check - this will re-evaluate when newlyInstalled set changes
const isNew = $derived(newlyInstalled.has(extension.id));

// Debug logging - runs on every render
$effect(() => {
  console.log(
    `[DTUX-2854 Badge Render] Extension: ${extension.displayName}, ID: ${extension.id}, isInstalled: ${extension.isInstalled}, isNew: ${isNew}, set contents:`,
    Array.from(newlyInstalled),
  );
});
</script>

<div class="flex items-center gap-y-1 m-0 p-0 {nowrap ? 'flex-nowrap gap-x-0.5' : 'flex-wrap gap-x-2'} {className}">
  {#if originFirst}
    {#if installed?.type === 'dd'}
      <Badge
        label="Docker Desktop extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
    {:else if installed?.devMode}
      <Badge
        label="DevMode extension"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {:else if installed && !installed.removable}
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
    {#if isNew}
      <Badge
        label="New"
        icon={faStar}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
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
    {:else if installed && !installed.removable}
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
    {#if isNew}
      <Badge
        label="New"
        icon={faStar}
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
  {/if}
</div>
