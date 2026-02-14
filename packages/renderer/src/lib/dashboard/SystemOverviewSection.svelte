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
import { Button } from '@podman-desktop/ui-svelte';

import {
  getCurrentState,
  setCurrentState,
  stateLabels,
  type SystemOverviewState,
} from '/@/stores/dashboard/system-overview-state.svelte';

import SystemOverviewCard from './SystemOverviewCard.svelte';

// All available states for toggle buttons
const states: SystemOverviewState[] = [
  'live',
  'machine-stopped',
  'machine-error',
  'multiple-errors',
  'starting',
  'onboarding',
  'all-running',
];

// Get current state reactively
let currentState = $derived(getCurrentState());

function selectState(state: SystemOverviewState): void {
  setCurrentState(state);
}
</script>

<!-- Testing States Buttons - Above System Overview -->
<div class="flex flex-col gap-4 mb-4">
  <div class="flex flex-wrap gap-2">
    {#each states as state}
      <Button
        type="tab"
        selected={currentState === state}
        onclick={() => selectState(state)}
        padding="px-3 pb-1"
        aria-label={`Switch to ${stateLabels[state]}`}>
        {stateLabels[state]}
      </Button>
    {/each}
  </div>
</div>

<!-- System Overview Card -->
<SystemOverviewCard />
