<script lang="ts">
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Expandable } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { getContext, type Snippet } from 'svelte';
import { fade, slide } from 'svelte/transition';

import { ExpandableState } from '/@/lib/ui/expandable-state.svelte';

import { DASHBOARD_SECTION_CONTEXT, type DashboardSectionContext } from './dashboard-section-context';

interface Props {
  // registry id of the section
  id: string;
  // configuration key persisting the expanded state
  expandedKey: string;
  // trailing header content, receives the expanded state
  status?: Snippet<[boolean]>;
  children: Snippet;
}

let { id, expandedKey, status, children }: Props = $props();

const dashboard = getContext<DashboardSectionContext | undefined>(DASHBOARD_SECTION_CONTEXT);
const expandableState = new ExpandableState(expandedKey);

let enhanced = $derived(dashboard?.enhanced ?? false);
let label = $derived(enhanced ? (dashboard?.label(id) ?? id) : id);

function toggle(): void {
  expandableState.expanded = !expandableState.expanded;
  expandableState.toggle(expandableState.expanded).catch((error: unknown) => {
    console.error(`Failed to persist ${expandedKey}: ${error}`);
  });
}

function hide(): void {
  dashboard?.hide(id);
}
</script>

{#if enhanced}
  <div class="group flex flex-col">
    <div class="flex flex-row items-center gap-6">
      <button type="button" class="flex items-center gap-2 cursor-pointer" aria-expanded={expandableState.expanded} onclick={toggle}>
        <span class="font-semibold text-lg text-(--pd-content-header) select-none">{label}</span>
        <Icon
          icon={faChevronDown}
          class="size-4! transition-transform duration-200 motion-reduce:transition-none {expandableState.expanded ? 'rotate-0' : '-rotate-90'}" />
      </button>
      {#if status}
        <div class="flex items-center self-stretch text-sm">
          {@render status(expandableState.expanded)}
        </div>
      {/if}
      <button
        type="button"
        class="size-6 flex items-center justify-center ml-auto opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 motion-reduce:transition-none outline-transparent focus:outline-(--pd-button-focus-ring)"
        aria-label="Hide {label}"
        title="Hide {label}"
        onclick={hide}>
        <Icon icon={faTimes} class="w-4 h-4" />
      </button>
    </div>
    {#if expandableState.initialized && expandableState.expanded}
      <div role="region" aria-label={label} transition:slide={{ duration: 250 }}>
        <div transition:fade={{ duration: 250 }}>
          {@render children()}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex flex-1 flex-col bg-(--pd-content-card-bg) p-5 rounded-lg">
    <Expandable
      bind:initialized={expandableState.initialized}
      bind:expanded={expandableState.expanded}
      onclick={expandableState.toggle.bind(expandableState)}>
      {#snippet title()}
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold text-(--pd-content-card-header-text)">{id}</span>
          {@render status?.(expandableState.expanded)}
        </div>
      {/snippet}
      {@render children()}
    </Expandable>
  </div>
{/if}
