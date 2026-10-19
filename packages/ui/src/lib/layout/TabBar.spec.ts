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

test('dropping a tab on another tab reorders it once at that position', async () => {
  const onReorder = vi.fn();
  const dataTransfer = {
    getData: vi.fn(() => JSON.stringify({ panelId: 'main-tabs', tabId: 'third' })),
  };

  render(TabBar, {
    ...props,
    onReorder,
    tabs: [
      { id: 'main', key: 'main', title: 'Containers', pinned: true },
      { id: 'first', key: 'first', title: 'first' },
      { id: 'second', key: 'second', title: 'second' },
      { id: 'third', key: 'third', title: 'third' },
    ],
  });

  await fireEvent.drop(screen.getByRole('tab', { name: /second/ }), { dataTransfer });

  expect(onReorder).toHaveBeenCalledTimes(1);
  expect(onReorder).toHaveBeenCalledWith('third', 'second');
});

test('dropping on the right half of a tab inserts after it', async () => {
  const onReorder = vi.fn();
  const dataTransfer = {
    getData: vi.fn(() => JSON.stringify({ panelId: 'main-tabs', tabId: 'first' })),
  };

  render(TabBar, {
    ...props,
    onReorder,
    tabs: [
      { id: 'main', key: 'main', title: 'Containers', pinned: true },
      { id: 'first', key: 'first', title: 'first' },
      { id: 'second', key: 'second', title: 'second' },
      { id: 'third', key: 'third', title: 'third' },
    ],
  });

  const targetTab = screen.getByRole('tab', { name: /second/ });
  vi.spyOn(targetTab, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 100 } as DOMRect);
  const dropEvent = new MouseEvent('drop', { bubbles: true, cancelable: true, clientX: 75 });
  Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });
  targetTab.dispatchEvent(dropEvent);

  expect(onReorder).toHaveBeenCalledTimes(1);
  expect(onReorder).toHaveBeenCalledWith('first', 'third');
});
