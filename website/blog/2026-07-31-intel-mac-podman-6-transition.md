---
title: 'Intel Mac support in Podman Desktop: What developers need to know'
description: Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.
slug: intel-mac-podman-6-transition
authors: [kyetter]
tags: [podman-desktop, podman, macos, deprecation]
hide_table_of_contents: false
---

[Podman v6.0.0](https://github.com/podman-container-tools/podman/releases/tag/v6.0.0) has removed support for Intel-based Macs, and will no longer publish an installer. Podman Desktop is adjusting how we bundle the engine so Apple silicon, Windows, and Linux users can move to Podman 6 without leaving Intel Mac users with a broken install experience. This change shipped with [Podman Desktop 1.29](https://podman-desktop.io/blog/podman-desktop-release-1.29). Here is what is changing, why, and what to do next.

<!--truncate-->

## Podman on macOS: A brief history

Podman Desktop bundles Podman so developers can install a working container environment from a single download. On macOS, Podman runs inside a lightweight virtual machine, and Podman Desktop has shipped a universal installer supporting both Apple silicon and Intel hardware. That made sense when Intel Macs were still common in the field. With Podman 6 now released, there is neither support nor an installer for Intel Macs, so we need a clear plan for the developers still on that hardware.

## What's changing?

Starting with current Podman Desktop releases, **not every download ships the same Podman version**:

| Download                        | Bundled Podman version |
| ------------------------------- | ---------------------- |
| macOS installer (Apple silicon) | Podman 6               |
| macOS installer (Intel)         | Podman 5               |
| macOS installer (universal)     | Podman 5 and Podman 6  |
| Windows installer               | Podman 6               |
| Linux packages                  | Podman 6               |

Intel Mac users will continue to receive a Podman Desktop installer, but it will bundle **Podman 5**, not Podman 6. The universal macOS installer includes both architectures, so it installs Podman 5 on Intel Macs and Podman 6 on Apple silicon. Everyone else moves to Podman 6 with their next Podman Desktop update.

## I'm on an Apple silicon Mac. Does this affect me?

No. If you are on Apple silicon, your Podman Desktop macOS installer bundles **Podman 6**. You get the latest engine improvements, and your upgrade path is unchanged. Install or update Podman Desktop as you normally would from the [downloads page](https://podman-desktop.io/downloads/macos).

## What are the key dates?

Podman Desktop follows the Podman project's support policy for the v5.8 series. As documented in the [Podman README](https://github.com/podman-container-tools/podman/blob/main/README.md):

> After the release of Podman 6.0, the Podman maintainers have decided to extend upstream support of the v5.8 series of releases until the 2nd week of June in 2027, one year after the release of Podman 6.0. This support will only include CVE fixes and critical bugfixes.

We are aligning with that policy. We will continue to provide a bundle for Intel-based Macs until the Podman team ceases support in the second week of June 2027. After that point, Intel Mac users who remain on that hardware will rely on previously released Podman Desktop versions or external Podman installations rather than current installers.

If the Podman maintainers adjust the v5.8 support window, we will follow their lead and communicate any changes to this timeline.

## Where can I share feedback?

If this transition affects your team or you have input on the timeline, please share it on [GitHub issue #16339](https://github.com/podman-desktop/podman-desktop/issues/16339) or join us in [community discussions](https://podman-desktop.io/community).

## Conclusion

Podman 6 moves the container ecosystem forward, and Podman Desktop is moving with it. This bundling change is available now in [Podman Desktop 1.29](https://podman-desktop.io/blog/podman-desktop-release-1.29). For Intel Mac users, Podman Desktop will keep bundling Podman 5 for as long as the Podman maintainers support the v5.8 series, currently through the 2nd week of June 2027. Use that runway to plan your next environment, and keep building with confidence on Apple silicon, Windows, and Linux where Podman 6 is ready today.
