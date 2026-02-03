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

import { kubernetesNoCurrentContext } from '/@/stores/kubernetes-no-current-context';
import { navigationRegistry } from '/@/stores/navigation/navigation-registry';

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

// In production we are going from 'index.html' to the Dashboard page during startup, so we need to skip this route
function isValidRoute(url: string): boolean {
  // Must start with '/' for relative routes
  if (!url.startsWith('/')) {
    return false;
  }

  if (url.includes('.html')) {
    return false;
  }

  return true;
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
      // When going to Kubernetes page (submenu) - `/kubernetes` and you:
      // 1. DONT have created cluster yet, you will be redirected to the Empty page - `/kubernetes`
      // 2. HAVE created cluster, you are imidiatly redirected to the Dashboard page - `/kubernetes/dashboard`
      // When going back in case:
      // 1. We want to go to `/kubernetes` page where should be the Empty Kubernetes page
      // 2. We want to skip the `kubernetes` submenu base route - `/kubernetes` since we have not actually navigated to it
      // (we have been imidiatly redirected to the Kubernetes Dashboard page)
      if (!get(kubernetesNoCurrentContext)) {
        return;
      }
    }

    if (!isValidRoute(navigation.url)) {
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
