<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';

import Icon from '../icons/Icon.svelte';
import StarIcon from '../icons/StarIcon.svelte';
import Spinner from '../progress/Spinner.svelte';

interface Props {
  // status: one of RUNNING, STARTING, USED, CREATED, DELETING, UPDATING, or DEGRADED
  // any other status will result in a standard outlined box
  status?: 'RUNNING' | 'STARTING' | 'USED' | 'DEGRADED' | 'DELETING' | 'UPDATING' | 'CREATED' | string;
  icon?: IconDefinition | Component | string;
  size?: number;
}
let { status = 'UNKNOWN', icon, size = 20 }: Props = $props();

let solid = $derived(status === 'RUNNING' || status === 'STARTING' || status === 'USED' || status === 'DEGRADED');
</script>

<div class="grid place-content-center" style="position:relative">
  <div
    class="grid place-content-center rounded-sm aspect-square"
    class:bg-[var(--pd-status-running)]={status === 'RUNNING' || status === 'USED'}
    class:bg-[var(--pd-status-starting)]={status === 'STARTING'}
    class:bg-[var(--pd-status-degraded)]={status === 'DEGRADED'}
    class:border-2={!solid && status !== 'DELETING' && status !== 'UPDATING'}
    class:p-0.5={!solid}
    class:p-1={solid}
    class:border-[var(--pd-status-not-running)]={!solid}
    class:text-[var(--pd-status-not-running)]={!solid}
    class:text-[var(--pd-status-contrast)]={solid}
    role="status"
    title={status}>
    {#if status === 'DELETING' || status === 'UPDATING'}
      <Spinner size="1.4em" />
    {:else if icon}
      <Icon icon={icon} size={size} />
    {/if}
  </div>
  {#if status === 'CREATED'}
    <StarIcon size="8" style="position:absolute;top:0;right:0" />
  {/if}
</div>
