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
export interface RecentlyClosedResourceTab {
  tab: ResourceTab;
  index: number;
}
export const MAIN_TAB = 'main';
export const tabsState = $state<{ activeId: string; tabs: ResourceTab[] }>({
  activeId: MAIN_TAB,
  tabs: [{ id: MAIN_TAB, title: 'Main', pinned: true, stack: [], index: -1 }],
});
export const recentlyClosedTabs = $state<RecentlyClosedResourceTab[]>([]);
let nextPendingTabId = 0;
let pendingNavigationTabId: string | undefined;
let selectedTabRouteOwner: string | undefined;

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
      selectedTabRouteOwner = pendingTab.id;
      pendingNavigationTabId = undefined;
      return;
    }
  }

  const urlPath = url.split('?')[0];
  if (urlPath.startsWith('/webviews/') || urlPath.startsWith('/contribs/')) return;

  // Keep the selected tab active while its route is restored from the tab strip.
  // This applies to resource and page tabs; otherwise a route without a
  // resourceTabId (for example Kubernetes) would be reassigned to the main tab.
  const selectedTab = activeTab();
  const id = resourceTabId(url);
  if (selectedTabRouteOwner === selectedTab.id) {
    const selectedUrl = selectedTab.stack[selectedTab.index]?.url;
    const selectedRoot = selectedUrl?.split('?')[0]?.split('/').filter(Boolean)[0] ?? '/';
    const incomingRoot = urlPath.split('/').filter(Boolean)[0] ?? '/';
    // Restoring a tab must not claim another resource in the same section.
    const selectedResource = selectedUrl ? resourceTabId(selectedUrl) : undefined;
    if (id && id === selectedResource) return;
    // Missing resources can redirect to their list; keep that fallback in this tab.
    if (!id && (selectedResource || selectedTab.id.startsWith('page:')) && selectedRoot === incomingRoot) return;
    selectedTabRouteOwner = undefined;
  }
  if (selectedTab.stack[selectedTab.index]?.url === url) return;

  if (!id) {
    tabsState.activeId = MAIN_TAB;
    return;
  }
  forgetRecentlyClosedTab(id);
  if (!tabsState.tabs.some(tab => tab.id === id)) {
    tabsState.tabs.push({ id, title: 'Resource', pinned: false, stack: [], index: -1 });
  }
  tabsState.activeId = id;
}

/**
 * Browser-like "open in a new tab" gesture: middle-click, Cmd+click or Ctrl+click.
 * A plain click reports button 0, a middle-click reports button 1.
 */
export function opensInNewTab(event: MouseEvent): boolean {
  return event.button === 1 || event.metaKey || event.ctrlKey;
}

/** Open a navigation destination in its own tab when tabbed navigation is enabled. */
export function openRouteInNewTab(url: string): void {
  if (!tabPreferences.tabsEnabled) {
    router.goto(url);
    return;
  }

  const id = resourceTabId(url) ?? `page:${url}`;
  forgetRecentlyClosedTab(id);
  let tab = tabsState.tabs.find(item => item.id === id);
  if (!tab) {
    tab = { id, title: id.startsWith('page:') ? 'Page' : 'Resource', pinned: false, stack: [{ url }], index: 0 };
    tabsState.tabs.push(tab);
  }
  tabsState.activeId = id;
  selectedTabRouteOwner = id;
  router.goto(url);
}

/** Open a destination in a background tab without changing the current route or active tab. */
export function openRouteInBackgroundTab(url: string, title = 'Resource'): void {
  if (!tabPreferences.tabsEnabled) {
    router.goto(url);
    return;
  }

  const id = resourceTabId(url) ?? `page:${url}`;
  forgetRecentlyClosedTab(id);
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

/** Sidebar navigation updates the shared page without restoring its previous URL first. */
export function activateMainTab(): void {
  if (!tabPreferences.tabsEnabled) return;
  tabsState.activeId = MAIN_TAB;
  selectedTabRouteOwner = undefined;
}

export function selectResourceTab(id: string): void {
  const tab = tabsState.tabs.find(tab => tab.id === id);
  if (!tab) return;
  tabsState.activeId = id;
  selectedTabRouteOwner = id;
  const entry = tab.stack[tab.index];
  if (entry?.extensionEntry) {
    if (entry.url.startsWith('/webviews/') || entry.url.startsWith('/contribs/')) {
      router.goto(entry.url);
    }
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
  rememberClosedTab(tab, index);
  tabsState.tabs = tabsState.tabs.filter(item => item.id !== id);
  if (tabsState.activeId === id) selectResourceTab(tabsState.tabs[Math.max(0, index - 1)]!.id);
}

export function closeOtherTabs(id: string): void {
  tabsState.tabs.forEach((tab, index) => {
    if (tab.id !== id && !tab.pinned) rememberClosedTab(tab, index);
  });
  tabsState.tabs = tabsState.tabs.filter(tab => tab.id === id || tab.pinned);
  if (!tabsState.tabs.some(tab => tab.id === tabsState.activeId)) selectResourceTab(id);
}

export function closeAllResourceTabs(): void {
  tabsState.tabs.forEach((tab, index) => {
    if (tab.id !== MAIN_TAB && !tab.pinned) rememberClosedTab(tab, index);
  });
  tabsState.tabs = tabsState.tabs.filter(tab => tab.id === MAIN_TAB || tab.pinned);
  if (!tabsState.tabs.some(tab => tab.id === tabsState.activeId)) selectResourceTab(MAIN_TAB);
}

export function restoreRecentlyClosedTab(id: string): void {
  const recentlyClosedIndex = recentlyClosedTabs.findIndex(item => item.tab.id === id);
  if (recentlyClosedIndex < 0) return;

  const [recentlyClosed] = recentlyClosedTabs.splice(recentlyClosedIndex, 1);
  const existingTab = tabsState.tabs.find(tab => tab.id === id);
  if (existingTab) {
    selectResourceTab(id);
    return;
  }

  const insertionIndex = Math.min(recentlyClosed!.index, tabsState.tabs.length);
  tabsState.tabs.splice(insertionIndex, 0, recentlyClosed!.tab);
  selectResourceTab(id);
}

function rememberClosedTab(tab: ResourceTab, index: number): void {
  recentlyClosedTabs.splice(
    0,
    recentlyClosedTabs.length,
    { tab: { ...tab, stack: tab.stack.map(entry => ({ ...entry })) }, index },
    ...recentlyClosedTabs.filter(item => item.tab.id !== tab.id),
  );
  if (recentlyClosedTabs.length > 5) recentlyClosedTabs.length = 5;
}

function forgetRecentlyClosedTab(id: string): void {
  const index = recentlyClosedTabs.findIndex(item => item.tab.id === id);
  if (index >= 0) recentlyClosedTabs.splice(index, 1);
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
