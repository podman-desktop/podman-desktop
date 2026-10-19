<script lang="ts">
import { faBox, faCube, faCubes } from '@fortawesome/free-solid-svg-icons';
import { TabBar } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { Modal } from '@podman-desktop/ui-svelte';
import { tick } from 'svelte';
import { router } from 'tinro';

import { containersInfos } from '/@/stores/containers';
import { imagesInfos } from '/@/stores/images';
import {
  closeAllResourceTabs,
  closeOtherTabs,
  closeResourceTab,
  MAIN_TAB,
  reorderResourceTab,
  selectResourceTab,
  tabsState,
  togglePin,
} from '/@/stores/layout/tabs.svelte';
import { getEntryInfo } from '/@/stores/navigation-history.svelte';
import { podsInfos } from '/@/stores/pods';

const mainTab = $derived(tabsState.tabs[0]!);
const mainInfo = $derived(getEntryInfo(mainTab.stack[mainTab.index]?.url ?? '/'));
const tabs = $derived(
  tabsState.tabs.map(tab => {
    const title = tab.id === MAIN_TAB ? mainInfo.name : tab.title;
    const resourceType =
      tab.id === MAIN_TAB
        ? 'Page'
        : ({
            containers: 'Container',
            images: 'Image',
            pods: 'Pod',
            volumes: 'Volume',
            networks: 'Network',
            secrets: 'Secret',
            compose: 'Compose',
            manifests: 'Manifest',
          }[tab.id.split('/')[1] ?? ''] ?? 'Resource');
    return { ...tab, key: tab.id, title, tooltip: `${resourceType}: ${title}` };
  }),
);
function tabIcon(id: string): ReturnType<typeof getEntryInfo>['icon'] {
  return id === MAIN_TAB ? mainInfo.icon : getEntryInfo(id).icon;
}
let pickerOpen = $state(false);
let filter = $state('');
let selectedIndex = $state(0);
let searchInput: HTMLInputElement | undefined = $state();
const resources = $derived([
  ...$containersInfos.map(container => ({
    id: `container:${container.engineId}:${container.id}`,
    title: container.name,
    kind: 'Container',
    icon: faCube,
    url: `/containers/${container.id}/summary`,
  })),
  ...$podsInfos.map(pod => ({
    id: `pod:${pod.engineId}:${pod.name}`,
    title: pod.name,
    kind: 'Pod',
    icon: faCubes,
    url: `/pods/podman/${encodeURIComponent(pod.name)}/${encodeURIComponent(pod.engineId)}/summary`,
  })),
  ...$imagesInfos.map(image => ({
    id: `image:${image.engineId}:${image.Id}`,
    title: image.RepoTags?.[0] ?? image.Id,
    kind: 'Image',
    icon: faBox,
    url: `/images/${encodeURIComponent(image.Id)}/${encodeURIComponent(image.engineId)}/${btoa(image.RepoTags?.[0] ?? '')}/summary`,
  })),
]);
const groupedMatches = $derived.by(() => {
  const query = filter.trim().toLowerCase();
  return ['Pod', 'Container', 'Image']
    .map(kind => ({
      kind,
      entries: resources.filter(
        resource =>
          resource.kind === kind && (!query || `${resource.title} ${resource.kind}`.toLowerCase().includes(query)),
      ),
    }))
    .filter(group => group.entries.length > 0);
});
const matches = $derived(groupedMatches.flatMap(group => group.entries));

function openPicker(): void {
  filter = '';
  selectedIndex = 0;
  pickerOpen = true;
  tick()
    .then(() => searchInput?.focus())
    .catch(console.error);
}
function closePicker(): void {
  pickerOpen = false;
}
function onSearchInput(): void {
  selectedIndex = 0;
}
function onSearchKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' && matches.length > 0) {
    event.preventDefault();
    selectedIndex = (selectedIndex + 1) % matches.length;
  } else if (event.key === 'ArrowUp' && matches.length > 0) {
    event.preventDefault();
    selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
  } else if (event.key === 'Enter' && matches[selectedIndex]) {
    event.preventDefault();
    openResource(matches[selectedIndex]!.url);
  }
}
function openResource(url: string): void {
  closePicker();
  router.goto(url);
}
function moveTab(_sourcePanel: string, id: string, beforeId?: string): void {
  reorderResourceTab(id, beforeId);
}
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closePicker();
  if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
  if (event.key.toLowerCase() === 'w') {
    event.preventDefault();
    closeResourceTab(tabsState.activeId);
  } else if (event.key.toLowerCase() === 't') {
    event.preventDefault();
    openPicker();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    const index = tabsState.tabs.findIndex(tab => tab.id === tabsState.activeId);
    selectResourceTab(
      tabsState.tabs[(index + (event.shiftKey ? -1 : 1) + tabsState.tabs.length) % tabsState.tabs.length]!.id,
    );
  }
}
</script>

<svelte:window onkeydown={onKeydown} />

<div aria-label="Main tabs">
  <TabBar panelId="main-tabs" {tabs} activeTabId={tabsState.activeId}
    onSelect={selectResourceTab} onClose={closeResourceTab} onCloseOthers={closeOtherTabs}
    onCloseAllInPanel={closeAllResourceTabs} onPinToggle={togglePin}
    onReorder={reorderResourceTab} onMoveFromOtherPanel={moveTab} onAddTab={openPicker} showCloseAllButton={true}>
    {#snippet tabIconSnippet(tab)}
      {@const icon = tabIcon(tab.id)}
      {@const resolvedIcon = icon?.iconComponent ?? icon?.iconImage ?? icon?.faIcon?.definition}
      {#if resolvedIcon}
        <Icon icon={resolvedIcon} size={16} class="w-4 h-4 shrink-0" />
      {/if}
    {/snippet}
  </TabBar>
</div>

{#if pickerOpen}
  <Modal name="Open a new tab" top onclose={closePicker}>
    <div class="flex w-full min-w-0 max-h-[75vh] flex-col">
      <div class="p-2 border-b border-[var(--pd-content-divider)]">
        <input
          bind:this={searchInput}
          bind:value={filter}
          oninput={onSearchInput}
          onkeydown={onSearchKeydown}
          type="text"
          aria-label="Search pods, containers, and images"
          placeholder="Search pods, containers, and images..."
          class="w-full px-3 py-2 rounded-sm bg-[var(--pd-input-field-focused-bg)] text-[var(--pd-input-field-text)] border border-[var(--pd-input-field-focused-bg)] focus:outline-hidden" />
      </div>
      <div class="min-w-0 overflow-y-auto py-1">
        {#each groupedMatches as group (group.kind)}
          <div class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-[var(--pd-modal-dropdown-text)] opacity-70">
            {group.kind}s
          </div>
          {#each group.entries as resource (resource.id)}
            {@const index = matches.indexOf(resource)}
            <button
              type="button"
              class="flex w-full min-w-0 items-center gap-3 px-3 py-2 text-left {index === selectedIndex
                ? 'bg-[var(--pd-modal-dropdown-highlight)]'
                : 'hover:bg-[var(--pd-dropdown-bg)]'}"
              onmouseenter={(): void => (selectedIndex = index)}
              onclick={openResource.bind(undefined, resource.url)}>
              <Icon icon={resource.icon} class="w-4 text-center shrink-0" />
              <span class="min-w-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-[var(--pd-modal-dropdown-text)]">
                {resource.title}
              </span>
              <span class="text-xs text-[var(--pd-modal-dropdown-text)] opacity-60 shrink-0">{resource.kind}</span>
            </button>
          {/each}
        {:else}
          <div class="px-3 py-6 text-center text-sm text-[var(--pd-modal-dropdown-text)] opacity-70">
            No matching resources.
          </div>
        {/each}
      </div>
    </div>
  </Modal>
{/if}
