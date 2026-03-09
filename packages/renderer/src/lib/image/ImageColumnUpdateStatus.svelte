<!--
/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/
-->
<script lang="ts">
import type { ImageUpdateStatus } from '@podman-desktop/core-api';
import { Spinner } from '@podman-desktop/ui-svelte';

import Label from '/@/lib/ui/Label.svelte';

import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  object: ImageInfoUI;
}

let { object }: Props = $props();

function getStatusLabel(status: ImageUpdateStatus): { dotColor: string; label: string } {
  if (status.status === 'error') return { dotColor: 'bg-(--pd-status-terminated)', label: 'Error' };
  if (status.updateAvailable) return { dotColor: 'bg-(--pd-status-connected)', label: 'Available' };
  if (status.status === 'skipped') return { dotColor: 'bg-(--pd-status-stopped)', label: 'N/A' };
  return { dotColor: 'bg-(--pd-status-stopped)', label: 'Up to date' };
}
</script>

<div class="flex flex-col gap-1 items-start text-left">
  {#if object.updateCheckInProgress}
    <div class="flex items-center gap-1">
      <Spinner size="1em" />
      <span class="text-xs text-[var(--pd-table-body-text-secondary)]">Checking</span>
    </div>
  {:else if object.updateInProgress}
    <div class="flex items-center gap-1">
      <Spinner size="1em" />
      <span class="text-xs text-[var(--pd-table-body-text-secondary)]">Updating</span>
    </div>
  {:else if object.updateStatus}
    {@const style = getStatusLabel(object.updateStatus)}
    <div class="flex items-start" title={object.updateStatus.message}>
      <Label role="note" name={style.label}>
        <div class="w-2 h-2 shrink-0 {style.dotColor} rounded-full"></div>
      </Label>
    </div>
  {:else}
    <span class="text-xs text-[var(--pd-table-body-text-secondary)]">-</span>
  {/if}
</div>
