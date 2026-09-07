---
sidebar_position: 9
title: CLI tools
description: Registering CLI tools in Podman Desktop
tags: [podman-desktop, extension]
keywords: [podman desktop, extension, cli, tool]
---

# CLI tools

Want to automatically install and update a CLI binary your extension depends on, instead of asking users to install it themselves? Extensions can register CLI tools so they appear in the Podman Desktop **Settings > CLI Tools** page. This lets users see the tool's version, path, and update status alongside other registered tools like `kubectl` or `kind`, and optionally lets Podman Desktop drive the install and update flow on the user's behalf.

## Registering a CLI tool

Use `extensionApi.cli.createCliTool()` to register a tool:

```typescript
import * as extensionApi from '@podman-desktop/api';

const cliTool = extensionApi.cli.createCliTool({
  name: 'my-cli',
  displayName: 'My CLI',
  markdownDescription: 'CLI tool for managing my resources',
  images: { icon: './icon.png' },
  version: '1.0.0',
  path: '/usr/local/bin/my-cli',
});
extensionContext.subscriptions.push(cliTool);
```

### Properties

| Property              | Type               | Description                                            |
| --------------------- | ------------------ | ------------------------------------------------------ |
| `name`                | `string`           | Unique identifier for the tool                         |
| `displayName`         | `string`           | Human-readable name shown in the UI                    |
| `markdownDescription` | `string`           | Description (supports Markdown)                        |
| `images`              | `{ icon: string }` | Path to the tool's icon relative to the extension root |
| `version`             | `string`           | Current version of the tool                            |
| `path`                | `string`           | Filesystem path to the tool's binary                   |

## Updating tool information

After registration, you can update the tool's version or path if the user installs a newer version:

```typescript
cliTool.updateVersion({
  version: '1.1.0',
});
```

## Registering an installer or updater

You can provide install and update capabilities so Podman Desktop can manage the tool lifecycle:

```typescript
cliTool.registerInstaller({
  selectVersion: async () => '1.0.0',
  install: async version => {
    await downloadAndInstallBinary(version);
  },
});

cliTool.registerUpdate({
  selectVersion: async () => '1.1.0',
  update: async version => {
    await downloadAndInstallBinary(version);
  },
});
```

When an installer is registered, Podman Desktop shows an install button if the tool is not found. When an updater is registered and a newer version is available, an "Update available" link appears.

## Verification

1. Build and load your extension.
2. Navigate to **Settings > CLI Tools**.
3. Verify the tool appears with the correct name, version, and icon.
