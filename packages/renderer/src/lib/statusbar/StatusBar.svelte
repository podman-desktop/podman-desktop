<script lang="ts">
import type { StatusBarEntry } from '@desktop-framework/api';
import { ExperimentalTasksSettings } from '@desktop-framework/api';
import { onMount } from 'svelte';

import TaskIndicator from '/@/lib/statusbar/TaskIndicator.svelte';
import { isHighContrast } from '/@/stores/appearance';
import { statusBarEntries } from '/@/stores/statusbar';

import Providers from './Providers.svelte';
import StatusBarItem from './StatusBarItem.svelte';

let leftEntries: StatusBarEntry[] = $state([]);
let rightEntries: StatusBarEntry[] = $state([]);

let experimentalTaskStatusBar: boolean = $state(false);

onMount(async () => {
  statusBarEntries.subscribe(value => {
    leftEntries = value
      .filter(descriptor => {
        return descriptor.alignLeft === true;
      })
      .toSorted((d1, d2) => {
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
      .toSorted((d1, d2) => {
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
});
</script>

<div
  class="flex justify-between px-1 bg-[var(--pd-statusbar-bg)] text-[var(--pd-statusbar-text)] text-sm space-x-2 z-40"
  role="contentinfo"
  aria-label="Status Bar"
  data-pd-force-theme={$isHighContrast ? 'hc-dark' : 'dark'}>
  <div class="flex flex-nowrap gap-x-1.5 h-full text-ellipsis whitespace-nowrap">
    <Providers/>
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
