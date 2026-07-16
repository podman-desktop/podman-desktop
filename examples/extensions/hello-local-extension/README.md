# Hello Local Extension (example)

Minimal extension used to exercise the **Install custom/local extensions** tab:

1. In Podman Desktop, enable **Preferences → Extensions → Development Mode**.
2. Open **Extensions → Install custom/local extensions**.
3. Click **Add a local folder extension…** and select this directory:

   `examples/extensions/hello-local-extension`

4. Confirm the folder appears in the local extensions table and can be started/stopped.

## Install custom (OCI) example

On the same tab, use **Install custom** with:

```text
ghcr.io/podman-desktop/podman-desktop-extension-kubernetes-dashboard:latest
```

That pulls a real public extension image and lands it on the **Installed** tab when finished.
