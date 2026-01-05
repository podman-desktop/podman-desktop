# Podman Desktop - A graphical tool for developing on containers and Kubernetes

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/podman-desktop/podman-desktop)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/podman-desktop/podman-desktop)
![GitHub contributors](https://img.shields.io/github/contributors/podman-desktop/podman-desktop)
[![codecov](https://codecov.io/gh/podman-desktop/podman-desktop/graph/badge.svg?token=clbFmLZ85j)](https://codecov.io/gh/podman-desktop/podman-desktop)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/9966/badge)](https://www.bestpractices.dev/projects/9966)
[![CLOMonitor](https://img.shields.io/endpoint?url=https://clomonitor.io/api/projects/cncf/podman-desktop/badge)](https://clomonitor.io/projects/cncf/podman-desktop)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/podman-desktop/podman-desktop/badge)](https://securityscorecards.dev/viewer/?uri=github.com/podman-desktop/podman-desktop)
[![FOSSA License Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpodman-desktop%2Fpodman-desktop.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpodman-desktop%2Fpodman-desktop?ref=badge_shield&issueType=license)
[![FOSSA Security Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpodman-desktop%2Fpodman-desktop.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpodman-desktop%2Fpodman-desktop?ref=badge_shield&issueType=security)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-podmandesktop-blue.svg?logo=linkedin)](https://www.linkedin.com/company/podman-desktop/)
[![LFX Health Score](https://insights.linuxfoundation.org/api/badge/health-score?project=podman-desktop)](https://insights.linuxfoundation.org/project/podman-desktop)
[![LFX Contributors](https://insights.linuxfoundation.org/api/badge/contributors?project=podman-desktop)](https://insights.linuxfoundation.org/project/podman-desktop)
[![LFX Active Contributors](https://insights.linuxfoundation.org/api/badge/active-contributors?project=podman-desktop)](https://insights.linuxfoundation.org/project/podman-desktop)

<p align="center">
  <img alt="Podman Desktop" src="/website/static/img/features/manage-containers.webp">
</p>

## Documentation

- [**Overview**](#overview)
- [**Download**](#download)
- [**Features**](#download)
- [**Join Our Early Adopter Program (Optional)**](#join-our-early-adopter-program-optional)
- [**Roadmap**](#roadmap)
- [**Contributing**](#contributing)
- [**Communication**](#communication)
- [**Code of Conduct**](#code-of-conduct)
- [**License**](#license)

## Overview

Podman Desktop is a graphical interface that enables application developers to seamlessly work with containers and Kubernetes.

Podman Desktop installs, configures, and keeps Podman up to date on your local environment. It provides a system tray, to check status and interact with your container engine without losing focus from other tasks. The desktop application provides a dashboard to interact with containers, images, pods, and volumes but also configures your environment with your OCI registries and network settings. Podman Desktop also provides capabilities to connect and deploy pods to Kubernetes environments.

Podman Desktop supports [multiple container engines](#multiple-container-engine-support), and extends its capabilities through [extensions](https://podman-desktop.io/extensions)!

## Download

Check the downloads page on [podman-desktop.io/downloads](https://podman-desktop.io/downloads).

## Features

#### Containers and pods dashboard

- Build, run, manage, and debug both containers and pods
- Run Pods on your container engine or with Kubernetes
- Convert your Pods to be running on Kubernetes
- Manage multiple container engines

#### Multiple container engine support

- [Podman container engine](https://github.com/containers/podman)
- [crc](https://github.com/code-ready/crc)
- [Lima: Linux Machines](https://github.com/lima-vm/lima)
- [Docker container engine](https://github.com/docker/docker)

#### Podman engine update support

- Keep `podman` up-to-date on your PC by having Podman Desktop automatically install the newest version

#### System tray support

- Manage your Container engine
- Define your Kubernetes context

#### Enterprise capabilities

- Proxy Support
- OCI Image registries management

#### Bridge between local and remote environments

- Connect and deploy to both local or remote Kubernetes environments
- Change your Kubernetes context and pick your deployment environment

## Join our early adopter program! (optional)

We are seeking developers who are interested in improving Podman Desktop!

Register your interest to join our Early Adopter Program by filling <a href="https://forms.gle/ow73dV7Ce3YLzoXH7" target="_blank">this form</a>.

This is totally _optional_ and does not change any Podman Desktop features.

## Roadmap

All upcoming features are tracked with GitHub milestones.

Check out all our [future features!](https://github.com/containers/podman-desktop/milestones)

## Contributing

Interested in fixing issues or contributing to Podman Desktop?

- :bug: [File bugs or feature requests on GitHub](https://github.com/containers/podman-desktop/issues/new/choose)
- :checkered_flag: [Read our contributing guide](./CONTRIBUTING.md)
- :ok_hand: [Review or contribute a pull request](https://github.com/containers/podman-desktop/pulls)

Joining a [community meeting](https://github.com/podman-desktop/community/blob/main/meetings/README.md#upcoming-community-meeting) is a great way to get involved and help shape the future of Podman Desktop.

## Communication

For all bug and feature requests please [file a GitHub issue](https://github.com/containers/podman-desktop/issues/new/choose).

Discussions are done using [GitHub Discussions](https://github.com/containers/podman-desktop/discussions/).

### Chatting

General questions & development:

- [#podman-desktop on the Podman Discord](https://discord.com/invite/x5GzFF6QH4)
- [#podman-desktop@libera.chat on IRC](https://libera.chat/)
- [#podman-desktop@fedora.im on Matrix](https://chat.fedoraproject.org/#/room/#podman-desktop:fedora.im)

Note: All channels are bridged. Chat on either Discord, IRC, or Matrix, and your messages will appear on all three platforms!

Kubernetes questions & development:

- [#podman-desktop](https://app.slack.com/client/T09NY5SBT/C04A0L7LUFM) on the [Kubernetes Slack](https://slack.k8s.io/)

### Social networks

[![Discord](https://img.shields.io/badge/discord-7289da.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/invite/x5GzFF6QH4)
[![X/Twitter](https://img.shields.io/badge/X/twitter-18a1d6.svg?style=for-the-badge&logo=X&logoColor=white)](https://x.com/podmandesktop)
[![GitHub Discussions](https://img.shields.io/badge/discussions-grey.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/podman-desktop/podman-desktop/discussions)
[![Linkedin](https://img.shields.io/badge/linkedin-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/podman-desktop)
[![Mastodon](https://img.shields.io/badge/mastodon-6364ff?style=for-the-badge&logo=mastodon&logoColor=white)](https://fosstodon.org/@podmandesktop)
[![Bluesky](https://img.shields.io/badge/bluesky-1283FE.svg?style=for-the-badge&logo=Bluesky&logoColor=white)](https://bsky.app/profile/podman-desktop.io)

### Adopters

Check out the [list of companies](./ADOPTERS.md) already using Podman Desktop.

## Code of Conduct

This project uses the [Containers Community Code of Conduct](https://github.com/containers/common/blob/main/CODE-OF-CONDUCT.md).

## Testing

[![Covered by Argos Visual Testing](https://argos-ci.com/badge-large.svg)](https://app.argos-ci.com/containers/podman-desktop-website)

## License

Licensed under [Apache 2.0](LICENSE).
