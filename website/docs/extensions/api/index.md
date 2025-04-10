---
sidebar_position: 3
title: API Reference
description: API Reference
tags: [podman-desktop, extension, api]
keywords: [podman desktop, extension, api]
---

The extension API reference is located [here](/api).

Based on your use cases, you can add these common capabilities to your extension:

- Create a new CLI tool instance and register it with Podman Desktop, see the details [here](https://podman-desktop.io/api/@podman-desktop/namespaces/cli/functions/createCliTool). You can add the `createCliTool()` function with relevant parameters in your `src/extension.ts` file.
  - Register the state of a CLI tool, see the [resource](/api/type-aliases/CliToolState).
- Add operations related to a container engine, see the usage of the [containerEngine](https://podman-desktop.io/api/@podman-desktop/namespaces/containerEngine) API.
- Add a new Kubernetes provider connection, use the [`KubernetesProviderConnection`](/api/interfaces/KubernetesProviderConnection) interface.
- Enable navigation to a CLI tool page, use the function [`navigateToCliTools()`](https://podman-desktop.io/api/@podman-desktop/namespaces/navigation/functions/navigateToCliTools).
- Enable navigation to a specific page in the UI, refer to the [navigation APIs](https://podman-desktop.io/api/@podman-desktop/namespaces/navigation) category.
- Create and show a new webview panel in the UI, use the [`createWebviewPanel()`](https://podman-desktop.io/api/@podman-desktop/namespaces/window/functions/createWebviewPanel) function.
- Add options for running a command, use the [`RunOptions`](/api/interfaces/RunOptions) interface.

You can also create your own custom extensions and add them to the catalog for others to use.
