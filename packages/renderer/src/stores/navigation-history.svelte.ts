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
import { currentRoute } from '/@/stores/current-route-hint.svelte';
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

// Action keywords that appear in URLs (not resource names)
const ACTION_KEYWORDS = ['build', 'pull', 'import', 'save', 'load', 'create', 'play'];

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
 * Get the base resource path from a URL, removing tab segments
 * @param url - The URL to process
 * @returns The base resource path without tab segment
 * @example
 * getBaseResourcePath('/containers/abc123/logs')
 * // => '/containers/abc123'
 *
 * getBaseResourcePath('/containers/abc123/inspect')
 * // => '/containers/abc123'
 *
 * getBaseResourcePath('/containers')
 * // => '/containers'
 */
function getBaseResourcePath(url: string): string {
  const { parts } = parseUrl(url);

  // For detail pages, return path without the last segment (which is the tab)
  // e.g., /containers/abc123/logs -> /containers/abc123
  if (parts.length >= 3) {
    return '/' + parts.slice(0, -1).join('/');
  }

  return url.split('?')[0];
}

/**
 * Check if two URLs represent the same resource (ignoring tab differences)
 * @param url1 - First URL to compare
 * @param url2 - Second URL to compare
 * @returns True if both URLs point to the same resource
 * @example
 * isSameResource('/containers/abc123/logs', '/containers/abc123/inspect')
 * // => true (same container, different tabs)
 *
 * isSameResource('/containers/abc123/logs', '/containers/xyz789/logs')
 * // => false (different containers)
 */
function isSameResource(url1: string, url2: string): boolean {
  const base1 = getBaseResourcePath(url1);
  const base2 = getBaseResourcePath(url2);
  return base1 === base2;
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
  else if (parts.length >= 2 && !ACTION_KEYWORDS.includes(parts[1])) {
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
 * // => 'Containers > abc123'
 *
 * urlToDisplayName('/kubernetes/pods', ['Kubernetes', 'Pods'])
 * // => 'Kubernetes > Pods'
 *
 * urlToDisplayName('/kubernetes/pods/my-pod/default', ['Kubernetes', 'Pods'])
 * // => 'Kubernetes > Pods > my-pod'
 */
function urlToDisplayName(url: string, registryBreadcrumb?: string[]): string {
  const { parts } = parseUrl(url);

  // Extract resource type and name
  const { typeLabel, name } = extractResourceInfo(parts);

  // Simple case: just the resource type (e.g., /containers)
  if (parts.length === 1) return typeLabel;

  // If we have a resource name (detail page)
  if (name) {
    // Use full registry breadcrumb + resource name
    // e.g., "Kubernetes > ConfigMaps & Secrets > my-config"
    const breadcrumb =
      registryBreadcrumb && registryBreadcrumb.length > 0
        ? [...registryBreadcrumb, truncate(name, 20)]
        : [typeLabel, truncate(name, 20)];
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
  const sortedEntries = [...settingsNavigationEntries].sort((a, b) => b.href.length - a.href.length);
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
 * Navigate to a specific index in the history stack
 * @param index - The history stack index to navigate to
 * @returns True if navigation occurred, false if index is invalid or current
 * @example
 * // If history is ['/', '/containers', '/images'] and index is 1:
 * navigateToIndex(0) // navigates to '/', returns true
 * navigateToIndex(1) // already at index 1, returns false
 * navigateToIndex(5) // invalid index, returns false
 */
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

/**
 * Navigate back one step in history (browser-like back button)
 * @example
 * // If history is ['/', '/containers', '/images'] and currently at index 2:
 * goBack() // navigates to '/containers' (index 1)
 */
export function goBack(): void {
  if (navigateToIndex(navigationHistory.index - 1)) {
    window.telemetryTrack('navigation.back').catch(console.error);
  }
}

/**
 * Navigate forward one step in history (browser-like forward button)
 * @example
 * // If history is ['/', '/containers', '/images'] and currently at index 0:
 * goForward() // navigates to '/containers' (index 1)
 */
export function goForward(): void {
  if (navigateToIndex(navigationHistory.index + 1)) {
    window.telemetryTrack('navigation.forward').catch(console.error);
  }
}

/**
 * Check if a URL is a submenu base route that immediately redirects
 * Submenu routes (like /kubernetes) redirect to their first item (like /kubernetes/dashboard)
 * and should not be added to history to prevent navigation issues when going back.
 * @param url - The URL to check
 * @returns True if the URL is a submenu base route
 * @example
 * isSubmenuBaseRoute('/kubernetes')
 * // => true (submenu that redirects to /kubernetes/dashboard)
 *
 * isSubmenuBaseRoute('/containers')
 * // => false (regular entry, not a submenu)
 */
function isSubmenuBaseRoute(url: string): boolean {
  const registry = get(navigationRegistry);
  return registry.some(entry => entry.type === 'submenu' && entry.link === url);
}

/**
 * Navigate to a specific index in the history stack (public API)
 * @param index - The history stack index to navigate to
 * @example
 * // User clicks on a specific history entry in a dropdown
 * goToHistoryIndex(3) // jumps to the entry at index 3
 */
export function goToHistoryIndex(index: number): void {
  navigateToIndex(index);
}

/**
 * Get history entries in a specific direction (back or forward)
 * @param direction - Either BACK or FORWARD
 * @returns Array of history entries with index, name, and icon
 * @example
 * // If history is ['/', '/containers', '/images', '/volumes'] and index is 2:
 * getEntries(BACK)
 * // => [
 * //   { index: 1, name: 'Containers', icon: {...} },
 * //   { index: 0, name: 'Dashboard', icon: {...} }
 * // ]
 *
 * getEntries(FORWARD)
 * // => [{ index: 3, name: 'Volumes', icon: {...} }]
 */
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

/**
 * Get all history entries that can be navigated backward to
 * @returns Array of history entries before the current position
 * @example
 * // If history is ['/', '/containers', '/images'] and currently at index 2:
 * getBackEntries()
 * // => [
 * //   { index: 1, name: 'Containers', icon: {...} },
 * //   { index: 0, name: 'Dashboard', icon: {...} }
 * // ]
 */
export function getBackEntries(): HistoryEntry[] {
  return getEntries(BACK);
}

/**
 * Get all history entries that can be navigated forward to
 * @returns Array of history entries after the current position
 * @example
 * // If history is ['/', '/containers', '/images'] and currently at index 0:
 * getForwardEntries()
 * // => [
 * //   { index: 1, name: 'Containers', icon: {...} },
 * //   { index: 2, name: 'Images', icon: {...} }
 * // ]
 */
export function getForwardEntries(): HistoryEntry[] {
  return getEntries(FORWARD);
}

/**
 * Check if a URL is a detail page root that will redirect to a tab
 * These root URLs should not be added to history since they immediately redirect
 * @param url - The URL to check
 * @returns True if the URL is a detail page root that redirects
 * @example
 * isDetailPageRoot('/containers/abc123/')
 * // => true (redirects to /containers/abc123/summary or /containers/abc123/logs)
 *
 * isDetailPageRoot('/containers/abc123/logs')
 * // => false (actual tab page, not a root)
 *
 * isDetailPageRoot('/')
 * // => false (dashboard, not a detail page root)
 */
function isDetailPageRoot(url: string): boolean {
  const { path, parts } = parseUrl(url);

  // Must end with / and not be just '/' and have at least 2 segments
  return path.endsWith('/') && path !== '/' && parts.length >= 2;
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

    // Skip detail page roots (e.g., /containers/abc123/) as they immediately redirect to a tab
    if (isDetailPageRoot(navigation.url)) {
      return;
    }

    // Truncate forward history if we're not at the end
    if (navigationHistory.index < navigationHistory.stack.length - 1) {
      navigationHistory.stack = navigationHistory.stack.slice(0, navigationHistory.index + 1);
    }

    const currentUrl = navigationHistory.stack[navigationHistory.index];

    // Handle tab routes: update existing entry for the same resource instead of adding new
    if (currentRoute.navigationHint === 'tab') {
      // Check if the current history entry is for the same resource
      if (currentUrl && isSameResource(currentUrl, navigation.url)) {
        // Update the current entry with the new tab URL (keeps latest tab)
        // e.g. containers/abc123/summary -> containers/abc123/logs
        navigationHistory.stack[navigationHistory.index] = navigation.url;
      } else {
        // First time visiting this resource, add it to history
        navigationHistory.stack = [...navigationHistory.stack, navigation.url];
        navigationHistory.index = navigationHistory.stack.length - 1;
      }
    }
    // Handle non-tab routes normally
    else if (currentUrl !== navigation.url) {
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
