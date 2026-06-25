<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { currentScreen, registerPrototype, unregisterPrototype } from '/@/stores/prototype';

import StatusDotIcon from './StatusDotIcon.svelte';

// #region Types

interface ContainerOption {
  name: string;
  status: 'running' | 'exited';
}

interface PanelTab {
  id: string;
  label: string;
  type: 'log' | 'terminal';
  icon: string;
  content: string;
  containers?: ContainerOption[];
  selectedContainer?: string;
}

interface TabbedPanelOverride {
  visible: boolean;
  minimized: boolean;
  tabs: PanelTab[];
  activeTabId: string;
  showOverflow: boolean;
}

// #endregion

// #region Mock data

const MOCK_LOG_CONTENT_1 = `2026-05-14T08:12:01.332Z  Starting container initialization...
2026-05-14T08:12:01.445Z  Loading configuration from /etc/podman/config.json
2026-05-14T08:12:01.612Z  Network bridge configured: podman0 (10.88.0.1/16)
2026-05-14T08:12:02.003Z  Container runtime ready (crun v1.17)
2026-05-14T08:12:02.118Z  Pulling layers: sha256:a3ed95ca... [complete]
2026-05-14T08:12:02.334Z  Pulling layers: sha256:bf5d463c... [complete]
2026-05-14T08:12:02.891Z  Mounting overlay filesystem...
2026-05-14T08:12:03.012Z  Starting process: /usr/sbin/nginx -g "daemon off;"
2026-05-14T08:12:03.234Z  nginx: [notice] using the "epoll" event method
2026-05-14T08:12:03.235Z  nginx: [notice] worker process 12 started
2026-05-14T08:12:03.236Z  nginx: [notice] worker process 13 started
2026-05-14T08:12:04.001Z  Health check passed (HTTP 200 on :8080/healthz)
2026-05-14T08:12:04.002Z  Container is healthy`;

const MOCK_LOG_CONTENT_2 = `2026-05-14T08:15:22.101Z  PostgreSQL 16.2 starting up
2026-05-14T08:15:22.203Z  listening on IPv4 address "0.0.0.0", port 5432
2026-05-14T08:15:22.204Z  listening on IPv6 address "::", port 5432
2026-05-14T08:15:22.310Z  database system was shut down at 2026-05-14 08:10:01 UTC
2026-05-14T08:15:22.512Z  database system is ready to accept connections
2026-05-14T08:15:23.001Z  autovacuum launcher started`;

// Terminal content stored as HTML for realistic coloring
const MOCK_TERMINAL_CONTENT_HTML = `<span class="term-prompt">[root@c3f2a1b9d4e7 /]#</span> ls -la /app
<span class="term-dim">total 48</span>
<span class="term-dir">drwxr-xr-x</span>  6 root root 4096 May 14 08:12 <span class="term-dir">.</span>
<span class="term-dir">drwxr-xr-x</span>  1 root root 4096 May 14 08:12 <span class="term-dir">..</span>
<span class="term-dim">-rw-r--r--</span>  1 root root  234 May 14 08:10 Dockerfile
<span class="term-dir">drwxr-xr-x</span>  2 root root 4096 May 14 08:12 <span class="term-dir">config</span>
<span class="term-dim">-rw-r--r--</span>  1 root root 1247 May 14 08:10 package.json
<span class="term-dir">drwxr-xr-x</span> 12 root root 4096 May 14 08:12 <span class="term-dir">node_modules</span>
<span class="term-dir">drwxr-xr-x</span>  3 root root 4096 May 14 08:10 <span class="term-dir">src</span>
<span class="term-prompt">[root@c3f2a1b9d4e7 /]#</span> <span class="term-cursor">█</span>`;

const TABS_SINGLE: PanelTab[] = [
  { id: 'log-nginx', label: 'nginx-frontend', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
];

const TABS_MIXED: PanelTab[] = [
  { id: 'log-nginx', label: 'nginx-frontend', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-postgres', label: 'postgres-db', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-app',
    label: 'app-server',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT_HTML,
  },
  { id: 'log-redis', label: 'redis-cache', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
];

const TABS_OVERFLOW: PanelTab[] = [
  { id: 'log-nginx', label: 'nginx-frontend', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-postgres', label: 'postgres-db', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-app',
    label: 'app-server',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT_HTML,
  },
  { id: 'log-redis', label: 'redis-cache', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-worker',
    label: 'celery-worker',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT_HTML,
  },
  { id: 'log-proxy', label: 'envoy-proxy', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-monitor', label: 'prometheus', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-debug',
    label: 'debug-shell',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT_HTML,
  },
  { id: 'log-grafana', label: 'grafana', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-alertmgr', label: 'alertmanager', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
];

const TABS_MULTI_CONTAINER: PanelTab[] = [
  {
    id: 'stack-myapp',
    label: 'my-app-stack',
    type: 'terminal',
    icon: 'fa-solid fa-cubes',
    content: MOCK_TERMINAL_CONTENT_HTML,
    containers: [
      { name: 'backend', status: 'running' },
      { name: 'frontend', status: 'running' },
      { name: 'postgres', status: 'running' },
      { name: 'redis', status: 'exited' },
    ],
    selectedContainer: 'backend',
  },
  { id: 'log-nginx', label: 'nginx-frontend', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-redis', label: 'redis-cache', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
];

// #endregion

// #region Content formatters

function formatLogContent(content: string): string {
  return content
    .split('\n')
    .map(line =>
      line
        .replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/, '<span class="log-ts">$1</span>')
        .replace(/\b(ERROR|FATAL|FAIL)\b/g, '<span class="log-error">$1</span>')
        .replace(/\b(WARN|WARNING)\b/g, '<span class="log-warn">$1</span>'),
    )
    .join('\n');
}

function renderContent(tab: PanelTab): string {
  return tab.type === 'log' ? formatLogContent(tab.content) : tab.content;
}

// #endregion

// #region Prototype registration

const override = registerPrototype<TabbedPanelOverride>({
  name: 'Tabbed Panel',
  screens: [
    { value: 'closed', label: 'Panel closed' },
    { value: 'single-log', label: 'Single log tab' },
    { value: 'mixed', label: 'Mixed tabs (logs + terminal)' },
    { value: 'overflow', label: 'Tab overflow (10 tabs)' },
    { value: 'minimized', label: 'Panel minimized' },
    { value: 'multi-container', label: 'Multi-container (pod/stack dropdown)' },
  ],
  overrides: {
    closed: { visible: false, minimized: false, tabs: [], activeTabId: '', showOverflow: false },
    'single-log': { visible: true, minimized: false, tabs: TABS_SINGLE, activeTabId: 'log-nginx', showOverflow: false },
    mixed: { visible: true, minimized: false, tabs: TABS_MIXED, activeTabId: 'term-app', showOverflow: false },
    overflow: { visible: true, minimized: false, tabs: TABS_OVERFLOW, activeTabId: 'term-app', showOverflow: true },
    minimized: { visible: true, minimized: true, tabs: TABS_MIXED, activeTabId: 'term-app', showOverflow: false },
    'multi-container': {
      visible: true,
      minimized: false,
      tabs: TABS_MULTI_CONTAINER,
      activeTabId: 'stack-myapp',
      showOverflow: false,
    },
  },
});

onDestroy(unregisterPrototype);

// #endregion

// #region Reactive state

let panelState: TabbedPanelOverride | undefined = $state();
let screenBeforeMinimize: string = $state('mixed');
const unsubscribe = override.subscribe(value => {
  panelState = value;
});
const unsubScreen = currentScreen.subscribe(value => {
  if (value !== 'minimized' && value !== 'closed') {
    screenBeforeMinimize = value;
  }
});
onDestroy((): void => {
  unsubscribe();
  unsubScreen();
});

let activeTab = $derived(panelState?.tabs.find(t => t.id === panelState?.activeTabId));
let visibleTabs = $derived(panelState?.showOverflow ? panelState.tabs.slice(0, 6) : (panelState?.tabs ?? []));
let overflowTabs = $derived(panelState?.showOverflow ? panelState.tabs.slice(6) : []);
let showOverflowMenu = $state(false);

let containerDropdownTabId: string | null = $state(null);
let containerDropdownLeft: number = $state(0);
let containerDropdownTop: number = $state(0);

function openContainerDropdown(event: MouseEvent, tabId: string): void {
  event.stopPropagation();
  if (containerDropdownTabId === tabId) {
    containerDropdownTabId = null;
    return;
  }
  containerDropdownTabId = tabId;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  containerDropdownLeft = rect.left;
  containerDropdownTop = rect.bottom;
}

function selectContainer(tab: PanelTab, containerName: string): void {
  tab.selectedContainer = containerName;
  containerDropdownTabId = null;
}

// #region Tab drag-and-drop reordering (pointer-based for horizontal-only movement)

let draggingTabId: string | null = $state(null);
let dragOverTabId: string | null = $state(null);
let dragTranslateX: number = $state(0);

function onTabPointerDown(event: PointerEvent, tabId: string): void {
  // Don't intercept clicks on the close button or container selector
  const target = event.target as HTMLElement;
  if (target.closest('[aria-label^="Close"]') || target.closest('[aria-label^="Select container"]')) return;

  event.preventDefault();
  draggingTabId = tabId;
  dragTranslateX = 0;

  const el = event.currentTarget as HTMLElement;
  const startX = event.clientX;
  const midY = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;

  el.setPointerCapture(event.pointerId);

  function onPointerMove(e: PointerEvent): void {
    dragTranslateX = e.clientX - startX;
    // Use elementsFromPoint at the pointer X but at a fixed tab-bar Y so only
    // horizontal position matters for the drop target calculation.
    const hit = document
      .elementsFromPoint(e.clientX, midY)
      .find(el => (el as HTMLElement).dataset.tabId && (el as HTMLElement).dataset.tabId !== draggingTabId);
    dragOverTabId = hit ? ((hit as HTMLElement).dataset.tabId ?? null) : null;
  }

  function onPointerUp(): void {
    if (panelState && draggingTabId && dragOverTabId && Math.abs(dragTranslateX) > 4) {
      const tabs = [...panelState.tabs];
      const fromIndex = tabs.findIndex(t => t.id === draggingTabId);
      const toIndex = tabs.findIndex(t => t.id === dragOverTabId);
      const [moved] = tabs.splice(fromIndex, 1);
      tabs.splice(toIndex, 0, moved);
      panelState = { ...panelState, tabs };
    }
    draggingTabId = null;
    dragOverTabId = null;
    dragTranslateX = 0;
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
  }

  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
}

// #endregion

const MIN_PANEL_HEIGHT = 120;
const PANEL_HEIGHT_MARGIN = 120;
const DEFAULT_PANEL_HEIGHT = 280;

let windowHeight = $state(window.innerHeight);
let maxPanelHeight = $derived(windowHeight - PANEL_HEIGHT_MARGIN);
let panelHeight = $state(DEFAULT_PANEL_HEIGHT);
let isResizing = $state(false);

function onResizePointerDown(event: PointerEvent): void {
  event.preventDefault();
  isResizing = true;
  const startY = event.clientY;
  if (panelState?.minimized) return;

  const startHeight = panelHeight;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);

  function onPointerMove(e: PointerEvent): void {
    const delta = startY - e.clientY;
    panelHeight = Math.min(maxPanelHeight, Math.max(MIN_PANEL_HEIGHT, startHeight + delta));
  }

  function onPointerUp(): void {
    isResizing = false;
    target.removeEventListener('pointermove', onPointerMove);
    target.removeEventListener('pointerup', onPointerUp);
  }

  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerup', onPointerUp);
}

export function togglePanel(): void {
  if (panelState?.visible) {
    currentScreen.set('closed');
  } else {
    currentScreen.set(screenBeforeMinimize || 'mixed');
  }
}

function toggleMinimize(): void {
  if (panelState?.minimized) {
    currentScreen.set(screenBeforeMinimize || 'mixed');
  } else {
    currentScreen.set('minimized');
  }
}

function selectOverflowTab(selectedTab: PanelTab): void {
  if (!panelState) return;
  const tabs = [...panelState.tabs];
  const selectedIndex = tabs.findIndex(t => t.id === selectedTab.id);
  const lastVisibleIndex = visibleTabs.length - 1;
  // Swap the chosen overflow tab into the last visible slot
  [tabs[selectedIndex], tabs[lastVisibleIndex]] = [tabs[lastVisibleIndex], tabs[selectedIndex]];
  panelState = { ...panelState, tabs, activeTabId: selectedTab.id };
  closeOverflowMenu();
}

function closeOverflowMenu(): void {
  showOverflowMenu = false;
  window.dispatchEvent(new Event('tooltip-show'));
}

function toggleOverflowMenu(): void {
  if (showOverflowMenu) {
    closeOverflowMenu();
  } else {
    showOverflowMenu = true;
    window.dispatchEvent(new Event('tooltip-hide'));
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === '`' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    event.preventDefault();
    togglePanel();
  }
}

onMount((): void => {
  function onWindowResize(): void {
    windowHeight = window.innerHeight;
  }
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', onWindowResize);
  return (): void => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', onWindowResize);
  };
});

// #endregion
</script>

{#if panelState?.visible}
  <div
    class="flex flex-col relative shrink-0"
    style={panelState.minimized ? '' : `height: ${panelHeight}px`}
    role="complementary"
    aria-label="Terminal and log panel">

    <!-- #region Resize handle -->
    <div
      class="absolute top-0 left-0 right-0 h-2 -translate-y-1/2 z-50 group/rh flex items-center {panelState.minimized ? 'cursor-default' : 'cursor-row-resize'}"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize panel"
      onpointerdown={onResizePointerDown}>
      <!-- Full-width thin indicator line -->
      <div
        class="w-full mt-[-2.5px] h-[2.5px] transition-colors {isResizing
          ? 'bg-(--pd-global-nav-icon-selected-highlight)'
          : panelState.minimized
            ? 'bg-transparent'
            : 'bg-transparent group-hover/rh:bg-(--pd-global-nav-icon-selected-highlight)'}"></div>
    </div>
    <!-- #endregion -->

    <!-- #region Tab bar -->
    <div
      class="flex items-center h-[36px] min-h-[36px] bg-(--pd-content-bg) border-t border-t-(--pd-global-nav-bg-border) select-none">

      <!-- Tabs -->
      <div class="flex items-center gap-0 overflow-x-auto flex-1 min-w-0">
        {#each visibleTabs as tab (tab.id)}
          {@const isActive = tab.id === panelState.activeTabId}
          <Tooltip top tip="{tab.type === 'terminal' ? 'Terminal' : 'Log'}: {tab.label}">
            <button
              data-tab-id={tab.id}
              onpointerdown={(e: PointerEvent): void => onTabPointerDown(e, tab.id)}
              class="group relative flex items-center gap-1.5 px-3 h-[35px] text-xs whitespace-nowrap border-r border-(--pd-global-nav-bg-border) transition-colors select-none
                {isActive
                  ? 'bg-(--pd-global-nav-icon-selected-bg) text-(--pd-content-header) font-medium'
                  : 'text-(--pd-global-nav-icon)'}
                {draggingTabId === tab.id ? 'opacity-80 cursor-grabbing pointer-events-none z-50' : 'cursor-grab'}
                {draggingTabId === tab.id && !isActive ? 'bg-(--pd-content-bg)' : ''}
                {dragOverTabId === tab.id ? 'border-l-2 border-l-(--pd-global-nav-icon-selected-highlight)' : ''}"
              style={draggingTabId === tab.id ? `transform: translateX(${dragTranslateX}px)` : ''}
              aria-selected={isActive}
              aria-label="{tab.type === 'terminal' ? 'Terminal' : 'Log'}: {tab.label}"
              role="tab">
              <!-- Top accent line on active tab -->
              {#if isActive}
                <span class="absolute top-0 inset-x-0 h-[4px] bg-(--pd-global-nav-icon-selected-highlight)"></span>
              {/if}
              <i class="{tab.icon} text-[10px]"></i>
              <span class="max-w-[80px] truncate">{tab.label}</span>
              <!-- Multi-container selector: shown inline when tab has container options -->
              {#if tab.containers && tab.containers.length > 0}
                <button
                  class="flex items-center gap-1 px-0.5 text-[10px] border border-transparent border-b-(--pd-input-field-stroke) hover:border-b-(--pd-input-field-hover-stroke) transition-colors"
                  aria-label="Select container for {tab.label}"
                  onclick={(e: MouseEvent): void => openContainerDropdown(e, tab.id)}>
                  <span>{tab.selectedContainer}</span>
                  <i class="fa-solid fa-caret-down text-[9px]"></i>
                </button>
              {/if}
              <i
                class="fa-solid fa-xmark text-[9px] ml-1 {isActive
                  ? 'opacity-60 hover:opacity-100'
                  : 'opacity-0 group-hover:opacity-60 hover:opacity-100!'}"
                role="button"
                aria-label="Close {tab.label}"></i>
            </button>
          </Tooltip>
        {/each}

        <!-- Container dropdown popup (fixed, appears below tab bar) -->
        {#if containerDropdownTabId}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="fixed inset-0"
            style="z-index: 9998;"
            onclick={(): void => {
              containerDropdownTabId = null;
            }}></div>
          {@const dropdownTab = panelState.tabs.find(t => t.id === containerDropdownTabId)}
          {#if dropdownTab?.containers}
            <div
              class="fixed rounded-md bg-(--pd-dropdown-bg) border border-(--pd-input-field-hover-stroke) min-w-[180px] py-1 overflow-y-auto"
              style="z-index: 9999; left: {containerDropdownLeft}px; top: {containerDropdownTop}px;">
              <div class="px-3 py-1 text-[10px] font-medium text-(--pd-content-text) tracking-wide border-b border-(--pd-input-field-stroke) mb-1">
                {dropdownTab.label}
              </div>
              {#each dropdownTab.containers as container (container.name)}
                <button
                  class="flex flex-row items-center w-full select-none px-2 py-1 text-xs text-start hover:bg-(--pd-dropdown-item-hover-bg) hover:text-(--pd-dropdown-item-hover-text) transition-colors"
                  role="menuitem"
                  onclick={(): void => selectContainer(dropdownTab, container.name)}>
                  <div class="min-w-4 max-w-4 flex items-center">
                    <StatusDotIcon status={container.status} size="10" />
                  </div>
                  <div class="grow">{container.name}</div>
                  {#if container.name === dropdownTab.selectedContainer}
                    <i class="fa-solid fa-check text-[9px] text-(--pd-global-nav-icon-selected-highlight)"></i>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        {/if}

        <!-- New tab button -->
        <Tooltip top tip="New terminal">
          <button
            class="flex items-center justify-center px-2.5 h-[35px] text-(--pd-global-nav-icon) {overflowTabs.length > 0 ? 'border-r border-(--pd-global-nav-bg-border)' : ''}"
            aria-label="New terminal tab">
            <i class="fa-solid fa-plus text-[10px]"></i>
          </button>
        </Tooltip>

        <!-- Overflow indicator -->
        {#if overflowTabs.length > 0}
          <div class="relative">
            <Tooltip top tip="{overflowTabs.length} more tabs">
              <button
                class="flex items-center gap-1 px-3 h-[35px] text-xs text-(--pd-global-nav-icon)"
                aria-label="{overflowTabs.length} more tabs"
                onclick={toggleOverflowMenu}>
                <i class="fa-solid fa-ellipsis"></i>
              </button>
            </Tooltip>

            {#if showOverflowMenu}
              <!-- Backdrop to dismiss on click outside -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="fixed inset-0"
                style="z-index: 9998;"
                onclick={closeOverflowMenu}></div>
              <div
                class="fixed rounded-md bg-(--pd-dropdown-bg) border border-(--pd-input-field-hover-stroke) min-w-[200px] py-1 overflow-y-auto overflow-menu-popup"
                style="z-index: 9999;">
                {#each overflowTabs as tab (tab.id)}
                  <button
                    class="flex flex-row items-center w-full select-none px-2 py-1 text-xs text-start hover:bg-(--pd-dropdown-item-hover-bg) hover:text-(--pd-dropdown-item-hover-text) transition-colors"
                    role="menuitem"
                    onclick={(): void => selectOverflowTab(tab)}>
                    <div class="min-w-4 max-w-4 flex items-center justify-center">
                      <i class="{tab.icon} text-[10px]"></i>
                    </div>
                    <div class="grow truncate">{tab.label}</div>
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Panel actions -->
      <div class="flex items-center gap-1 px-2">
        <Tooltip top tip={panelState.minimized ? 'Expand panel' : 'Minimize panel'}>
          <button
            class="flex items-center justify-center w-6 h-6 rounded text-(--pd-global-nav-icon) hover:bg-(--pd-content-card-hover-bg) transition-colors"
            aria-label={panelState.minimized ? 'Expand panel' : 'Minimize panel'}
            onclick={toggleMinimize}>
            <i
              class="fa-solid text-[10px]"
              class:fa-chevron-up={panelState.minimized}
              class:fa-chevron-down={!panelState.minimized}></i>
          </button>
        </Tooltip>
        <Tooltip top tip="Close panel (`)">
          <button
            class="flex items-center justify-center w-6 h-6 rounded text-(--pd-global-nav-icon) hover:bg-(--pd-content-card-hover-bg) transition-colors"
            aria-label="Close panel"
            onclick={togglePanel}>
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </Tooltip>
      </div>
    </div>
    <!-- #endregion -->

    <!-- #region Content area -->
    {#if !panelState.minimized && activeTab}
      <div
        class="flex-1 min-h-0 overflow-hidden font-mono text-xs leading-[1.6] p-3 bg-(--pd-terminal-background) text-(--pd-terminal-foreground)"
        class:ring-[var(--pd-input-field-focused-bg)]={activeTab.type === 'terminal'}
        role={activeTab.type === 'terminal' ? 'textbox' : 'log'}
        aria-label="{activeTab.type === 'terminal' ? 'Terminal' : 'Log output'}: {activeTab.label}"
        aria-readonly={activeTab.type === 'log'}>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <pre class="whitespace-pre-wrap m-0">{@html renderContent(activeTab)}</pre>
      </div>
    {/if}
    <!-- #endregion -->

  </div>
{/if}

<style>
  .overflow-menu-popup {
    position: fixed;
    transform: translateY(calc(-100% - 40px));
  }

  /* Log content coloring */
  :global(.log-ts) {
    color: var(--pd-terminal-ansiBrightBlack);
  }
  :global(.log-error) {
    color: var(--pd-terminal-ansiRed);
    font-weight: 600;
  }
  :global(.log-warn) {
    color: var(--pd-terminal-ansiYellow);
  }

  /* Terminal content coloring */
  :global(.term-prompt) {
    color: var(--pd-terminal-ansiGreen);
    font-weight: 600;
  }
  :global(.term-dir) {
    color: var(--pd-terminal-ansiBlue);
  }
  :global(.term-dim) {
    color: var(--pd-terminal-ansiBrightBlack);
  }
  :global(.term-cursor) {
    animation: cursor-blink 1.2s step-end infinite;
  }

  @keyframes cursor-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
