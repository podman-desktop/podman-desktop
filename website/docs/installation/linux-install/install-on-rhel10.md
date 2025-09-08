---
sidebar_position: 3
title: Installing on RHEL 10
description: Install Podman Desktop on a RHEL 10 machine
keywords: [podman desktop, podman, install, RHEL 10]
tags: [install-on-rhel-10, podman-desktop-installation]
---

# Installing on RHEL 10

You can use the subscription manager package to install Podman Desktop on a Red Hat Enterprise Linux (RHEL) 10 machine.

#### Prerequisites

- A RHEL 10 machine.
- Register with the subscription manager using either your [account details](https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_rhel_system_registration/basic-reg-rhel-cli#proc-reg-rhel-rhc-username_) or an [activation key](https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_rhel_system_registration/basic-reg-rhel-cli#proc-reg-rhel-rhc-act-key_).

#### Procedure

1. Open a terminal, and enable the RHEL extensions repository:

   ```sh
   $ sudo subscription-manager repos --enable rhel-10-for-$(arch)-extensions-rpms
   ```

1. Enter your password when prompted.
1. Install Podman Desktop:
   ```sh
   $ sudo dnf install podman-desktop
   ```
1. Enter `y` to confirm that the installed size is okay.
1. Enter `y` to import the GPG key and complete the installation.

#### Verification

1. Enter Podman Desktop in the search box at the top of your home screen, and click the application to open it.
1. Follow the prompts to complete a quick onboarding process with the application.

   :::note

   Podman is included with a RHEL subscription, and the application automatically detects and runs it.

   :::

1. Run basic tasks, such as:
   - [Start a container](/docs/containers/starting-a-container)
   - [Create a Kubernetes cluster](/docs/kubernetes/creating-a-kube-cluster)
