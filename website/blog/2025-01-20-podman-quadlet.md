---
title: Podman Quadlets with Podman Desktop
description: Learn how to create & manage and use Quadlets with Podman Desktop
slug: podman-quadlet
authors: [axel7083]
tags: [podman-desktop, extension, podman, quadlet, systemd]
hide_table_of_contents: false
image: /img/blog/podman-desktop-release-1.15/banner.png
---

import ReactPlayer from 'react-player'
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![banner](img/ai-lab-first-app/banner.png)

## Running Containers Under Systemd: Podman Quadlets

Containers are typically deployed in Kubernetes clusters.
But at a smaller scale, on a single-node server, or for development purposes, Kubernetes will be overkill.
What’s the recommended way to run a fully autonomous application with several interacting containers in these cases?

The answer is [systemd](https://systemd.io/). It can orchestrate containers as is an already running process manager, and containers are just child processes.
It’s a perfect fit for running containerized workloads without human intervention.

## What is a Quadlet?

Since version 4.4, Podman supports building, and starting containers (and pulling image, creating volume, pods, etc.) via systemd[^1].

These files called `Quadlets` are read during boot (and when systemctl daemon-reload is run) and generate corresponding regular systemd service unit files.

### Just show me the code :eyes:

Podman read in a set of directories[^2] files with a specific extension such as `*.container`, `*.pod`, `*.image` etc.

Bellow is an example of a nginx container Quadlet, it will start during boot.

```editorconfig title="~/.config/containers/systemd/nginx.container"
# nginx.container
[Container]
ContainerName=nginx
Image=nginx
PublishPort=80:8080

[Service]
Restart=always
```

## Exploring Quadlet with Podman Desktop

Since on non-linux platform Podman runs in virtual machines (WSL, hyperV, etc.) we cannot just use the file explorer,
we will be using a dedicated extension called Podman Quadlet in Podman Desktop to [list](#list-quadlets), [generate](#generate-quadlets) and [edit Quadlets](#edit-quadlets) on the available machines.

If you already have the latest version of Podman Desktop you can <a href="podman-desktop:extension/podman-desktop.quadlet">**click here to install the Podman Quadlet extension**</a>

### List Quadlets 📖

On the Podman Quadlet page, you can **Refresh** to let the extension fetch the quadlets on each machine.

:::note

Since the Quadlets are files in the machines we cannot detect changes.

:::

<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/podman-quadlet-home-light.png').default,
    dark: require('./img/podman-quadlet/podman-quadlet-home-dark.png').default,
  }}
/>

### Generate Quadlets

Through the extension, you can generate quadlets

### Edit Quadlets

You can edit a listed Quadlet and update its specification.

[^1]: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#description

[^2]: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#podman-rootless-unit-search-path
