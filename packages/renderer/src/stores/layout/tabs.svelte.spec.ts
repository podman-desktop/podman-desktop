import { beforeEach, expect, test } from 'vitest';

import { MAIN_TAB, reorderResourceTab, tabsState } from './tabs.svelte';

beforeEach(() => {
  tabsState.activeId = MAIN_TAB;
  tabsState.tabs = [
    { id: MAIN_TAB, title: 'Containers', pinned: true, stack: [], index: -1 },
    { id: 'first', title: 'first', pinned: false, stack: [], index: -1 },
    { id: 'second', title: 'second', pinned: false, stack: [], index: -1 },
    { id: 'third', title: 'third', pinned: false, stack: [], index: -1 },
  ];
});

test('reorders a tab before the requested tab and preserves the page tab', () => {
  reorderResourceTab('first', 'third');

  expect(tabsState.tabs.map(tab => tab.id)).toEqual([MAIN_TAB, 'second', 'first', 'third']);
});
