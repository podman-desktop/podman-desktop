---
sidebar_position: 1
title: Windows
description: How to install Podman Desktop and Podman on Windows.
tags: [podman-desktop, installing, windows]
keywords: [podman desktop, containers, podman, installing, installation, windows]
---

# Installing Podman Desktop and Podman on Windows

You can install Podman Desktop by using:

- The Windows installer
- Windows Package Manager (WinGet)
- Other alternative methods

During Podman installation, ensure to have administrator privileges for the following tasks:

- Installing or updating Windows Subsystem for Linux version 2 (WSL 2) on a single-user or all-users machine
- Enabling the WSL feature to allow users to set up Podman
- Setting up a Podman machine using Hyper-V as the machine provider type

## Installing Podman Desktop

_**Using the Windows installer**_

1. [Download the Windows installer](/downloads/windows).
1. Locate the file in the Downloads folder, and double-click on it. The Podman Desktop Setup screen opens.
1. Select one of the installation options: `Windows Linux Subsystem (WSLv2)` or `Windows Hyper-V`.
1. Click **Install**. Wait for the installation to complete.
   ![install button](img/install-button-for-podman-desktop.png)
1. Click **Finish** to close the screen. The **Get started with Podman Desktop** screen opens.

_**Using WinGet**_

1. [Install the Winget Package manager for Windows](https://aka.ms/getwinget).

1. Install from the terminal:

   ```shell-session
   > winget install RedHat.Podman-Desktop
   ```

<details>
<summary>
Alternate installation methods:
- Silent Windows installer
- Chocolatey
- Scoop
</summary>

#### Silent Windows installer

1. [Download the Windows installer](/downloads/windows).

1. To install without user interaction, run the Windows installer with the silent flag `/S` from the Command Prompt:

   ```shell-session
   > podman-desktop-1.6.4-setup-x64.exe /S
   ```

#### Chocolatey

1. Install the [Chocolatey package manager](https://chocolatey.org/install).

1. Install from the terminal:

   ```shell-session
   > choco install podman-desktop
   ```

#### Scoop package manager for Windows

1. [Install the Scoop package manager](https://github.com/ScoopInstaller/Install#readme).

1. Install from the terminal:

   ```shell-session
   > scoop bucket add extras
   > scoop install podman-desktop
   ```

</details>

## Installing Podman

On Windows, running the Podman container engine requires running a Linux distribution on a virtual machine.

### Use WSL2 as machine provider

Podman Desktop creates a [Windows Subsystem for Linux version 2 (WSL 2)](https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2) virtual machine: the Podman Machine.

Main benefits are:

- Ease of use.
- WSL 2 native virtualization performance.

#### Prerequisites

Check that your environment has:

- 6 GB RAM for the Podman Machine.
- Windows Subsystem for Linux version 2 (WSL 2) prerequisites. See [Enabling WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install), [WSL basic commands](https://learn.microsoft.com/en-us/windows/wsl/basic-commands), and [Troubleshooting WSL 2](https://learn.microsoft.com/en-us/windows/wsl/troubleshooting#error-0x80370102-the-virtual-machine-could-not-be-started-because-a-required-feature-is-not-installed):
  - The Windows user has administrator privileges.
  - Windows 64bit.
  - Windows 10 Build 19043 or greater, or Windows 11.
  - On a virtual machine: [Nested Virtualization enabled](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#configure-nested-virtualization).

#### Procedure: Enable the WSL feature

1. Open the command prompt, and run the following commands to enable the WSL feature without installing the default Ubuntu distribution of Linux.

   ```shell-session
   > wsl --update
   > wsl --install --no-distribution
   ```

   :::note

   If you run the Podman Desktop setup on a Windows 10 LTSC version, you require to install a specific WSL distribution. See [Troubleshooting Podman on Windows](/docs/troubleshooting/troubleshooting-podman-on-windows#windows-10-enterprise-ltsc-version-21h2-podman-desktop-is-unable-to-detect-wsl2-machine)

   :::

1. Restart your computer.

#### Procedure: Install Podman Desktop dependencies

After installing Podman Desktop, the **Get started with Podman Desktop** screen opens to help you start onboarding. You can install Podman, `kubectl` CLI and `compose` CLI or completely skip this onboarding setup and do it later by using:

- The **Set up** button shown in the notification on the Dashboard page.
- The **Setup Podman** button shown in the Podman tile on the Resources page.

Perform the following procedure to set up Podman and create the Podman machine:

1. Click **Set up** in the notification on the Dashboard page.
   ![set up button](img/podman-set-up-button.png)
1. Click **Next**. A confirmation notification to install Podman opens.
1. Click **Yes**. The Podman Setup screen opens with the default WSLv2 virtualization provider selected.
1. Click **Install**. A notification stating `Installation Successfully Completed` appears on the screen.
   ![install button for Podman](img/install-podman-through-installer.png)
1. Click **Close**. A page notifying that Podman has been set up correctly opens.
1. Click **Next**. A page notifying you to create a Podman machine opens.
1. Click **Next**, and then click **Create**.
   ![install button for Podman](img/notification-to-create-podman-machine.png)
1. Click **Next** to navigate back to the Dashboard page.

To verify that Podman is set up, go to **Settings > Resources** and view the running Podman machine in the **Podman** tile.

![Podman is running screen](img/podman-machine-running.png)

You are now ready to use the application.

### Use Hyper-V as machine provider

As an administrator, you can set up a Podman machine using Hyper-V as the machine provider type. To do so, select `hyperv` from the **Provider Type** dropdown list when [creating a Podman machine](/docs/podman/creating-a-podman-machine).

:::note

If you already have a running Podman machine with the WSL provider type, you will be prompted to set the Hyper-V machine as the default machine to avoid CLI errors.

:::

#### Verification

1. Go to **Settings > Resources**.
1. View the created machine in the Podman tile.
   ![Podman machine with the hyperv provide type](img/podman-machine-hyperv.png)

#### Next steps

- [Work with containers](/docs/containers).
- [Work with Kubernetes](/docs/kubernetes).
