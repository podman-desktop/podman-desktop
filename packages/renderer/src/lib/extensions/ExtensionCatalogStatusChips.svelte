<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import Badge from '/@/lib/ui/Badge.svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  EXTENSION_BUILTIN_CHIP_LABEL,
  EXTENSION_BUILTIN_CHIP_TEXT_CLASS,
  EXTENSION_BUILTIN_CHIP_TOOLTIP,
  EXTENSION_CHIP_BADGE_CLASS,
  EXTENSION_CHIP_COLORS,
  EXTENSION_CHIP_TEXT_CLASS,
} from './extension-badge-styles';
import { isNewlyInstalled } from './extension-catalog-settings.svelte';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import ExtensionVerifiedLabel from './ExtensionVerifiedLabel.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  /** When true, origin chips render before catalog meta chips (table layout). */
  originFirst?: boolean;
  class?: string;
}

let { extension, originFirst = false, class: className = '' }: Props = $props();

const installed = $derived(extension.installedExtension);
const showUpdate = $derived(extensionRequiresManualUpdate(extension));
</script>

<div class="flex flex-none flex-wrap items-center justify-start gap-x-2 gap-y-1 {className}">
  {#if originFirst}
    {#if installed?.type === 'dd'}
      <Tooltip right tip="Docker Desktop extension">
        <Badge
          label="Docker Desktop extension"
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
      </Tooltip>
    {:else if installed?.devMode}
      <Tooltip right tip="In Development Mode extension">
        <Badge
          label="DevMode extension"
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
      </Tooltip>
    {:else if installed && !installed.removable}
      <Tooltip right tip={EXTENSION_BUILTIN_CHIP_TOOLTIP}>
        <Badge
          label={EXTENSION_BUILTIN_CHIP_LABEL}
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
      </Tooltip>
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
    {#if isNewlyInstalled(extension.id)}
      <Badge
        label="New"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
  {:else}
    {#if extension.isFeatured}
      <Badge
        label="Featured"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.featured} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if isNewlyInstalled(extension.id)}
      <Badge
        label="New"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.new} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if showUpdate}
      <Badge
        label="Update"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.update} ${EXTENSION_CHIP_TEXT_CLASS}`} />
    {/if}
    {#if installed?.type === 'dd'}
      <Tooltip right tip="Docker Desktop extension">
        <Badge
          label="Docker Desktop extension"
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.dockerDesktop} ${EXTENSION_CHIP_COLORS.dockerDesktopText}`} />
      </Tooltip>
    {:else if installed?.devMode}
      <Tooltip right tip="In Development Mode extension">
        <Badge
          label="DevMode extension"
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.devMode} ${EXTENSION_CHIP_TEXT_CLASS}`} />
      </Tooltip>
    {:else if installed && !installed.removable}
      <Tooltip right tip={EXTENSION_BUILTIN_CHIP_TOOLTIP}>
        <Badge
          label={EXTENSION_BUILTIN_CHIP_LABEL}
          class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.builtin} ${EXTENSION_BUILTIN_CHIP_TEXT_CLASS}`} />
      </Tooltip>
    {:else}
      <Badge
        label="Community"
        class={`${EXTENSION_CHIP_BADGE_CLASS} ${EXTENSION_CHIP_COLORS.communityOrigin} ${EXTENSION_CHIP_TEXT_CLASS}`} />
      {#if extension.isVerified}
        <ExtensionVerifiedLabel isSupportedByRedHat={extension.isSupportedByRedHat} class={EXTENSION_CHIP_BADGE_CLASS} />
      {/if}
    {/if}
  {/if}
</div>
