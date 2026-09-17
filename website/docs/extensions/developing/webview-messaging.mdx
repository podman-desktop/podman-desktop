---
sidebar_position: 10
title: Webview messaging
description: Communicating between an extension and its webview panel
tags: [podman-desktop, extension]
keywords: [podman desktop, extension, webview, postMessage]
---

# Webview messaging

Extensions with a webview panel (a dashboard, custom UI, etc.) communicate with their frontend content through message passing. The extension posts messages to the webview, and the webview can post messages back.

## Creating a webview panel

Use `extensionApi.window.createWebviewPanel()` to create a panel that hosts your frontend, then set its HTML content:

```typescript
import * as extensionApi from '@podman-desktop/api';

const panel = extensionApi.window.createWebviewPanel('my-extension-view', 'My Extension');
panel.webview.html = getHtml(); // your bundled frontend HTML

extensionContext.subscriptions.push(panel);
```

## Sending messages to the webview

Call `panel.webview.postMessage()` with a JSON-serializable payload. This is commonly used from a command handler to tell the frontend to navigate or update its state:

```typescript
const viewContainerCommand = extensionApi.commands.registerCommand(
  'my-extension.viewContainerUsage',
  async (container: { id?: string; Id?: string }) => {
    const containerId = container?.id ?? container?.Id;
    panel.reveal();
    await new Promise(resolve => setTimeout(resolve, 200));
    await panel.webview.postMessage({
      type: 'navigate',
      url: `/container/${containerId}`,
    });
  },
);
extensionContext.subscriptions.push(viewContainerCommand);
```

> **_NOTE:_** If the panel was just revealed, the webview may not be mounted yet. A short delay (as above) or a "ready" handshake from the frontend avoids the message being missed.

## Receiving messages on the frontend

Inside the webview content, add a `message` event listener on `window` to react to messages posted by the extension:

```svelte
<script lang="ts">
  let status = $state('idle');

  window.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'navigate') {
      router.goto(event.data.url);
    }
  });
</script>
```

## Receiving messages from the webview

The extension can also listen for messages sent from the frontend using `panel.webview.onDidReceiveMessage`:

```typescript
panel.webview.onDidReceiveMessage((message: unknown) => {
  console.log('Received message from webview', message);
});
```

The frontend posts messages back with `acquirePodmanDesktopApi().postMessage()`, which is exposed to the webview content and internally uses the same `postMessage` mechanism.

## Verification

1. Build and load your extension, and open its dashboard panel.
2. Trigger a command that calls `panel.webview.postMessage()`.
3. Check that the frontend reacts to the message (for example, by navigating to a different page).
