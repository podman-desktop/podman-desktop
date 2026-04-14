---
sidebar_position: 2
title: Developing
description: Developing a Podman Desktop extension
tags: [podman-desktop, extension, writing]
keywords: [podman desktop, extension, writing]
---

# Developing a Podman Desktop extension

Podman Desktop is organized so that you can modularly add new functionality in the form of "extensions" as well as the corresponding extension-api. This allows you to communicate with Podman Desktop without having to know the internal workings. You look for the API call and Podman Desktop will do the rest.

It is recommended that an extension be written in `TypeScript` for type checking, but extensions can be written in `JavaScript`.

Most extensions are externally loaded; however, we also dogfood our own API by loading them as [internal extensions](https://github.com/podman-desktop/podman-desktop/tree/main/extensions) that use the same API. These internally maintained extensions can be used as an example and basis for how to build an externally loaded extension.

## Overview of creating a new extension

We try to simplify extension creation as much as possible by utilizing `package.json` and by keeping activations simple within the extension, providing only two entrypoints: `activate()` and `deactivate()`.

All Podman Desktop functionalities are communicated entirely through the API. The extension you create interacts with the Podman Desktop API through the `@podman-desktop/api` package. The API code is located [here](https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts), while the website representation of the code can be found [here](https://podman-desktop.io/api).

### Activating

When activating an extension, Podman Desktop will:

1. Search and load the `JavaScript` file specified in `main` entry of the `package.json` file in the extension directory (typically `extension.js`).
2. Run the exported `activate` function.

### Deactivating

When deactivating an extension, Podman Desktop will:

1. Run the optionally exported `deactivate` function.
2. Dispose of any resources that have been added to `extensionContext.subscriptions`, see `deactivateExtension` in [extension-loader.ts](https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/plugin/extension-loader.ts).

### Example boilerplate code

This is an example `extensions/foobar/src/extensions.ts` file with the basic `activate` and `deactivate` functionalities, provided that you already have a `package.json` created as well:

```ts
import * as extensionApi from '@podman-desktop/api';

// Activate the extension asynchronously
export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {
  // Create a provider with an example name, ID and icon
  const provider = extensionApi.provider.createProvider({
    name: 'FooBar',
    id: 'foobar',
    status: 'unknown',
    images: {
      icon: './icon.png',
      logo: './icon.png',
    },
  });

  // Push the new provider to Podman Desktop
  extensionContext.subscriptions.push(provider);
}

// Deactivate the extension
export function deactivate(): void {
  console.log('stopping FooBar extension');
}
```

### Interacting with the UI

The extension "hooks" into the Podman Desktop UI by various means, which include:

- Registering the extension as a specific provider (authentication, registry, Kubernetes, containers, CLI tools, or others).
- Registering to specific events (with functions starting with `onDid...`).
- Adding entries to menus (tray menu, status bar, and other types of menus).
- Adding fields to the configuration panel.
- Watching files in the filesystem.

When the extension code is accessed through these different registrations, the extension can use utility functions provided by the API to:

- Get values of configuration fields.
- Interact with the user through input boxes and quick picks.
- Display information, warnings, error messages, and notifications to the user.
- Get information about the environment (OS, telemetry, system clipboard).
- Execute the process in the system.
- Send data to the telemetry.
- Set data in the context, which is propagated in the UI.

## Creating and running your extension

You can create and run an extension by performing the following end-to-end tasks:

1. [Initializing an extension](/tutorial/creating-an-extension#initializing-an-extension)
1. [Writing the extension's features](/tutorial/creating-an-extension#writing-the-extension-entry-point)
1. [Build dependencies](/tutorial/creating-an-extension#build-dependencies)
1. [Running the extension](/tutorial/creating-an-extension#running-the-extension)
1. [Verifying the extension's features](/tutorial/creating-an-extension#verifying-the-extensions-features)

## Expanding your extension

Below is documentation and/or "boiler-plate" code that can help expand your extension.

### Using `ProviderStatus`

Podman Desktop runs each provider via series of statuses from [extension-api](https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts).

```ts
export type ProviderStatus =
  | 'not-installed'
  | 'installed'
  | 'configured'
  | 'ready'
  | 'started'
  | 'stopped'
  | 'starting'
  | 'stopping'
  | 'error'
  | 'unknown';
```

`ProviderStatus` supplies information to the main Provider page detailing whether or not that Provider is installed, ready, started, stopped, etc.

This can be updated throughout your extension by calling for example: `provider.updateStatus('installed')`. Podman Desktop will show the status on the main screen.

> **_NOTE:_** ProviderStatus is for information purposes only and can be used from within the extension to keep track if `activate()` and `deactivate()` are working correctly.

### Using `ProviderConnectionStatus`

```ts
export type ProviderConnectionStatus = 'started' | 'stopped' | 'starting' | 'stopping' | 'unknown';
```

> **_NOTE:_** The `unknown` status is unique as it will not show in the extension section of Podman Desktop, it will also not be accessible via API calls. Unknown statuses typically happen when Podman Desktop is unable to load the extension.

`ProviderConnectionStatus` is the main "Lifecycle" of your extension. The status is updated automatically by Podman Desktop and reflected within the provider.

Upon a successful start up via the `activate` function within your extension, `ProviderConnectionStatus` will be reflected as 'started'.

`ProviderConnectionStatus` statuses are used in two areas, [extension-loader.ts](https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/plugin/extension-loader.ts) and [tray-menu.ts](https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/tray-menu.ts):

- `extension-loader.ts`: Attempts to load the extension and sets the status accordingly (either `started`, `stopped`, `starting` or `stopping`). If an unknown error has occurred, the status is set to `unknown`. `extension-loader.ts` also sends an API call to Podman Desktop to update the UI of the extension.
- `tray-menu.ts`: If `extensionApi.tray.registerMenuItem(item);` API call has been used, a tray menu of the extension will be created. When created, Podman Desktop will use the `ProviderConnectionStatus` to indicate the status within the tray menu.

### Adding commands

## Commands

Declare commands using `contributes` section of package.json file.

```json
 "contributes": {
    "commands": [
      {
        "command": "my.command",
        "title": "This is my command",
        "category": "Optional category to prefix title",
        "enablement": "myProperty === myValue"
      },
    ],
 }
```

If optional `enablement` property evaluates to false, command palette will not display this command.

To register the callback of the command, use the following code:

```ts
import * as extensionApi from '@podman-desktop/api';

extensionContext.subscriptions.push(extensionApi.commands.registerCommand('my.command', async () => {
    // callback of your command
    await extensionApi.window.showInformationMessage('Clicked on my command');
});
);
```

### Expanding the `extension-api` API

Sometimes you'll need to add new functionality to the API in order to make an internal change within Podman Desktop. An example would be a new UI/UX component that happens within the renderer, you'd need to expand the API in order to make that change to Podman Desktop's inner-workings.

Please note that an API contribution is **subject to approval** as we want to maintain sustainability / consistency in the API. A discussion within an issue would be beneficial before writing code.

In this example, we'll add a new function to simply display: "hello world" in the console.

1. Add the new function to `/packages/extension-api/src/extension-api.d.ts`, under a namespace. This will make it accessible within the API when it's being called within your extension:

```ts
export namespace foobar {
  // ...
  export function hello(input: string): void;
}
```

2. The `packages/main/src/plugin/extension-loader.ts` acts as an extension loader that defines all the actions needed by the API. Modify it to add the main functionality of `hello()` under the `foobar` namespace const: <!-- markdownlint-disable-line MD029 -->

```ts
// It's recommended you define a class that you retrieve from a separate file
// see Podman and Kubernetes examples for implementation.

// Add the class to the constructor of the extension loader
import type { FoobarClient } from './foobar';

export class ExtensionLoader {
  // ...
  constructor(
    private foobarClient: FoobarClient,
    // ...
  ) {}
// ..
}

// Initialize the 'foobar' client
const foobarClient = this.foobarClient;

// The "containerDesktopAPI.foobar" call is the namespace you previously defined within `extension-api.d.ts`
const foobar: typeof containerDesktopAPI.foobar = {

  // Define the function that you are implementing and call the function from the class you created.
  hello(input: string): void => {
    return foobarClient.hello(input);
  },
};

// Add 'foobar' to the list of configurations being returned by `return <typeof containerDesktopAPI>`
return <typeof containerDesktopAPI>{
  foobar
};
```

3. The above code won't work until we've created the class! So let's create a `packages/main/src/plugin/foobar-client.ts` file with the functionality: <!-- markdownlint-disable-line MD029 -->

```ts
export class FoobarClient {
  hello(input: string) {
    console.log('hello ' + input);
  }
}
```

4. An instance of this class needs to be created and passed to the constructor of the `ExtensionLoader`, in `packages/main/src/plugin/index.ts`: <!-- markdownlint-disable-line MD029 -->

```ts
const foobarClient = new FoobarClient();
this.extensionLoader = new ExtensionLoader(
  /* ... */
  foobarClient,
);
```

5. In package.json you can register some setting through the configuration settings property <!-- markdownlint-disable-line MD029 -->

For example if you contribute a property named `podman.binary.path` it will display `Path` in Podman Desktop UI setting, and if you change it to `podman.binary.pathToBinary` it becomes `Path To Binary` in the title.

```ts

    "configuration": {
      "title": "Podman",
      "properties": {
        "podman.binary.path": {
          "name": "Path to Podman Binary",
          "type": "string",
          "format": "file",
          "default": "",
          "description": "Custom path to Podman binary (Default is blank)"
        },
```

6. Last step! Call the new API call to the extension you are implementing from your extension: <!-- markdownlint-disable-line MD029 -->

```ts
export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {
  // Define the provider
  const provider = extensionApi.provider.createProvider({
    name: 'FooBar',
    id: 'foobar',
    status: 'unknown',
    images: {
      icon: './icon.png',
      logo: './icon.png',
    },
  });

  // Push the new provider to Podman Desktop
  extensionContext.subscriptions.push(provider);

  // Call the "hello world" function that'll output to the console
  extensionContext.foobar.hello('world');
}
```

## Additional resources

- Consider a packer such as [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) to shrink the size of the artifact.

## Next steps

- [Publishing a Podman Desktop extension](/docs/extensions/publish)
