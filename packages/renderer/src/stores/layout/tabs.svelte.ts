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
let nextPendingTabId = 0;
let pendingNavigationTabId: string | undefined;

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

  if (pendingNavigationTabId) {
    const pendingTab = tabsState.tabs.find(tab => tab.id === pendingNavigationTabId);
    if (pendingTab) {
      tabsState.activeId = pendingTab.id;
      pendingNavigationTabId = undefined;
      return;
    }
  }

  // Explicitly opened page tabs (for example from Cmd/Ctrl-click) should stay
  // selected when their route is first pushed or restored from the tab strip.
  const selectedTab = activeTab();
  if (selectedTab.id.startsWith('page:') && selectedTab.stack[selectedTab.index]?.url === url) return;

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

/** Open a navigation destination in its own tab when tabbed navigation is enabled. */
export function openRouteInNewTab(url: string): void {
  if (!tabPreferences.tabsEnabled) {
    router.goto(url);
    return;
  }

  const id = resourceTabId(url) ?? `page:${url}`;
  let tab = tabsState.tabs.find(item => item.id === id);
  if (!tab) {
    tab = { id, title: id.startsWith('page:') ? 'Page' : 'Resource', pinned: false, stack: [{ url }], index: 0 };
    tabsState.tabs.push(tab);
  }
  tabsState.activeId = id;
  router.goto(url);
}

/** Open a destination in a background tab without changing the current route or active tab. */
export function openRouteInBackgroundTab(url: string, title = 'Resource'): void {
  if (!tabPreferences.tabsEnabled) {
    router.goto(url);
    return;
  }

  const id = resourceTabId(url) ?? `page:${url}`;
  if (tabsState.tabs.some(tab => tab.id === id)) return;

  tabsState.tabs.push({ id, title, pinned: false, stack: [{ url }], index: 0 });
}

/** Run a navigational action such as an extension route inside a fresh tab. */
export async function openNavigationActionInNewTab(action: () => Promise<void>): Promise<void> {
  if (!tabPreferences.tabsEnabled) {
    await action();
    return;
  }

  const previousActiveId = tabsState.activeId;
  const id = `page:pending:${++nextPendingTabId}`;
  tabsState.tabs.push({ id, title: 'Page', pinned: false, stack: [], index: -1 });
  tabsState.activeId = id;
  pendingNavigationTabId = id;
  try {
    await action();
  } catch (error) {
    if (pendingNavigationTabId === id) pendingNavigationTabId = undefined;
    tabsState.tabs = tabsState.tabs.filter(tab => tab.id !== id);
    if (tabsState.activeId === id) tabsState.activeId = previousActiveId;
    throw error;
  }
  if (pendingNavigationTabId === id) {
    pendingNavigationTabId = undefined;
    tabsState.tabs = tabsState.tabs.filter(tab => tab.id !== id);
    if (tabsState.activeId === id) tabsState.activeId = previousActiveId;
  }
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
