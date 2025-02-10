<script lang="ts">
import ProviderWidget from '/@/lib/statusbar/ProviderWidget.svelte';
import { providerInfos } from '/@/stores/providers';
import { statusBarPinned } from '/@/stores/statusbar-pinned';
import type { ProviderInfo } from '/@api/provider-info';
import { STATUS_BAR_PIN_CONSTANTS } from '/@api/status-bar/pin-constants';

let pinned: Set<string> = $derived(
  new Set($statusBarPinned.filter(option => option.pinned).map(option => option.value)),
);

let containerProviders: ProviderInfo[] = $derived(
  $providerInfos.filter(provider => provider.containerConnections.length > 0 && pinned.has(provider.id)),
);

let kubernetesProviders = $derived(
  $providerInfos.filter(provider => provider.kubernetesConnections.length > 0 && pinned.has(provider.id)),
);

function onclick(): void {
  console.log('onclick provider pin (executing TOGGLE_MENU_COMMAND)');
  window.executeCommand(STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU_COMMAND).catch(console.error);
}
</script>

{#if $statusBarPinned.length > 0}
  <!-- We cannot use <Fa> object here, as we detect click on this button and outside to toggle the menu -->
  <button
    data-task-button="Pin"
    onclick={onclick}
    class="px-1 py-px flex h-full items-center relative hover:bg-[var(--pd-statusbar-hover-bg)] hover:cursor-pointer z-1 fa-solid fa-thumbtack"
    title="Pin"
    aria-label="Pin">
  </button>
{/if}

{#each containerProviders as entry}
  <ProviderWidget entry={entry}/>
{/each}
{#each kubernetesProviders as entry}
  <ProviderWidget entry={entry}/>
{/each}
