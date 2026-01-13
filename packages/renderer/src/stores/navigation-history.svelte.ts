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

import { get } from 'svelte/store';
import { router } from 'tinro';

import DashboardIcon from '/@/lib/images/DashboardIcon.svelte';
import { settingsNavigationEntries } from '/@/PreferencesNavigation';

import { navigationRegistry, type NavigationRegistryEntry } from './navigation/navigation-registry';

export const BACK = 'back';
export const FORWARD = 'forward';

export type Direction = typeof BACK | typeof FORWARD;

export type HistoryEntryIcon = NavigationRegistryEntry['icon'];

export interface HistoryEntry {
  index: number;
  name: string;
  icon?: HistoryEntryIcon;
}

/**
 * Navigation history store
 *
 * @property stack - An array of URLs
 * @property index - The current index in the stack
 */
export const navigationHistory = $state<{
  stack: string[];
  index: number;
}>({
  stack: [],
  index: -1,
});

let isNavigatingHistory = false;

// Convert URL to display name
function urlToDisplayName(url: string): string {
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return 'Dashboard';

  const mainPart = parts[0];
  let name = mainPart.charAt(0).toUpperCase() + mainPart.slice(1);

  if (parts.length > 1 && parts[1]) {
    const detail = parts[1];
    if (detail.length > 12) {
      name += `: ${detail.substring(0, 12)}...`;
    } else {
      name += `: ${detail}`;
    }
  }

  return name;
}

// Find navigation entry that matches a URL
function findNavigationEntry(url: string, entries: NavigationRegistryEntry[]): NavigationRegistryEntry | undefined {
  const path = url.split('?')[0];

  for (const entry of entries) {
    // Check if URL matches this entry's link
    if (path === entry.link || path.startsWith(entry.link + '/')) {
      return entry;
    }

    // Check nested items (for groups and submenus)
    if (entry.items) {
      const found = findNavigationEntry(url, entry.items);
      if (found) return found;
    }
  }

  return undefined;
}

// Get entry info (name and icon) for a URL
function getEntryInfo(url: string): { name: string; icon?: HistoryEntryIcon } {
  const path = url.split('?')[0];

  // Handle Dashboard specially
  if (path === '/') {
    return {
      name: 'Dashboard',
      icon: { iconComponent: DashboardIcon },
    };
  }

  // Check navigation registry (includes webviews, extensions, containers, etc.)
  const registry = get(navigationRegistry);
  const navEntry = findNavigationEntry(url, registry);
  if (navEntry) {
    return {
      name: navEntry.name,
      icon: navEntry.icon,
    };
  }

  // Check settings navigation entries for routes not in navigation registry
  // Sort by href length descending to match most specific route first
  const sortedEntries = [...settingsNavigationEntries].sort((a, b) => b.href.length - a.href.length);
  for (const route of sortedEntries) {
    if (
      path === route.href ||
      path.startsWith(route.href + '/') ||
      (route.href.endsWith('/') && path.startsWith(route.href))
    ) {
      return {
        name: route.title,
        icon: route.icon ? { iconComponent: route.icon } : undefined,
      };
    }
  }

  // Fallback to URL-based name
  return {
    name: urlToDisplayName(url),
    icon: undefined,
  };
}

// Core navigation function
function navigateToIndex(index: number): boolean {
  if (index < 0 || index >= navigationHistory.stack.length || index === navigationHistory.index) {
    return false;
  }

  isNavigatingHistory = true;
  navigationHistory.index = index;
  const url = navigationHistory.stack[index];
  if (url) {
    router.goto(url);
  }
  return true;
}

export function goBack(): void {
  if (navigateToIndex(navigationHistory.index - 1)) {
    window.telemetryTrack('navigation.back').catch(console.error);
  }
}

export function goForward(): void {
  if (navigateToIndex(navigationHistory.index + 1)) {
    window.telemetryTrack('navigation.forward').catch(console.error);
  }
}

/**
 * Check if a URL is a submenu base route that immediately redirects.
 * Submenu routes (like /kubernetes) redirect to their first item (like /kubernetes/dashboard)
 * and should not be added to history to prevent navigation issues when going back.
 */
function isSubmenuBaseRoute(url: string): boolean {
  const registry = get(navigationRegistry);
  return registry.some(entry => entry.type === 'submenu' && entry.link === url);
}

export function goToHistoryIndex(index: number): void {
  navigateToIndex(index);
}

// Get history entries for a direction
function getEntries(direction: Direction): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  const start = direction === BACK ? navigationHistory.index - 1 : navigationHistory.index + 1;
  const condition = (i: number): boolean => (direction === BACK ? i >= 0 : i < navigationHistory.stack.length);
  const step = direction === BACK ? -1 : 1;

  for (let i = start; condition(i); i += step) {
    const url = navigationHistory.stack[i];
    if (url) {
      const info = getEntryInfo(url);
      entries.push({
        index: i,
        name: info.name,
        icon: info.icon,
      });
    }
  }
  return entries;
}

export function getBackEntries(): HistoryEntry[] {
  return getEntries(BACK);
}

export function getForwardEntries(): HistoryEntry[] {
  return getEntries(FORWARD);
}

// Initialize router subscription
router.subscribe(navigation => {
  if (navigation.url) {
    if (isNavigatingHistory) {
      isNavigatingHistory = false;
      return;
    }

    // Skip submenu base routes - they immediately redirect to a sub-page
    // and shouldn't be in the history stack
    if (isSubmenuBaseRoute(navigation.url)) {
      return;
    }

    // Truncate forward history if we're not at the end
    if (navigationHistory.index < navigationHistory.stack.length - 1) {
      navigationHistory.stack = navigationHistory.stack.slice(0, navigationHistory.index + 1);
    }

    // Only add if different from current
    const currentUrl = navigationHistory.stack[navigationHistory.index];
    if (currentUrl !== navigation.url) {
      navigationHistory.stack = [...navigationHistory.stack, navigation.url];
      navigationHistory.index = navigationHistory.stack.length - 1;
    }
  }
});

// Listen for navigation commands from command palette
window.events?.receive('navigation-go-back', () => {
  goBack();
});

window.events?.receive('navigation-go-forward', () => {
  goForward();
});
