# Proxy usage audit

This documents every place in Podman Desktop that consumes the configured HTTP/HTTPS proxy
(Settings > Proxy), whether it actually works, and where in the UI each path can be exercised.
It complements `tests/playwright/src/specs/proxy-traffic-routing.spec.ts`, which verifies a subset
of these end-to-end against a local logging-only stub proxy.

## How the proxy is applied

- `packages/main/src/plugin/proxy.ts` - `Proxy.overrideFetch()` monkey-patches `globalThis.fetch`
  with an undici `ProxyAgent` when a proxy is configured. Called at the end of `Proxy.init()`,
  awaited early in main process bootstrap (`packages/main/src/plugin/index.ts`).
- `packages/main/src/plugin/proxy-resolver.ts` - `createHttpPatchedModules()` patches Node's
  `http`/`https` `get`/`request` with `hpagent` agents. Wired into `ExtensionLoader`'s module
  loader, so `require('http')`/`require('https')` calls made by **extension code** get proxied.
- `packages/main/src/plugin/util/exec.ts` - injects `HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY` into the
  env of any subprocess spawned via the `Exec` API. Whether this matters depends entirely on
  whether the spawned binary itself honors those env vars.
- `packages/main/src/plugin/proxy-system.ts` - reads OS-level proxy settings (Windows registry,
  macOS `networksetup`, Linux env vars) to populate "System" mode. This is the _source_ of proxy
  config, not a consumer.

## Proxied via global `fetch()` (main process)

| #   | Code                                                                                                                 | What it does                                                                                                   | UI trigger                                                                                                                  | Status                                   |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1   | `packages/main/src/plugin/extension/catalog/extensions-catalog.ts:92` `refreshCatalog()`                             | Fetches the extension catalog JSON                                                                             | Extensions > Catalog tab > **"Refresh the catalog"** button                                                                 | Verified passing (E2E)                   |
| 2   | Telemetry (segment.io)                                                                                               | Background analytics events                                                                                    | Automatic, fires during normal app use                                                                                      | Verified passing (E2E)                   |
| 3   | `packages/main/src/plugin/updater.ts:130,144,146` `getReleaseNotes()`                                                | Fetches release notes / GitHub latest-release JSON                                                             | Dashboard release-notes banner / "What's new" - the `api.github.com` branch only fires in dev builds with a `-next` version | Untested, same mechanism as #1           |
| 4   | `packages/main/src/plugin/documentation/documentation-service.ts:76` `fetchDocumentation()`/`refreshDocumentation()` | Fetches documentation-link manifests from `product.json`                                                       | Dashboard "Documentation" panel; explicit refresh via IPC `documentation:refresh`                                           | Untested, same mechanism as #1           |
| 5   | `packages/main/src/plugin/image-registry.ts` (own `hpagent` agents, separate wiring but still proxy-aware)           | Registry credential checks / manifest calls made directly from the main process (not via the container engine) | Settings > Registries > add/login to a registry; "Push manifest" action on an image                                         | Confirmed buggy - see "Bugs found" below |
| 6   | `packages/main/src/plugin/docker-extension/docker-desktop-installation.ts:272`                                       | Docker-Desktop-compatible extension UI talking to its own backend service                                      | Any bundled Docker-Desktop-style extension's webview                                                                        | N/A - always `localhost`, proxy is moot  |

## Proxied via patched `http`/`https` modules (extension code only)

| #   | Code                                                                    | What it does                              | UI trigger                                                               | Status                              |
| --- | ----------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| 7   | `extensions/kubectl-cli/src/kubectl-github-releases.ts`                 | kubectl version/release check             | Settings > CLI Tools > **kubectl** row > Update/Upgrade-Downgrade button | Verified passing (E2E)              |
| 8   | `extensions/kind/src/kind-installer.ts:92,138,197` (Octokit)            | kind CLI release check/download           | Settings > CLI Tools > **kind** row > Update/Install button              | Untested, identical mechanism to #7 |
| 9   | `extensions/compose/src/compose-github-releases.ts:52,90,111` (Octokit) | docker-compose CLI release check/download | Settings > CLI Tools > **Compose** row > Update/Install button           | Untested, identical mechanism to #7 |

## Proxied only via subprocess env vars (depends on the external binary honoring them)

| #   | Code                                                                                                    | What it does                                             | UI trigger                                                              | Status                                                       |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| 10  | `extensions/podman/packages/extension/src/extension.ts:2180` `createMachine()` -> `podman machine init` | Downloads the machine's base VM disk image               | "Create new Podman machine" wizard (onboarding or Settings > Resources) | Untested - depends on `podman`/`gvproxy`'s own proxy support |
| 11  | `extensions/kind/src/create-cluster.ts:318` -> `kind create cluster`                                    | Pulls the kind node image via kind's embedded containerd | Kubernetes > **"Create a Kind Cluster"** dialog                         | Untested - depends on `kind`'s embedded runtime              |
| 12  | `extensions/lima/src/limactl.ts` -> `limactl` subprocess                                                | Downloads Lima VM base images                            | Lima VM creation flow (macOS only)                                      | Untested - depends on `limactl`                              |

## Confirmed NOT proxied (real product gaps, found via live E2E runs)

| #   | Code                                                                                           | What it does                                                   | UI trigger                                                | Status                                                                                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | `packages/main/src/plugin/kubernetes/*.ts` (`@kubernetes/client-node`)                         | Kubernetes API calls (context reachability, resource browsing) | Settings > Kubernetes contexts; Kubernetes resource pages | Confirmed bypasses proxy entirely - raw DNS lookup failure observed (`getaddrinfo ENOTFOUND`), no proxy wiring anywhere in this code                                                                                                          |
| 14  | `packages/main/src/plugin/container-registry.ts` `pullImage()` -> Podman engine's own REST API | Actual image/container pulls                                   | Images > "Pull an Image"                                  | Confirmed doesn't reach a host-bound proxy - the pull happens inside the Podman machine's own VM/network namespace; proxy settings only propagate there after a machine restart, and even then need the VM's gateway address, not `127.0.0.1` |

## Not real outbound network calls (proxy irrelevant)

- `extensions/podman/packages/extension/src/extension.ts:653`, `extensions/podman/packages/extension/src/utils/warnings.ts:35,46`, and `extensions/docker/packages/extension/src/docker-daemon-monitor.ts:140,166` - `http.get` calls to **Unix domain sockets** (`podman.sock`/`docker.sock`) for local health checks, not the internet.
- `extensions/podman/packages/extension/scripts/podman-download.ts` - build-time asset download script, never runs on an end user's machine.
- `extensions/registries/` - no direct network calls; delegates to the container engine.

## Bugs found

### Bug 1: registry credential check ignores the proxy right after switching to Manual

Found via the "Add registry goes through the proxy" test (now `test.skip()`, since it reproduces a
real product bug rather than a test defect).

**Root cause**: `packages/main/src/plugin/proxy.ts`: the Settings UI's "Update" button
(`PreferencesProxiesRendering.svelte`) calls `setProxyState()` before `updateProxySettings()`.
`setState()` fires `onDidStateChange` using `isEnabled()`, which reads proxy settings that haven't
been saved yet - so on a fresh System/Disabled -> Manual switch it evaluates `false`.
`ImageRegistry` (`packages/main/src/plugin/image-registry.ts`) caches that stale `false` into
`this.proxyEnabled` and never re-evaluates it, so every registry credential check for the rest of
the session skips the proxy - until the user disables and re-enables Manual mode, which fires the
events again in the now-consistent state. This doesn't affect the mechanisms already verified
working (rows 1, 2, 7), since those read `proxy.isEnabled()`/`proxy.proxy` live at request time
instead of caching them from these two events.

#### Steps to reproduce (UI only)

Setup - a simple "proxy" you can watch, no real proxy server needed:

```bash
nc -l -p 8877 -k
```

This prints anything it receives on port 8877 and keeps listening (`-k`). If Podman Desktop's
registry check goes through the proxy, a `CONNECT fake-registry.test:443 ...` line appears in this
terminal the moment "Add" is clicked in step 7 below.

1. Open Podman Desktop.
2. Go to **Settings > Proxy**. Confirm it's currently set to **System** (or **Disabled**).
3. Switch the mode to **Manual**.
4. Fill in:
   - HTTP Proxy: `http://127.0.0.1:8877`
   - HTTPS Proxy: `http://127.0.0.1:8877`
5. Click **Update**.
6. Go to **Settings > Registries > Add registry**.
7. Fill in:
   - URL: `https://fake-registry.test` (any non-existent host works)
   - Username / Password: anything
8. Click **Add**.

**Expected result**: the `nc` terminal shows a `CONNECT fake-registry.test:443` line - the
credential check reached the proxy (even though it then fails, since nothing is actually listening
as a real proxy behind it).

**Actual result**: nothing appears in the `nc` terminal. The credential check went out directly,
bypassing the just-configured proxy entirely.

#### Confirms it's a one-time ordering issue, not "proxy doesn't work at all"

9. Without closing the app, go back to **Settings > Proxy**, switch to **Disabled**, click
   **Update**, then switch back to **Manual** (fields are pre-filled) and click **Update** again.
10. Repeat steps 6-8 with a _different_ fake host (e.g. `https://fake-registry-2.test`) so the two
    attempts can be told apart.

**Result**: this second time, the `CONNECT` _does_ show up in the `nc` terminal - proving the proxy
settings are correct and usable, just not applied on the very first Manual switch.

### Bug 2 (tracked upstream): image pulls never see the proxy even after a machine restart

Row 14's `test.skip()` links to
[podman-desktop#17249](https://github.com/podman-desktop/podman-desktop/issues/17249): the proxy
env is only written into the VM's systemd config during `podman machine start` (via SSH), but the
Podman user service inside the VM starts before that SSH session is available, so it boots with the
old environment. `systemctl daemon-reload` updates the unit file but doesn't restart the
already-running service, so a _second_ restart is required before pulled images actually see the
proxy. That race is tracked upstream at
[containers/podman#24752](https://github.com/containers/podman/issues/24752) (stale) and Podman
Desktop has no automated double-restart workaround yet.
