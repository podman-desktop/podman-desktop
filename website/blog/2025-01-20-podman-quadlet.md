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

Since on non-linux platform Podman runs in virtual machines (WSL, hyperV, etc.) we cannot just use the file explorer.

We will be using a dedicated extension called Podman Quadlet in Podman Desktop to [list](#list-quadlets), [generate](#generate-quadlets) and [edit Quadlets](#edit-quadlets) on the available machines.

If you already have the latest version of Podman Desktop you can <a href="podman-desktop:extension/podman-desktop.quadlet">**click here to install the Podman Quadlet extension**</a>

This extension introduced some useful feature to interact with the Quadlets,

- It integrates [Podlet](#podlet),
- It adds a dedicated page to list all Quadlets file across your podman machines
- It allows to delete, edit, start or stop a specific Quadlet
- It provides logs from journalctl

### Podlet

Internally, the Podman Quadlet extension uses [Podlet](https://github.com/containers/podlet) to generate Quadlets from existing object.

<details>
  <summary>Install <code>Podlet</code> with Podman Desktop</summary>

Once the Podman Quadlet extension installed in Podman Desktop, go to **<Icon icon="fa-solid fa-cog" size="lg" /> Settings > CLI Tools**. to found Podlet

<br/>
<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/cli-podlet-light.png').default,
    dark: require('./img/podman-quadlet/cli-podlet-dark.png').default,
  }}
/>
<br/><br/>
Click on **Install** to start the installation.
<br/>
:::note

You may need to select which version to install, we recommend to use the latest available.

:::

:::tip

You can install Podlet yourself from they [GitHub release](https://github.com/containers/podlet/releases) page,
at startup the extension will detect system-wide podlet executable and use it.

:::

</details>

### List Quadlets :clipboard:

On the Podman Quadlet page, you can **Refresh** to let the extension fetch the quadlets on each machine.

:::note

Since the Quadlets are files in the machines we cannot detect changes automatically.

:::

<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/podman-quadlet-home-light.png').default,
    dark: require('./img/podman-quadlet/podman-quadlet-home-dark.png').default,
  }}
/>

### Generate Quadlets :hammer:

:::info

To be able to generate Quadlets you need to install Podlet, thankfully Podman Desktop let you

:::

Let's generate a quadlet from an existing container! If you don't have any container running, you may start a nginx container with the following command

```shell
podman run --name nginx-demo -d -p 80:8080 nginx
```

Inside Podman Desktop, in the containers page, you may see your nginx container.
Let's generate a Quadlet using `Actions > Generate Quadlet`

<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/generate-quadlet-action-light.png').default,
    dark: require('./img/podman-quadlet/generate-quadlet-action-dark.png').default,
  }}
/>
<br/><br/>

:::note

There are known issue with certain containers, currently only container created through the podman CLI can generate a Quadlet.

Learn more on [Podlet repository (issue #134)](https://github.com/containers/podlet/issues/134)

:::

You will be redirected to the Quadlet generate form. You may see a few elements

- The Container engine you are using
- The Quadlet Type you are trying to generate
- The resource you selected, here the `nginx-demo` container.

<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/generate-form-options-light.png').default,
    dark: require('./img/podman-quadlet/generate-form-options-dark.png').default,
  }}
/>
<br/><br/>

Click on **Generate**.

### Edit Quadlets :pen:

When opening a Quadlet details page, we may access 3 tabs

- `Generated` result of the podman systemd generate (readonly)
- `Source` Quadlet file used to generate the systemd service (editable)
- `Logs` More in the [dedicated section](#quadlet-logs-scroll)

You can edit a listed Quadlet and update its specification.

### Quadlet logs :scroll:

Since Quadlet are used to generate systemd service, we would need to use [journactl](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html) to be able to access the logs, this is often a complicated task...

Thankfully the extension do it for us! When opening the details of a Quadlet, you may go to the logs tab, to see what is happening.

<ThemedImage
alt="Feedback Form"
sources={{
    light: require('./img/podman-quadlet/quadlet-details-logs-light.png').default,
    dark: require('./img/podman-quadlet/quadlet-details-logs-dark.png').default,
  }}
/>
<br/><br/>

## Conclusion

TODO conclusion

I

[^1]: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#description

[^2]: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#podman-rootless-unit-search-path
