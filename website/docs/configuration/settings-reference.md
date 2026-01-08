---
sidebar_position: 2
title: Settings reference
description: Complete reference of all configuration settings available in Podman Desktop
tags: [podman-desktop, settings, configuration]
keywords: [podman desktop, settings, configuration, preferences]
---

# Settings Reference

To customize your Podman Desktop experience, modify the `settings.json` file located in your user configuration directory. You can also adjust these settings, except for internal settings, through the **Settings > Preferences** page in Podman Desktop.

## Configuration File Location

Your user settings are stored in a JSON file at the following locations:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```
%USERPROFILE%\.local\share\containers\podman-desktop\configuration\settings.json
```

</TabItem>
<TabItem value="mac" label="macOS">

```
~/.local/share/containers/podman-desktop/configuration/settings.json
```

</TabItem>
<TabItem value="linux" label="Linux">

```
~/.local/share/containers/podman-desktop/configuration/settings.json
```

</TabItem>
</Tabs>

## User Settings

| Setting                                      | Type    | Default            | Description                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------- | ------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dockerCompatibility.enabled`                | boolean | `false`            | Enable Docker compatibility section                                                                                                                                                                                                                                                                                  |
| `editor.integrated.fontSize`                 | number  | `10`               | Editor font size (6-100 px)                                                                                                                                                                                                                                                                                          |
| `extensions.autoCheckUpdates`                | boolean | `true`             | Auto-check for extension updates                                                                                                                                                                                                                                                                                     |
| `extensions.autoUpdate`                      | boolean | `true`             | Auto-install extension updates                                                                                                                                                                                                                                                                                       |
| `extensions.ignoreBannerRecommendations`     | boolean | `false`            | Disable recommendation banners                                                                                                                                                                                                                                                                                       |
| `extensions.ignoreRecommendations`           | boolean | `false`            | Disable extension recommendations                                                                                                                                                                                                                                                                                    |
| `feedback.dialog`                            | boolean | `true`             | Show experimental feature feedback dialog                                                                                                                                                                                                                                                                            |
| `kubernetes.Kubeconfig`                      | string  | `"~/.kube/config"` | Path to kubeconfig file                                                                                                                                                                                                                                                                                              |
| `kubernetes.statesExperimental`              | object  | `null`             | **EXPERIMENTAL:** New context monitoring. Example: `{}`                                                                                                                                                                                                                                                              |
| `preferences.appearance`                     | string  | `"system"`         | Theme: `"system"`, `"dark"`, or `"light"`                                                                                                                                                                                                                                                                            |
| `preferences.ExitOnClose`                    | boolean | Platform           | Quit app on close vs minimize to tray                                                                                                                                                                                                                                                                                |
| `preferences.login.minimize`                 | boolean | `false`            | Minimize on login                                                                                                                                                                                                                                                                                                    |
| `preferences.login.start`                    | boolean | `true`             | Start on login                                                                                                                                                                                                                                                                                                       |
| `preferences.navigationBarLayout`            | string  | `"icon + title"`   | Navigation style: `"icon + title"` or `"icon"`                                                                                                                                                                                                                                                                       |
| `preferences.OpenDevTools`                   | string  | `"undocked"`       | DevTools position in dev mode                                                                                                                                                                                                                                                                                        |
| `preferences.TrayIconColor`                  | string  | `"default"`        | Tray icon color (requires restart)                                                                                                                                                                                                                                                                                   |
| `preferences.update.reminder`                | string  | `"startup"`        | Update reminders: `"startup"` or `"never"`                                                                                                                                                                                                                                                                           |
| `preferences.zoomLevel`                      | number  | `0`                | Zoom level (-3 to 3)                                                                                                                                                                                                                                                                                                 |
| `preferences.{extensionId}.engine.autostart` | boolean | `true`             | Autostart engine on launch (e.g., `preferences.podman.engine.autostart`)                                                                                                                                                                                                                                             |
| `proxy.enabled`                              | number  | `0`                | Proxy mode: 0=System, 1=Manual, 2=Disabled                                                                                                                                                                                                                                                                           |
| `proxy.http`                                 | string  | `""`               | HTTP proxy URL                                                                                                                                                                                                                                                                                                       |
| `proxy.https`                                | string  | `""`               | HTTPS proxy URL                                                                                                                                                                                                                                                                                                      |
| `proxy.no`                                   | string  | `""`               | No-proxy pattern (comma-separated)                                                                                                                                                                                                                                                                                   |
| `registries.defaults`                        | array   | `[]`               | Default registries and mirrors for container image pulls. See [Managed configuration use cases](/docs/configuration/managed-configuration-use-cases#configuring-default-registries-and-mirrors) and [containers-registries.conf](https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md) |
| `statusbarProviders.showProviders`           | object  | `null`             | **EXPERIMENTAL:** Show providers in status bar. Example: `{"remindAt": 1758312136049, "disabled": false}`                                                                                                                                                                                                            |
| `tasks.manager`                              | object  | `null`             | **EXPERIMENTAL:** New task manager widget. Example: `{}`                                                                                                                                                                                                                                                             |
| `tasks.statusBar`                            | object  | `null`             | **EXPERIMENTAL:** Show tasks in status bar. Example: `{}`                                                                                                                                                                                                                                                            |
| `tasks.toast`                                | boolean | `false`            | Show task creation notifications                                                                                                                                                                                                                                                                                     |
| `telemetry.enabled`                          | boolean | `true`             | Send anonymous usage data to Red Hat                                                                                                                                                                                                                                                                                 |
| `terminal.integrated.fontSize`               | number  | `10`               | Terminal font size (6-100 px)                                                                                                                                                                                                                                                                                        |
| `terminal.integrated.lineHeight`             | number  | `1`                | Terminal line height (1-4)                                                                                                                                                                                                                                                                                           |
| `titleBar.searchBar`                         | object  | `null`             | **EXPERIMENTAL:** Enable titlebar searchbar. Example: `{}`                                                                                                                                                                                                                                                           |
| `userConfirmation.bulk`                      | boolean | `true`             | Confirm bulk actions                                                                                                                                                                                                                                                                                                 |
| `userConfirmation.fetchImageFiles`           | boolean | `true`             | Confirm fetching image layers                                                                                                                                                                                                                                                                                        |
| `window.restorePosition`                     | boolean | `true`             | Restore window position on restart                                                                                                                                                                                                                                                                                   |

## Internal Settings

These settings are automatically managed by Podman Desktop and should not typically be modified manually:

| Setting                                          | Type    | Default                                                    | Description                                                                              |
| ------------------------------------------------ | ------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `exploreFeatures.expanded`                       | boolean | `true`                                                     | Explore features expanded state                                                          |
| `exploreFeatures.hiddenFeatures`                 | array   | `null`                                                     | Hidden feature IDs                                                                       |
| `extensions.developmentExtensionsFolders`        | array   | `[]`                                                       | Development extension folders                                                            |
| `extensions.registryUrl`                         | string  | `"https://registry.podman-desktop.io/api/extensions.json"` | Extensions catalog URL                                                                   |
| `learningCenter.expanded`                        | boolean | `true`                                                     | Learning center expanded state                                                           |
| `libpodApi.forImageList`                         | boolean | `true`                                                     | Use libpod API for images                                                                |
| `list.{listKind}`                                | array   | Dynamic                                                    | Column preferences per list type (e.g., `list.containers`, `list.images`)                |
| `navbar.disabledItems`                           | array   | `[]`                                                       | Disabled navigation items                                                                |
| `preferences.update.disableDifferentialDownload` | boolean | Platform                                                   | Disable differential download                                                            |
| `releaseNotesBanner.show`                        | string  | `"show"`                                                   | Release notes banner state                                                               |
| `statusBar.pinnedItems`                          | array   | `["podman"]`                                               | Pinned status bar items                                                                  |
| `telemetry.check`                                | boolean | `false`                                                    | Telemetry dialog shown                                                                   |
| `welcome.version`                                | string  | `"undefined"`                                              | Welcome page version shown                                                               |
| `window.bounds`                                  | object  | `null`                                                     | Window position and size. Example: `{"x": 2008, "y": 310, "width": 1022, "height": 795}` |

## Example Configuration

```json
{
  "preferences.appearance": "dark",
  "preferences.zoomLevel": 0,
  "telemetry.enabled": false,
  "terminal.integrated.fontSize": 12,
  "editor.integrated.fontSize": 14,
  "preferences.update.reminder": "never",
  "kubernetes.Kubeconfig": "~/.kube/config",
  "preferences.login.start": true,
  "extensions.autoUpdate": true,
  "userConfirmation.bulk": true,
  "proxy.http": "https://127.0.0.1:8081",
  "statusbarProviders.showProviders": {
    "remindAt": 1758312136049,
    "disabled": false
  },
  "window.bounds": {
    "x": 2008,
    "y": 310,
    "width": 1022,
    "height": 795
  }
}
```

## See Also

- [Managed Configuration](/docs/configuration/managed-configuration) - Deploy and lock settings across multiple machines
