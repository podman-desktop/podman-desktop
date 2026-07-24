---
title: 'From Compose to Kubernetes with Podman Kube Play'
description: Learn a practical path from Compose to Kubernetes manifests using an existing guestbook sample.
slug: from-compose-to-kubernetes-with-podman-kube-play
authors: [simonrey1]
tags: [podman-desktop, docker, compose, kubernetes, migrating]
hide_table_of_contents: false
---

Moving from Compose to Kubernetes does not need a big rewrite.

If your team already runs multi-container apps with Compose, this guide shows a practical next step: convert an existing `compose.yaml` into Kubernetes manifests and validate everything locally with `podman kube play` before touching a real cluster.

In the tutorial, you will:

- Run an existing sample app with Podman Compose
- Convert Compose resources to Kubernetes YAML with `kompose`
- Validate the generated manifests locally with `podman kube play`

Read the full tutorial:

- [Compose to Kubernetes with Podman Kube Play](/tutorial/compose-to-kubernetes-with-podman-kube-play)
