<script lang="ts">
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

import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import Dialog from '/@/lib/dialogs/Dialog.svelte';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  volume: VolumeInfoUI;
  onClose: () => void;
}

let { volume, onClose }: Props = $props();

let newName = $state('');
let renameInProgress = $state(false);
let renameError: string | undefined = $state();

let normalizedName = $derived(newName.trim());
let renameDisabled = $derived(renameInProgress || normalizedName.length === 0 || normalizedName === volume.name);

onMount(() => {
  newName = volume.name;
});

async function renameVolume(): Promise<void> {
  renameError = undefined;
  renameInProgress = true;
  try {
    await window.renameVolume(volume.engineId, volume.name, normalizedName);
    onClose();
  } catch (error: unknown) {
    renameError = error instanceof Error ? error.message : String(error);
  } finally {
    renameInProgress = false;
  }
}
</script>

<Dialog title="Rename Volume" onclose={onClose}>
  {#snippet content()}
    <div class="w-full">
      <label for="volumeName" class="block my-2 text-sm font-bold text-[var(--pd-modal-text)]">Volume name</label>
      <Input
        bind:value={newName}
        name="volumeName"
        id="volumeName"
        aria-label="Volume Name"
        disabled={renameInProgress}
        required />
      {#if renameError}
        <ErrorMessage class="text-sm mt-2" error={renameError} />
      {/if}
    </div>
  {/snippet}
  {#snippet buttons()}
    <Button type="link" onclick={onClose} disabled={renameInProgress}>Cancel</Button>
    <Button type="primary" onclick={renameVolume} disabled={renameDisabled} inProgress={renameInProgress}>Rename</Button>
  {/snippet}
</Dialog>
