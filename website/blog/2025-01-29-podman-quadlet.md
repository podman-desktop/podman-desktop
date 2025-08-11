---
title: Podman Quadlets with Podman Desktop
description: Learn how to create & manage and use Quadlets with Podman Desktop
slug: podman-quadlet
authors: [axel7083]
tags: [podman-desktop, extension, podman, quadlet, systemd]
hide_table_of_contents: false
---

import ReactPlayer from 'react-player'
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![banner](img/podman-quadlet/banner.png)

Containers are typically deployed in Kubernetes clusters.
However, for smaller-scale use cases such as on a single-node server or during development, Kubernetes can be overkill.

What’s a more lightweight solution for running autonomous applications with multiple interacting containers?

In this blog, we'll dive into what Quadlets are, their benefits, and how to use them within Podman Desktop.

<!-- truncate -->

## What Are Quadlets?

Podman Quadlets allow you to manage containers declaratively using systemd[^1].
Since version 4.4, Podman can create, start, and manage containers (including pulling images, creating volumes, and managing pods) through systemd.

Quadlets are simplified configuration files—recognized by their specific extensions,
such as `*.container`, `*.pod`, or `*.image` that are processed during startup or when you reload the daemon using the `systemctl daemon-reload` command.

Quadlets generate the equivalent systemd unit files, streamlining the container management process.

[^1]: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html

### Why Use Quadlets?

- **Declarative Configuration**: Similar to Compose or Kubernetes manifests, Quadlets allow you to declare what you want to run, simplifying the workload setup.
- **Tight System Integration**: Quadlets align with Podman’s philosophy of integrating seamlessly with Linux, leveraging systemd’s process management capabilities.
- **Ease of Automation**: Quadlets make it simple to configure containers to start at boot, restart on failure, and more.

### Example: A Quadlet File for Nginx

Below is an example of an `nginx.container` Quadlet file, which starts an nginx container at boot:

```editorconfig title="~/.config/containers/systemd/nginx.container"
# nginx.container
[Container]
ContainerName=nginx
Image=nginx
PublishPort=80:8080

[Service]
Restart=always
```

This configuration ensures the container restarts automatically if stopped, and exposes port 8080.

## Using the Podman Quadlet Extension in Podman Desktop

Managing Quadlets directly on non-Linux platforms can be challenging due to virtualized environments (e.g., WSL or Hyper-V).
Fortunately, the Podman Desktop extension Podman Quadlet simplifies this process, enabling you to list, generate, and edit Quadlets visually.

### Key Features of the Extension

- **Integration with Podlet**: Generates Quadlets from existing Podman objects[^2].
- **Quadlet Management UI**: Provides a dedicated interface to list, edit, delete, start, and stop Quadlets.
- **Logs Viewer**: Fetches and displays systemd logs using journalctl for troubleshooting.

[^2]: https://github.com/containers/podlet

### Installation

If you already have the latest version of Podman Desktop, you can <a href="podman-desktop:extension/podman-desktop.quadlet">**click here to install the Podman Quadlet extension**</a>.

Alternatively, navigate to the Extensions page within Podman Desktop to install it.

### List Quadlets :clipboard:

On the Podman Quadlet page, you can view all the Quadlets available across your Podman machines. To update the list, click **Refresh**.

<ThemedImage
alt="Quadlets List"
sources={{
    light: require('./img/podman-quadlet/podman-quadlet-home-light.png').default,
    dark: require('./img/podman-quadlet/podman-quadlet-home-dark.png').default,
  }}
/>
<br/><br/>

In Podman Desktop, you can see that a dedicated icon is used for the containers managed by a Quadlet.

<ThemedImage
alt="Container Quadlet Icon"
sources={{
    light: require('./img/podman-quadlet/container-icon-quadlet-light.png').default,
    dark: require('./img/podman-quadlet/container-icon-quadlet-dark.png').default,
  }}
/>

### Generate a container Quadlet :hammer:

1. Start a container using Podman:

```shell
podman run --name nginx-demo -d -p 80:8080 nginx
```

2. In Podman Desktop, find your container on the Containers page.
3. Click the **overflow menu** icon and select **Generate Quadlet**.

<ThemedImage
alt="Container actions"
sources={{
    light: require('./img/podman-quadlet/generate-quadlet-action-light.png').default,
    dark: require('./img/podman-quadlet/generate-quadlet-action-dark.png').default,
  }}
/>
<br/><br/>

4. Click **Generate** to finalize the Quadlet.

<ThemedImage
alt="Quadlet Generate Form"
sources={{
    light: require('./img/podman-quadlet/generate-form-options-light.png').default,
    dark: require('./img/podman-quadlet/generate-form-options-dark.png').default,
  }}
/>
<br/><br/>

5. Optional: Edit the Quadlet configuration details.
6. Click **Load into machine**.

<ThemedImage
alt="Quadlet Generate Form"
sources={{
    light: require('./img/podman-quadlet/generate-form-edit-light.png').default,
    dark: require('./img/podman-quadlet/generate-form-edit-dark.png').default,
  }}
/>
<br/><br/>

Congrats 🎉 you created your first Quadlet!

### Edit Quadlets :pen:

Click the Quadlet **STATUS** icon to view its details page, which has three tabs:

- **Generated**: View the systemd unit generated by Podman (read-only).
- **Source**: Edit the Quadlet file directly.
- **Logs**: Monitor logs for the service using journalctl.

You can make changes to the Quadlet’s source file and apply updates as needed.

<ThemedImage
alt="Quadlet Details Source"
sources={{
    light: require('./img/podman-quadlet/quadlet-details-source-light.png').default,
    dark: require('./img/podman-quadlet/quadlet-details-source-dark.png').default,
  }}
/>

### View Quadlet Logs :scroll:

Since a Quadlet's corresponding resource is managed by systemd we can access corresponding unit's logs using journalctl.

<ThemedImage
alt="Quadlet Details Logs"
sources={{
    light: require('./img/podman-quadlet/quadlet-details-logs-light.png').default,
    dark: require('./img/podman-quadlet/quadlet-details-logs-dark.png').default,
  }}
/>

## Conclusion

Podman Quadlets provide a powerful way to manage containers declaratively with systemd, bridging the gap between lightweight container management and full orchestration tools like Kubernetes.

With the Podman Quadlet extension in Podman Desktop, users gain a convenient interface to manage Quadlets visually, reducing complexity and saving time.

Try it today and streamline your container workflows!
