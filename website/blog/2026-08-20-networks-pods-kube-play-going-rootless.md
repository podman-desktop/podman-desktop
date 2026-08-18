---
title: 'Podman: from Docker networks to pods, kube play, and going rootless'
description: When a Docker-style network is better off as a Podman pod, how to run it with kube play, and how to check whether you're actually running rootless.
slug: networks-pods-kube-play-going-rootless
authors: [simonrey1]
tags: [podman-desktop, podman, docker, rootless, pods, kubernetes]
hide_table_of_contents: false
---

import ThemedImage from '@theme/ThemedImage';

If you know Docker, [Podman Desktop](https://podman-desktop.io/docs/installation) will feel familiar. The `podman` CLI works almost like `docker`, and networks work the same way too. Podman adds one more option: pods, where containers talk to each other over `localhost` instead of a network, just like in Kubernetes. You can even run a pod straight from a Kubernetes YAML file with `kube play`. That's handy for exercising a workload the way it will run in production, but `kube play` doesn't enforce Kubernetes admission or OpenShift SCC rules by itself, for that you still need a real cluster or a local one like Kind, covered later in this post.

This post covers networks, pods, and `kube play`, then ends with a look at Podman's rootless design. One thing to clear up first: the `podman` CLI is rootless by default, `podman machine init` creates a rootless machine unless you ask for `--rootful`. But Podman Desktop's ["Create a Podman machine"](https://podman-desktop.io/docs/podman/creating-a-podman-machine) dialog defaults to a **rootful** connection instead, notably because [Kind on Windows requires it](https://podman-desktop.io/docs/kind/configuring-podman-for-kind-on-windows).

<!--truncate-->

## 1. Same CLI

Only the binary name changes for most day-to-day commands:

```shell-session
$ podman pull quay.io/hummingbird/postgresql:18
$ podman images
$ podman volume create pgdata
$ podman run -d -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret quay.io/hummingbird/postgresql:18
```

Two things do change once you look closer: how containers get grouped together, and how "root" behaves once a container runs. Both are covered below.

## 2. Networks work too

Creating a network in Podman Desktop looks exactly like Docker:

1. Go to **Networks > Create Network** and create a network named `myapp`.

<ThemedImage
alt="Podman Desktop Networks > Create Network dialog"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/network-create-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/network-create-dark.png').default,
  }}
/>

2. Go to **Containers > Create**, select **Existing image**, and pick `quay.io/hummingbird/postgresql:18`.

<ThemedImage
alt="Podman Desktop run existing image hummingbird postgresql"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/run-existing-image-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/run-existing-image-dark.png').default,
  }}
/>

3. In the **Networking** tab, select **Container networking**, choose **User-defined network**, then pick `myapp`. Name the container `db`.

<ThemedImage
alt="Podman Desktop run container dialog with network selection"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/run-container-network-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/run-container-network-dark.png').default,
  }}
/>

4. Run a second container the same way, same image and network, named `web`, with command `sh -c 'while true; do pg_isready -h db && echo "web: connected to db"; sleep 2; done'`. It checks every couple of seconds that `db` is reachable by name.

<ThemedImage
alt="Podman Desktop run container dialog with pg_isready loop command and myapp network selected"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/run-web-container-config-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/run-web-container-config-dark.png').default,
  }}
/>

Or the same thing via CLI:

```shell-session
$ podman network create myapp
$ podman run -d --network myapp --name db -e POSTGRES_PASSWORD=secret quay.io/hummingbird/postgresql:18
$ podman run -d --network myapp --name web quay.io/hummingbird/postgresql:18 \
    sh -c 'while true; do pg_isready -h db && echo "web: connected to db"; sleep 2; done'
```

Check that it works: both containers should show as running on the **Containers** page, and `web`'s **Logs** tab should keep printing `accepting connections` and `web: connected to db`.

<ThemedImage
alt="Podman Desktop web container logs showing the pg_isready loop connecting to db"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/container-terminal-pgisready-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/container-terminal-pgisready-dark.png').default,
  }}
/>

Cleanup: select `db` and `web` in the Containers list and delete them, then delete the `myapp` network from the Networks list.

<ThemedImage
alt="Podman Desktop Containers list with db and web selected for deletion"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/delete-containers-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/delete-containers-dark.png').default,
  }}
/>

Or via CLI:

```shell-session
$ podman rm -f db web
$ podman network rm myapp
```

Two small differences worth knowing:

- Since Podman 6 / [Netavark 2.0](https://github.com/containers/netavark/releases/tag/v2.0.0), bridge networks default to [`isolate=strict`](https://docs.podman.io/en/latest/markdown/podman-network-create.1.html). Containers on different networks can no longer reach each other by default.
- To reach a service on your host, Podman supports Docker's `host.docker.internal`, plus its own `host.containers.internal`. Your existing Docker scripts and Compose files keep working.

But a network is as far as Docker takes you. Containers stay separate processes that just happen to know each other's names, and that's not how they'll actually be grouped once they land on Kubernetes or OpenShift. Podman has something for that Docker doesn't: the pod.

## 3. Pods: the alternative to a network

The name "Podman" comes from "Pod Manager". A [pod](https://docs.podman.io/en/latest/markdown/podman-pod.1.html) groups containers so they share one network namespace, close to a [Kubernetes Pod](https://kubernetes.io/docs/concepts/workloads/pods/). Docker has no equivalent, there's no `docker pod` command. Containers in a pod just talk to each other over `localhost` instead of a hostname, the same way they will once deployed. See Podman Desktop's [guide to creating a pod](https://podman-desktop.io/docs/containers/creating-a-pod) for more detail.

In Podman Desktop, run both containers first:

**`db` container**: image `quay.io/hummingbird/postgresql:18`, environment variable `POSTGRES_PASSWORD=secret`.

<ThemedImage
alt="Podman Desktop run db container with POSTGRES_PASSWORD env variable"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/run-db-container-config-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/run-db-container-config-dark.png').default,
  }}
/>

**`web` container**: same image, command `sh -c 'while true; do pg_isready -h localhost && echo "web: connected to db"; sleep 2; done'`.

<ThemedImage
alt="Podman Desktop run web container with pg_isready loop command"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/run-web-container-config-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/run-web-container-config-dark.png').default,
  }}
/>

Then select both containers in the Containers list and click **Create Pod**.

<ThemedImage
alt="Podman Desktop select containers and Create Pod"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/create-pod-from-containers-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/create-pod-from-containers-dark.png').default,
  }}
/>

In the Create Pod form, set the pod name to `myapp`, this is the name the rest of this section refers to.

<ThemedImage
alt="Podman Desktop Create Pod form"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/create-pod-from-containers-form-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/create-pod-from-containers-form-dark.png').default,
  }}
/>

Or the same thing via CLI:

```shell-session
$ podman pod create --name myapp -p 5432:5432
$ podman run -d --pod myapp --name db -e POSTGRES_PASSWORD=secret quay.io/hummingbird/postgresql:18
$ podman run -d --pod myapp --name web quay.io/hummingbird/postgresql:18 \
    sh -c 'while true; do pg_isready -h localhost && echo "web: connected to db"; sleep 2; done'
```

Check `web`'s logs: this time it reaches `db` over `localhost`, not a network hostname.

<ThemedImage
alt="Podman Desktop web container logs showing localhost connectivity to db"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/pod-terminal-psql-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/pod-terminal-psql-dark.png').default,
  }}
/>

```shell-session
$ podman logs web
# localhost:5432 - accepting connections
# web: connected to db
```

Cleanup: open the **Pods** page and delete the `myapp` pod. This removes the pod, `db`, `web`, and the infra container in one go.

<ThemedImage
alt="Podman Desktop Pods page with the myapp pod selected for deletion"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/delete-pod-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/delete-pod-dark.png').default,
  }}
/>

Or via CLI:

```shell-session
$ podman pod rm -f myapp
```

### That same pod can come from a Kubernetes YAML file

A pod is already shaped like a Kubernetes Pod. That means Podman can run one straight from a Kubernetes YAML file, no cluster needed. It's the same workflow you'd later use to [deploy a pod to Kubernetes](https://podman-desktop.io/docs/kubernetes/deploying-a-pod-to-kubernetes) or [apply a YAML manifest](https://podman-desktop.io/docs/kubernetes/applying-a-yaml-manifest) from Podman Desktop:

```shell-session
$ cat <<'EOF' > myapp-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: web
      image: quay.io/hummingbird/postgresql:18
      command:
        - sh
        - -c
        - 'while true; do pg_isready -h localhost && echo "web: connected to db"; sleep 2; done'
    - name: db
      image: quay.io/hummingbird/postgresql:18
      env:
        - name: POSTGRES_PASSWORD
          value: secret
EOF
$ podman kube play myapp-pod.yaml
```

`web` runs the exact same connectivity loop as the pod example above, just from a YAML file instead of two `podman run` commands.

You can paste that same YAML into Podman Desktop instead, under **Pods > Play Kubernetes YAML**:

<ThemedImage
alt="Podman Desktop Play Kubernetes YAML dialog"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/kube-play-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/kube-play-dark.png').default,
  }}
/>

Verify `db` came up: go to **Containers**, open `myapp-web` (grouped under the `myapp` pod), and check its **Logs** tab. Same output as before, `accepting connections` and `web: connected to db`.

<ThemedImage
alt="Podman Desktop myapp-web container logs showing the pg_isready loop connecting to db"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/kube-play-web-logs-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/kube-play-web-logs-dark.png').default,
  }}
/>

Or open `myapp-web`'s **Terminal** tab for a one-off check:

```shell-session
$ pg_isready -h localhost
# localhost:5432 - accepting connections
```

Or tail the logs from your own terminal:

```shell-session
$ podman logs myapp-web
# localhost:5432 - accepting connections
# web: connected to db
```

Cleanup:

```shell-session
$ podman kube down myapp-pod.yaml
$ rm myapp-pod.yaml
```

The same file also works with `kubectl apply -f` on a real cluster. Develop locally with `podman kube play`, then deploy the exact same file to Kubernetes or OpenShift, Docker has no equivalent for this.

That said, `kube play` doesn't cover the whole Kubernetes spec. There's no controller, no scheduler, none of the networking features a real cluster gives you, and no admission checks either, `podman kube play` runs the workload but doesn't enforce Kubernetes or OpenShift security policies. For that, you still need a cluster, even a local one like Kind, which is exactly what the next section sets up to check one important rule: whether your containers are allowed to run as root.

## 4. Testing that rule locally, with Kind

OpenShift's [`restricted-v2` SCC](https://docs.openshift.com/container-platform/latest/authentication/managing-security-context-constraints.html) and the [Kubernetes restricted Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/) both reject pods that try to run as root. A container that works fine on your laptop can get rejected the moment it reaches a cluster with either policy turned on. Better to catch that locally first, and Podman Desktop's [Kind extension](https://podman-desktop.io/docs/kind) lets you do exactly that. Kind only lets you test the Kubernetes side, the `pod-security.kubernetes.io/enforce=restricted` label below, not `restricted-v2` itself, which is specific to OpenShift, but the two enforce a similar non-root rule.

One naming note before you start: once a Kind cluster exists, Podman Desktop shows a second, separate **Pods** view under **Kubernetes**. That one lists pods actually running on the cluster (like `my-web` below), not your local Podman pods (like `myapp` earlier). Keep the two apart as you follow along.

On Windows with WSL, Kind needs a rootful Podman machine. For an existing machine, stop it, switch it, then start it again:

```shell-session
$ podman machine stop
$ podman machine set --rootful
$ podman machine start
```

Or create a new one already rootful: `podman machine init --rootful --now`.

1. Go to **Settings > Resources** and [create a Kind cluster](https://podman-desktop.io/docs/kind/creating-a-kind-cluster).

<ThemedImage
alt="Settings > Resources showing Kind cluster creation"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/kind-cluster-create-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/kind-cluster-create-dark.png').default,
  }}
/>

2. Apply the restricted policy on the default namespace:

```shell-session
$ kubectl config use-context kind-kind-cluster
$ kubectl label --overwrite ns default pod-security.kubernetes.io/enforce=restricted
```

3. Deploy without a `securityContext` and watch it get rejected before it even starts:

```shell-session
$ kubectl run my-web --image=quay.io/hummingbird/nginx:1.27 --port=8080
# Error from server (Forbidden): pods "my-web" is forbidden: violates PodSecurity "restricted:latest":
# allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
```

4. Add a `securityContext` and use an image built for non-root, like [Project Hummingbird](https://hummingbird-project.io/docs/using/overview/). You can apply the YAML from Podman Desktop too, under **Kubernetes > Pods > Apply YAML**:

<ThemedImage
alt="Podman Desktop Kubernetes > Pods > Apply YAML dialog"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/kubernetes-pods-apply-yaml-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/kubernetes-pods-apply-yaml-dark.png').default,
  }}
/>

Or via CLI:

```shell-session
$ cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: my-web
spec:
  containers:
    - name: web
      image: quay.io/hummingbird/nginx:1.27
      ports:
        - containerPort: 8080
      securityContext:
        allowPrivilegeEscalation: false
        runAsNonRoot: true
        capabilities:
          drop: ["ALL"]
        seccompProfile:
          type: RuntimeDefault
EOF
```

This time it starts. Podman Desktop's **Kubernetes > Pods** view shows it running:

<ThemedImage
alt="Kubernetes > Pods view showing my-web pod running successfully"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/pod-my-web-running-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/pod-my-web-running-dark.png').default,
  }}
/>

```shell-session
$ kubectl wait --for=condition=Ready pod/my-web --timeout=60s
# pod/my-web condition met
$ kubectl delete pod my-web
```

5. One more test: use the same `securityContext`, but with the plain `image: nginx:1.27`, which still runs as root internally. The fields look correct, so admission passes, but the pod fails at runtime instead:

```shell-session
$ cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx-root
spec:
  containers:
    - name: web
      image: nginx:1.27
      ports:
        - containerPort: 8080
      securityContext:
        allowPrivilegeEscalation: false
        runAsNonRoot: true
        capabilities:
          drop: ["ALL"]
        seccompProfile:
          type: RuntimeDefault
EOF
$ kubectl get pod nginx-root
# NAME         READY   STATUS                       RESTARTS   AGE
# nginx-root   0/1     CreateContainerConfigError   0          5s
$ kubectl describe pod nginx-root | grep "Error"
# Error: container has runAsNonRoot and image will run as root
```

Same view, but now an error state:

<ThemedImage
alt="Kubernetes > Pods view showing nginx-root pod in CreateContainerConfigError state"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/pod-nginx-root-error-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/pod-nginx-root-error-dark.png').default,
  }}
/>

```shell-session
$ kubectl delete pod nginx-root
```

When done, [delete the Kind cluster](https://podman-desktop.io/docs/kind/deleting-your-kind-cluster) from **Settings > Resources**.

**Documentation**: [Project Hummingbird](https://hummingbird-project.io/docs/using/overview/) | [OpenShift SCC](https://docs.openshift.com/container-platform/latest/authentication/managing-security-context-constraints.html) | [K8s Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) | [Red Hat image guidelines](https://docs.openshift.com/container-platform/latest/openshift_images/create-images.html#use-uid_create-images)

## 5. Why Podman makes rootless easy

That rejection is about the image, not about Podman. The same restricted policy would reject a container that runs as root inside, whether it was built and run with Docker or Podman. What is specific to Podman is something else entirely: how little work it takes to keep that same container from having root access on your host, even when it thinks it's root inside.

One clarification up front: "rootless" here describes Podman's own design, not something every Podman Desktop user automatically gets. A Podman machine can be created rootful or rootless, and the [default in Podman Desktop's "Create a Podman machine" dialog is rootful](https://podman-desktop.io/docs/podman/creating-a-podman-machine). Check which one you're actually running with:

```shell-session
$ podman info --format=json | jq -r '.host.security.rootless'
```

Everything below explains why a rootless connection is worth using when your setup allows it, not a claim that Podman Desktop is rootless out of the box.

### No daemon, no root process

Docker runs `dockerd`, a long-running root process that manages every container. Anyone in the `docker` group can talk to it, and Docker itself [warns](https://docs.docker.com/engine/security/#docker-daemon-attack-surface) that this is close to root access, since the daemon can mount any host path and start privileged containers on request. Docker does ship a [rootless mode](https://docs.docker.com/engine/security/rootless/) since Engine 20.10, but you have to turn it on.

Podman skips the daemon entirely. On Linux, each `podman run` is a direct [fork/exec](https://developers.redhat.com/blog/2020/09/25/rootless-containers-with-podman-the-basics) under your own user account. On macOS and Windows, there's no native container runtime, so `podman machine` runs a small Linux VM, and your local `podman` CLI is really a remote client talking to the `podman` process inside that VM. The fork/exec still happens, just inside the VM's own user, rather than directly on your host. Either way, a process inside the container can still see itself as UID 0, but a [user namespace](https://docs.podman.io/en/latest/markdown/podman.1.html#rootless-mode) maps that back to an unprivileged user underneath (your host user on Linux, or the VM's user on macOS/Windows). If something inside a container, or in Podman itself, goes wrong, it's limited to what that user can already access, not full control of the machine or VM. It's not a complete boundary though: it can still read or write anything that user owns, or reach services that user can already reach.

|               | Docker                                  | Podman                                                                               |
| ------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| Architecture  | Root daemon (`dockerd`)                 | No daemon; fork/exec into a user namespace on Linux, or inside a VM on macOS/Windows |
| Container UID | Root inside = root on host (via daemon) | Root inside = an unprivileged user on Linux, or in the VM on macOS/Windows           |

### That's also why pods are lightweight

`podman pod create` just starts a small infra container whose only job is to own a network namespace. Every container you add with `--pod` forks into that same namespace, the way any Linux process can join a namespace another process already created. There's no daemon tracking "which containers belong to which pod" somewhere else, Podman just reads that from local state on disk. A pod ends up being a handful of ordinary processes sharing one namespace, not some new kind of object that needs a service to manage it.

You can see that infra container yourself. Open the `myapp` pod on the **Containers** page, and next to `db` and `web` there's a third one, usually named `myapp-infra`, sitting quietly and holding the shared namespace open:

<ThemedImage
alt="Podman Desktop Containers page showing the myapp-infra container alongside db and web inside the pod"
sources={{
    light: require('./img/docker-to-podman-pods-socket-rootless/pod-infra-container-light.png').default,
    dark: require('./img/docker-to-podman-pods-socket-rootless/pod-infra-container-dark.png').default,
  }}
/>

If you need the container's user to match your own host UID, say, for sane file ownership on a mounted volume, use [`--userns=keep-id`](https://docs.podman.io/en/latest/markdown/podman-run.1.html#userns-mode) instead. It maps your host UID/GID straight into the container rather than remapping everything to UID 0.

### No daemon also means no socket

Docker's daemon listens on `/var/run/docker.sock`, and tools like Testcontainers, VS Code Dev Containers, and various CI runners talk to it directly. Podman has no daemon, so that socket just isn't there unless you ask for it:

```shell-session
# With Podman running but Docker Compatibility disabled:
$ docker info --format=json | jq -r .ServerVersion
# failed to connect to the docker API at unix:///var/run/docker.sock
```

On macOS, turn it on under **Settings > Preferences > Docker Compatibility**, then enable **Third-Party Docker Tool Compatibility**. This maps `/var/run/docker.sock` to the Podman socket:

```shell-session
$ docker info --format=json | jq -r .ServerVersion
# 6.0.2  (Podman responds with its own version)
```

With that toggle on, the `docker` CLI and most tools that expect the Docker socket work without any further changes. That specific setting is macOS-only. On Windows, Podman exposes a named pipe instead, `npipe:////./pipe/docker_engine`, which many Docker-aware tools pick up automatically.

On Linux, there's no toggle, you start the Podman API socket yourself with systemd and point tools at it. For a rootless setup:

```shell-session
$ systemctl --user enable --now podman.socket
$ export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock
```

For a rootful setup:

```shell-session
$ sudo systemctl enable --now podman.socket
$ export DOCKER_HOST=unix:///run/podman/podman.sock
```

One clarification, since the name carries baggage from Docker Desktop. `/var/run/docker.sock` is the control interface of Docker's daemon, the always-running root process that holds every container's state. Podman's `podman.sock` is a different thing: it's served by `podman system service`, a REST API listener that can even be started on demand through systemd socket activation, and it calls into the same container-management code the CLI uses, rather than keeping its own long-running state like `dockerd` does. Docker Compatibility just gives Docker-flavored tools a familiar address to call, not a second daemon hiding in the background.

### Even the installer tries to be rootless

Podman Desktop pushes the same idea back to installation, before you've even run a container.

On [Windows with WSL](https://podman-desktop.io/docs/installation/windows-install) already enabled, the Podman v6 MSI installer lets you choose a user-scoped install (`%LOCALAPPDATA%\Programs\Podman`) instead of a machine-wide one, and with that option, `podman machine init`/`start` need no elevation. Podman Desktop itself installs with the "Only for me" option, no admin required. Choose those options and the whole workflow can stay admin-free from install to runtime. The [installation guide](https://podman-desktop.io/docs/installation) covers macOS and Linux too, if WSL isn't your setup.

A few spots still ask for elevated access, and it's worth knowing why:

- **macOS**: the installer asks for your password once, to set up `podman-mac-helper`, a LaunchDaemon that forwards `/var/run/docker.sock` to your Podman socket, because `/var/run` is owned by the system. Podman Desktop itself just installs by dragging it to Applications.
- **Windows with Hyper-V**: creating a Hyper-V VM needs administrator rights. WSL doesn't.
- **Docker-in-Docker style CI**: some pipelines expect a root daemon inside the container, and for those you can still create a rootful machine with `podman machine init --rootful`.
- **Podman Desktop's default**: in the ["Create a Podman machine"](https://podman-desktop.io/docs/podman/creating-a-podman-machine) dialog, "Machine with root privileges" is on by default. Turn it off if you want a fully rootless machine from the start.

**Documentation**: [Rootless containers with Podman](https://developers.redhat.com/blog/2020/09/25/rootless-containers-with-podman-the-basics) | [Podman rootless mode](https://docs.podman.io/en/latest/markdown/podman.1.html#rootless-mode) | [Rootless tutorial](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md) | [Windows installation](https://podman-desktop.io/docs/installation/windows-install)

## Putting it together

A network isn't wrong, it's just not the whole picture. Swap some of those networks for pods, and use `kube play` to run that grouping straight from a Kubernetes YAML file, so what you test locally is closer to what actually gets deployed.

Rootless is the other half of the story. Podman didn't invent it, but it makes it easy to get, provided your Podman connection is actually rootless, which isn't the default everywhere. Once a pod reaches OpenShift or a cluster with restricted policies, running as non-root stops being optional, and a Kind cluster lets you catch that locally first. Having no daemon is what makes this workflow lightweight, not the reason any of it's required, root is a production concern either way, with or without Podman.

## Summary

| Area            | Docker                                                                                   | Podman                                                                          | Fix                                                                                                                                                                                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Networking      | User-defined networks (legacy `--link` deprecated)                                       | Same networks, plus pods and `kube play` for K8s-ready setups                   | Prefer pods once you are aiming at production                                                                                                                                                                                                                                                         |
| Architecture    | Root daemon (`dockerd`)                                                                  | No daemon; fork/exec on Linux, or inside a `podman machine` VM on macOS/Windows | Check `podman info --format=json \| jq -r '.host.security.rootless'`, switch to a rootless machine if it says `false`                                                                                                                                                                                 |
| Socket          | `/var/run/docker.sock` on macOS/Linux, a named pipe on Windows, always available         | No socket by default, endpoint and setup vary by OS                             | macOS: enable Docker Compatibility. Windows: use the `npipe` endpoint. Linux: start `podman.socket` and export `DOCKER_HOST`                                                                                                                                                                          |
| Non-root images | Root images run locally with both, but get rejected on OpenShift/K8s restricted policies | Same                                                                            | For plain Kubernetes, add `USER 1001` in your Containerfile, or use a non-root image like [Hummingbird](https://hummingbird-project.io/docs/using/overview/) (fixed UID 65532). For OpenShift, which assigns an arbitrary UID from the project's range, also make runtime paths writable by group `0` |
| Install         | Requires admin (daemon plus group membership)                                            | Admin-free on Windows/WSL, macOS needs a password for the helper                | Improving with each release                                                                                                                                                                                                                                                                           |

## Going further

- [Installing Podman Desktop](https://podman-desktop.io/docs/installation)
- [Migration documentation](https://podman-desktop.io/docs/migrating-from-docker)
- [Docker Compatibility settings](https://podman-desktop.io/docs/migrating-from-docker/managing-docker-compatibility)
- [Creating a pod](https://podman-desktop.io/docs/containers/creating-a-pod)
- [Deploying a pod to Kubernetes](https://podman-desktop.io/docs/kubernetes/deploying-a-pod-to-kubernetes)
- [Working with the Kind extension](https://podman-desktop.io/docs/kind)
- [Podman `podman run` volume options](https://docs.podman.io/en/latest/markdown/podman-run.1.html#volume-v-source-volume-host-dir-container-dir-options)
- [Creating images for OpenShift](https://docs.openshift.com/container-platform/latest/openshift_images/create-images.html#use-uid_create-images)

If you run into a case not covered here, open a [discussion on GitHub](https://github.com/podman-desktop/podman-desktop/discussions).
