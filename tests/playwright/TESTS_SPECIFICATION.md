# Playwright test specifications

This document describes related groups of tests across `tests/playwright`.
The inventory covers every `.spec.ts` file in `src/specs` and
`src/special-specs`. Groups share host requirements, environment variables,
or runner settings; they are planning groups, not new Playwright projects
or tags. Tables combine closely related specs; shared preconditions, inputs,
execution, and notes apply to every row unless stated otherwise. Detailed
test cases remain in the spec files.

For framework setup and runner configuration, see [README.md](README.md).
All commands below run from the repository root.

## Shared inputs

These flags apply only to specs that use them through
[utility/platform.ts](src/utility/platform.ts).

| Variable        | Enabled values                                  | Other values or unset |
| --------------- | ----------------------------------------------- | --------------------- |
| `PRODUCT_TESTS` | `1` or case-insensitive `true`: Red Hat product | Upstream              |
| `AIRGAP_BUILD`  | `1` or case-insensitive `true`: airgap          | Non-airgap            |

False-valued flags do not need to be set explicitly. The installed
`product.json` does not override these flags. Whether `PODMAN_DESKTOP_BINARY`
is required depends on the spec.

## Selecting a test environment

| Group                                                                     | Shared requirements                                                                                                                   | Keep separate from                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Installer / update](#installer--update)                                  | Installed artifact for asset/default-directory checks; older update-capable build for update flows; Podman absent for installation UI | Engine workflows that install Podman or download bundled assets           |
| [Application UI](#application-ui-without-an-engine)                       | Launchable app, unlocked preferences; no running engine required by these tests                                                       | Managed policies; startup tests need their own fresh profiles             |
| [Extensions](#extensions-and-tool-installation)                           | Expected built-in/preinstalled extensions or catalog/OCI/download access; some suites also require Podman                             | Managed extension restrictions; CLI lifecycle tests alter installed tools |
| [Podman workflows](#podman-containers-images-pods-and-volumes)            | Podman CLI and working engine; machine virtualization on macOS/Windows; registry access                                               | Stress fixtures, unrelated engine resources, machine deletion workflows   |
| [Registries](#registry-authentication-and-build-validation)               | Podman plus optional authenticated registry/private image, or writable host auth file                                                 | Concurrent credential changes and shared registry repositories            |
| [Proxy](#proxy-settings-and-traffic-routing)                              | Unlocked proxy settings; local listening socket for routing checks                                                                    | Managed proxy policy; other network-dependent tests                       |
| [Kubernetes / Kind](#kubernetes-and-kind-clusters)                        | Podman, Kind extension/CLI and usually kubectl; capacity for a local cluster                                                          | Shared cluster/context names; machine reset suites                        |
| [Machine lifecycle](#podman-machine-lifecycle-and-multiple-environments)  | macOS/Windows, `TEST_PODMAN_MACHINE=true`, suitable virtualization provider                                                           | Concurrent engine/cluster work on the same host                           |
| [Managed configuration](#managed-configuration)                           | Administrator-provisioned defaults and locks                                                                                          | Ordinary preferences, extension, registry, proxy, and update tests        |
| [Remote / stress / visual](#remote-connections-stress-and-visual-capture) | Explicitly prepared connections/resources or screenshot destination                                                                   | Engine cleanup/pruning suites that destroy prepared fixtures              |

### Common runner inputs

See [README.md](README.md) and [runner-factory.ts](src/runner/runner-factory.ts).

| Variable / option                            | Meaning and default                                                                                                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PODMAN_DESKTOP_BINARY`                      | Packaged executable; unset uses development mode. Required only where stated.                                                                                                                       |
| `PODMAN_DESKTOP_ARGS`                        | Built application repository for development mode, especially from another repository. Mutually exclusive with `PODMAN_DESKTOP_BINARY`.                                                             |
| `DEBUGGING_PORT`                             | With `PODMAN_DESKTOP_BINARY`, selects the CDP runner. Requires the binary and cannot be combined with `PODMAN_DESKTOP_ARGS`. Native dialog/Electron interception checks have skips described below. |
| `KEEP_TRACES_ON_PASS`, `KEEP_VIDEOS_ON_PASS` | Any non-empty value retains the corresponding passing-test artifacts; unset uses each suite's runner options (normally discard on pass).                                                            |
| `SKIP_REMOVE_FOLDER`                         | Any non-empty value skips global setup's `tests/output` cleanup; a non-empty `CI` also skips it. This is distinct from `tests/playwright/output`.                                                   |
| `CI`                                         | Shared `isCI` is true only for case-insensitive `true`. Some helpers use any non-empty value instead (registry credential defaults and global cleanup), as noted below.                             |
| `RunnerOptions`                              | Specs may choose a profile folder, injected settings, or disabled extensions in code. These are not additional command-line environment variables.                                                  |

The runner normally redirects application data to
`tests/playwright/output/<profile>/<customFolder>` and seeds settings there.
This does not isolate Podman resources, host CLI installations, registry auth,
or system managed-configuration files. The real-home installation spec opts
out of this redirection.

### Execution and selection

Install dependencies and build once with `pnpm test:e2e:build`; `:run` and
`test:e2e:suite` commands below reuse that build. Global setup also ensures
Playwright Chromium is installed. Examples use Bash environment syntax;
on PowerShell set the same variables through `$env:NAME` before the command.

- `pnpm test:e2e:run` selects `src/specs` and excludes `@k8s_e2e`.
- `pnpm test:e2e:all:run` selects all of `src/specs`, including opt-in suites
  whose skip conditions still apply. It does **not** include `special-specs`.
- `pnpm test:e2e:smoke:run` selects `@smoke` within `src/specs`.
  A filename ending in `-smoke.spec.ts` does not itself add that tag.
- `pnpm test:e2e:suite <name>` matches a directory segment first, then a
  filename substring, across both spec directories. For example,
  `installation` selects seven specs, while `image` selects multiple workflows.
  Use full file paths with `pnpm exec playwright test` for an exact subset.
- Tags such as `@windows_sanity` and `@macos_sanity` select tests; they do not
  enforce a platform. Actual `test.skip` conditions determine support.
- [playwright.config.ts](../../playwright.config.ts) uses one worker. Preserve
  serial execution: suites share engine state, resource names, and host files.
  A skip inside a test body can still allow setup hooks to launch the app or
  change host state.

## Installer / update

This group covers installed files, installation UI, and application updates.
All specs in this group are included in `pnpm test:e2e:update:run` through the
`@update-install` tag.

### Installed application assets

#### Metadata

| Field     | Value                                                                                     |
| --------- | ----------------------------------------------------------------------------------------- |
| Spec name | [installation-assets.spec.ts](src/special-specs/installation/installation-assets.spec.ts) |
| Tags      | `@installation-assets`, `@update-install`                                                 |
| Mode      | Static file inspection; does not launch the application                                   |

#### Purpose

Check packaged Podman installers, machine images, the Red Hat EULA, and
preinstalled remote extensions. The
[default asset list](src/model/core/installation-assets.json) defines the
filenames and locations. Each applicable asset appears in its own named test.

Installers must be present in both build variants. Machine images must be
present for airgap builds and absent otherwise. The EULA must be present in
product mode and absent in upstream mode. Each entry in the installed
`product.json`'s `extensions.remote` list requires
`<resources>/extensions-extra/<name>/package.json`, regardless of variant.

#### Preconditions

- macOS/Windows, x64/arm64: Podman installer and machine-image checks.
- macOS/Windows/Linux: EULA and declared remote-extension checks.
- An installed or extracted application with accessible resources; the default
  layout does not cover Flatpak.
- Run before workflows that download additional assets into the checked paths.
- Installed `product.json` has non-empty string `appId` and `name` values.
  It is read during discovery to name remote-extension tests.

#### Inputs

| Variable                   | Purpose                   | When unset            |
| -------------------------- | ------------------------- | --------------------- |
| `PODMAN_DESKTOP_BINARY`    | Installed executable path | Suite is skipped      |
| `PRODUCT_TESTS`            | Shared product flag       | Upstream              |
| `AIRGAP_BUILD`             | Shared airgap flag        | Non-airgap            |
| `TEST_INSTALLATION_ASSETS` | Custom JSON asset list    | Uses the default list |

#### Execution

For an upstream, non-airgap installation:

```bash
PODMAN_DESKTOP_BINARY="/Applications/Podman Desktop.app/Contents/MacOS/Podman Desktop" \
pnpm test:e2e:suite installation-assets
```

For a Red Hat airgap build, also set `PRODUCT_TESTS=1` and `AIRGAP_BUILD=1`.

#### Notes

- Checks cover regular-file presence, without checksums, signatures, or
  executing assets. No application or profile cleanup is needed.
- `<resources>` is `Contents/Resources` on macOS, or `resources` beside the
  executable on Windows/Linux. The EULA is under `Contents/License` on macOS
  and beside the executable elsewhere.
- Universal macOS apps bundle architecture-specific installers. Only the
  current test process's platform and architecture are checked.
- Empty or omitted `extensions.remote` adds no extension checks and does not
  require `extensions-extra` to exist or be absent.
- Missing directories count as no matching files. Other filesystem errors,
  malformed inputs, or a combined rule set with no applicable checks fail.
  Input loading occurs during discovery, before skip conditions are applied.

### Podman installation UI

#### Metadata

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Spec name | [podman-installation-ui.spec.ts](src/special-specs/installation/podman-installation-ui.spec.ts) |
| Tags      | `@update-install`                                                                               |
| Mode      | Application UI through the shared runner                                                        |

#### Purpose

Check that the dashboard offers Podman installation when Podman is absent:
provider status contains `NOT-INSTALLED`, the Install and detection-check
buttons are visible, and detection details report that Podman was not found.

#### Preconditions

- macOS/Windows GitHub Actions host with Podman absent. Linux is skipped.
- The application can launch through the configured runner. Setup handles
  the update dialog and Welcome page.

#### Inputs

| Variable                | Purpose                                | When unset                               |
| ----------------------- | -------------------------------------- | ---------------------------------------- |
| `CI`                    | Must evaluate to `true` through `isCI` | Test is skipped                          |
| `GITHUB_ACTIONS`        | Must equal `true`                      | Test is skipped                          |
| `PODMAN_DESKTOP_BINARY` | Optional installed executable path     | Runner uses development mode; see README |

#### Execution

```bash
pnpm test:e2e:suite podman-installation-ui
```

#### Notes

The test does not install Podman or verify successful installation. Runner
setup hooks may execute even when the test is skipped outside CI. Cleanup
closes the runner and finalizes its recordings.

### Application data directories

#### Metadata and purpose

| Spec                                                                                                      | Tags              | Mode / coverage                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| [data-directory-structure.spec.ts](src/special-specs/installation/data-directory-structure.spec.ts)       | `@update-install` | App launch plus file inspection: startup creates the expected data subdirectories under the runner's sandbox. |
| [product-json-data-directory.spec.ts](src/special-specs/installation/product-json-data-directory.spec.ts) | `@update-install` | Installed-app launch plus file inspection: bundled `product.json` determines the real data directory.         |

#### Preconditions and inputs

The sandboxed check works with the normal development or packaged runner on
all three platforms. The real-directory check requires
`PODMAN_DESKTOP_BINARY` and macOS/Windows (otherwise skipped), a disposable
host, and bundled `product.json` with `paths.config`. It uses
`RunnerOptions({ useDefaultHomeDirectory: true })`, writes into the real home,
and checks `~/.local/share/<paths.config>`.

#### Execution

```bash
pnpm test:e2e:suite data-directory-structure
PODMAN_DESKTOP_BINARY="/path/to/installed/executable" pnpm test:e2e:suite product-json-data-directory
```

#### Notes

Both use the shared [subdirectory list](src/model/core/data-subdirectories.ts).
Closing the runner does not remove the real-home directories. These checks
need no Podman engine.

### Application update behavior

#### Metadata and purpose

| Spec                                                                                              | Tags              | Mode / coverage                                                                                                         |
| ------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [update-install.spec.ts](src/special-specs/installation/update-install.spec.ts)                   | `@update-install` | UI and updater cache inspection: automatic/manual update, download progress, restart offer, and installer architecture. |
| [update-install-disabled.spec.ts](src/special-specs/installation/update-install-disabled.spec.ts) | `@update-install` | UI/logs with injected `preferences.update.appUpdate=false`: disabled message, no startup dialog or update action.       |
| [update-install-never.spec.ts](src/special-specs/installation/update-install-never.spec.ts)       | `@update-install` | UI with injected `preferences.update.reminder=never`: no startup prompt, but manual update remains available.           |

#### Preconditions and inputs

All three skip Linux. For meaningful update coverage, provide an older
update-capable packaged build and reachable update service/downloads. The
positive update and reminder-never flows expect an available update; no
Podman engine is needed. Host policy must allow each injected update setting.

`INSTALLATION_TYPE=custom-extensions` adds external-extension installation to
`update-install`; unset/other values use the vanilla path. This extension
subgroup is skipped on macOS. The updater-cache check uses Windows
`LOCALAPPDATA` (or its home-directory fallback), or macOS `~/Library/Caches`.

#### Execution

```bash
PODMAN_DESKTOP_BINARY="/path/to/older/executable" pnpm test:e2e:suite update-install
```

This substring selects all three update specs. The broader
`pnpm test:e2e:update:run` also selects asset, directory, and Podman-absent UI
checks, so prepare their different prerequisites before using the whole group.

#### Notes

The positive flow downloads the update and cancels the restart offer; it does
not verify the restarted/upgraded application. It leaves the downloaded
installer in the host updater cache. Runner hooks close the app; they do not
restore host installation/cache state.

## Application UI without an engine

### Metadata and purpose

These specs launch the app but do not require a working container engine or
live Kubernetes cluster. The default platform scope is Linux/macOS/Windows.

| Spec                                                                                     | Tags                                         | Coverage / additional setup                                                                                                           |
| ---------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [welcome-page-smoke.spec.ts](src/specs/welcome-page-smoke.spec.ts)                       | `@smoke`, `@windows_sanity`, `@macos_sanity` | Welcome overlay, telemetry consent, Dashboard and sidebar; dedicated `welcome-podman-desktop` profile.                                |
| [appearance-smoke.spec.ts](src/specs/appearance-smoke.spec.ts)                           | `@smoke`, `@windows_sanity`, `@macos_sanity` | System/light/dark/high-contrast switching and theme application; resets appearance afterwards.                                        |
| [preferences.spec.ts](src/specs/preferences.spec.ts)                                     | `@macos_sanity`                              | Kubeconfig text persists across preference-page navigation; no real kubeconfig required.                                              |
| [navigation-history-smoke.spec.ts](src/specs/navigation-history-smoke.spec.ts)           | `@smoke`, `@windows_sanity`, `@macos_sanity` | Back/forward, command-palette actions, history branching and dropdowns.                                                               |
| [search-bar-smoke.spec.ts](src/specs/search-bar-smoke.spec.ts)                           | `@smoke`, `@windows_sanity`, `@macos_sanity` | Search UI, keyboard interaction, commands and page navigation; arrow-key check skips if fewer than two results.                       |
| [help-menu-smoke.spec.ts](src/specs/help-menu-smoke.spec.ts)                             | `@smoke`, `@windows_sanity`, `@macos_sanity` | Configured product help items, dismiss behavior, links and commands; dedicated `help-menu` profile.                                   |
| [troubleshooting-smoke.spec.ts](src/specs/troubleshooting-smoke.spec.ts)                 | `@smoke`                                     | Troubleshooting navigation, reconnect providers, logs and auth-provider store refresh.                                                |
| [experimental-feature-feedback.spec.ts](src/specs/experimental-feature-feedback.spec.ts) | `@smoke`                                     | Overdue startup feedback reminder appears and can be deferred; dedicated profile with past `remindAt` and enabled status-bar feature. |
| [kubernetes-context-smoke.spec.ts](src/specs/kubernetes-context-smoke.spec.ts)           | `@smoke`, `@macos_sanity`                    | Load fixture kubeconfig, list/switch/edit/duplicate/delete contexts; no real cluster.                                                 |

### Preconditions and inputs

Use normal runner inputs and unlocked default preferences. Welcome and
feedback checks depend on initial startup state; preserve their injected
settings and dedicated profiles. Help-menu expectations come from the running
product configuration (or its bundled/repository `product.json` fallback).
Missing optional headers/commands/links skip the corresponding checks; link
interception requires the Electron runner and is skipped with CDP.

### Execution

For an engine-free UI subset, select files explicitly, for example:

```bash
pnpm exec playwright test tests/playwright/src/specs/appearance-smoke.spec.ts tests/playwright/src/specs/navigation-history-smoke.spec.ts tests/playwright/src/specs/search-bar-smoke.spec.ts
```

### Notes

Do not substitute a blanket `--grep @smoke` for this subset; that includes
engine-dependent suites. The context suite copies `resources/test-kube-config`
to `resources/kube-config` and changes its contexts. Preferences and context
checks change the configured kubeconfig path; runner shutdown is not a host
configuration reset.

## Extensions and tool installation

### Metadata and purpose

| Spec                                                                                   | Tags                                         | Coverage / additional requirements                                                                                                                                      |
| -------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [builtin-extension-smoke.spec.ts](src/specs/builtin-extension-smoke.spec.ts)           | `@smoke`, `@windows_sanity`, `@macos_sanity` | Built-in/preinstalled extension status, non-removability, versions, disable/enable and catalog search. No running engine required.                                      |
| [podman-extension-smoke.spec.ts](src/specs/podman-extension-smoke.spec.ts)             | `@smoke`, `@macos_sanity`                    | Podman extension activation, disable/enable, Dashboard and preference contributions. No running engine required.                                                        |
| [extension-installation-smoke.spec.ts](src/specs/extension-installation-smoke.spec.ts) | `@smoke`                                     | Catalog/OCI installation, details, activation, contributions, disable/enable/removal, and configured digest installation.                                               |
| [extension-onboarding-smoke.spec.ts](src/specs/extension-onboarding-smoke.spec.ts)     | `@smoke`                                     | Fresh Welcome onboarding, Podman setup, kubectl and Compose install/version paths; creates a machine through CLI on macOS/Windows, but skips macOS.                     |
| [compose-onboarding-smoke.spec.ts](src/specs/compose-onboarding-smoke.spec.ts)         | `@smoke`                                     | Compose setup/version selection, local/system install and cancel/resume; no engine startup hook. Skips Linux in CI.                                                     |
| [cli-tools-smoke.spec.ts](src/specs/cli-tools-smoke.spec.ts)                           | None                                         | Windows-only install/downgrade/upgrade/uninstall via CLI Tools and Resources; setup requires Podman.                                                                    |
| [cancelable-task-smoke.spec.ts](src/specs/cancelable-task-smoke.spec.ts)               | `@smoke`, `@windows_sanity`                  | Installs `ghcr.io/podmandesktop-ci/long-task-example:v1.0`, enables experimental features, cancels tasks and checks task filtering/search/clear; setup requires Podman. |

### Preconditions

Catalog/OCI tests need access to their configured extension sources; tool
onboarding needs download/GitHub API access and installation permissions.
Use a host on which tools can be installed and removed: the CLI lifecycle
suite uninstalls selected tools before testing and leaves them uninstalled.
Compose onboarding expects the Setup flow to be available. Extension onboarding
uses its own `compose-onboarding` profile and skips macOS because of admin
installation requirements. Podman-dependent rows use the engine setup below.

### Inputs

| Variable                          | Consumers / behavior                                                                                                                                                                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PRODUCT_TESTS`                   | Built-in suite chooses upstream or Red Hat preinstalled/catalog fixture files using the shared flag.                                                                                                                                                                                |
| `PREINSTALLED_EXTENSIONS_FILE`    | Built-in suite override: text lines with `label=...,name=...[,version=...]`; blanks and `#` comments allowed. Version defaults to app version. Missing explicit file or malformed entry fails.                                                                                      |
| `CATALOG_JSON_FILE`               | Built-in suite override: JSON with non-empty `extensions[0].displayName` used for catalog filtering; invalid input fails during discovery.                                                                                                                                          |
| `SKIP_EXTENSIONS_TEST`            | Exact `true` skips external extension installation.                                                                                                                                                                                                                                 |
| `PODMAN_DESKTOP_EXTENSIONS`       | Comma-separated extension names; case-insensitive, trimmed prefix matching against known names. Unset uses the smoke extension list; no matches adds a failing validation test. See [extensions.ts](src/model/core/extensions.ts) for available names and OCI/digest configuration. |
| `SKIP_EXTENSIONS_ONBOARDING_TEST` | Exact `true` skips Welcome extension onboarding.                                                                                                                                                                                                                                    |
| `SKIP_COMPOSE_ONBOARDING_TEST`    | Any non-empty value skips Compose onboarding, including `false` or `0`.                                                                                                                                                                                                             |
| `COMPOSE_PARTIAL_INSTALL`         | Any non-empty value skips the Compose system-wide install and final verification steps; unset enables them.                                                                                                                                                                         |
| `CLI_TOOLS`                       | CLI lifecycle: unset selects `Kind`; exact `all` selects `Kind,Compose,kubectl`; otherwise split on commas (use exact tool names, without spaces).                                                                                                                                  |

### Execution

```bash
pnpm test:e2e:extension:run
pnpm test:e2e:suite builtin-extension-smoke
CLI_TOOLS=all pnpm test:e2e:suite cli-tools-smoke
```

`test:e2e:extension:run` selects only external extension installation.
`cli-tools-smoke` has no smoke tag and must be selected explicitly.

### Notes

OpenShift Docker extension installation/digest coverage skips Windows; its
disable/enable subgroup is skipped on all platforms. Selected extensions may
have additional activation requirements. Tool suites skip affected downstream
steps after rate limits or failed version lookups; kubectl has no Resources
provider-card upgrade check. Installation suites remove tested external
extensions, but cancelable-task cleanup only closes the runner and does not
explicitly undo all enabled features or remove its extension. Verify tool state
before starting dependent Compose or Kind tests.

## Podman containers, images, pods, and volumes

### Shared engine preconditions and inputs

These specs require the Podman CLI and an engine visible in the app. Linux
uses native Podman. On macOS/Windows,
[waitForPodmanMachineStartup](src/utility/wait.ts) calls the CLI to initialize
and start the default machine; it can reset machines if startup is stuck.
A host with working virtualization and sufficient disk/memory is required.
`TEST_PODMAN_MACHINE` is **not** required for these ordinary workflows.

| Variable                      | Behavior in shared machine creation                                                                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PODMAN_ROOTFUL`              | Exact `0` omits `--rootful` during machine initialization; every other value/unset requests rootful. Does not reconfigure an existing machine.                                                              |
| `PODMAN_NETWORKING`           | Exact `1` adds `--user-networking` during initialization; otherwise omitted.                                                                                                                                |
| `CONTAINERS_MACHINE_PROVIDER` | Provider mapping used by machine checks/skips: `wsl`, `hyperv`, `applehv`, `libkrun`, `qemu` (case-insensitive). Match the actual host provider; expected defaults are WSL on Windows and LibKrun on macOS. |

Public image pulls/builds need access to the registries named in each spec
(primarily GHCR, plus Docker Hub/Quay for search). Use a disposable engine:
suites prune images, containers, pods, volumes or networks, and profile folders
do not isolate those resources. In particular image, image-search, manifest,
and registry-push suites clear images through `ensureNoImagesPresentCLI`.

### Metadata and purpose

| Spec                                                                               | Tags                                            | Coverage / additional requirements                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [image-smoke.spec.ts](src/specs/image-smoke.spec.ts)                               | `@smoke`                                        | Pull/search/cancel/details/rename/delete, build/staged build, prune, save/load tar; clears images at setup.                                                                                                                |
| [image-search.spec.ts](src/specs/image-search.spec.ts)                             | `@smoke`, `@windows_sanity`                     | Search, tag selection, relevance and pull results; clears images at setup.                                                                                                                                                 |
| [container-smoke.spec.ts](src/specs/container-smoke.spec.ts)                       | `@smoke`                                        | Create/details/terminal/navigation/start/stop/delete, export/import, filter/prune and bulk start.                                                                                                                          |
| [pod-smoke.spec.ts](src/specs/pod-smoke.spec.ts)                                   | `@smoke`                                        | Pull frontend/backend, run containers, podify, inspect, application connectivity, lifecycle and pruning. Needs reachable published application ports.                                                                      |
| [volume-smoke.spec.ts](src/specs/volume-smoke.spec.ts)                             | `@smoke`; basic workflow also `@windows_sanity` | Create/details/delete/filter/prune plus bootc-image-builder volumes and container mount/file I/O; includes a large image pull.                                                                                             |
| [network-smoke.spec.ts](src/specs/network-smoke.spec.ts)                           | `@smoke`                                        | Default bridge, custom subnet creation, container attachment/inspect, details deletion and filtering; skips if Podman CLI is absent or below `5.7.0`.                                                                      |
| [yaml-smoke.spec.ts](src/specs/yaml-smoke.spec.ts)                                 | `@smoke`, `@windows_sanity`                     | Play podify-demo YAML by typed path/file selection, replace, verify pod/images.                                                                                                                                            |
| [podman-kube-play-smoke.spec.ts](src/specs/podman-kube-play-smoke.spec.ts)         | `@smoke`                                        | Create pod from inline definition and YAML with build flag; needs port `8080`. Build subgroup skips Linux in CI.                                                                                                           |
| [podman-compose-smoke.spec.ts](src/specs/podman-compose-smoke.spec.ts)             | `@smoke`                                        | Compose CLI plus Podman: `podman compose up` and auto-refresh of the Compose group, containers and images. Requires working Compose; skips the whole suite on macOS in CI and the CLI-install verification on Linux in CI. |
| [navigation-history.spec.ts](src/specs/navigation-history.spec.ts)                 | `@smoke`                                        | Keyboard/mouse/swipe history, focus/scroll behavior, deleted-container navigation. Uses a real container.                                                                                                                  |
| [certificate-sync-smoke.spec.ts](src/specs/certificate-sync-smoke.spec.ts)         | `@smoke`                                        | macOS/Windows machine-creation form: native CA import checkbox defaults/toggle; does not create a machine or prove CA synchronization.                                                                                     |
| [docker-compatibility-smoke.spec.ts](src/specs/docker-compatibility-smoke.spec.ts) | `@smoke`                                        | Windows-only experimental Docker compatibility, socket reachability as the default Podman machine stops/starts.                                                                                                            |
| [preferred-registry.spec.ts](src/specs/preferred-registry.spec.ts)                 | `@smoke`                                        | Search preference ordering: Docker Hub → Quay → Docker Hub; restores preferred registry to `docker.io`.                                                                                                                    |

### Execution

```bash
pnpm test:e2e:suite container-smoke
pnpm exec playwright test tests/playwright/src/specs/pod-smoke.spec.ts tests/playwright/src/specs/volume-smoke.spec.ts
```

### Notes

With both `DEBUGGING_PORT` and `PODMAN_DESKTOP_BINARY` set, the entire YAML and
kube-play specs skip. Image save/load and container export/import cases skip
within their otherwise runnable suites. Use the Electron runner for this
coverage.

Compose runtime checks may install Compose on non-macOS hosts and skip
affected steps after API rate limits. Ensure Compose is already usable where
installation checks are skipped. Teardown removes its frontend/backend
containers and images.

The comprehensive navigation suite currently skips its Kubernetes navigation,
stopped-machine, extension-webview, and attached-TTY regression placeholders;
these are not executed coverage. Most resource suites perform cleanup in tests
or teardown, but a failed serial run can leave resources. Image/image-search
teardown only closes the runner. Docker compatibility can reset/recreate the
default machine on failure.

## Registry authentication and image building validation

### Metadata and purpose

All rows require the shared Podman engine setup and reachable registries.

| Spec                                                                                         | Tags     | Coverage / gate                                                                                                                        |
| -------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [registry.spec.ts](src/specs/registry.spec.ts)                                               | `@smoke` | Default registries and invalid URL/credentials always run; authenticated add/edit/remove subgroup requires credentials.                |
| [registry-image.spec.ts](src/specs/registry-image.spec.ts)                                   | `@smoke` | Unauthenticated private-image pull rejection always runs; registry addition and successful pull require credentials.                   |
| [image-push-to-registry-smoke.spec.ts](src/specs/image-push-to-registry-smoke.spec.ts)       | `@smoke` | Add registry, pull/tag/push/delete/re-pull; whole suite skips without credentials. Clears images at setup.                             |
| [image-manifest-smoke.spec.ts](src/specs/image-manifest-smoke.spec.ts)                       | `@smoke` | amd64/arm64 manifest builds/details/deletion; authenticated push checks are optional. Clears images at setup.                          |
| [insecure-registry-smoke.spec.ts](src/specs/insecure-registry-smoke.spec.ts)                 | `@smoke` | Intended self-signed HTTPS registry push/re-pull; currently unconditionally skipped pending certificate-bundle investigation (#17384). |
| [build-image-registry-validation.spec.ts](src/specs/build-image-registry-validation.spec.ts) | None     | Build with no/bad auth and validation on/off; injects deliberately malformed GHCR credentials into host `auth.json`.                   |

### Preconditions and inputs

Authenticated tests use [setup-registry.ts](src/setupFiles/setup-registry.ts).
Credentials must permit the tested pulls/pushes; `registry-image` needs a
private image whose unauthenticated pull fails. Several checks explicitly use
the `GitHub` registry label, so an arbitrary registry URL may require adapting
the fixtures/assertions.

| Variable                                                                            | Default / meaning                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REGISTRY_URL`                                                                      | `ghcr.io`                                                                                                                                                                                                  |
| `REGISTRY_USERNAME`                                                                 | `podmandesktop-ci` when `CI` is non-empty; otherwise empty.                                                                                                                                                |
| `REGISTRY_PASSWD`                                                                   | When `CI` is non-empty, falls back to `PODMANDESKTOP_CI_BOT_TOKEN`; otherwise empty.                                                                                                                       |
| `PODMANDESKTOP_CI_BOT_TOKEN`                                                        | CI password/token fallback; empty if unset.                                                                                                                                                                |
| `REGISTRY_IMAGE_NAME`, `REGISTRY_IMAGE_TAG`                                         | `registry-image` private-image fixture; defaults `alpine-hello`, `latest` under `<registry>/<username>`.                                                                                                   |
| `INSECURE_REGISTRY_URL`, `INSECURE_REGISTRY_USERNAME`, `INSECURE_REGISTRY_PASSWORD` | Self-signed registry fixture; all default empty. Setting these does not override the unconditional skip.                                                                                                   |
| `XDG_RUNTIME_DIR`                                                                   | Linux build-validation auth file is `<XDG_RUNTIME_DIR>/containers/auth.json`; unset resolves `containers/auth.json` relative to the working directory. macOS/Windows use `~/.config/containers/auth.json`. |

`canTestRegistry()` requires non-empty URL, username and password. Its CI
fallback uses string presence, unlike the shared `isCI` comparison to `true`.
Do not interpret skipped authenticated subgroups as successful auth coverage.

Manifest builds skip RHEL in CI; the complex Containerfile subgroup also skips
Windows/WSL because it executes foreign-architecture binaries. Other hosts
need suitable cross-architecture emulation for those RUN steps.

### Execution

```bash
# Set registry credentials in the environment first.
pnpm exec playwright test tests/playwright/src/specs/registry.spec.ts tests/playwright/src/specs/registry-image.spec.ts tests/playwright/src/specs/image-push-to-registry-smoke.spec.ts
pnpm test:e2e:suite build-image-registry-validation
```

### Notes

The build-validation suite needs no valid registry secret, but requires
writable host auth storage; it ensures the file exists at discovery time,
backs it up, removes GHCR credentials, and restores/removes it during teardown.
Do not run it concurrently with registry login or other users of that auth
file. It has no `@smoke` tag. Registry suites remove local credentials/images;
they do not delete pushed remote registry artifacts.

## Proxy settings and traffic routing

### Metadata and purpose

| Spec                                                                     | Tags                                         | Coverage                                                                                                               |
| ------------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [proxy-smoke.spec.ts](src/specs/proxy-smoke.spec.ts)                     | `@smoke`, `@macos_sanity`                    | System/manual/disabled proxy UI, URL validation and persistence; uses placeholder URLs.                                |
| [proxy-traffic-routing.spec.ts](src/specs/proxy-traffic-routing.spec.ts) | `@smoke`, `@windows_sanity`, `@macos_sanity` | Local logging stub proxy records catalog and CLI-version traffic; validates requests arrive, not successful downloads. |

### Preconditions and inputs

No running engine or real Kubernetes cluster is needed for currently active
cases. Proxy settings must be unlocked. Routing tests start their own local
proxy on an allocated port; no external proxy environment variables are
required. CLI-version coverage needs a tool with an update/downgrade action,
otherwise that case skips.

### Execution

Select exact paths: `test:e2e:suite proxy` would also match the managed
configuration proxy spec, which requires a different host setup.

```bash
pnpm exec playwright test tests/playwright/src/specs/proxy-smoke.spec.ts tests/playwright/src/specs/proxy-traffic-routing.spec.ts
```

### Notes

The routing stub records requests and does not forward them. Registry-add,
image-pull and Kubernetes-API routing cases are unconditionally skipped for
known gaps (#19171, #17249 and extension-kubernetes-dashboard#1349).
Both suites restore System proxy; routing teardown also stops the stub.
Run separately from other network-dependent suites while Manual proxy is set.

## Kubernetes and Kind clusters

### Metadata and purpose

| Spec                                                                                         | Tags                      | Coverage / additional requirements                                                                                              |
| -------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [kind.spec.ts](src/specs/kind.spec.ts)                                                       | `@k8s_e2e`                | CLI install, extension lifecycle, cluster creation/deploy/stop/start/restart/delete, ingress choice and custom config.          |
| [kubernetes.spec.ts](src/specs/kubernetes.spec.ts)                                           | `@k8s_e2e`, `@k8s_sanity` | Provider creation navigation, nodes/dashboard/namespaces, PVCs, ConfigMaps/Secrets, pods, apply YAML, deployments and CronJobs. |
| [kubernetes-networking.spec.ts](src/specs/kubernetes-networking.spec.ts)                     | `@k8s_e2e`                | Ingress/service availability and pod/service/deployment port forwarding; needs local ports `9090`, `50000`, `50001`, `50002`.   |
| [kubernetes-image-push.spec.ts](src/specs/kubernetes-image-push.spec.ts)                     | `@k8s_e2e`                | Push a local image into Kind and run a pod using it; no registry push credentials needed.                                       |
| [kubernetes-status-bar-providers.spec.ts](src/specs/kubernetes-status-bar-providers.spec.ts) | `@k8s_e2e`                | Experimental provider status/pinning, resource creation/deletion and Kind provider; may create a second Podman machine.         |

### Preconditions and inputs

All use shared Podman setup and the Kind extension. Resource/network/image
suites ensure Kind and kubectl are installed unless explicitly skipped; Kind
lifecycle/status-bar suites ensure Kind. Downloads and cluster-node/workload
images must be reachable. Allow several minutes and enough resources for a
cluster; specs create their own `kind-cluster` instead of sharing a precreated
cluster. The Kind custom-config path also creates `test-cluster`.

| Variable                      | Meaning                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `SKIP_KIND_INSTALL`           | Exact `true` skips CLI installation; required tools must already be available. It does not skip cluster creation.        |
| `KIND_PROVIDER_GHA`           | Provider selection passed to cluster creation; unset/empty leaves the default. Match the engine provisioned on the host. |
| `ROOTFUL_MODE`                | Exact `true` allows the Kind gate on Windows; this declares test eligibility and does not configure the machine.         |
| `RUN_KIND_TESTS`              | Exact `true` overrides the Kind eligibility gate; unset otherwise allows Linux/macOS or rootful Windows.                 |
| `CONTAINERS_MACHINE_PROVIDER` | Shared provider input used for WSL/Hyper-V-specific skips.                                                               |

The Kind eligibility gate is applied to the entire Kind, Kubernetes resource,
and image-push suites, and to the Kind-creation case in status-bar providers.
Networking does **not** apply this gate, so select it only on a suitable host.
Status-bar second-machine creation skips Linux and Hyper-V; it stops the
default machine temporarily on macOS.

### Execution

```bash
ROOTFUL_MODE=true pnpm test:e2e:k8s:run
pnpm test:e2e:k8s-sanity:run
```

`ROOTFUL_MODE=true` in this example assumes the host has actually been
configured rootful. The sanity selector currently selects `kubernetes.spec.ts`;
context-file management is in the engine-free UI group instead.

### Notes

Kind stop/start/restart subgroups skip WSL. With the CDP runner, Kind
custom-config and Kubernetes Apply YAML subgroups skip. Teardowns delete the
created cluster and selected resources, but do not undo CLI installations or
guarantee every pulled image is removed. Keep cluster/context names and ports
free, and run these before destructive machine lifecycle workflows.

## Podman machine lifecycle and multiple environments

### Metadata and purpose

| Spec                                                                                                     | Tags            | Coverage / special constraints                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [z-podman-machine-dashboard-onboarding.spec.ts](src/specs/z-podman-machine-dashboard-onboarding.spec.ts) | `@pdmachine`    | Delete default machine, recreate through Dashboard, optional final deletion.                                                                                     |
| [z-podman-machine-onboarding.spec.ts](src/specs/z-podman-machine-onboarding.spec.ts)                     | `@pdmachine`    | Delete default machine, onboarding defaults/provider/privileges, create/details/stop/start/restart/edit, optional final deletion.                                |
| [z-podman-machine-resources.spec.ts](src/specs/z-podman-machine-resources.spec.ts)                       | `@pdmachine`    | Stop default machine, create/start/restart/delete machines through Resources; skips Hyper-V. User-mode networking variant is Windows-only; its restart skips CI. |
| [z-podman-machine-tests.spec.ts](src/specs/z-podman-machine-tests.spec.ts)                               | `@pdmachine`    | Provider-page navigation, default/rootless machine switching and cleanup.                                                                                        |
| [environment-filter.spec.ts](src/specs/environment-filter.spec.ts)                                       | `@pdmachine`    | Second running machine and environment-specific pod/volume filtering; skips Hyper-V.                                                                             |
| [enhanced-dashboard.spec.ts](src/specs/enhanced-dashboard.spec.ts)                                       | `@experimental` | Experimental Dashboard toggle, CLI/UI machine detection/creation and dummy Kubernetes/VM connections; downloads a dummy resource extension from Quay.            |

### Preconditions and inputs

All require macOS/Windows and exact `TEST_PODMAN_MACHINE=true`; Linux and
unset/other values skip. Install Podman and configure a usable virtualization
provider. Shared `PODMAN_ROOTFUL`, `PODMAN_NETWORKING` and
`CONTAINERS_MACHINE_PROVIDER` inputs apply to CLI setup/recovery.

`MACHINE_CLEANUP=true` enables the final default-machine deletion in the two
onboarding specs; unset/other values keep it. This flag is also read in
Dashboard setup paths, but never bypasses the `TEST_PODMAN_MACHINE` gate.
It is not a general cleanup switch for every machine suite.

### Execution

```bash
TEST_PODMAN_MACHINE=true pnpm test:e2e:pdmachine:run
TEST_PODMAN_MACHINE=true pnpm test:e2e:experimental:run
```

The experimental command selects the enhanced Dashboard, not all tests that
happen to enable experimental features. The feedback-dialog and Docker
compatibility specs retain their own smoke selection.

### Notes

Use a disposable host. These suites delete/stop/reconfigure machines and can
reset/recreate them on failure. The `z-` prefix places the main lifecycle files
after ordinary workflows in filename order; environment-filter and enhanced
Dashboard do not have that prefix. Grouping does not establish dependencies
or make running suites in parallel safe. Resources teardown restarts the
default machine; environment-filter removes its second machine and fixtures;
enhanced Dashboard removes the dummy cluster/extension. Verify engine state
before reusing the host, especially after `MACHINE_CLEANUP=true`.

## Managed configuration

### Metadata and purpose

All use `@managed-configuration`, application UI, and a
`managed-configuration` runner profile. No working engine is required by their
assertions.

| Spec                                                                                                                         | Coverage                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [managed-configuration-combined.spec.ts](src/special-specs/managed-configuration/managed-configuration-combined.spec.ts)     | Precedence of user/default/locked preferences, managed labels, editable/resettable values, locked controls. |
| [managed-configuration-extensions.spec.ts](src/special-specs/managed-configuration/managed-configuration-extensions.spec.ts) | Installed tab remains; catalog, local extensions and custom install are hidden by locked defaults.          |
| [managed-configuration-proxy.spec.ts](src/special-specs/managed-configuration/managed-configuration-proxy.spec.ts)           | Locked HTTP/HTTPS defaults override user values; proxy mode and no-proxy remain unlocked.                   |
| [managed-configuration-registries.spec.ts](src/special-specs/managed-configuration/managed-configuration-registries.spec.ts) | Locked preferred registries and, on Linux only, generated host `registries.conf` entries.                   |

### Preconditions and inputs

Before launching the app, provision
[default-settings.json](resources/managed-configuration/default-settings.json)
and [locked.json](resources/managed-configuration/locked.json) in its system
managed configuration location. The specs do not install those files or take
an environment variable pointing to them. The
[managed-configuration workflow](../../.github/workflows/managed-configuration-template.yaml)
uses these upstream locations:

| Platform | Directory containing both JSON files                           |
| -------- | -------------------------------------------------------------- |
| Linux    | `/usr/share/podman-desktop`                                    |
| macOS    | `/Library/Application Support/io.podman_desktop.PodmanDesktop` |
| Windows  | `%ProgramData%/Podman Desktop`                                 |

For a differently branded app, use its configured policy location. Combined
and proxy specs seed user settings through `RunnerOptions` to exercise
precedence. The Linux registry check reads
`~/.config/containers/registries.conf`.

### Execution

```bash
pnpm test:e2e:managed-configuration:run
```

### Notes

These host-wide defaults disable updates and extension-installation entry
points and lock proxy/registry values. Run on a dedicated host or restore its
policy files before ordinary suites. Teardown closes the app and does not
remove policies or restore host registry files. The combined suite marks the
Zoom Level reset case as expected to fail (`test.fail`, #16000).

## Remote connections, stress, and visual capture

### Remote Podman connection

- **Metadata:** [podman-remote.spec.ts](src/special-specs/podman-remote/podman-remote.spec.ts),
  `@podman-remote`, application UI.
- **Purpose:** Remote SSH connections and their images are hidden until
  “Load remote system connections (ssh)” is enabled, then become visible.
- **Preconditions:** Externally provision a reachable SSH system connection
  named `remote-machine`, with image
  `ghcr.io/podmandesktop-ci/alpine-remote` already pulled there. Remote loading
  must initially be disabled. The spec does not create the connection/image.
- **Inputs:** Normal runner inputs; connection and image are constants in code.
- **Execution:** `pnpm test:e2e:remote:run`.
- **Notes:** Teardown closes the runner; it does not remove remote resources
  or explicitly revert the remote-loading preference.

### Large resource lists

- **Metadata:** [ui-stress.spec.ts](src/special-specs/ui-stress/ui-stress.spec.ts),
  `@ui-stress`, application UI with shared Podman startup.
- **Purpose:** Verify row counts and visibility/scrolling for many resources.
- **Preconditions:** Populate the engine **before** the run: one source image
  plus `N` tags `localhost/my-image-1` … `localhost/my-image-N`, `3N`
  containers (including `my-container-1` … `my-container-N`), and `N` pods
  `my-pod-1` … `my-pod-N`. Each pod contributes two of those containers.
- **Inputs:** `N = Number(OBJECT_NUM) || 100`;
  `BASELINE_IMAGE_COUNT` uses `Number(value) || 0`. Use positive integer `N`
  and a non-negative baseline. Expected image rows are `baseline + N + 1`
  (the test title's `N + 2` is not the assertion); containers/pods have exact
  totals with no baseline allowance.
- **Execution:** `OBJECT_NUM=100 BASELINE_IMAGE_COUNT=0 pnpm test:e2e:ui-stress:run`.
- **Notes:** The spec neither generates nor removes the stress fixtures.
  Do not combine it with image/container/pod pruning suites on the same engine.

### Screenshot capture

- **Metadata:** [visual-testing.spec.ts](src/special-specs/visual-testing/visual-testing.spec.ts),
  no tags, application UI.
- **Purpose:** Capture the empty Containers page; this is screenshot generation,
  with no reference-image comparison.
- **Preconditions:** Empty Containers list and launchable app. There is no
  engine startup helper or fixture population in this spec.
- **Inputs:** Non-empty `PLAYWRIGHT_SCREENSHOTS_PATH`, otherwise skipped.
  The dedicated script sets it to `./tests/playwright/output/screenshots`.
- **Execution:** `pnpm test:e2e:screenshots:run`, or set the variable and use
  `pnpm test:e2e:suite visual-testing`.
- **Notes:** Writes `containers-empty-<platform>-<arch>.png`. Teardown closes
  the app and includes an attempted container-prune fallback; prepare the
  empty state explicitly rather than relying on teardown.

## Adding specifications

Place each spec in the group matching its strongest host/setup requirements.
For related specs, extend the group's metadata/purpose table and shared
preconditions, inputs, execution, and notes. Create a separate group when
setup or cleanup conflicts with the existing group. Link every new spec,
record actual tags and skip conditions, and distinguish external provisioning
from setup done by hooks. Keep detailed steps and execution history in the
specs and reports, outside this document.
