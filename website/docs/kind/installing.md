---
sidebar_position: 2
title: Installing the CLI
description: Kind is one way to get Kubernetes running on your workstation.
keywords: [podman desktop, podman, containers, installing CLI, kubernetes, kind]
tags: [installing-the-kind-CLI, kind]
---

# Installing the `kind` CLI

#### Procedure

Install the `kind` CLI using one of these ways:

_Using the CLI Page_

1. Go to **Settings > CLI tools**.
1. Click the **Install** link on the **Kind** tile.

_Using the Resources Page_

1. Go to **Settings > Resources**.
1. Click the **Create new…** link on the **Kind** tile. A pop-up window opens to confirm the installation of the latest version of Kind.
1. Click **Confirm** to proceed.
1. Click **Go back to resources** after cluster creation.

_Using the Status Bar_

- In the status bar, click **Kind** and follow the on-screen prompts.
  ![Kind in the status bar](img/kind-status-bar.png)

#### Verification

1. Under **Settings > Resources**, verify your cluster is active on the **Kind** tile.
   ![Kind resource tile](img/kind-resource.png)
1. Open a terminal, and run the `kind` CLI:

   ```shell-session
   $ kind get clusters
   ```
