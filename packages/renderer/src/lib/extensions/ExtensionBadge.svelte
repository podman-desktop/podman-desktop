<script lang="ts">
import type { OverriddenExtension } from '@desktop-framework/api';
import { Tooltip } from '@podman-desktop/ui-svelte';
import type { HTMLAttributes } from 'svelte/elements';

import { t } from '/@/lib/i18n/translations.svelte';
import Badge from '/@/lib/ui/Badge.svelte';

interface Props extends HTMLAttributes<HTMLDivElement> {
  extension: {
    type: 'dd' | 'pd';
    removable: boolean;
    devMode: boolean;
    bundled: boolean;
    overrides?: OverriddenExtension;
  };
}

let { extension, class: className = '', ...restProps }: Props = $props();
</script>

<div class="flex flex-row gap-1 items-center {className}" role="region" aria-label={t('workloads.extensionBadge') ?? 'Extension Badge'} {...restProps}>
  {#if extension.type === 'dd'}
    <Tooltip right tip={t('workloads.dockerExtension') ?? 'Docker Desktop extension'}>
      <Badge class="text-[8px] text-(--pd-badge-dd-extension-text)" color="bg-(--pd-badge-dd-extension-bg)" label={t('workloads.dockerExtension') ?? 'Docker Desktop extension'} />
    </Tooltip>
  {:else if extension.devMode}
    <Tooltip right tip={t('workloads.developmentExtension') ?? 'In Development Mode Extension'}>
      <Badge class="text-[8px] text-(--pd-badge-text)" color="bg-(--pd-badge-devmode-extension-bg)" label={t('workloads.developmentExtension') ?? 'devMode Extension'} />
    </Tooltip>
  {:else if extension.bundled}
    <Tooltip right tip={t('workloads.bundledExtension') ?? 'Bundled extension'}>
      <Badge class="text-[8px] text-(--pd-badge-text)" color="bg-(--pd-badge-bundled-extension-bg)" label={t('workloads.bundledExtension') ?? 'Bundled extension'} />
    </Tooltip>
  {/if}
  {#if extension.overrides}
    <Tooltip right tip={t('workloads.overridesExtension', { name: extension.overrides.id, version: extension.overrides.version }) ?? `Replaces the bundled extension ${extension.overrides.id} v${extension.overrides.version}`}>
      <Badge class="text-[8px] text-(--pd-badge-text)" color="bg-(--pd-badge-overrides-extension-bg)" label={t('workloads.overrides') ?? 'Overrides'} />
    </Tooltip>
  {/if}
</div>
