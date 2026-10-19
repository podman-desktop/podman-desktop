import { afterEach, beforeEach, expect, test } from 'vitest';

import { tabPreferences } from './tab-preferences.svelte';
import {
  MAIN_TAB,
  openRouteInBackgroundTab,
  openRouteInNewTab,
  prepareTabForRoute,
  reorderResourceTab,
  tabsState,
} from './tabs.svelte';

beforeEach(() => {
  tabPreferences.tabsEnabled = true;
  tabsState.activeId = MAIN_TAB;
  tabsState.tabs = [
    { id: MAIN_TAB, title: 'Containers', pinned: true, stack: [], index: -1 },
    { id: 'first', title: 'first', pinned: false, stack: [], index: -1 },
    { id: 'second', title: 'second', pinned: false, stack: [], index: -1 },
    { id: 'third', title: 'third', pinned: false, stack: [], index: -1 },
  ];
});

afterEach(() => {
  tabPreferences.tabsEnabled = false;
});

test('reorders a tab before the requested tab and preserves the page tab', () => {
  reorderResourceTab('first', 'third');

  expect(tabsState.tabs.map(tab => tab.id)).toEqual([MAIN_TAB, 'second', 'first', 'third']);
});

test('opens a top-level navigation route in its own tab', () => {
  openRouteInNewTab('/containers');

  expect(tabsState.activeId).toBe('page:/containers');
  expect(tabsState.tabs.find(tab => tab.id === 'page:/containers')?.stack).toEqual([{ url: '/containers' }]);
});

test('opens a destination in a background tab without changing the current tab', () => {
  openRouteInBackgroundTab('/containers/container-1/summary', 'container-1');

  expect(tabsState.activeId).toBe(MAIN_TAB);
  expect(tabsState.tabs.find(tab => tab.id === '/containers/container-1')?.stack).toEqual([
    { url: '/containers/container-1/summary' },
  ]);
  expect(tabsState.tabs.find(tab => tab.id === '/containers/container-1')?.title).toBe('container-1');
});

test('reuses an existing navigation tab for the same route', () => {
  openRouteInNewTab('/pods');
  openRouteInNewTab('/pods');

  expect(tabsState.tabs.filter(tab => tab.id === 'page:/pods')).toHaveLength(1);
});

test('keeps an explicitly opened page tab selected for its route', () => {
  openRouteInNewTab('/images');
  prepareTabForRoute('/images');

  expect(tabsState.activeId).toBe('page:/images');
});
