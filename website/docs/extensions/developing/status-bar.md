---
sidebar_position: 6
title: Status bar
description: Adding status bar items to Podman Desktop
tags: [podman-desktop, extension]
keywords: [podman desktop, extension, status bar]
---

# Status bar

Extensions can add items to the Podman Desktop status bar at the bottom of the window. Status bar items display text, respond to clicks by executing a command, and can be updated dynamically at runtime.

## Creating a status bar item

Use `extensionApi.window.createStatusBarItem()` to create a new item:

```typescript
import * as extensionApi from '@podman-desktop/api';

const statusBar = extensionApi.window.createStatusBarItem();
statusBar.text = 'My Extension';
statusBar.command = 'my-extension.openDashboard';
statusBar.tooltip = 'Click to open the dashboard';
statusBar.show();

extensionContext.subscriptions.push(statusBar);
```

### Properties

| Property    | Type                                               | Description                                     |
| ----------- | -------------------------------------------------- | ----------------------------------------------- |
| `text`      | `string`                                           | Text displayed in the status bar                |
| `command`   | `string`                                           | Command ID executed when the item is clicked    |
| `tooltip`   | `string`                                           | Tooltip shown on hover                          |
| `iconClass` | `string` or `{ active: string; inactive: string }` | CSS class for an icon                           |
| `enabled`   | `boolean`                                          | Whether the item is clickable (default: `true`) |

### Visibility

Call `.show()` to make the item visible and `.hide()` to remove it. You can toggle visibility based on extension settings:

```typescript
if (settings.showStatusBar) {
  statusBar.show();
} else {
  statusBar.hide();
}
```

## Updating text dynamically

Use `setInterval` or event listeners to update the status bar text at runtime:

```typescript
const interval = setInterval(() => {
  const count = getActiveCount();
  statusBar.text = count > 0 ? `My Extension (${count} active)` : 'My Extension';
}, 3000);

extensionContext.subscriptions.push({
  dispose: () => clearInterval(interval),
});
```

## Controlling visibility from configuration

Declare a boolean setting in `package.json` so users can toggle the status bar item:

```json
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "my-extension.showStatusBar": {
          "type": "boolean",
          "default": true,
          "description": "Show the status bar indicator."
        }
      }
    }
  }
}
```

Then read the setting at startup and react to changes:

```typescript
const config = extensionApi.configuration.getConfiguration('my-extension');
const showStatusBar = config.get<boolean>('showStatusBar') ?? true;

if (showStatusBar) {
  statusBar.show();
}

extensionApi.configuration.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('my-extension')) {
    const updated = extensionApi.configuration.getConfiguration('my-extension');
    if (updated.get<boolean>('showStatusBar')) {
      statusBar.show();
    } else {
      statusBar.hide();
    }
  }
});
```

## Verification

1. Build and load your extension.
2. Check that the status bar item appears at the bottom of the Podman Desktop window.
3. Click the item and verify the linked command executes.
