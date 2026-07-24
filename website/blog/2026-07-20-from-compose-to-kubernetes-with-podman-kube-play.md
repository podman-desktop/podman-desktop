---
title: 'From Compose to Kubernetes with Podman kube play'
description: Learn a practical path from Compose to Kubernetes manifests using Podman and kompose.
slug: from-compose-to-kubernetes-with-podman-kube-play
authors: [simonrey1]
tags: [podman-desktop, docker, compose, kubernetes, migrating]
hide_table_of_contents: false
---

Moving from Compose to Kubernetes does not need to be a big rewrite.

If your team already runs multi-container apps with Compose, this guide shows a practical next step: convert an existing `docker-compose.yml` into Kubernetes manifests and validate everything locally with `podman kube play` before touching a real cluster.

In the tutorial, you will:

- Run a small sample app with Podman Compose
- Convert Compose resources to Kubernetes YAML with `kompose`
- Validate the generated manifests locally with `podman kube play`

Read the full tutorial:

- [Compose to Kubernetes with Podman Kube Play](/docs/compose/compose-to-kubernetes-with-podman-kube-play)
