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
import SettingsIcon from '/@/lib/images/SettingsIcon.svelte';
import { settingsNavigationEntries } from '/@/PreferencesNavigation';
import { navigationRegistry, type NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

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
 * Reactive navigation state, refreshed from Electron's NavigationHistory API.
 * Replaces the custom stack/index approach with Electron's built-in tracking.
 */
export const navigationState = $state<{
  canGoBack: boolean;
  canGoForward: boolean;
}>({
  canGoBack: false,
  canGoForward: false,
});

interface ParsedUrl {
  path: string;
  parts: string[];
}

/**
 * Parse URL into path (without query params) and parts (path segments)
 * @param url - The URL to parse
 * @returns Object with path and parts array
 * @example
 * parseUrl('/containers/abc123/logs?filter=running')
 * // => { path: '/containers/abc123/logs', parts: ['containers', 'abc123', 'logs'] }
 *
 * parseUrl('/')
 * // => { path: '/', parts: [] }
 */
function parseUrl(url: string): ParsedUrl {
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);
  return { path, parts };
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 * @example
 * capitalize('containers') // => 'Containers'
 * capitalize('pods') // => 'Pods'
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a maximum length, adding '...' if truncated
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns The truncated string
 * @example
 * truncate('very-long-container-name', 10) // => 'very-long-...'
 * truncate('short', 10) // => 'short'
 */
function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}

/**
 * Extract resource type and name from URL parts
 * @param parts - URL path segments (from parseUrl)
 * @returns Object with typeLabel (capitalized resource type) and optional name
 * @example
 * extractResourceInfo([])
 * // => { typeLabel: 'Dashboard' }
 *
 * extractResourceInfo(['containers'])
 * // => { typeLabel: 'Containers' }
 *
 * extractResourceInfo(['containers', 'abc123', 'logs'])
 * // => { typeLabel: 'Containers', name: 'abc123' }
 *
 * extractResourceInfo(['kubernetes', 'pods', 'my-pod', 'default'])
 * // => { typeLabel: 'Pods', name: 'my-pod' }
 */
function extractResourceInfo(parts: string[]): { typeLabel: string; name?: string } {
  if (parts.length === 0) return { typeLabel: 'Dashboard' };

  const resourceType = parts[0];
  let typeLabel = capitalize(resourceType);
  let name: string | undefined;

  // Kubernetes resources: /kubernetes/pods/:name/:namespace
  if (resourceType === 'kubernetes') {
    if (parts.length >= 3) {
      // Detail page: has resource name
      typeLabel = capitalize(parts[1]);
      name = decodeURIComponent(parts[2]);
    }
    // else: base route like /kubernetes/pods - no resource name, typeLabel stays 'Kubernetes'
  }
  // Resources with middleware: /pods/podman/:name or /compose/details/:name
  else if ((parts[1] === 'podman' || parts[1] === 'details') && parts.length >= 3) {
    name = decodeURIComponent(parts[2]);
  }
  // Generic resources: /containers/:name (but not kubernetes base routes)
  else if (parts.length >= 2) {
    name = decodeURIComponent(parts[1]);
  }

  return { typeLabel, name };
}

/**
 * Convert a URL to a human-readable display name for navigation history
 * @param url - The URL to convert
 * @param registryBreadcrumb - Optional breadcrumb path from navigation registry
 * @returns Human-readable display name
 * @example
 * urlToDisplayName('/')
 * // => 'Dashboard'
 *
 * urlToDisplayName('/containers')
 * // => 'Containers'
 *
 * urlToDisplayName('/containers/abc123/logs')
 * // => 'Containers > abc123 > logs'
 *
 * urlToDisplayName('/kubernetes/pods', ['Kubernetes', 'Pods'])
 * // => 'Kubernetes > Pods'
 *
 * urlToDisplayName('/kubernetes/pods/my-pod/default/logs', ['Kubernetes', 'Pods'])
 * // => 'Kubernetes > Pods > my-pod > logs'
 */
function urlToDisplayName(url: string, registryBreadcrumb?: string[]): string {
  const { parts } = parseUrl(url);

  // Extract resource type and name
  const { typeLabel, name } = extractResourceInfo(parts);

  // Simple case: just the resource type (e.g., /containers)
  if (parts.length === 1) return typeLabel;

  // If we have a resource name (detail page)
  if (name) {
    // Build breadcrumb with resource name
    const breadcrumb =
      registryBreadcrumb && registryBreadcrumb.length > 0
        ? [...registryBreadcrumb, truncate(name, 20)]
        : [typeLabel, truncate(name, 20)];

    // Extract and add tab name (last segment) if present
    // For regular resources: /containers/:name/:tab (3+ parts)
    // For resources with middleware: /pods/podman/:name/:tab (4+ parts)
    // For kubernetes: /kubernetes/:type/:name/:namespace/:tab (5+ parts)
    const resourceType = parts[0];
    const minPartsForTab = resourceType === 'kubernetes' ? 5 : parts[1] === 'podman' || parts[1] === 'details' ? 4 : 3;

    // Tab is always the last segment if we have enough parts
    if (parts.length >= minPartsForTab) {
      const tabSegment = parts[parts.length - 1];
      breadcrumb.push(capitalize(tabSegment));
    }

    return breadcrumb.join(' > ');
  }

  return registryBreadcrumb?.length ? registryBreadcrumb.join(' > ') : typeLabel;
}

/**
 * Find navigation registry entry that matches a URL, returning entry and breadcrumb path
 * @param url - The URL to find in the registry
 * @param entries - Array of navigation registry entries to search
 * @param parentPath - Accumulator for breadcrumb path (used in recursion)
 * @returns Object with matching entry and full breadcrumb path, or undefined if not found
 * @example
 * findNavigationEntry('/containers/abc123/logs', registry)
 * // => { entry: { name: 'Containers', link: '/containers', ... }, breadcrumb: ['Containers'] }
 *
 * findNavigationEntry('/kubernetes/pods/my-pod', registry)
 * // => { entry: { name: 'Pods', link: '/kubernetes/pods', ... }, breadcrumb: ['Kubernetes', 'Pods'] }
 *
 * findNavigationEntry('/unknown', registry)
 * // => undefined
 */
function findNavigationEntry(
  url: string,
  entries: NavigationRegistryEntry[],
  parentPath: string[] = [],
): { entry: NavigationRegistryEntry; breadcrumb: string[] } | undefined {
  const { path } = parseUrl(url);

  for (const entry of entries) {
    const currentPath = [...parentPath, entry.name];

    // Check nested items (for groups and submenus)
    if (entry.items) {
      const found = findNavigationEntry(url, entry.items, currentPath);
      if (found) return found;
    }

    // Check if URL matches this entry's link
    if (path === entry.link || path.startsWith(entry.link + '/')) {
      return { entry, breadcrumb: currentPath };
    }
  }

  return undefined;
}

/**
 * Check if a URL matches a route pattern
 * @param url - The URL to check
 * @param routeHref - The route pattern to match against
 * @returns True if URL matches the route pattern
 * @example
 * matchesRoute('/preferences/default/resources', '/preferences/default/resources')
 * // => true (exact match)
 *
 * matchesRoute('/preferences/default/resources/cpu', '/preferences/default/resources')
 * // => true (starts with route + '/')
 *
 * matchesRoute('/preferences/other', '/preferences/default/resources')
 * // => false (different route)
 */
function matchesRoute(url: string, routeHref: string): boolean {
  return url === routeHref || url.startsWith(routeHref + '/') || (routeHref.endsWith('/') && url.startsWith(routeHref));
}

/**
 * Get display name and icon for a URL from navigation registry or fallback to URL parsing
 * @param url - The URL to get entry info for
 * @returns Object with display name and optional icon
 * @example
 * getEntryInfo('/')
 * // => { name: 'Dashboard', icon: { iconComponent: DashboardIcon } }
 *
 * getEntryInfo('/containers')
 * // => { name: 'Containers', icon: { ... } }
 *
 * getEntryInfo('/containers/abc123/logs')
 * // => { name: 'Containers > abc123', icon: { ... } }
 *
 * getEntryInfo('/preferences/default/resources')
 * // => { name: 'Resources', icon: { iconComponent: SettingsIcon } }
 */
function getEntryInfo(url: string): { name: string; icon?: HistoryEntryIcon } {
  const { path } = parseUrl(url);

  // Handle Dashboard
  if (path === '/') {
    return { name: 'Dashboard', icon: { iconComponent: DashboardIcon } };
  }

  // Handle Preferences
  if (path.startsWith('/preferences/default/')) {
    return { name: 'Preferences', icon: { iconComponent: SettingsIcon } };
  }

  // Check navigation registry
  const registry = get(navigationRegistry);
  const result = findNavigationEntry(url, registry);
  if (result) {
    // Always use urlToDisplayName, passing registry breadcrumb for base routes
    return { name: urlToDisplayName(url, result.breadcrumb), icon: result.entry.icon };
  }

  // Check settings navigation entries (sorted by specificity)
  const sortedEntries = settingsNavigationEntries.toSorted((a, b) => b.href.length - a.href.length);
  for (const route of sortedEntries) {
    if (matchesRoute(path, route.href)) {
      return {
        name: route.title,
        icon: route.icon ? { iconComponent: route.icon } : undefined,
      };
    }
  }

  // Fallback to URL-based name
  return { name: urlToDisplayName(url), icon: undefined };
}

/**
 * Extract the hash path from a full Electron navigation entry URL.
 * In hash-mode routing, URLs look like 'file:///path/index.html#/containers'
 * or 'http://localhost:5173/#/containers'. This extracts the '/containers' part.
 */
function extractHashPath(url: string): string {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return '/';
  const hash = url.substring(hashIndex + 1);
  return hash.startsWith('/') ? hash : `/${hash}`;
}

/**
 * Refresh canGoBack/canGoForward from Electron's NavigationHistory API.
 * Called after route changes and popstate events to keep reactive state in sync.
 */
export async function refreshNavigationState(): Promise<void> {
  if (!window.navigationHistoryCanGoBack || !window.navigationHistoryCanGoForward) {
    console.warn('[nav] NavigationHistory IPC not available');
    return;
  }
  const [canGoBack, canGoForward, entries, activeIndex] = await Promise.all([
    window.navigationHistoryCanGoBack(),
    window.navigationHistoryCanGoForward(),
    window.navigationHistoryGetAllEntries(),
    window.navigationHistoryGetActiveIndex(),
  ]);
  console.log(`[nav] canGoBack=${canGoBack} canGoForward=${canGoForward} entries=${entries.length} active=${activeIndex}`);
  entries.forEach((e, i) => console.log(`[nav]  ${i === activeIndex ? '>' : ' '} [${i}] ${e.url}`));
  navigationState.canGoBack = canGoBack;
  navigationState.canGoForward = canGoForward;
}

/**
 * Navigate back one step in history using the browser's native back
 * @example
 * goBack() // navigates to the previous page
 */
export function goBack(): void {
  if (navigationState.canGoBack) {
    history.back();
    window.telemetryTrack('navigation.back').catch(console.error);
  }
}

/**
 * Navigate forward one step in history using the browser's native forward
 * @example
 * goForward() // navigates to the next page
 */
export function goForward(): void {
  if (navigationState.canGoForward) {
    history.forward();
    window.telemetryTrack('navigation.forward').catch(console.error);
  }
}

/**
 * Navigate to a specific index in the Electron navigation history
 * @param index - The absolute index in Electron's navigation history
 * @example
 * // User clicks on a specific history entry in a dropdown
 * goToHistoryIndex(3) // jumps to the entry at index 3
 */
export async function goToHistoryIndex(index: number): Promise<void> {
  await window.navigationHistoryGoToIndex(index);
}

/**
 * Fetch entries from Electron's NavigationHistory and convert to display entries
 */
async function fetchElectronEntries(): Promise<{ entries: { url: string; title: string }[]; activeIndex: number }> {
  const [entries, activeIndex] = await Promise.all([
    window.navigationHistoryGetAllEntries(),
    window.navigationHistoryGetActiveIndex(),
  ]);
  return { entries, activeIndex };
}

/**
 * Get all history entries that can be navigated backward to.
 * Queries Electron's NavigationHistory API and converts URLs to display names.
 * @returns Array of history entries before the current position
 */
export async function getBackEntries(): Promise<HistoryEntry[]> {
  const { entries, activeIndex } = await fetchElectronEntries();
  const result: HistoryEntry[] = [];

  for (let i = activeIndex - 1; i >= 0; i--) {
    const entry = entries[i];
    if (!entry?.url.includes('#')) continue;
    const hashPath = extractHashPath(entry.url);
    const info = getEntryInfo(hashPath);
    result.push({ index: i, name: info.name, icon: info.icon });
  }
  return result;
}

/**
 * Get all history entries that can be navigated forward to.
 * Queries Electron's NavigationHistory API and converts URLs to display names.
 * @returns Array of history entries after the current position
 */
export async function getForwardEntries(): Promise<HistoryEntry[]> {
  const { entries, activeIndex } = await fetchElectronEntries();
  const result: HistoryEntry[] = [];

  for (let i = activeIndex + 1; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry?.url.includes('#')) continue;
    const hashPath = extractHashPath(entry.url);
    const info = getEntryInfo(hashPath);
    result.push({ index: i, name: info.name, icon: info.icon });
  }
  return result;
}

// Refresh state on popstate (triggered by history.back() / history.forward())
window.addEventListener('popstate', () => {
  refreshNavigationState().catch(console.error);
});

// Refresh state when tinro pushes new routes (pushState does not trigger popstate)
router.subscribe(() => {
  refreshNavigationState().catch(console.error);
});

// Listen for navigation commands from command palette
window.events?.receive('navigation-go-back', () => {
  goBack();
});

window.events?.receive('navigation-go-forward', () => {
  goForward();
});
