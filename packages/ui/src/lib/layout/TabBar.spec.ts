import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import TabBar from './TabBar.svelte';

const onClose = vi.fn();
const props = {
  panelId: 'main-tabs',
  tabs: [
    { id: 'main', key: 'main', title: 'Containers', pinned: true },
    { id: 'container', key: 'container', title: 'demo-nginx' },
  ],
  activeTabId: 'container',
  onSelect: vi.fn(),
  onClose,
  onCloseOthers: vi.fn(),
  onCloseAllInPanel: vi.fn(),
  onPinToggle: vi.fn(),
  onReorder: vi.fn(),
  onMoveFromOtherPanel: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('right-click exposes core tab actions without split or section actions', async () => {
  render(TabBar, props);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /options|more/i })).not.toBeInTheDocument();
  await fireEvent.contextMenu(screen.getByRole('tab', { name: /demo-nginx/ }), { clientX: 20, clientY: 20 });
  expect(screen.getAllByRole('menuitem').map(item => item.textContent?.trim())).toEqual([
    'Close Other Tabs',
    'Pin Tab',
  ]);
  await fireEvent.click(screen.getByRole('menuitem', { name: 'Pin Tab', exact: true }));
  expect(props.onPinToggle).toHaveBeenCalledWith('container');
});

test('keyboard context menu exposes the same options', async () => {
  render(TabBar, props);
  await fireEvent.keyDown(screen.getByRole('tab', { name: /demo-nginx/ }), { key: 'F10', shiftKey: true });
  expect(screen.getByRole('menuitem', { name: 'Pin Tab' })).toBeInTheDocument();
});

test('the shared page tab cannot be closed', () => {
  render(TabBar, props);
  expect(screen.queryByRole('button', { name: 'Close tab Containers' })).not.toBeInTheDocument();
});
