# Podman Desktop Governance

This is the governance policy for the Podman Desktop project. It applies to all repositories
in the [Podman Desktop GitHub organization](https://github.com/podman-desktop).

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Project Roles](#project-roles)
  - [Contributor](#contributor)
  - [Organization Member](#organization-member)
  - [Extension Maintainer](#extension-maintainer)
- [Conflict Resolution](#conflict-resolution)
- [Changing Roles](#changing-roles)
  - [Inactivity](#inactivity)
  - [Involuntary Removal or Demotion](#involuntary-removal-or-demotion)
  - [Stepping Down/Emeritus Process](#stepping-downemeritus-process)
- [Changes to this Document](#changes-to-this-document)

## Code of Conduct

All members of the Podman Desktop community are expected to follow the
[Code of Conduct](https://github.com/podman-desktop/podman-desktop/blob/main/CODE-OF-CONDUCT.md)

## Project Roles

### Contributor

A Contributor contributes directly to the project and adds value to it. Contributions need not be code.
People at the Contributor level may be new contributors, or they may only contribute occasionally.

#### Responsibilities

- Follow the [Code of Conduct](https://github.com/podman-desktop/podman-desktop/blob/main/CODE-OF-CONDUCT.md)
- Follow the project [contributing guide](https://github.com/podman-desktop/podman-desktop/blob/main/CONTRIBUTING.md)

#### How to get involved

- Participate in community discussions
- Help other users
- Submit bug reports and feature requests
- Comment on issues
- Try out new releases
- Attend community events

#### How to contribute

- Report and sometimes resolve issues
- Occasionally submit PRs
- Contribute to the documentation
- Participate in meetings
- Answer questions from other community members
- Submit feedback on issues and PRs
- Test releases and patches and submit reviews
- Run or help run events
- Promote the project externally

### Organization Member

An org member is a frequent contributor that has become a member of the Podman Desktop GitHub organization.
In addition to the responsibilities of contributors, an org member is also expected to be reasonably active
in the community through continuous contributions of any type.

An Organization Member must meet the responsibilities and has the requirements of a Contributor.

#### Responsibilities

- Continues to contribute regularly, as demonstrated by having at least 10 GitHub contributions per year

#### Requirements

There are two paths to become an Organization Member:

1. Individual org member path:

- Must have at least 10 contributions to the project in the form of:
  - Accepted PRs
  - Helpful PR reviews
  - Resolving GitHub issues
  - Or some equivalent contributions to the project
- Must have been contributing for at least 3 months

2. Team member of an existing project area maintainer team:

- In the case where a team at an organization owns a project area, all the members of that team are
  automatically able to become Organization Members. This must be approved by at least one of the existing Core Maintainers

#### Privileges

- Membership in the podman-desktop GitHub Organization

### Extension Maintainer

An Extension Maintainer is responsible for maintaining an individual Podman Desktop extension.
This includes responding to issues filed against the extension, contributing to it, reviewing contributions,
and keeping the extension up to date.

Extension repositories are named extension-\<name\>, e.g. https://github.com/podman-desktop/extension-minikube.

Extension Maintainer is a lightweight form of ownership and is reflected through CODEOWNERS in each extension repository.
Each extension can have one or more maintainers.

An Extension Maintainer has all the rights and responsibilities of an Organization Member.

#### Responsibilities

- Review the majority of PRs towards the extension
- Respond to GitHub issues related to the extension
- Keep the extension up-to-date with Podman Desktop extension APIs and other dependencies
- Periodically release the extension and publish to the catalog

#### Requirements

- Is supportive of new and occasional contributors and helps get useful PRs in shape to merge
- Owns at least one extension in the https://github.com/podman-desktop organization.

#### Privileges

- Write access to the https://github.com/podman-desktop/extension-\<name\> repository
- GitHub [code owner](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
  of the extension, with rights to approve and merge PRs towards the extension

#### Becoming an Extension Maintainer

There are two ways to become an extension maintainer:

1. By contributing a new extension repository to this organization.
   The extension contribution must be approved by the community Core Maintainers and follow all CNCF rules for ownership change, IP transfer, etc.
   When the contribution is merged by the Core Maintainers you will remain as the code owner of the extension and granted Extension Maintainer status.

2. Organization Members can become an Extension Maintainer through continued high-quality contributions to a
   particular extension. New Extension Maintainers can be added to an extension by a
   [super-majority](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) vote of the existing maintainers.
   
   A potential maintainer may be nominated by an existing maintainer or Organization Member. A vote is conducted
   in private between the current maintainers over the course of a one week voting period. At the end of the week,
   votes are counted, the maintainer is given write access to the repository and a pull request is made adding the
   new maintainer to the code owners.

### Core Maintainer

Core Maintainers are responsible for the Podman Desktop project as a whole, including all repositories. Final decisions
on the project reside with the Core Maintainers. They help review and merge project-level pull requests as well as
coordinate work affecting multiple project areas. Core Maintainers should also mentor and seek out new maintainers,
lead community meetings, and communicate with the CNCF on behalf of the project.

#### Responsibilities

- Take part in the incoming issue and PR triage and review process. PRs are shared equally among all maintainers
- Drive refactoring and manage tech health across the entire project
- Participate in CNCF maintainer activities
- Respond to security incidents in accordance to our [security policy](https://github.com/podman-desktop/podman-desktop/blob/main/SECURITY.md)
- Determine strategy and policy for the project
- Participate in and/or lead community meetings

#### Requirements

- Experience as an Organization Member for at least 6 months
- Demonstrates a broad knowledge of the project
- Is able to exercise judgment for the good of the project, independent of their employer, friends, or team
- Mentors other contributors

#### Privileges

- Write access to all repositories under the podman-desktop GitHub Organization
- Approve PRs
- Merge PRs
- Represent the project in public as a Maintainer
- Communicate with the CNCF on behalf of the project
- Have a vote in Maintainer decision-making meetings
- Drive the direction and roadmap of the project

#### Becoming a Core Maintainer

New Core Maintainers can be added to the project by a
[super-majority](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) vote of the existing maintainers.
A potential maintainer may be nominated by an existing core maintainer or Organization Member. A vote is conducted
in private between the current maintainers over the course of a one week voting period. At the end of the week,
votes are counted, the maintainer is given write access to repositories and a pull request is made adding the
new maintainer to the code owners.

## Conflict Resolution

Final decisions on the project reside with the Core Maintainers. If the Core Maintainers cannot agree
on an issue, the issue will be resolved by voting. The voting process is based on a
[super-majority](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) vote where each Core Maintainer is given one vote.

## Changing Roles

### Inactivity

Inactivity is measured by periods of no contributions without explanation, for longer than:

- Core Maintainer: 6 months
- Extension Maintainer: 12 months
- Organization Member: 12 months

Consequences of being inactive include:

- Involuntary removal or demotion
- Being asked to move to Emeritus status

### Involuntary Removal or Demotion

Involuntary removal/demotion of a contributor happens when responsibilities or requirements aren't being met.
This may include repeated patterns of inactivity, extended periods of inactivity, a period of failing to meet
the requirements of your role, and/or a violation of the Code of Conduct. This process is important because
it protects the community and its deliverables while also opening up opportunities for new contributors to
step in.

Involuntary removal or demotion is handled through a vote by a
[super-majority](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) of the current Core Maintainers.

### Stepping Down/Emeritus Process

If and when contributors' commitment levels change, contributors can consider voluntarily stepping down
(moving down the contributor ladder) or moving to emeritus status (completely stepping away from the project).

Contact the Core Maintainers about changing to Emeritus status or reducing your contributor level.

Emeritus contributors will remain listed in a dedicated section of the contributors file.

Emeritus Maintainers are former Maintainers or Core Maintainers whose status has lapsed, either voluntarily
or through inactivity. We recognize these former maintainers for their past contributions, their valuable
experience and insights, and they maintain Emeritus status as a way of recognizing this. Emeritus Maintainer
also offers a fast-tracked path to becoming a Maintainer again, should the contributor wish to return to the
project. Emeritus Maintainers have no responsibilities or requirements beyond those of an ordinary Contributor.

## Changes to this Document

Changes to this governance document require a pull request with approval from a
[super-majority](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) of the current maintainers.
