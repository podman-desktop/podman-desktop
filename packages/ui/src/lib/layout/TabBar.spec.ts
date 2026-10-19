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

test('keeps the add-tab action beside the scrollable tabs and close-all at the far edge', () => {
  render(TabBar, { ...props, onAddTab: vi.fn(), showCloseAllButton: true });

  const tabList = screen.getByRole('tablist');
  expect(tabList).not.toContainElement(screen.getByRole('button', { name: 'Open a new tab' }));
  expect(tabList).not.toContainElement(screen.getByRole('button', { name: 'Close unpinned tabs' }));
  expect(tabList.parentElement).toContainElement(screen.getByRole('button', { name: 'Open a new tab' }));
  expect(screen.getByRole('button', { name: 'Close unpinned tabs' })).toBeInTheDocument();
  expect(
    screen
      .getByRole('button', { name: 'Open a new tab' })
      .compareDocumentPosition(screen.getByRole('button', { name: 'Close unpinned tabs' })),
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('marks the selected tab with the tab highlight underline', () => {
  render(TabBar, props);

  expect(screen.getByRole('tab', { name: /demo-nginx/ })).toHaveClass('border-b-[var(--pd-tab-highlight)]');
  expect(screen.getByRole('tab', { name: /Containers/ })).toHaveClass('border-b-transparent');
});

test('scrolls the selected tab into view when it is outside the visible strip', async () => {
  const frameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 0;
  });
  const { rerender } = render(TabBar, {
    ...props,
    activeTabId: 'main',
    tabs: [
      { id: 'main', key: 'main', title: 'Main', pinned: true },
      { id: 'second', key: 'second', title: 'Second' },
      { id: 'third', key: 'third', title: 'Third' },
    ],
  });

  const tabList = screen.getByRole('tablist');
  Object.defineProperty(tabList, 'clientWidth', { configurable: true, value: 100 });
  vi.spyOn(tabList, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 100 } as DOMRect);
  vi.spyOn(screen.getByRole('tab', { name: 'Third' }), 'getBoundingClientRect').mockReturnValue({
    left: 100,
    right: 150,
  } as DOMRect);

  await rerender({
    ...props,
    activeTabId: 'third',
    tabs: [
      { id: 'main', key: 'main', title: 'Main', pinned: true },
      { id: 'second', key: 'second', title: 'Second' },
      { id: 'third', key: 'third', title: 'Third' },
    ],
  });

  expect(tabList.scrollLeft).toBe(50);
  frameSpy.mockRestore();
});

test('scrolls newly added background tabs into view without selecting them', async () => {
  const frameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 0;
  });
  const { rerender } = render(TabBar, {
    ...props,
    activeTabId: 'main',
    tabs: [{ id: 'main', key: 'main', title: 'Containers', pinned: true }],
  });

  const tabList = screen.getByRole('tablist');
  Object.defineProperty(tabList, 'clientWidth', { configurable: true, value: 100 });
  Object.defineProperty(tabList, 'scrollWidth', { configurable: true, value: 300 });

  await rerender({
    ...props,
    activeTabId: 'main',
    tabs: [
      { id: 'main', key: 'main', title: 'Containers', pinned: true },
      { id: 'background', key: 'background', title: 'New resource' },
    ],
  });

  expect(tabList.scrollLeft).toBe(200);
  expect(screen.getByRole('tab', { name: 'Containers' })).toHaveAttribute('aria-selected', 'true');
  frameSpy.mockRestore();
});

test('scrolling an overflowing tab strip does not scroll the page', () => {
  render(TabBar, props);

  const tabList = screen.getByRole('tablist');
  Object.defineProperty(tabList, 'clientWidth', { configurable: true, value: 100 });
  Object.defineProperty(tabList, 'scrollWidth', { configurable: true, value: 300 });
  const pageWheelHandler = vi.fn();
  tabList.parentElement?.addEventListener('wheel', pageWheelHandler);
  const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 60 });

  tabList.dispatchEvent(event);

  expect(tabList.scrollLeft).toBe(60);
  expect(event.defaultPrevented).toBe(true);
  expect(pageWheelHandler).not.toHaveBeenCalled();
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
