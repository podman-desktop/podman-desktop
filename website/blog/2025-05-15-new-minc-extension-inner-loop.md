---
title: 'MINC: Speed Up Local K8s Dev'
description: Speed up your development inner loop using a local Kubernetes cluster powered by MicroShift in a container.
slug: iterate-quickly-inner-loop-with-a-kubernetes-cluster
authors: [benoitf]
tags: [podman-desktop, podman, images, kubernetes, microshift]
hide_table_of_contents: false
image: /img/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster/iterate-quickly-inner-loop-with-a-kubernetes-cluster.png
---

Developers working locally often seek a fast inner loop for coding, building, and testing their OCI images and Kubernetes applications.

For instance, when testing a new image in a Kubernetes pod, the image must be accessible either by pushing it to a private or public registry or by ensuring it's available on the Kubernetes cluster nodes. This often requires additional commands such as `kind load docker-image`, `minikube cache add <image>`, or publishing the image to a third-party registry.

In this blog post, we’ll introduce a new extension called `MINC (MicroShift IN Container)`, which provides a [MicroShift](https://github.com/openshift/microshift) cluster running within an existing Podman Machine environment.

![hero](/img/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster/iterate-quickly-inner-loop-with-a-kubernetes-cluster.png)

<!--truncate-->

---

## Introduction

A [previous blog post](https://podman-desktop.io/blog/sharing-podman-images-with-kubernetes-cluster) outlines various methods to improve the inner loop using Kind or Minikube. While these approaches can enhance performance, there are still gaps and certain complexities involved. Achieving a seamless workflow where an image is built with Podman and immediately available in the cluster—often requires additional steps or tricky configurations.

## podman, kubernetes/cri-o and MicroShift

The CRI-O project implements the CRI interface and reuses image management from [containers/image](https://github.com/containers/image) project and handles storage using [containers/storage](https://github.com/containers/storage) project.

Podman uses these same libraries to read and write container images, storing them in the `/var/lib/containers` directory.

The MINC extension launches a [MicroShift](https://github.com/openshift/microshift) cluster in a more efficient way for developers than previous deployments. Unlike the OpenShift Local extension, which sets up a separate virtual machine (VM), MINC (Microshift IN Container) runs a container inside your existing Podman Machine (on Windows or macOS). This avoids running two VMs, one for Kubernetes and another for Podman.

A key benefit is that the MINC container shares Podman’s image storage. When you build an image with Podman, it's instantly available in the cluster, no uploading or copying required.

:::note[MINC requires a rootful Podman machine]
Make sure the machine is running in rootful mode, or create a new one using the `--rootful` option.
:::

## Creating a Local Kubernetes/MicroShift Cluster

1. Create the MicroShift cluster

In the Resources view, click the MINC card and select "Create new…". For now, no customization is needed—just click "Next". The cluster will start automatically.

1. Verify that now you see in bottom left in the status bar `microshift` as the default Kubernetes context and if you go in the left navbar in the Kubernetes section you can see in the Nodes entry the MicroShift node.

1. Verify `kubectl` setup using a CLI

MINC updates your `$HOME/.kube/config` file with a new `microshift` entry. Check in the bottom left of the status bar, you should see a `microshift` entry as the default Kubernetes context.

Try listing all pods:

```bash
kubectl get -A pods
```

Example output:

```shell
NAMESPACE              NAME                                      READY   STATUS
kube-flannel           kube-flannel-ds-wjn2f                     1/1     Running
kube-proxy             kube-proxy-jh7r8                          1/1     Running
kube-system            csi-snapshot-controller-8d97d878f-l6q6j   1/1     Running
openshift-dns          dns-default-zvdw9                         2/2     Running
openshift-dns          node-resolver-84twk                       1/1     Running
openshift-ingress      router-default-54c5757547-4jnfd           1/1     Running
openshift-service-ca   service-ca-7977bdc4d4-ssjq2               1/1     Running

```

#### Create a Hello World container image

Create a `Containerfile`

```Dockerfile
FROM nginx

RUN echo '<!DOCTYPE html><html><head><title>Hello</title></head><body><h1>Hello from MINC</h1></body></html>' \
    > /usr/share/nginx/html/index.html
```

Or quickly create it with:

```shell
echo 'FROM nginx:alpine
RUN echo "<!DOCTYPE html><html><head><title>Hello</title></head><body><h1>Hello from MINC</h1></body></html>" > /usr/share/nginx/html/index.html' > Containerfile
```

Then, using Podman Desktop, build the image providing the name `minc/nginx:hello-world`.

### Verify Image in the MicroShift Cluster

Inside the MicroShift container, run:

```bash
crictl images | grep hello
```

You should see something like:

```bash
docker.io/minc/nginx                                                                     hello-world               e7032b219ab03       51.1MB
```

The image is now available in the MicroShift cluster.

#### Create a Pod from the UI

Click on the play button from the image to start a new container. Then select the container and click on "Create Pod".

#### Deploy a pod from this image using the CLI

Use `kubectl` to deploy a pod from the image:

```shell
kubectl run hello-world-pod --image=minc/nginx:hello-world --port=80
```

To check if the pod is running, use:

```shell
kubectl get pods
```

Expected output:

```shell
kubectl get pods
NAME              READY   STATUS    RESTARTS   AGE
hello-world-pod   1/1     Running   0          6s
```

# Deploy this podman Pod to Kubernetes/MINC

Select the pod and click on `Deploy to Kubernetes...` in the Kebab menu.
Your Pod is now deployed to the MINC cluster.

If you want to use the CLI/manual steps :

**Create a Service for the Pod using the CLI**

Expose the pod with a service:

```shell
kubectl expose pod hello-world-pod --port=80 --target-port=80 --name=hello-world-service
```

**Create a Route (Requires oc CLI)**

Assuming the `oc` CLI (OpenShift client) is available in your `PATH`, create a route:

```shell
oc create route edge hello-world-route --service svc/hello-world-service --port 80 --wildcard-policy=None
```

To list all routes:

```
oc get routes
```

#### Access the Nginx Container

Clicking on the route in the UI will redirect you to the page.

Without the UI it's also possible to get that information.

Check that the nginx container is reachable using the route. Use the `-k` flag with curl to ignore the self-signed certificate warning:

```shell
curl -k "https://$(oc get route hello-world-route -ojsonpath='{.status.ingress[0].host}'):9443"
```

You can also open the URL in your browser (you’ll need to ignore the self-signed certificate warning):

```shell
open "https://$(oc get route hello-world-route -ojsonpath='{.status.ingress[0].host}'):9443"
```

You should see the message: "Hello from MINC" 🎉

This confirms that your inner development loop is working. Once the image is built, it’s instantly available in the cluster.

### Video walkthrough

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/BsPvfnYdRjA"
  title="MINC extension"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

### Conclusion

Using MINC and the MINC extension significantly reduces the turnaround time between building and testing container images.

Have feedback? Share it on the [MINC extension issue tracker](https://github.com/minc-org/minc-extension/issues)
