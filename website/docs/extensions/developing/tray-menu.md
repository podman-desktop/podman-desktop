---
sidebar_position: 8
title: Tray menu
description: Adding items to the system tray menu
tags: [podman-desktop, extension]
keywords: [podman desktop, extension, tray, menu]
---

# Tray menu

Extensions can add items and submenus to the Podman Desktop system tray icon menu, giving users quick access to extension commands without opening the main window.

## Registering a menu item

Use `extensionApi.tray.registerMenuItem()` to add an entry. The item's `id` must match a registered command:

```typescript
import * as extensionApi from '@podman-desktop/api';

const trayItem = extensionApi.tray.registerMenuItem({
  id: 'my-extension.openDashboard',
  label: 'Open Dashboard',
  type: 'normal',
});
extensionContext.subscriptions.push(trayItem);
```

When the user clicks the tray entry, Podman Desktop invokes the command with the matching `id`.

## Creating a submenu

Group related actions under a single submenu using `type: 'submenu'`:

```typescript
const traySubmenu = extensionApi.tray.registerMenuItem({
  id: 'my-extension.tray',
  type: 'submenu',
  label: 'My Extension',
  submenu: [
    { id: 'my-extension.openDashboard', label: 'Open Dashboard', type: 'normal' },
    { id: 'my-extension.stopAll', label: 'Stop All', type: 'normal' },
  ],
});
extensionContext.subscriptions.push(traySubmenu);
```

### Menu item properties

| Property  | Type                      | Description                                                   |
| --------- | ------------------------- | ------------------------------------------------------------- |
| `id`      | `string`                  | Command ID to execute on click (must be a registered command) |
| `label`   | `string`                  | Text displayed in the tray menu                               |
| `type`    | `'normal'` or `'submenu'` | Whether this is a clickable item or a submenu container       |
| `submenu` | `MenuItem[]`              | Child items (only when `type` is `'submenu'`)                 |

## Prerequisites

The commands referenced by tray menu `id` fields must be registered before the tray item is created:

```typescript
extensionContext.subscriptions.push(
  extensionApi.commands.registerCommand('my-extension.openDashboard', () => {
    panel.reveal();
  }),
);

extensionContext.subscriptions.push(
  extensionApi.commands.registerCommand('my-extension.stopAll', async () => {
    await stopAllOperations();
    extensionApi.window.showInformationMessage('All operations stopped.');
  }),
);
```

## Verification

1. Build and load your extension.
2. Right-click (or click, depending on OS) the Podman Desktop tray icon.
3. Verify your menu items or submenu appear and execute the correct commands.
