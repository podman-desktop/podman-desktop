<script lang="ts">
import type { WebviewInfo } from '@podman-desktop/core-api';
import { onDestroy, onMount } from 'svelte';
import { get, type Unsubscriber } from 'svelte/store';

import Route from '/@/Route.svelte';
import { webviews } from '/@/stores/webviews';

import { webviewLifecycle } from './webview-directive';

// webview id
export let id: string;

// script to load for the webview
let preloadPath: string;

// exposed port of the server providing pages for the webview
let webViewPort: number | undefined;

// info about the webview retrieved from the id
let webviewInfo: WebviewInfo | undefined;

$: webviewInfo = get(webviews).find(webview => webview.id === id);

const notifyNewWebwievState = (): void => {
  if (webviewInfo) {
    window
      .makeDefaultWebviewVisible(webviewInfo.id)
      .catch((err: unknown) => console.error(`Error make default webview visible ${webviewInfo?.id}`, err));
  }
};

$: webviewInfo && notifyNewWebwievState();
// webview HTML element used to communicate
let webviewElement: HTMLElement | undefined;

// reactive options for webview lifecycle directive - updates when webviewInfo changes
$: lifecycleOptions = { webviewInfo };

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

const openDevtoolsDisposable = window.events?.receive('dev-tools:open-webview', (id: unknown) => {
  if (
    id === webviewInfo?.id &&
    webviewElement &&
    'openDevTools' in webviewElement &&
    typeof webviewElement.openDevTools === 'function'
  ) {
    webviewElement.openDevTools();
  }
});

let unsubscriber: Unsubscriber | undefined;
onMount(async () => {
  preloadPath = await window.getWebviewPreloadPath();
  webViewPort = await window.getWebviewRegistryHttpPort();

  // subscribe to webviews
  unsubscriber = webviews.subscribe(webviews => {
    webviewInfo = webviews.find(webview => webview.id === id);
  });
});

onDestroy(() => {
  webviewPostMessageDisposable.dispose();
  webviewUpdateHtmlDisposable.dispose();
  openDevtoolsDisposable.dispose();
  unsubscriber?.();

  // no webviews are visible anymore
  window
    .makeDefaultWebviewVisible('')
    .catch((err: unknown) => console.error('Error make default webviews visible', err));
});
</script>

{#if preloadPath && webViewPort && webviewInfo}
  <Route path="/*" breadcrumb={webviewInfo.name}>
    <webview
      bind:this={webviewElement}
      use:webviewLifecycle={lifecycleOptions}
      aria-label="Webview {webviewInfo?.name}"
      role="document"
      httpreferrer="http://{webviewInfo?.uuid}.webview.localhost:{webViewPort}"
      src="http://{webviewInfo?.uuid}.webview.localhost:{webViewPort}?webviewId={webviewInfo?.id}"
      preload={preloadPath}
      style="height: 100%; width: 100%"></webview>
  </Route>
{/if}
