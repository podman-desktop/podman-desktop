---
sidebar_position: 5
title: Working with a cluster
description: Working with your local Kind-powered Kubernetes cluster.
keywords: [podman desktop, podman, containers, setting context, kubernetes, kind]
tags: [working-with-a-kind-cluster, kind]
---

# Working with your local Kind-powered Kubernetes cluster

Set your Kubernetes context to your local Kind-powered Kubernetes cluster.

#### Prerequisites

- [You onboarded a Kind cluster](/docs/kind).
- [You have set your Kubernetes context to your local Kind-powered Kubernetes cluster](/docs/kind/working-with-your-local-kind-cluster).

#### Procedure

1. Open the Podman Desktop tray.
2. Go to **Kubernetes**.
3. Click the Kubernetes context with the `kind` prefix.

:::note

Alternatively, use the status bar or the Podman Desktop **Settings** to set your Kubernetes context. For more details, see [Viewing and selecting the current Kubernetes context](/docs/kubernetes/viewing-and-selecting-current-kubernetes-context).

:::

#### Verification

- The Kubernetes CLI reports that the current context is your cluster with the `kind` suffix:

  ```shell-session
  kubectl config current-context
  ```
