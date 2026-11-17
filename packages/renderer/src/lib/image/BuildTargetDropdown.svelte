<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';

let { target = $bindable(), containerFilePath }: { target: string | undefined; containerFilePath: string } = $props();

const DEFAULT = '<none>';

function onChange(val: string): void {
  if (val === DEFAULT) {
    target = undefined;
  } else {
    target = val;
  }
}

const infoPromise = $derived(window.containerfileGetInfo(containerFilePath));
</script>

<svelte:boundary>
  {#await infoPromise then info}
    {#if info?.targets.length > 0}
      <div class="space-y-2">
        <label for="target" class="block mb-2 font-semibold text-(--pd-content-card-header-text)">{t('resources.target') ?? 'Target'}</label>
        <Dropdown
          value={target ?? DEFAULT}
          onChange={onChange}
          name="target"
          id="target"
          options={info.targets.map(target => ({ label: target, value: target })).concat({ label: t('resources.default-no-target') ?? 'default (no target)', value: DEFAULT })}
          class="w-full" />
      </div>
    {/if}
  {/await}
</svelte:boundary>
