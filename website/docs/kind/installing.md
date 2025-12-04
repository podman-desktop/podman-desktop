---
sidebar_position: 2
title: Installing the CLI
description: Kind is one way to get Kubernetes running on your workstation.
keywords: [podman desktop, podman, containers, installing CLI, kubernetes, kind]
tags: [installing-the-kind-CLI, kind]
---

# Installing the `kind` CLI

#### Procedure

- In the status bar, click on **Kind**, and follow the prompts.
  ![Kind in the status bar](img/kind-status-bar.png)

#### Verification

1. The status bar does not display **Kind**.
1. **<Icon icon="fa-solid fa-cog" size="lg" /> Settings > Resources** contain a **Kind** tile.
   ![Kind resource tile](img/kind-resource.png)
1. You can run the `kind` CLI:

   ```shell-session
   kind get clusters
   ```
