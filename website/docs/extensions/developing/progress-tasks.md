---
sidebar_position: 7
title: Progress tasks
description: Showing progress indicators in Podman Desktop
tags: [podman-desktop, extension]
keywords: [podman desktop, extension, progress, task]
---

# Progress tasks

Extensions can show progress indicators in the Podman Desktop task widget while performing long-running operations. This gives users visual feedback with a title, message, and optional progress bar.

## Using `withProgress`

Wrap any async operation with `extensionApi.window.withProgress()`:

```typescript
import * as extensionApi from '@podman-desktop/api';

await extensionApi.window.withProgress(
  { location: extensionApi.ProgressLocation.TASK_WIDGET, title: 'Building image' },
  async progress => {
    progress.report({ increment: 0, message: 'Preparing build context...' });
    await prepareBuildContext();

    progress.report({ increment: 50, message: 'Building layers...' });
    await buildLayers();

    progress.report({ increment: 100, message: 'Build complete' });
  },
);
```

### Parameters

The first argument is an options object:

| Property   | Type               | Description                                                                         |
| ---------- | ------------------ | ----------------------------------------------------------------------------------- |
| `location` | `ProgressLocation` | Where to show the progress. Use `ProgressLocation.TASK_WIDGET` for the task manager |
| `title`    | `string`           | Title displayed at the top of the task entry                                        |

### Reporting progress

Inside the callback, call `progress.report()` with:

| Property    | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `message`   | `string` | Status text shown below the title |
| `increment` | `number` | Progress bar value from 0 to 100  |

You can call `progress.report()` multiple times to update both the message and the progress bar as work proceeds.

## Indeterminate progress

If you cannot estimate progress, omit the `increment` field. The task widget will show an indeterminate spinner:

```typescript
await extensionApi.window.withProgress(
  { location: extensionApi.ProgressLocation.TASK_WIDGET, title: 'Scanning containers' },
  async progress => {
    progress.report({ message: 'Scanning...' });
    await scanAllContainers();
    progress.report({ message: 'Done' });
  },
);
```

## Verification

1. Ensure that **Tasks** section visibility is enabled in **Settings > Preferences** (Status Bar and Toast).
2. Trigger the operation that calls `withProgress`.
3. Check that a task entry appears in the task widget with the correct title and progress updates.
