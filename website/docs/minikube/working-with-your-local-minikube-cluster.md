---
sidebar_position: 5
title: Working with a cluster
description: Working with your local Minikube-powered Kubernetes cluster.
keywords: [podman desktop, podman, containers, setting context, kubernetes, minikube]
tags: [working-with-a-minikube-cluster, minikube]
---

# Working with your local Minikube-powered Kubernetes cluster

Set your Kubernetes context to your local Minikube-powered Kubernetes cluster.

#### Prerequisites

- [You onboarded a Minikube cluster](/docs/minikube/installing).

#### Procedure

1. Open the Podman Desktop tray.
2. Go to **Kubernetes**.
3. Click the Kubernetes context named `minikube`.

:::note

Alternatively, use the status bar or the Podman Desktop **Settings** to set your Kubernetes context. For more details, see [Viewing and selecting the current Kubernetes context](/docs/kubernetes/viewing-and-selecting-current-kubernetes-context).

:::

#### Verification

- The Kubernetes CLI reports that the current context is your cluster with the `minikube` name:

  ```shell-session
  kubectl config current-context
  ```
