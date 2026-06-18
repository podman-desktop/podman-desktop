<script lang="ts">
import type { StatusBarEntry } from '@podman-desktop/core-api';
import { ExperimentalTasksSettings } from '@podman-desktop/core-api';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import TaskIndicator from '/@/lib/statusbar/TaskIndicator.svelte';
import { isHighContrast } from '/@/stores/appearance';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import { currentScreen } from '/@/stores/prototype';
import { statusBarEntries } from '/@/stores/statusbar';

import Providers from './Providers.svelte';
import StatusBarItem from './StatusBarItem.svelte';

let panelVisible = $state(false);
const unsubScreen = currentScreen.subscribe(s => {
  panelVisible = s !== '' && s !== 'closed';
});
onDestroy(unsubScreen);

function togglePanel(): void {
  if (panelVisible) {
    currentScreen.set('closed');
  } else {
    currentScreen.set('mixed');
  }
}

let leftEntries: StatusBarEntry[] = $state([]);
let rightEntries: StatusBarEntry[] = $state([]);

let experimentalTaskStatusBar: boolean = $state(false);
let experimentalProvidersStatusBar: boolean = $state(false);

function onDidChangeConfigurationCallback(e: Event): void {
  if (!('detail' in e) || !e.detail || typeof e.detail !== 'object') {
    return;
  }
  if ('key' in e.detail && 'value' in e.detail) {
    const detail = e.detail as { key: string; value: boolean };
    if ('statusbarProviders.showProviders' === detail.key) {
      experimentalProvidersStatusBar = detail.value;
    }
  }
}

onMount(async () => {
  statusBarEntries.subscribe(value => {
    leftEntries = value
      .filter(descriptor => {
        return descriptor.alignLeft === true;
      })
      .sort((d1, d2) => {
        if (d1.priority > d2.priority) {
          return 1;
        } else if (d1.priority < d2.priority) {
          return -1;
        } else {
          return 0;
        }
      })
      .map(descriptor => {
        return descriptor.entry;
      });

    rightEntries = value
      .filter(descriptor => {
        return descriptor.alignLeft === false;
      })
      .sort((d1, d2) => {
        if (d1.priority > d2.priority) {
          return 1;
        } else if (d1.priority < d2.priority) {
          return -1;
        } else {
          return 0;
        }
      })
      .map(descriptor => {
        return descriptor.entry;
      });
  });

  experimentalTaskStatusBar = await window.isExperimentalConfigurationEnabled(
    `${ExperimentalTasksSettings.SectionName}.${ExperimentalTasksSettings.StatusBar}`,
  );
  experimentalProvidersStatusBar = await window.isExperimentalConfigurationEnabled('statusbarProviders.showProviders');

  onDidChangeConfiguration.addEventListener('statusbarProviders.showProviders', onDidChangeConfigurationCallback);
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener('statusbarProviders.showProviders', onDidChangeConfigurationCallback);
});
</script>

<div
  class="flex justify-between px-1 bg-[var(--pd-statusbar-bg)] text-[var(--pd-statusbar-text)] text-sm space-x-2 z-40"
  role="contentinfo"
  aria-label="Status Bar"
  data-pd-force-theme={$isHighContrast ? 'hc-dark' : 'dark'}>
  <div class="flex flex-nowrap gap-x-1.5 h-full text-ellipsis whitespace-nowrap items-center">
    <Tooltip top tip="Toggle terminal panel (`)" containerClass="-ml-1 relative self-stretch flex items-stretch">
      <button
        class="pl-3 pr-1.5 flex h-full items-center hover:cursor-pointer hover:bg-(--pd-statusbar-hover-bg)"
        aria-label="Toggle terminal panel"
        onclick={togglePanel}>
        <i class="fa-solid fa-terminal text-[11px] text-(--pd-global-nav-icon)"></i>
      </button>
    </Tooltip>
    {#if experimentalProvidersStatusBar}
      <Providers/>
    {/if}
    {#each leftEntries as entry, index (index)}
      <StatusBarItem entry={entry} />
    {/each}
  </div>
  <div class="flex flex-wrap flex-row-reverse gap-x-1.5 h-full place-self-end">
    {#each rightEntries as entry, index (index)}
      <StatusBarItem entry={entry} />
    {/each}
    {#if experimentalTaskStatusBar}
      <TaskIndicator />
    {/if}
  </div>
</div>
