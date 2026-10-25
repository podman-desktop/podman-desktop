import { afterEach, beforeEach, expect, test } from 'vitest';

import { tabPreferences } from './tab-preferences.svelte';
import {
  closeAllResourceTabs,
  closeResourceTab,
  MAIN_TAB,
  openRouteInBackgroundTab,
  openRouteInNewTab,
  prepareTabForRoute,
  recentlyClosedTabs,
  reorderResourceTab,
  restoreRecentlyClosedTab,
  selectResourceTab,
  tabsState,
} from './tabs.svelte';

beforeEach(() => {
  recentlyClosedTabs.splice(0);
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

test('selecting Main does not swallow a later resource navigation in the same section', () => {
  tabsState.tabs[0]!.stack = [{ url: '/containers' }];
  tabsState.tabs[0]!.index = 0;
  selectResourceTab(MAIN_TAB);
  prepareTabForRoute('/containers');
  prepareTabForRoute('/containers/new-container/summary');
  expect(tabsState.activeId).toBe('/containers/new-container');
  expect(tabsState.tabs[0]!.stack).toEqual([{ url: '/containers' }]);
});

test('a selected resource retains its subviews but does not claim another resource', () => {
  openRouteInNewTab('/containers/alpha/summary');
  prepareTabForRoute('/containers/alpha/logs');
  expect(tabsState.activeId).toBe('/containers/alpha');
  prepareTabForRoute('/containers/beta/summary');
  expect(tabsState.activeId).toBe('/containers/beta');
});

test('settings and Kubernetes page tabs retain their subpage redirects', () => {
  for (const [url, subpage] of [
    ['/preferences', '/preferences/resources'],
    ['/kubernetes', '/kubernetes/dashboard'],
  ]) {
    openRouteInNewTab(url!);
    prepareTabForRoute(subpage!);
    expect(tabsState.activeId).toBe(`page:${url}`);
  }
});

test('closing remembers only five tabs, restoring keeps its history and removes the recent entry', () => {
  for (let i = 0; i < 6; i++) {
    const url = `/containers/item-${i}/summary`;
    openRouteInNewTab(url);
    closeResourceTab(`/containers/item-${i}`);
  }
  expect(recentlyClosedTabs).toHaveLength(5);
  expect(recentlyClosedTabs[0]!.tab.id).toBe('/containers/item-5');
  restoreRecentlyClosedTab('/containers/item-5');
  expect(tabsState.activeId).toBe('/containers/item-5');
  expect(tabsState.tabs.find(tab => tab.id === tabsState.activeId)?.stack).toEqual([
    { url: '/containers/item-5/summary' },
  ]);
  expect(recentlyClosedTabs.some(item => item.tab.id === tabsState.activeId)).toBe(false);
});

test('close all retains pinned tabs and records the unpinned tabs for restoration', () => {
  tabsState.tabs[2]!.pinned = true;
  closeAllResourceTabs();
  expect(tabsState.tabs.map(tab => tab.id)).toEqual([MAIN_TAB, 'second']);
  expect(recentlyClosedTabs.map(item => item.tab.id)).toEqual(['third', 'first']);
});

test('a restored missing resource cannot redirect over the main page', () => {
  tabsState.tabs[0]!.stack = [{ url: '/preferences/resources' }];
  tabsState.tabs[0]!.index = 0;
  openRouteInNewTab('/secrets/engine/deleted/summary');
  selectResourceTab('/secrets/engine/deleted');
  prepareTabForRoute('/secrets');
  expect(tabsState.activeId).toBe('/secrets/engine/deleted');
  expect(tabsState.tabs[0]!.stack).toEqual([{ url: '/preferences/resources' }]);
});
