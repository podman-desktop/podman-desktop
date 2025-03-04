---
sidebar_position: 4
title: Configuring a mirror registry
description: Covers the procedure to configure a mirror registry
keywords: [podman desktop, podman, mirroring, registry, configuration]
tags: [registry-configuration, mirroring-a-registry]
---

# Configuring a mirror registry

You can add registry locations and configure their mirrors by using the Podman Desktop UI. By configuring a mirror, you can redirect a registry to another location and use its content, such as images, files, and other resources during development.

#### Prerequisites

- [A running Podman machine](/docs/podman/creating-a-podman-machine).

#### Procedure

1. Go to the **Settings > Resources** page.
1. Select **More Options > Setup registry configuration** in the Podman tile. A command palette opens.
   ![Set up registry configuration](img/setting-up-registry-configuration.png)
1. Set up your registry configuration:
   1. Select the **Add registry configuration** option from the command palette.
      ![adding registry configuration](img/add-registry-configuration.png)
   1. Type the location of the registry, such as `docker.io`, and press the `Enter` key. The `docker.io` registry is added to the palette.
      ![docker.io registry added](img/docker-option-added.png)
   1. Select `docker.io` from the command palette.
   1. Type the location where you want to mirror the registry, such as `ghcr.io`, and press the `Enter` key. The entry for the `docker.io` registry shows the location where it is mirrored.
      ![mirrored registry location](img/mirrored-registry.png)
   1. Select the `End configuring registries` option to end registry configuration.
      ![ending registry configuration](img/end-configuring-registries.png)
