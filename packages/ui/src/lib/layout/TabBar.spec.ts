import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

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
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
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
  expect(tabList).not.toContainElement(screen.getByRole('button', { name: 'Tab actions' }));
  expect(tabList.parentElement).toContainElement(screen.getByRole('button', { name: 'Open a new tab' }));
  expect(screen.getByRole('button', { name: 'Tab actions' })).toBeInTheDocument();
  expect(
    screen
      .getByRole('button', { name: 'Open a new tab' })
      .compareDocumentPosition(screen.getByRole('button', { name: 'Tab actions' })),
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('marks the selected tab with a page-colored surface and no underline', () => {
  render(TabBar, props);

  expect(screen.getByRole('tab', { name: /demo-nginx/ })).toHaveClass('tab-active');
  expect(screen.getByRole('tab', { name: /Containers/ })).not.toHaveClass('tab-active');
  expect(screen.getByRole('tab', { name: /demo-nginx/ })).not.toHaveClass('border-b-[var(--pd-tab-highlight)]');
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

test('Left Arrow from the main tab enters page navigation even when it is the only tab', async () => {
  const onFocusNavigation = vi.fn();
  render(TabBar, { ...props, tabs: [props.tabs[0]!], activeTabId: 'main', onFocusNavigation });
  const mainTab = screen.getByRole('tab', { name: 'Containers' });
  mainTab.focus();
  await fireEvent.keyDown(mainTab, { key: 'ArrowLeft' });
  expect(onFocusNavigation).toHaveBeenCalledOnce();
  expect(props.onSelect).not.toHaveBeenCalled();
});

test('Left Arrow from a resource tab selects the main tab before entering page navigation', async () => {
  const onFocusNavigation = vi.fn();
  render(TabBar, { ...props, onFocusNavigation });
  const resourceTab = screen.getByRole('tab', { name: /demo-nginx/ });
  resourceTab.focus();
  await fireEvent.keyDown(resourceTab, { key: 'ArrowLeft' });
  expect(screen.getByRole('tab', { name: 'Containers' })).toHaveFocus();
  expect(props.onSelect).toHaveBeenCalledWith('main');
  expect(onFocusNavigation).not.toHaveBeenCalled();
});

function pointer(element: HTMLElement, type: string, x: number, pointerType = 'mouse'): Promise<boolean> {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, { pointerId: 1, pointerType, button: 0, clientX: x, clientY: 15 });
  return fireEvent(element, event);
}

function renderDragStrip(): { source: HTMLElement; second: HTMLElement; strip: HTMLElement } {
  render(TabBar, {
    ...props,
    activeTabId: 'main',
    tabs: [props.tabs[0]!, ...['first', 'second', 'third'].map(id => ({ id, key: id, title: id }))],
  });
  screen.getAllByRole('tab').forEach((tab, index) => {
    vi.spyOn(tab, 'getBoundingClientRect').mockReturnValue({
      left: index * 100,
      right: (index + 1) * 100,
      width: 100,
      top: 0,
      bottom: 30,
    } as DOMRect);
    Object.assign(tab, { setPointerCapture: vi.fn(), hasPointerCapture: () => false });
  });
  const strip = screen.getByRole('tablist');
  Object.defineProperty(strip, 'clientWidth', { configurable: true, value: 400 });
  Array.from(strip.children).forEach(child => {
    vi.spyOn(child, 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect);
  });
  vi.spyOn(strip, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 400, top: 0, bottom: 30 } as DOMRect);
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => strip) });
  return {
    source: screen.getByRole('tab', { name: 'first' }),
    second: screen.getByRole('tab', { name: 'second' }),
    strip,
  };
}

test('drag selects its tab, follows the pointer, and shifts a neighbor only after its midpoint', async () => {
  const { source, second } = renderDragStrip();
  await pointer(source, 'pointerdown', 150);
  await pointer(source, 'pointermove', 190);
  expect(props.onSelect).toHaveBeenCalledWith('first');
  expect(source).toHaveFocus();
  expect(source.style.transform).toBe('translateX(40px)');
  expect(second.style.transform).toBe('');
  await pointer(source, 'pointermove', 210);
  expect(second.style.transform).toBe('translateX(-100px)');
  await pointer(source, 'pointerup', 210);
  expect(props.onReorder).toHaveBeenCalledExactlyOnceWith('first', 'third');
  expect(source.style.transform).toBe('');
});

test('dragging left creates the gap before the crossed neighbor', async () => {
  renderDragStrip();
  const third = screen.getByRole('tab', { name: 'third' });
  await pointer(third, 'pointerdown', 350);
  await pointer(third, 'pointermove', 280);
  await pointer(third, 'pointerup', 280);
  expect(props.onReorder).toHaveBeenCalledExactlyOnceWith('third', 'second');
});

test('Escape cancels a drag without reordering', async () => {
  const { source } = renderDragStrip();
  await pointer(source, 'pointerdown', 150);
  await pointer(source, 'pointermove', 290);
  await fireEvent.keyDown(window, { key: 'Escape' });
  await pointer(source, 'pointerup', 290);
  expect(props.onReorder).not.toHaveBeenCalled();
  expect(source.style.transform).toBe('');
});

test('touch swipe leaves native scrolling available instead of capturing a drag', async () => {
  const { source } = renderDragStrip();
  await pointer(source, 'pointerdown', 150, 'touch');
  await pointer(source, 'pointermove', 210, 'touch');
  await pointer(source, 'pointerup', 210, 'touch');
  expect(source.setPointerCapture).not.toHaveBeenCalled();
  expect(props.onSelect).not.toHaveBeenCalled();
  expect(props.onReorder).not.toHaveBeenCalled();
});

test('holding a drag at an edge keeps scrolling without more pointer moves', async () => {
  const frames = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++nextId, callback);
    return nextId;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    frames.delete(id);
  });
  const { source, strip } = renderDragStrip();
  frames.clear();
  await pointer(source, 'pointerdown', 150);
  await pointer(source, 'pointermove', 390);
  for (let i = 0; i < 3; i++) {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(frame => frame(i * 16));
  }
  expect(strip.scrollLeft).toBe(36);
  await fireEvent.keyDown(window, { key: 'Escape' });
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(frame => frame(64));
  expect(strip.scrollLeft).toBe(36);
});

test('middle-click closes a resource from its title or close-button area, but never Main', async () => {
  render(TabBar, props);
  for (const element of [
    screen.getByText('demo-nginx'),
    screen.getByRole('button', { name: 'Close tab demo-nginx' }),
  ]) {
    await fireEvent(element, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
  }
  expect(onClose).toHaveBeenCalledTimes(2);
  await fireEvent(
    screen.getByRole('tab', { name: 'Containers' }),
    new MouseEvent('auxclick', { bubbles: true, button: 1 }),
  );
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('context-menu Escape restores focus to its tab and close-others skips pinned tabs', async () => {
  render(TabBar, props);
  const tab = screen.getByRole('tab', { name: /demo-nginx/ });
  tab.focus();
  await fireEvent.keyDown(tab, { key: 'F10', shiftKey: true });
  expect(screen.getByRole('menuitem', { name: 'Close Other Tabs' })).toBeDisabled();
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Pin Tab' })).toHaveFocus());
  await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(tab).toHaveFocus();
});

test('empty tab actions can close with Escape when every action is disabled', async () => {
  render(TabBar, { ...props, tabs: [props.tabs[0]!], showCloseAllButton: true });
  const trigger = screen.getByRole('button', { name: 'Tab actions' });
  await fireEvent.click(trigger);
  expect(screen.getByRole('menuitem', { name: 'Close unpinned tabs' })).toBeDisabled();
  await waitFor(() => expect(screen.getByRole('menu')).toHaveFocus());
  await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('tab actions show at most five closed tabs and keyboard Enter restores the focused one', async () => {
  const onRestoreClosedTab = vi.fn();
  render(TabBar, {
    ...props,
    showCloseAllButton: true,
    onRestoreClosedTab,
    recentlyClosedTabs: Array.from({ length: 6 }, (_, i) => ({
      id: `closed-${i}`,
      key: `closed-${i}`,
      title: `Closed ${i}`,
    })),
  });
  await fireEvent.click(screen.getByRole('button', { name: 'Tab actions' }));
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Close unpinned tabs' })).toHaveFocus());
  expect(screen.queryByText('Closed 5')).not.toBeInTheDocument();
  await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
  expect(screen.getByRole('menuitem', { name: 'Closed 0' })).toHaveFocus();
  await fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
  expect(onRestoreClosedTab).toHaveBeenCalledWith('closed-0');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('close unpinned closes the menu and outside pointer closes a reopened menu', async () => {
  render(TabBar, { ...props, showCloseAllButton: true });
  const trigger = screen.getByRole('button', { name: 'Tab actions' });
  await fireEvent.click(trigger);
  await fireEvent.click(screen.getByRole('menuitem', { name: 'Close unpinned tabs' }));
  expect(props.onCloseAllInPanel).toHaveBeenCalledOnce();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  await fireEvent.click(trigger);
  await fireEvent.pointerDown(document.body);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('overflow menu supports keyboard selection and replaces other open tab menus', async () => {
  const { strip } = renderDragStrip();
  Object.defineProperty(strip, 'clientWidth', { configurable: true, value: 200 });
  await fireEvent.scroll(strip);
  const trigger = screen.getByRole('button', { name: 'Show all open tabs' });
  await fireEvent.contextMenu(screen.getByRole('tab', { name: 'first' }));
  await fireEvent.click(trigger);
  expect(screen.getAllByRole('menu')).toHaveLength(1);
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Containers' })).toHaveFocus());
  await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
  expect(screen.getByRole('menuitem', { name: 'first' })).toHaveFocus();
  await fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
  expect(props.onSelect).toHaveBeenCalledWith('first');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('only shows the overflow arrow when natural tab widths exceed the available space', async () => {
  const { strip, source } = renderDragStrip();
  vi.mocked(source.getBoundingClientRect).mockReturnValue({ left: -6, right: 450, width: 456 } as DOMRect);
  await fireEvent.scroll(strip);
  expect(screen.queryByRole('button', { name: 'Show all open tabs' })).not.toBeInTheDocument();
  Object.defineProperty(strip, 'clientWidth', { configurable: true, value: 200 });
  await fireEvent.scroll(strip);
  await fireEvent.click(screen.getByRole('button', { name: 'Show all open tabs' }));
  expect(screen.getByRole('menu')).toBeInTheDocument();
  Object.defineProperty(strip, 'clientWidth', { configurable: true, value: 400 });
  await fireEvent.scroll(strip);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Show all open tabs' })).not.toBeInTheDocument();
});
