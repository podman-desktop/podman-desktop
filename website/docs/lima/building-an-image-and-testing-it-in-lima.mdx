---
sidebar_position: 5
title: Building and testing an image
description: Building an image and testing it in Lima
keywords: [podman desktop, podman, containers, pods, building an image, kubernetes, lima]
tags: [building-an-image, testing-an-image-on-lima]
---

# Building an image and testing it in Lima

With Podman Desktop, you can build an image and test it in your local Lima-powered Kubernetes cluster.

#### Prerequisites

- [You onboarded a container engine](/docs/containers).
- [You onboarded a Lima cluster](/docs/lima).
- [You have set your Kubernetes context to your local Lima-powered Kubernetes cluster](/docs/lima/creating-a-kubernetes-instance).
- A container definition file: `Containerfile` or `Dockerfile`.

#### Procedure

1. Build your image:
   1. Go to **Images** from the left navigation pane.
   1. Click **Build**.
   1. Provide the relevant details, such as **Containerfile path**, **Image name**, and **Build arguments** to build the image. For example, use the image name `my-custom-image`.
   1. Click **Build**. Wait for the image build to finish.
      ![building an image](img/build-image-from-containerfile.png)
   1. Click **Done** to view the new image on the same page.

1. Push your image to your Lima cluster (if needed):
   1. Click the **overflow menu** icon corresponding to `my-custom-image` and select **Push image to Lima cluster**. A successful operation notification opens.
   1. Click **OK**.

1. Test your image by creating a container:
   1. Click the **Run Image** icon corresponding to the image `my-custom-image`.
      ![running an image](img/running-an-image.png)
   1. **Container name**: enter `my-custom-image-container`.
   1. Review the parameters that Podman Desktop has detected from your image definition or edit them, if required.
   1. Click **Start Container**.
      ![starting a container](img/starting-a-container.png)
   1. Select the **Summary** tab to view the details of the new container.
   1. Click the **Close** icon.

1. Test your image and container on your Lima cluster:
   1. Click the overflow menu icon corresponding to the container and select **Deploy to Kubernetes**.
      ![deploying to Kubernetes](img/deploying-to-kubernetes.png)
   1. Provide the following details:
      - **Pod Name**: Keep the proposed value `my-custom-image-container-pod`.
      - **Expose service locally using Kubernetes Ingress**: Select the checkbox to expose the service locally using the ingress controller.
      - Optional: If your container exposes more than one port, select the port to expose from the dropdown list.
   1. Click **Deploy**. Wait for the pod to reach the state: **Phase: Running**.
   1. Click **Done**.

#### Verification

1. Go to **Kubernetes > Pods** from the left navigation pane.
1. View the running `my-custom-image-container-pod` pod.
   ![running pod](img/my-custom-image-container-pod.png)
1. Click the pod name to view its details and logs.
1. Optional: If your container exposes a port, go to `http://localhost:<port-number-exposed>`: your application is running.

#### Additional resources

You can build and test your image in the _same_ Lima instance, you don't need to push it!

- [Customizing the Lima instance](/docs/lima/customizing).
- [You have set your Docker socket host to your local Lima-powered Kubernetes cluster](/docs/lima/creating-a-lima-instance).
- Containers and Kubernetes need to use the same image storage.

List of common Docker API and Kubernetes CRI sockets that you can install and configure:

| Docker API socket | Kubernetes CRI socket |
| ----------------- | --------------------- |
| nerdctl.sock      | containerd.sock       |
| docker.sock       | cri-dockerd.sock      |
| podman.sock       | crio.sock             |

- [Kubernetes Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
