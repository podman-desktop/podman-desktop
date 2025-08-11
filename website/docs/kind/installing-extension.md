---
sidebar_position: 1
title: Installing the Kind extension
description: Tutorial on how to install the Kind extension and use it
keywords: [podman desktop, podman, kind, kubernetes]
tags: [podman, kubernetes, kind]
---

import ReactPlayer from 'react-player'

# Installing the Kind extension

:::note

Kind is a _built-in_ extension to Podman Desktop and no installation is necessary.

:::

The Kind extension provides the capability of creating a local Kubernetes cluster using only containers rather than a Virtual Machine.

#### Procedure

[Install Podman Desktop](/docs/installation) to have the extension available. To confirm the built-in extension is installed, you can find Kind within the **Extensions** section of Podman Desktop.

#### Tutorial

The following video provides a complete guide on creating a single-node cluster:

<ReactPlayer playing playsInline controls src='https://github.com/containers/podman-desktop-media/raw/refs/heads/kind/video/cluster-creation-kind.mp4' width='100%' height='100%' />

:::note

If you are running Podman Desktop in a Linux system host and enabling the Contour ingress controller, you need to ensure that the `ip_tables` module is loaded, otherwise the `envoy` pod will fail to insert an iptable rule that it needs in order to be deployed (`/usr/sbin/iptables -t nat -S CNI-HOSTPORT-SETMARK 1 --wait`). To accomplish that, run the command `sudo modprobe ip_tables` to enable the required module, and then the command `lsmod | grep ip_tables` to check if it is enabled.

:::
