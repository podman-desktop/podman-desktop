---
sidebar_position: 4
title: Testing a Flatpak from a release
description: How to correctly test a Podman Desktop Flatpak bundle from the release page.
tags: [podman-desktop, testing, linux, flatpak]
keywords: [podman desktop, podman, containers, testing, linux, flatpak, release, permissions]
---

# Testing a Flatpak from a release {#testing-flatpak-release}

Each Podman Desktop release includes a `.flatpak` bundle in the [GitHub release assets](https://github.com/podman-desktop/podman-desktop/releases). This page explains how to test that bundle correctly, including cases where sandbox permissions have changed between releases.

When you install Podman Desktop from Flathub, the permissions declared in [`io.podman_desktop.PodmanDesktop.yml`](https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml) are applied automatically. Installing a `.flatpak` bundle over an existing Flathub installation can leave an older cached permission profile active, causing failures such as lost filesystem access or silent D-Bus errors.

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

2. (Optional) Remove cached application data for a completely clean environment:

   For a user install:

   ```shell-session
   $ rm -rf ~/.var/app/io.podman_desktop.PodmanDesktop
   ```

   For a system-wide install (requires elevated privileges):

   ```shell-session
   $ sudo rm -rf /var/lib/flatpak/app/io.podman_desktop.PodmanDesktop
   ```

   :::caution
   These commands remove all local Podman Desktop settings and data stored under the Flatpak sandbox. Only run the command that matches your install scope from Step 1.
   :::

3. Install the downloaded bundle using the same scope as Step 1:

   For a user install:

   ```shell-session
   $ flatpak install --user ~/Downloads/podman-desktop-<version>.flatpak
   ```

   For a system-wide install, omit `--user`:

   ```shell-session
   $ flatpak install ~/Downloads/podman-desktop-<version>.flatpak
   ```

4. Run Podman Desktop:

   ```shell-session
   $ flatpak run io.podman_desktop.PodmanDesktop
   ```

5. Verify the active permissions match the expected manifest:

   For a user install:

   ```shell-session
   $ flatpak info --user --show-permissions io.podman_desktop.PodmanDesktop
   ```

   For a system-wide install:

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

2. Apply your changes to `io.podman_desktop.PodmanDesktop.yml`, for example, add or update `finish-args` entries.

3. Build and install locally:

   ```shell-session
   $ flatpak run org.flatpak.Builder \
       --user \
       --install \
       --force-clean \
       build \
       io.podman_desktop.PodmanDesktop.yml
   ```

4. Run Podman Desktop and verify the new permissions are in effect:

   ```shell-session
   $ flatpak run io.podman_desktop.PodmanDesktop
   ```

5. Check the active permissions:

   ```shell-session
   $ flatpak info --show-permissions io.podman_desktop.PodmanDesktop
   ```

#### Reverting to the Flathub release

To go back to the stable Flathub version after testing, run the commands that match the scope you used when installing:

For a user install:

```shell-session
$ flatpak uninstall --user io.podman_desktop.PodmanDesktop
$ flatpak install --user flathub io.podman_desktop.PodmanDesktop
```

For a system-wide install, omit `--user`:

```shell-session
$ flatpak uninstall io.podman_desktop.PodmanDesktop
$ flatpak install flathub io.podman_desktop.PodmanDesktop
```

#### Additional resources

- [Flathub manifest for Podman Desktop](https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml)
- [Flatpak — Building your first Flatpak](https://docs.flatpak.org/en/latest/first-build.html)
- [Flatpak — Sandbox permissions reference](https://docs.flatpak.org/en/latest/sandbox-permissions-reference.html)
- [Installing from a Flatpak bundle](/docs/installation/linux-install/installing-podman-desktop-from-a-flatpak-bundle)

#### Next steps

- [Working with containers](/docs/containers)
