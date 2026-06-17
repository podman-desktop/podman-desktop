<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import { currentScreen, registerPrototype, unregisterPrototype } from '/@/stores/prototype';

// #region Types

interface PanelTab {
  id: string;
  label: string;
  type: 'log' | 'terminal';
  icon: string;
  content: string;
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

const MOCK_TERMINAL_CONTENT = `[root@c3f2a1b9d4e7 /]# ls -la /app
total 48
drwxr-xr-x  6 root root 4096 May 14 08:12 .
drwxr-xr-x  1 root root 4096 May 14 08:12 ..
-rw-r--r--  1 root root  234 May 14 08:10 Dockerfile
drwxr-xr-x  2 root root 4096 May 14 08:12 config
-rw-r--r--  1 root root 1247 May 14 08:10 package.json
drwxr-xr-x 12 root root 4096 May 14 08:12 node_modules
drwxr-xr-x  3 root root 4096 May 14 08:10 src
[root@c3f2a1b9d4e7 /]# █`;

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
    content: MOCK_TERMINAL_CONTENT,
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
    content: MOCK_TERMINAL_CONTENT,
  },
  { id: 'log-redis', label: 'redis-cache', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-worker',
    label: 'celery-worker',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT,
  },
  { id: 'log-proxy', label: 'envoy-proxy', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-monitor', label: 'prometheus', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
  {
    id: 'term-debug',
    label: 'debug-shell',
    type: 'terminal',
    icon: 'fa-solid fa-terminal',
    content: MOCK_TERMINAL_CONTENT,
  },
  { id: 'log-grafana', label: 'grafana', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_1 },
  { id: 'log-alertmgr', label: 'alertmanager', type: 'log', icon: 'fa-solid fa-scroll', content: MOCK_LOG_CONTENT_2 },
];

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
  ],
  overrides: {
    closed: { visible: false, minimized: false, tabs: [], activeTabId: '', showOverflow: false },
    'single-log': { visible: true, minimized: false, tabs: TABS_SINGLE, activeTabId: 'log-nginx', showOverflow: false },
    mixed: { visible: true, minimized: false, tabs: TABS_MIXED, activeTabId: 'term-app', showOverflow: false },
    overflow: { visible: true, minimized: false, tabs: TABS_OVERFLOW, activeTabId: 'term-app', showOverflow: true },
    minimized: { visible: true, minimized: true, tabs: TABS_MIXED, activeTabId: 'term-app', showOverflow: false },
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

const MIN_PANEL_HEIGHT = 120;
const MAX_PANEL_HEIGHT = 600;
const DEFAULT_PANEL_HEIGHT = 280;
let panelHeight = $state(DEFAULT_PANEL_HEIGHT);
let isResizing = $state(false);

function onResizePointerDown(event: PointerEvent): void {
  event.preventDefault();
  isResizing = true;
  const startY = event.clientY;
  const startHeight = panelHeight;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);

  function onPointerMove(e: PointerEvent): void {
    const delta = startY - e.clientY;
    panelHeight = Math.min(MAX_PANEL_HEIGHT, Math.max(MIN_PANEL_HEIGHT, startHeight + delta));
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

function toggleOverflowMenu(): void {
  showOverflowMenu = !showOverflowMenu;
  if (showOverflowMenu) {
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
  window.addEventListener('keydown', handleKeydown);
});

onDestroy((): void => {
  window.removeEventListener('keydown', handleKeydown);
});

// #endregion
</script>

{#if panelState?.visible}
  <div
    class="flex flex-col relative"
    style={panelState.minimized ? '' : `height: ${panelHeight}px`}
    role="complementary"
    aria-label="Terminal and log panel">

    <!-- #region Resize handle -->
    <div
      class="absolute top-0 left-0 right-0 h-[3px] -translate-y-1/2 cursor-row-resize z-50 hover:bg-[var(--pd-global-nav-icon-selected-highlight)] transition-colors {isResizing ? 'bg-[var(--pd-global-nav-icon-selected-highlight)]' : ''}"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize panel"
      onpointerdown={onResizePointerDown}></div>
    <!-- #endregion -->

    <!-- #region Tab bar -->
    <div class="flex items-center h-[36px] min-h-[36px] bg-[var(--pd-content-bg)] border-t border-b border-[var(--pd-content-divider)] select-none">

      <!-- Panel label -->
      <Tooltip top tip="Toggle terminal panel (`)">
        <button
          class="flex items-center gap-1.5 px-3 h-[35px] text-xs font-medium text-[var(--pd-content-text)] opacity-60 whitespace-nowrap hover:opacity-100 transition-opacity"
          aria-label="Toggle terminal panel"
          onclick={togglePanel}>
          <i class="fa-solid fa-terminal text-[10px]"></i>
          Terminal
        </button>
      </Tooltip>

      <!-- Tabs -->
      <div class="flex items-center gap-0 overflow-x-auto flex-1 min-w-0">
        {#each visibleTabs as tab (tab.id)}
          {@const isActive = tab.id === panelState.activeTabId}
          <Tooltip top tip="{tab.type === 'terminal' ? 'Terminal' : 'Log'}: {tab.label}">
            <button
              class="group flex items-center gap-1.5 px-3 h-[35px] text-xs whitespace-nowrap border-r border-[var(--pd-content-divider)] transition-colors {isActive ? 'bg-[var(--pd-global-nav-icon-selected-bg)] text-[var(--pd-content-header)] font-medium' : 'text-[var(--pd-content-text)]/60 hover:bg-[var(--pd-content-card-hover-bg)]'}"
              aria-selected={isActive}
              aria-label="{tab.type === 'terminal' ? 'Terminal' : 'Log'}: {tab.label}"
              role="tab">
              <i class="{tab.icon} text-[10px]"
                 class:text-[var(--pd-status-running)]={tab.type === 'terminal' && !isActive}></i>
              <span class="max-w-[120px] truncate">{tab.label}</span>
              <i class="fa-solid fa-xmark text-[9px] transition-opacity ml-1 {isActive ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'}"
                 role="button"
                 aria-label="Close {tab.label}"></i>
            </button>
          </Tooltip>
        {/each}

        <!-- Overflow indicator -->
        {#if overflowTabs.length > 0}
          <div class="relative">
            <Tooltip top tip="{overflowTabs.length} more tabs">
              <button
                class="flex items-center gap-1 px-3 h-[35px] text-xs text-[var(--pd-content-text)]/60 hover:text-[var(--pd-content-text)] transition-colors"
                aria-label="{overflowTabs.length} more tabs"
                onclick={toggleOverflowMenu}>
                <i class="fa-solid fa-ellipsis"></i>
                <span class="text-[10px] bg-[var(--pd-content-text)]/10 rounded px-1">{overflowTabs.length}</span>
              </button>
            </Tooltip>

            {#if showOverflowMenu}
              <div class="fixed bg-[var(--pd-content-card-bg)] border border-[var(--pd-content-divider)] rounded shadow-lg min-w-[200px] overflow-menu-popup"
                   style="z-index: 9999;">
                {#each overflowTabs as tab (tab.id)}
                  <button
                    class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-[var(--pd-content-text)] hover:bg-[var(--pd-content-card-hover-bg)] transition-colors"
                    role="menuitem">
                    <i class="{tab.icon} text-[10px]"
                       class:text-[var(--pd-status-running)]={tab.type === 'terminal'}></i>
                    <span class="truncate">{tab.label}</span>
                    <span class="ml-auto text-[var(--pd-content-text)]/30 text-[10px]">{tab.type}</span>
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
            class="flex items-center justify-center w-6 h-6 rounded text-[var(--pd-content-text)]/50 hover:text-[var(--pd-content-text)] hover:bg-[var(--pd-content-card-hover-bg)] transition-colors"
            aria-label={panelState.minimized ? 'Expand panel' : 'Minimize panel'}
            onclick={toggleMinimize}>
            <i class="fa-solid text-[10px]"
               class:fa-chevron-up={panelState.minimized}
               class:fa-chevron-down={!panelState.minimized}></i>
          </button>
        </Tooltip>
        <Tooltip top tip="Close panel (`)">
          <button
            class="flex items-center justify-center w-6 h-6 rounded text-[var(--pd-content-text)]/50 hover:text-[var(--pd-content-text)] hover:bg-[var(--pd-content-card-hover-bg)] transition-colors"
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
        class="flex-1 min-h-0 overflow-hidden font-mono text-xs leading-[1.6] p-3 bg-[var(--pd-terminal-background)] text-[var(--pd-terminal-foreground)]"
        class:ring-2={activeTab.type === 'terminal'}
        class:ring-inset={activeTab.type === 'terminal'}
        class:ring-[var(--pd-input-field-focused-bg)]={activeTab.type === 'terminal'}
        role={activeTab.type === 'terminal' ? 'textbox' : 'log'}
        aria-label="{activeTab.type === 'terminal' ? 'Terminal' : 'Log output'}: {activeTab.label}"
        aria-readonly={activeTab.type === 'log'}>
        <pre class="whitespace-pre-wrap m-0">{activeTab.content}</pre>
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
</style>
