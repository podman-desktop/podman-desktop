<!--
   Copyright (C) 2025 Red Hat, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   SPDX-License-Identifier: Apache-2.0
-->

<script lang="ts">
import { Expandable } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { onDidChangeConfiguration } from '/@/stores/configurationProperties';

import SystemOverviewContent from './SystemOverviewContent.svelte';

// Expandable state management (same pattern as Explore Features)
let expanded: boolean = $state(true);
let initialized: boolean = $state(false);

const CONFIGURATION_KEY = 'systemOverview.expanded';

const listener: EventListener = (obj: object) => {
  if ('detail' in obj) {
    const detail = obj.detail as { key: string; value: boolean };
    if (CONFIGURATION_KEY === detail?.key) {
      expanded = detail.value;
    }
  }
};

onMount(async () => {
  onDidChangeConfiguration.addEventListener(CONFIGURATION_KEY, listener);
  expanded = (await window.getConfigurationValue<boolean>(CONFIGURATION_KEY)) ?? true;
  initialized = true;
});

onDestroy(() => {
  onDidChangeConfiguration.removeEventListener(CONFIGURATION_KEY, listener);
});

async function toggle(expanded: boolean): Promise<void> {
  await window.updateConfigurationValue(CONFIGURATION_KEY, expanded);
}
</script>

<div class="flex flex-1 flex-col bg-[var(--pd-content-card-bg)] p-5 rounded-lg">
  <Expandable bind:initialized bind:expanded onclick={toggle}>
    {#snippet title()}
      <div class="text-lg font-semibold text-[var(--pd-content-card-header-text)]">System Overview</div>
    {/snippet}
    <div class="pt-4">
      <!-- System Overview Content -->
      <SystemOverviewContent />
    </div>
  </Expandable>
</div>
