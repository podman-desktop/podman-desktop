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
    class="flex flex-col relative shrink-0 border-b border-(--pd-content-divider)"
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
      class="flex items-center h-[36px] min-h-[36px] bg-(--pd-content-bg) border-t border-t-(--panel-top-border) border-b border-b-(--pd-content-divider) select-none">

      <!-- Panel label — right border separates label from tab strip -->
      <Tooltip top tip="Toggle terminal panel (`)">
        <button
          class="flex items-center gap-1.5 px-3 h-[35px] text-xs font-medium text-(--pd-global-nav-icon) whitespace-nowrap border-r border-(--pd-content-divider)"
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
              class="group relative flex items-center gap-1.5 px-3 h-[35px] text-xs whitespace-nowrap border-r border-(--pd-content-divider) transition-colors {isActive
                ? 'bg-(--pd-global-nav-icon-selected-bg) text-(--pd-content-header) font-medium'
                : 'text-(--pd-global-nav-icon)'}"
              aria-selected={isActive}
              aria-label="{tab.type === 'terminal' ? 'Terminal' : 'Log'}: {tab.label}"
              role="tab">
              <!-- Top accent line on active tab -->
              {#if isActive}
                <span class="absolute top-0 inset-x-0 h-[4px] bg-(--pd-global-nav-icon-selected-highlight)"></span>
              {/if}
              <i class="{tab.icon} text-[10px]"></i>
              <span class="max-w-[120px] truncate">{tab.label}</span>
              <i
                class="fa-solid fa-xmark text-[9px] ml-1 {isActive
                  ? 'opacity-60 hover:opacity-100'
                  : 'opacity-0 group-hover:opacity-60 hover:opacity-100!'}"
                role="button"
                aria-label="Close {tab.label}"></i>
            </button>
          </Tooltip>
        {/each}

        <!-- New tab button -->
        <Tooltip top tip="New terminal">
          <button
            class="flex items-center justify-center px-2.5 h-[35px] border-r border-(--pd-content-divider) text-(--pd-global-nav-icon)"
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
                <span class="flex items-center justify-center w-[16px] h-[16px] rounded-full text-[9px] font-medium bg-(--pd-global-nav-icon) text-(--pd-content-bg)">{overflowTabs.length}</span>
              </button>
            </Tooltip>

            {#if showOverflowMenu}
              <!-- Backdrop to dismiss on click outside -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="fixed inset-0"
                style="z-index: 9998;"
                onclick={(): void => {
                  showOverflowMenu = false;
                }}></div>
              <div
                class="fixed bg-(--pd-content-card-bg) border border-(--pd-content-divider) rounded shadow-lg min-w-[200px] overflow-menu-popup"
                style="z-index: 9999;">
                {#each overflowTabs as tab (tab.id)}
                  <button
                    class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-(--pd-content-text) hover:bg-(--pd-content-card-hover-bg) transition-colors"
                    role="menuitem">
                    <i
                      class="{tab.icon} text-[10px]"
                      class:text-[var(--pd-status-running)]={tab.type === 'terminal'}></i>
                    <span class="truncate">{tab.label}</span>
                    <span class="ml-auto text-(--pd-content-text)/30 text-[10px]">{tab.type}</span>
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
  /* Top border of the tab bar: black in light themes, white in dark themes */
  :global(:root) {
    --panel-top-border: #000;
  }
  :global(.dark),
  :global(.hc-dark) {
    --panel-top-border: #fff;
  }

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
