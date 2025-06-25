---
sidebar_position: 117
title: Uninstallation
description: How to uninstall Podman Desktop on Windows, macOS, and Linux.
tags: [podman-desktop, uninstall]
keywords: [podman desktop, containers, podman, unistall-on-windows, unistall-on-macOS, uninstall-on-linux]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Uninstall Podman Desktop

Uninstalling Podman Desktop does not automatically remove the created Kubernetes clusters, Podman, or other resources. To uninstall, perform the following tasks:

1. Optional: Remove cluster resources
1. Uninstall Podman
1. Uninstall Podman Desktop

## Optional: Remove cluster resources

- For Kind, use the UI to [delete the Kind cluster](/docs/kind/deleting-your-kind-cluster) or run the `kind delete clusters --all` command.
- For Minikube, run `minikube delete` and then remove the `~/.minikube` folder.

  :::note

  You can find the installed binaries and plugins for Podman Desktop at `~/.local/share/containers/podman-desktop/extensions-storage/`, and you may delete them if necessary.

  :::

## Uninstall Podman

<Tabs groupId="operating-systems">
<TabItem value="win" label="Windows" className="markdown">

You can delete all pods, containers, and images by removing the Podman machine.

1. Remove all Podman machines:
   ```sh
   $ podman machine reset -f
   ```
1. Uninstall Podman from the Start menu, Settings, or Control Panel. For more details, see the [resource](https://support.microsoft.com/en-us/windows/uninstall-or-remove-apps-and-programs-in-windows-4b55f974-2cc6-2d2b-d092-5905080eaf98).
1. Remove Podman files and configurations:
   ```powershell
   rm -Recurse -Force ~/.local/share/containers/podman
   rm -Recurse -Force ~/.config/containers/
   rm -Recurse -Force ~/AppData/Roaming/containers
   ```

</TabItem>
<TabItem value="macOS" label="macOS" className="markdown">

1. Remove all Podman machines:
   ```sh
   $ podman machine reset -f
   ```
1. Perform one of the following steps based on your installation:
   - If you have installed Podman using `brew`, run the following command:
     ```sh
     $ brew uninstall podman
     ```
   - If you have installed Podman using the Podman Desktop setup, run the following commands one by one:
     ```sh
     $ sudo /opt/podman/bin/podman-mac-helper uninstall
     $ sudo rm /etc/paths.d/podman-pkg
     $ sudo rm -rfv /opt/podman
     ```
1. Remove the Podman files and configurations:
   ```sh
   $ rm -rf ~/.local/share/containers/podman
   $ rm -rf ~/.config/containers/podman
   ```
1. Optional: Delete storage configuration:
   ```sh
   $ rm -rf ~/.local/share/containers/storage
   ```

</TabItem>
<TabItem value="linux" label="Linux" className="markdown">

By default, Podman is available on Linux distributions, such as CentOS Stream, Fedora, and Red Hat Enterprise Linux. However, you can remove Podman resources, including containers, pods, images, and Podman machines.

- To remove all containers, run the `podman rm -a -f` command.
- To remove all pods, run the `podman pod rm -a -f` command.
- To remove all images, run the `podman rmi -a -f` command.
- To remove all Podman machines, run the `podman machine reset -f` command.

</TabItem>
</Tabs>

## Uninstall Podman Desktop

<Tabs groupId="operating-systems">
<TabItem value="win" label="Windows" className="markdown">

1. Choose an uninstall method based on how Podman Desktop was installed and perform the necessary step:

   <details>
   <summary>
   uninstall methods:
   - Installer
   - Chocolatey
   - Scoop
   - Winget
   </summary>

   #### Installer
   - Uninstall Podman Desktop from the Start menu, Settings, or Control Panel. For more details, see the [resource](https://support.microsoft.com/en-us/windows/uninstall-or-remove-apps-and-programs-in-windows-4b55f974-2cc6-2d2b-d092-5905080eaf98).

   #### Chocolatey
   - Run the following command:

     ```shell-session
     > choco uninstall podman-desktop
     ```

   #### Scoop package manager for Windows
   - Run the following command:

     ```shell-session
     > scoop uninstall podman-desktop
     ```

   #### Winget
   - Run the following command:

     ```shell-session
     > winget uninstall -e --id RedHat.Podman-Desktop
     ```

   </details>

1. Remove the Podman Desktop configuration files:
   ```powershell
   $ rm -Recurse -Force ~/.local/share/containers/podman-desktop/
   $ rm -Recurse -Force ~/AppData/Roaming/Podman Desktop
   ```
1. Remove temporary files, caches, and blobs:
   ```powershell
   $ rm -Recurse -Force ~/AppData/Roaming/Podman Desktop
   ```

</TabItem>
<TabItem value="macOS" label="macOS" className="markdown">

1. Perform one of the following steps based on your installation:
   - If you have installed Podman Desktop using `brew`, run the following command:
     ```sh
     $ brew uninstall podman-desktop
     ```
   - If you have installed Podman Desktop using the `.dmg` file, perform the following steps:
     1. Locate the Podman Desktop `.dmg` file.
     1. Drag the Podman Desktop icon and drop it to the trash folder.

1. Remove the Podman Desktop configuration files:
   ```sh
   $ rm -rf ~/.local/share/containers/podman-desktop
   ```

</TabItem>
<TabItem value="linux" label="Linux" className="markdown">

1. Uninstall Podman Desktop using flatpak or flathub:

   ```sh
   $ flatpak uninstall io.podman_desktop.PodmanDesktop
   ```

1. Remove the Podman Desktop configuration folder:
   ```sh
   $ rm -rf ~/.local/share/containers/podman-desktop
   ```

</TabItem>
</Tabs>
