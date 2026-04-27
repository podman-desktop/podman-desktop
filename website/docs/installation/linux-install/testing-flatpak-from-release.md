---
sidebar_position: 4
title: Testing a Flatpak from a release
description: How to correctly test a Podman Desktop Flatpak bundle from the release page.
tags: [podman-desktop, testing, linux, flatpak]
keywords: [podman desktop, podman, containers, testing, linux, flatpak, release, permissions]
---

# Testing a Flatpak from a release {#testing-flatpak-release}

When Podman Desktop publishes a new release, a `.flatpak` bundle is attached to the [GitHub release assets](https://github.com/podman-desktop/podman-desktop/releases). This page explains how to correctly test that bundle, including when the Flatpak's sandbox permissions have changed between releases.

Flatpak enforces sandbox permissions declared in the application manifest ([`io.podman_desktop.PodmanDesktop.yml`](https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml)). When you install Podman Desktop from Flathub, those permissions are applied automatically. However, if you install a `.flatpak` bundle over an existing Flathub installation, the old permission profile may remain cached on your system, causing unexpected failures such as filesystem access or D-Bus calls failing silently.

#### Prerequisites

- A Linux system with [Flatpak](https://flatpak.org/setup/) installed.
- The `.flatpak` bundle downloaded from the [releases page](https://github.com/podman-desktop/podman-desktop/releases).
- _(For building locally only)_ Flatpak builder, runtime, and SDK:

  ```shell-session
  $ flatpak remote-add --if-not-exists flathub --user https://flathub.org/repo/flathub.flatpakrepo
  $ flatpak install --user flathub org.flatpak.Builder org.freedesktop.Platform//25.08 org.freedesktop.Sdk//25.08
  ```

#### Procedure: Testing a release bundle

1. Uninstall any existing installation to remove stale cached permissions:

   ```shell-session
   $ flatpak uninstall --user io.podman_desktop.PodmanDesktop
   ```

   If Podman Desktop was installed system-wide, omit `--user`:

   ```shell-session
   $ flatpak uninstall io.podman_desktop.PodmanDesktop
   ```

1. (Optional) Remove cached application data for a completely clean environment:

   ```shell-session
   $ rm -rf ~/.var/app/io.podman_desktop.PodmanDesktop
   ```

   :::caution
   This removes all local Podman Desktop settings and data stored under the Flatpak sandbox.
   :::

1. Install the downloaded bundle:

   ```shell-session
   $ flatpak install --user ~/Downloads/podman-desktop-<version>.flatpak
   ```

1. Run Podman Desktop:

   ```shell-session
   $ flatpak run io.podman_desktop.PodmanDesktop
   ```

1. Verify the active permissions match the expected manifest:

   ```shell-session
   $ flatpak info --show-permissions io.podman_desktop.PodmanDesktop
   ```

   Compare the output against the `finish-args` section of the [upstream manifest](https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml).

#### Procedure: Building from the Flathub manifest

When a pull request modifies Flatpak permissions, build the Flatpak locally from the updated manifest rather than relying on the pre-built release bundle.

1. Clone the Flathub manifest repository:

   ```shell-session
   $ git clone https://github.com/flathub/io.podman_desktop.PodmanDesktop.git
   $ cd io.podman_desktop.PodmanDesktop
   ```

1. Apply your changes to `io.podman_desktop.PodmanDesktop.yml`, for example, add or update `finish-args` entries.

1. Build and install locally:

   ```shell-session
   $ flatpak run org.flatpak.Builder \
       --user \
       --install \
       --force-clean \
       build \
       io.podman_desktop.PodmanDesktop.yml
   ```

1. Run Podman Desktop and verify the new permissions are in effect:

   ```shell-session
   $ flatpak run io.podman_desktop.PodmanDesktop
   ```

1. Check the active permissions:

   ```shell-session
   $ flatpak info --show-permissions io.podman_desktop.PodmanDesktop
   ```

#### Reverting to the Flathub release

To go back to the stable Flathub version after testing:

```shell-session
$ flatpak uninstall --user io.podman_desktop.PodmanDesktop
$ flatpak install --user flathub io.podman_desktop.PodmanDesktop
```

#### Additional resources

- [Flathub manifest for Podman Desktop](https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml)
- [Flatpak — Building your first Flatpak](https://docs.flatpak.org/en/latest/first-build.html)
- [Flatpak — Sandbox permissions reference](https://docs.flatpak.org/en/latest/sandbox-permissions-reference.html)
- [Installing from a Flatpak bundle](/docs/installation/linux-install/installing-podman-desktop-from-a-flatpak-bundle)

#### Next steps

- [Working with containers](/docs/containers)
