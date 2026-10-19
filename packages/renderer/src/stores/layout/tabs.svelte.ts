import type { HistoryStackEntry } from '@desktop-framework/api';
import { router } from 'tinro';

import { tabPreferences } from './tab-preferences.svelte';

export interface TabHistory {
  stack: HistoryStackEntry[];
  index: number;
}
export interface ResourceTab extends TabHistory {
  id: string;
  title: string;
  pinned: boolean;
}
export const MAIN_TAB = 'main';
export const tabsState = $state<{ activeId: string; tabs: ResourceTab[] }>({
  activeId: MAIN_TAB,
  tabs: [{ id: MAIN_TAB, title: 'Main', pinned: true, stack: [], index: -1 }],
});

export function activeTab(): ResourceTab {
  return tabsState.tabs.find(tab => tab.id === tabsState.activeId) ?? tabsState.tabs[0]!;
}

/** Recognize resource details, excluding creation and other top-level workflows. */
export function resourceTabId(url: string): string | undefined {
  const path = url.split('?')[0]!;
  const patterns = [
    /^(\/containers\/[^/]+)(?:\/|$)/,
    /^(\/(?:images|manifests)\/[^/]+\/[^/]+\/[^/]+)/,
    /^(\/pods\/podman\/[^/]+\/[^/]+)/,
    /^(\/(?:volumes|networks|secrets)\/[^/]+\/[^/]+)/,
    /^(\/compose\/details\/[^/]+\/[^/]+)/,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(path);
    if (match) return match[1];
  }
  return undefined;
}

export function prepareTabForRoute(url: string): void {
  if (!tabPreferences.tabsEnabled) return;
  const id = resourceTabId(url);
  if (!id) {
    tabsState.activeId = MAIN_TAB;
    return;
  }
  if (!tabsState.tabs.some(tab => tab.id === id)) {
    tabsState.tabs.push({ id, title: 'Resource', pinned: false, stack: [], index: -1 });
  }
  tabsState.activeId = id;
}

export function selectResourceTab(id: string): void {
  const tab = tabsState.tabs.find(tab => tab.id === id);
  if (!tab) return;
  tabsState.activeId = id;
  const entry = tab.stack[tab.index];
  if (entry?.extensionEntry) {
    window
      .navigateToExtensionHistoryEntry(entry.extensionEntry.extensionId, entry.extensionEntry.id)
      .catch(console.error);
  } else {
    router.goto(entry?.url ?? '/');
  }
}

export function closeResourceTab(id: string): void {
  const tab = tabsState.tabs.find(tab => tab.id === id);
  if (!tab || id === MAIN_TAB) return;
  const index = tabsState.tabs.indexOf(tab);
  tabsState.tabs = tabsState.tabs.filter(item => item.id !== id);
  if (tabsState.activeId === id) selectResourceTab(tabsState.tabs[Math.max(0, index - 1)]!.id);
}

export function closeOtherTabs(id: string): void {
  tabsState.tabs = tabsState.tabs.filter(tab => tab.id === id || tab.pinned);
  if (!tabsState.tabs.some(tab => tab.id === tabsState.activeId)) selectResourceTab(id);
}

export function closeAllResourceTabs(): void {
  tabsState.tabs = tabsState.tabs.filter(tab => tab.id === MAIN_TAB || tab.pinned);
  if (!tabsState.tabs.some(tab => tab.id === tabsState.activeId)) selectResourceTab(MAIN_TAB);
}

export function togglePin(id: string): void {
  const tab = tabsState.tabs.find(item => item.id === id);
  if (tab && id !== MAIN_TAB) tab.pinned = !tab.pinned;
}

export function reorderResourceTab(id: string, beforeId?: string): void {
  if (id === MAIN_TAB || beforeId === MAIN_TAB || id === beforeId) return;
  const tab = tabsState.tabs.find(item => item.id === id);
  if (!tab || tab.pinned) return;
  const remaining = tabsState.tabs.filter(item => item.id !== id);
  const index = remaining.findIndex(item => item.id === beforeId);
  remaining.splice(index < 0 ? remaining.length : index, 0, tab);
  tabsState.tabs = remaining;
}
