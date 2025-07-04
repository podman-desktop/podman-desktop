---
sidebar_position: 20
title: Creating a Podman machine
description: Podman Desktop can assist you to create custom Podman machine on Windows and macOS.
tags: [podman, installing, windows, macOS]
keywords: [podman desktop, containers, podman, installing, installation, windows, macos, podman machine]
---

# Creating a Podman machine

On macOS and Windows, running the Podman container engine requires running a Linux virtual machine.

By default, Podman Desktop initializes a Podman machine with a standard configuration.

Consider creating a custom Podman machine to:

- Control the assigned resources: CPUs, memory, and disk size.
- Use a custom boot image.
- Use the rootful connection by default, for example to run Kind.
- (On Windows) Route the traffic through the network connection from your Windows session.

#### Prerequisites

- The Podman executable is installed.

  :::note

  On the macOS ARM64 platform, you might get a warning that the `krunkit` binary is unavailable on the _Create Podman machine_ page. To resolve the warning, [install `krunkit` manually](https://github.com/containers/krunkit?tab=readme-ov-file#installation) or [install Podman using the GitHub installer](https://github.com/containers/podman/releases).

  :::

#### Procedure

1. Go to **Settings > Resources**.
1. In the **Podman** tile, click **Create new**.
1. In the **Create a Podman machine** screen:
   1. **Name**:
      Enter a name, such as `podman-machine-default`.
   1. **CPU(s)**:
      Select the number of CPUs.
   1. **Memory**:
      Select the memory size.
   1. **Disk size**:
      Select the disk size.
   1. Optional: Provide a bootable image using one of the following options:
      - **Image Path**: Select an image, such as `podman-machine.aarch64.applehv.raw.zst` from your local machine.
      - **Image URL or image reference**: Enter an image URL or a registry path. You can use an image URL from the [Podman releases page](https://github.com/containers/podman/releases) or use a valid registry path in the format `registry/repo/image:version`.
   1. **Machine with root privileges**:
      Enable to use the rootful connection by default.
      Required to use Kind on Windows.
   1. Additional settings based on your operating system:
      - (On Windows)
        - **User mode networking (traffic relayed by a user process)**: Enable to route the traffic through the network connection from your Windows session. This setting is required to access resources behind your VPN connection.
        - **Provider Type**: The setting is visible only to administrators, and its default value is `wsl`.
      - (On macOS) **Provider Type**:
        - For the macOS ARM64 platform, the default value is `GPU enabled (LibKrun)`. However, you can switch to `Apple HyperVisor` when needed.
        - For the macOS AMD64 platform, the default value is `Apple HyperVisor`, and you cannot use the `GPU enabled (LibKrun)` provider.

   1. Click **Create**.

      ![Create a Podman machine](img/create-a-podman-machine.png)
