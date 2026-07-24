---
sidebar_position: 9
title: Compose to Kubernetes with Podman Kube Play
description: Convert an existing Compose application to Kubernetes YAML with kompose and validate it locally with podman kube play.
keywords: [compose, kubernetes, podman, kompose]
tags: [podman-desktop, tutorial, compose, kubernetes, migrating]
---

import ThemedImage from '@theme/ThemedImage';

You do not need a full rewrite to start moving from Compose to Kubernetes.

This tutorial uses the existing `guestbook-compose` sample from `podman-desktop-demo` and walks through a practical migration flow:

1. Run the app with Compose.
2. Convert `compose.yaml` to Kubernetes YAML with `kompose`.
3. Run the generated manifests locally with `podman kube play`.

## Why this migration path

- Keep your current Compose workflow while adopting Kubernetes step by step.
- Validate generated manifests locally before touching a real cluster.
- Catch gaps early and reduce production migration risk.

## Prerequisites

- Podman Desktop: [Download Podman Desktop](https://podman-desktop.io/downloads)
- Podman CLI
- Kompose: [kompose.io](https://kompose.io/)

On macOS or Windows, ensure your Podman machine is running in **Settings > Resources**.

## Step 1: run the existing Compose app

Clone the demo repository and open the existing sample:

```shell-session
$ git clone https://github.com/redhat-developer/podman-desktop-demo.git
$ cd podman-desktop-demo/guestbook-compose
```

Start the stack:

```shell-session
$ podman compose -f compose.yaml up -d --build
```

<ThemedImage
alt="Step 1 podman compose terminal output"
sources={{
    light: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-compose-output.png').default,
    dark: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-compose-output.png').default,
  }}
/>

Open the guestbook UI:

- [http://localhost:8080](http://localhost:8080)

<ThemedImage
alt="Step 1 in Podman Desktop: containers list"
sources={{
    light: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-podman-desktop-light.png').default,
    dark: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-podman-desktop-dark.png').default,
  }}
/>

<ThemedImage
alt="Step 1 guestbook app"
sources={{
    light: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-grocery-app.png').default,
    dark: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-1-grocery-app.png').default,
  }}
/>

## Step 2: convert Compose to Kubernetes YAML

Generate Kubernetes manifests from the Compose file:

```shell-session
$ kompose convert --stdout -f compose.yaml > guestbook-kube.yaml
```

This conversion is file-based and works even if Podman pods are not present.

You may see this warning during conversion:

```text
WARN Service "redis-replica" won't be created because 'ports' is not specified
```

This is expected for this sample. `redis-replica` is internal-only, so it does not publish host ports. Kompose can still generate the workload resources needed for local validation with `podman kube play`.

<ThemedImage
alt="Step 2 generated Kubernetes YAML"
sources={{
    light: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-2-generated-yaml.png').default,
    dark: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-2-generated-yaml.png').default,
  }}
/>

## Step 3: run Kubernetes YAML locally

Stop Compose first:

```shell-session
$ podman compose -f compose.yaml down
```

Run the generated YAML:

```shell-session
$ podman kube play --replace --publish-all guestbook-kube.yaml
```

At this point, you crossed the first Kubernetes boundary:

- your app is no longer started from Compose
- your app is now started from Kubernetes manifests
- Podman executes those manifests locally so you can validate behavior

Verify the app:

- [http://localhost:8080](http://localhost:8080)

<ThemedImage
alt="Step 3 containers after kube play"
sources={{
    light: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-3-containers-kube-play-light.png').default,
    dark: require('../blog/img/from-compose-to-kubernetes-with-podman-kube-play/step-3-containers-kube-play-dark.png').default,
  }}
/>

## Step 4: before using a real cluster

This sample validates migration flow, not production readiness.

Before production:

- replace demo settings and credentials
- add readiness/liveness probes and resource requests/limits
- add ingress/TLS and storage policies
- add CI checks and image/dependency scanning

## Cleanup

```shell-session
$ podman compose -f compose.yaml down -v
$ podman kube down guestbook-kube.yaml
```

## Troubleshooting

- Port already in use (`8080`): stop conflicting containers, then rerun.
- Local image pull error for `web`: ensure Compose build completed before `kube play`.
- `kompose` not found: install from [kompose.io](https://kompose.io/).
- `kube play` issues after retries: run `podman kube down guestbook-kube.yaml` and retry.
