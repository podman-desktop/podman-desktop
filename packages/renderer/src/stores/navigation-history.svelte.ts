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

// Tab names that appear at the end of detail URLs
const TAB_NAMES = ['summary', 'logs', 'inspect', 'kube', 'terminal', 'k8s-terminal', 'tty', 'history'];

// Action keywords that appear in URLs (not resource names)
const ACTION_KEYWORDS = ['build', 'pull', 'import', 'save', 'load', 'create', 'play'];

// Helper: Parse URL into path and parts
interface ParsedUrl {
  path: string;
  parts: string[];
}

function parseUrl(url: string): ParsedUrl {
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);
  return { path, parts };
}

// Helper: Capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: Check if a part is a tab name
function isTabName(part: string): boolean {
  return TAB_NAMES.includes(part.toLowerCase());
}

// Helper: Truncate long strings
function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}

/**
 * Extract the base resource path from a URL (removes the tab if present)
 * e.g., /containers/abc123/summary -> /containers/abc123
 */
function getBaseResourcePath(url: string): string {
  const { path, parts } = parseUrl(url);

  if (parts.length === 0) return path;

  const lastPart = parts[parts.length - 1] ?? '';

  // If last part is a tab name, remove it
  if (isTabName(lastPart)) {
    return '/' + parts.slice(0, -1).join('/');
  }

  return path;
}

/**
 * Check if two URLs are the same resource with different tabs
 * (e.g., /containers/abc/summary vs /containers/abc/logs)
 */
function isSameResourceDifferentTab(url1: string, url2: string): boolean {
  if (!url1 || !url2) return false;

  const basePath1 = getBaseResourcePath(url1);
  const basePath2 = getBaseResourcePath(url2);
  const { path: path1 } = parseUrl(url1);
  const { path: path2 } = parseUrl(url2);

  // Must have the same base path and both must have tabs
  return basePath1 === basePath2 && basePath1 !== path1 && basePath2 !== path2;
}

/**
 * Extract resource information from URL parts
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
      typeLabel = capitalize(parts[1] ?? resourceType);
      name = decodeURIComponent(parts[2] ?? '');
    }
    // else: base route like /kubernetes/pods - no resource name, typeLabel stays 'Kubernetes'
  }
  // Resources with middleware: /pods/podman/:name or /compose/details/:name
  else if ((parts[1] === 'podman' || parts[1] === 'details') && parts.length >= 3) {
    name = decodeURIComponent(parts[2] ?? '');
  }
  // Generic resources: /containers/:name (but not kubernetes base routes)
  else if (parts.length >= 2 && !ACTION_KEYWORDS.includes(parts[1] ?? '')) {
    name = decodeURIComponent(parts[1] ?? '');
  }

  return { typeLabel, name };
}

// Convert URL to display name
function urlToDisplayName(url: string, registryBreadcrumb?: string[]): string {
  const { parts } = parseUrl(url);

  if (parts.length === 0) return 'Dashboard';
  if (parts.length === 1) return capitalize(parts[0]);

  // Remove tab from parts if present
  const lastPart = parts[parts.length - 1] ?? '';
  const contentParts = isTabName(lastPart) ? parts.slice(0, -1) : parts;

  // Extract resource type and name
  const { typeLabel, name } = extractResourceInfo(contentParts);

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

  // No resource name (base route) - use registry breadcrumb if available
  if (registryBreadcrumb && registryBreadcrumb.length > 0) {
    return registryBreadcrumb.join(' > ');
  }

  return typeLabel;
}

// Find navigation entry that matches a URL, returning the entry and breadcrumb path
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
 */
function matchesRoute(url: string, routeHref: string): boolean {
  return url === routeHref || url.startsWith(routeHref + '/') || (routeHref.endsWith('/') && url.startsWith(routeHref));
}

// Get entry info (name and icon) for a URL
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

/**
 * Check if a URL is a detail page root that will redirect to a tab
 * (e.g., /containers/abc123/ which redirects to /containers/abc123/summary)
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

    // Check if we're just switching tabs on the same resource
    if (currentUrl && isSameResourceDifferentTab(currentUrl, navigation.url)) {
      // Update the current entry instead of adding a new one
      navigationHistory.stack[navigationHistory.index] = navigation.url;
    } else if (currentUrl !== navigation.url) {
      // Add new entry for different resources
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
