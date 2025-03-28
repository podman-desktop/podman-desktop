---
sidebar_position: 3
title: Publishing
description: Publishing a Podman Desktop extension to the catalog
tags: [podman-desktop, extension, publishing]
keywords: [podman desktop, extension, publishing-an-extension]
---

# Packaging and publishing a Podman Desktop extension

To enable users to install your extension from the catalog, consider push your extension to an Open Container Initiative (OCI) image registry. After pushing your extension, add the extension details to the `podman-desktop-catalog/static/api/extensions.json` file in the [catalog repository](https://github.com/podman-desktop/podman-desktop-catalog).

#### Prerequisites

- The extension builds successfully.
  See [Developing a Podman Desktop extension](/docs/extensions/developing) and [Creating an extension](/tutorial/creating-an-extension).

- All runtime dependencies are inside the final binary.

- An OCI image registry to publish to, such as `quay.io/username/my-first-extension`.

- (Optional) The OCI image registry is public to enable anybody to fetch the image.

## Push your extension to an OCI registry

1. Create and edit a `Containerfile` file.

1. Use a scratch image.
   The extension requires no runtime:

   ```dockerfile
   FROM scratch
   ```

1. Apply mandatory Podman Desktop metadata on the `OCI` image:

   ```dockerfile
   LABEL org.opencontainers.image.title="My first extension" \
         org.opencontainers.image.description="Example of extension" \
         org.opencontainers.image.vendor="podman-desktop" \
         io.podman-desktop.api.version=">= 0.12.0"
   ```

   `io.podman-desktop.api.version=">= 0.12.0"` sets the minimal Podman Desktop version that the extension requires to run.

1. Copy the extension assembly, including the metadata, icon, and production binary, to the `/extension` folder inside the image:

   ```dockerfile
   COPY package.json /extension/
   COPY icon.png /extension/
   COPY dist /extension/dist
   ```

1. Build an image:

   ```shell-session
   $ podman build -t quay.io/username/my-first-extension .
   ```

1. Push the image and manifest to the OCI image registry:

   ```shell-session
   $ podman push quay.io/username/my-first-extension
   ```

### Adding platform-specific files

You may want to add a system-native executable to the extension's image, so the extension can execute it.

In contrast to the extension's code (transpiled into JavaScript) which is executable in any platform, you will need to prepare several OCI images, one for each platform (OS and architecture) you want the extension to support.

For this, you will need to create:

- one Containerfile for each platform or a common Containerfile with parameters to create
  one image per platform
- one manifest to reference all images created at the previous step.

The URL you need to share with the users to install the extension is the URL of the manifest.

If the manifest does not contain an image for the platform of the user, Podman Desktop will install the
image for Linux (amd64 or arm64 depending on the architecture of the user's platform).

You can leverage the [Buildah Build action](https://github.com/redhat-actions/buildah-build) to build this manifest.

## Publish the extension to the catalog

1. Fork and then clone the [Podman Desktop catalog repository](https://github.com/podman-desktop/podman-desktop-catalog).
1. Checkout a new branch to add your extension details.
1. Add a license, a readme file, and the extension icon to the `podman-desktop-catalog/static/api/extensions` directory.
1. Edit the `extensions.json` file. Here is a sample code to add a Podman Desktop extension to the catalog:

```json
      "publisher": {
        "publisherName": "podman-desktop",
        "displayName": "Podman Desktop"
      },
      "extensionName": "<name-of-the-extension>",
      "displayName": "<display-name-of-the-extension>",
      "shortDescription": "<description-of-the-extension>",
      "license": "Apache-2.0",
      "categories": ["<category-of-the-extension>"],
      "keywords": ["<keywords-for-the-extension>"],
      "versions":
        {
          "version": "<version-number-of-extension>",
          "podmanDesktopVersion": "<version-number-of-podman-desktop>",
          "preview": false,
          "lastUpdated": "2025-03-25T00:00:00Z",
          "ociUri": "<path-to-extension-image>",
          "files": [
            {
              "assetType": "icon",
              "data": "https://registry.podman-desktop.io/api/extensions/podman-desktop/<extension>/<version>/icon.png"
            },
            {
              "assetType": "README",
              "data": "https://registry.podman-desktop.io/api/extensions/podman-desktop/<extention>/<version>/README.md"
            },
            {
              "assetType": "LICENSE",
              "data": "https://registry.podman-desktop.io/api/extensions/podman-desktop/<extention>/<version>/LICENSE"
            }
          ]
        },
```

5. Create a PR with your changes.
6. Get your PR merged to make your extension available in the catalog.

Podman Desktop has an in-built automatic update mechanism to refresh the catalog list with the newly added extensions.

#### Additional resources

- [Installing a Podman Desktop extension](/docs/extensions/install)
- [Create an extension](/tutorial/creating-an-extension)
