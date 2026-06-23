<script lang="ts">
import type { WebviewInfo } from '@podman-desktop/core-api';
import { onDestroy } from 'svelte';

import Route from '/@/Route.svelte';
import {
  consumePendingWebviewSubRoute,
  extractSubPath,
  pushWebviewSubRoute,
  replaceWebviewSubRoute,
  titleFromSubPath,
  updateCurrentWebviewSubRouteUrl,
} from '/@/stores/navigation-history.svelte';
import { webviews } from '/@/stores/webviews';

import { webviewLifecycle } from './webview-directive';

// webview id
interface Props {
  id: string;
}
let { id }: Props = $props();

interface WebviewElement extends HTMLElement {
  getURL?: () => string;
  loadURL?: (url: string) => Promise<void>;
}

// script to load for the webview
let preloadPath = $derived(await window.getWebviewPreloadPath());

// exposed port of the server providing pages for the webview
let webViewPort = $derived(await window.getWebviewRegistryHttpPort());

// webview HTML element used to communicate
let webviewElement = $state<HTMLElement | undefined>(undefined);

// info about the webview retrieved from the id
let webviewInfo: WebviewInfo | undefined = $derived($webviews.find(webview => webview.id === id));

// reactive options for webview lifecycle directive - updates when webviewInfo changes
let lifecycleOptions = $derived({ webviewInfo });

// navigation history tracking state
let latestPageTitle: string | undefined;
let isNavigatingWebviewHistory = false;
let initialUrlRecorded = false;
let lastRecordedSubPath: string | undefined;
let previousWebviewId: string | undefined;
// Timestamp of the last history navigation. During a brief cooldown after
// a history nav, any webview-initiated navigation uses replaceWebviewSubRoute
// instead of pushWebviewSubRoute to avoid creating spurious entries when the
// webview's internal router redirects after loading.
let lastHistoryNavTime = 0;
const HISTORY_NAV_COOLDOWN_MS = 1000;

$effect(() => {
  if (id !== previousWebviewId) {
    previousWebviewId = id;
    latestPageTitle = undefined;
    isNavigatingWebviewHistory = false;
    initialUrlRecorded = false;
    lastRecordedSubPath = undefined;
  }
  if (webviewInfo) {
    window
      .makeDefaultWebviewVisible(webviewInfo.id)
      .catch((err: unknown) => console.error(`Error make default webview visible ${webviewInfo?.id}`, err));
  }
});

// handle in-page navigation events from the webview to track history
function handleDidNavigateInPage(event: Event): void {
  const e = event as Event & { url?: string; isMainFrame?: boolean };

  if (e.isMainFrame === false) return;

  if (isNavigatingWebviewHistory) {
    lastHistoryNavTime = Date.now();
    if (e.url) {
      lastRecordedSubPath = extractSubPath(e.url);
    }
    isNavigatingWebviewHistory = false;
    return;
  }

  if (!webviewInfo || !e.url) return;

  const subPath = extractSubPath(e.url);

  if (subPath === lastRecordedSubPath) {
    updateCurrentWebviewSubRouteUrl(id, e.url);
    return;
  }

  const title = latestPageTitle ?? titleFromSubPath(subPath);
  lastRecordedSubPath = subPath;

  // After a history navigation (back/forward), the webview's internal router
  // may redirect to a different page (e.g. path-based webviews that can't
  // restore a sub-route from URL alone). Suppress all tracking during the
  // cooldown so those redirects don't overwrite the history entry.
  if (Date.now() - lastHistoryNavTime < HISTORY_NAV_COOLDOWN_MS) {
    return;
  }

  if (!initialUrlRecorded) {
    initialUrlRecorded = true;
    replaceWebviewSubRoute(id, subPath, title, webviewInfo.name, e.url);
  } else {
    pushWebviewSubRoute(id, subPath, title, webviewInfo.name, e.url);
  }

  latestPageTitle = undefined;
}

// Handle full page navigations (path-based webviews like Hummingbird).
// For hash-based webviews, loadURL triggers did-navigate-in-page directly,
// but for path-based webviews it triggers did-navigate instead.
// This handler clears the history navigation flag and records the sub-path
// so subsequent did-navigate-in-page events from the webview's internal
// router don't create spurious history entries.
function handleDidNavigate(event: Event): void {
  const e = event as Event & { url?: string };
  if (!isNavigatingWebviewHistory) return;
  lastHistoryNavTime = Date.now();
  if (e.url) {
    lastRecordedSubPath = extractSubPath(e.url);
  }
  isNavigatingWebviewHistory = false;
}

function handlePageTitleUpdated(event: Event): void {
  const e = event as Event & { title?: string };
  if (e.title) {
    latestPageTitle = e.title;
  }
}

// navigate the webview to a specific sub-route using loadURL
function navigateWebview(path: string, storedUrl?: string): void {
  const wv = webviewElement as WebviewElement;
  if (!wv?.getURL || !wv.loadURL) {
    isNavigatingWebviewHistory = false;
    return;
  }
  const currentUrl = wv.getURL();
  let targetUrl: string;
  if (storedUrl) {
    try {
      const parsed = new URL(storedUrl);
      if (!parsed.searchParams.has('webviewId')) {
        parsed.searchParams.set('webviewId', id);
      }
      targetUrl = parsed.toString();
    } catch {
      targetUrl = storedUrl;
    }
  } else {
    // Strip both hash fragments and query parameters (e.g. ?wvpath=) from
    // the webview's current URL before appending the target sub-path.
    // This works in both hash-mode and path-mode routing.
    const hashIdx = currentUrl.indexOf('#');
    const urlWithoutHash = hashIdx >= 0 ? currentUrl.substring(0, hashIdx) : currentUrl;
    const qIdx = urlWithoutHash.indexOf('?');
    const base = qIdx >= 0 ? urlWithoutHash.substring(0, qIdx) : urlWithoutHash;
    targetUrl = `${base}#${path.replace(/^#/, '')}`;
  }
  if (targetUrl === currentUrl) {
    isNavigatingWebviewHistory = false;
    return;
  }
  wv.loadURL(targetUrl).catch((err: unknown) => {
    console.error('Error loading webview URL', err);
    isNavigatingWebviewHistory = false;
  });
}

// handle sub-route navigation requests from the navigation history store
function handleSubrouteNavigation(event: Event): void {
  const { webviewId, path, webviewUrl } = (
    event as CustomEvent<{ webviewId: string; path: string; webviewUrl?: string }>
  ).detail;
  const wv = webviewElement as WebviewElement;
  if (webviewId !== id || !wv?.getURL) {
    return;
  }

  const currentSubPath = extractSubPath(wv.getURL());
  if (path === currentSubPath) {
    return;
  }

  isNavigatingWebviewHistory = true;
  navigateWebview(path, webviewUrl);
}

// function to notify webview when messages are coming
const postMessageToWebview = (webviewEvent: unknown): void => {
  const webviewEventTyped = webviewEvent as { id: string; message: unknown };
  if (
    id === webviewEventTyped.id &&
    webviewElement &&
    'send' in webviewElement &&
    typeof webviewElement.send === 'function'
  ) {
    webviewElement.send('webview-post-message', { message: webviewEventTyped.message });
  }
};

// call postMessageToWebview when receiving messages from the main process
const webviewPostMessageDisposable = window.events?.receive('webview-post-message', postMessageToWebview);

const updateHtmlOfWebview = (webviewEvent: unknown): void => {
  const webviewEventTyped = webviewEvent as { id: string; html: string };
  if (
    id === webviewEventTyped.id &&
    webviewElement &&
    'send' in webviewElement &&
    typeof webviewElement.send === 'function'
  ) {
    webviewElement.send('webview-update-html', webviewEventTyped.html);
  }
};

const webviewUpdateHtmlDisposable = window.events?.receive('webview-update:html', updateHtmlOfWebview);
window.addEventListener('webview-navigate-to-subroute', handleSubrouteNavigation);

const openDevtoolsDisposable = window.events?.receive('dev-tools:open-webview', (devToolsId: unknown) => {
  if (
    devToolsId === webviewInfo?.id &&
    webviewElement &&
    'openDevTools' in webviewElement &&
    typeof webviewElement.openDevTools === 'function'
  ) {
    webviewElement.openDevTools();
  }
});

// register webview-specific event listeners on the webview element
function navigationListeners(node: HTMLElement): { destroy: () => void } {
  node.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
  node.addEventListener('did-navigate', handleDidNavigate);
  node.addEventListener('page-title-updated', handlePageTitleUpdated);
  node.addEventListener('dom-ready', handleWebviewDomReady);
  return {
    destroy(): void {
      node.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      node.removeEventListener('did-navigate', handleDidNavigate);
      node.removeEventListener('page-title-updated', handlePageTitleUpdated);
      node.removeEventListener('dom-ready', handleWebviewDomReady);
    },
  };
}

// consume pending sub-route after webview loads (for cross-page back/forward navigation)
function handleWebviewDomReady(): void {
  if (!webviewElement) return;

  const pending = consumePendingWebviewSubRoute(id);
  if (pending && (pending.webviewUrl || pending.path !== '/')) {
    isNavigatingWebviewHistory = true;
    navigateWebview(pending.path, pending.webviewUrl);
  }
}

onDestroy(() => {
  webviewPostMessageDisposable.dispose();
  webviewUpdateHtmlDisposable.dispose();
  openDevtoolsDisposable.dispose();
  window.removeEventListener('webview-navigate-to-subroute', handleSubrouteNavigation);

  // no webviews are visible anymore
  window
    .makeDefaultWebviewVisible('')
    .catch((err: unknown) => console.error('Error making default webviews visible', err));
});
</script>

{#if preloadPath && webViewPort && webviewInfo}
  <Route path="/*" breadcrumb={webviewInfo.name}>
    <webview
      bind:this={webviewElement}
      use:webviewLifecycle={lifecycleOptions}
      use:navigationListeners
      aria-label="Webview {webviewInfo?.name}"
      role="document"
      httpreferrer="http://{webviewInfo?.uuid}.webview.localhost:{webViewPort}"
      src="http://{webviewInfo?.uuid}.webview.localhost:{webViewPort}?webviewId={webviewInfo?.id}"
      preload={preloadPath}
      style="height: 100%; width: 100%"></webview>
  </Route>
{/if}
