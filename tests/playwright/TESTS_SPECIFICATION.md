# Tests specification and execution guide

## Installation assets

`installation-assets.spec.ts` checks installed files without launching the app.
Each asset has its own named test case. Run it before workflows that download
additional assets:

```bash
PODMAN_DESKTOP_BINARY="/Applications/Podman Desktop.app/Contents/MacOS/Podman Desktop" \
pnpm test:e2e:suite installation-assets
```

Only `PODMAN_DESKTOP_BINARY` is needed for a typical upstream, non-airgap run.

| Environment variable       | When set                                                     | When unset                                     |
| -------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `PODMAN_DESKTOP_BINARY`    | Path to the installed executable                             | Suite is skipped                               |
| `PRODUCT_TESTS`            | `1` selects Red Hat; other values select upstream            | Upstream                                       |
| `TEST_AIRGAP_BUILD`        | `true` or `1` selects airgap; other values select non-airgap | Non-airgap                                     |
| `TEST_INSTALLATION_ASSETS` | Path to a custom JSON asset list                             | Uses `src/model/core/installation-assets.json` |

No explicit `PRODUCT_TESTS=0` or `TEST_AIRGAP_BUILD=false` is necessary in CI.
The suite also has the `@update-install` tag and runs with
`pnpm test:e2e:update:run`. Dashboard behavior is checked separately in
`podman-installation-ui.spec.ts`.

### Default checks

- **macOS/Windows:** the current architecture's Podman installer must exist
  under `<resources>/extensions/podman/packages/extension/assets/`.
- **macOS/Windows:** `podman-image-<arch>.zst` in that directory must exist for
  airgap runs and be absent for non-airgap runs.
- **All platforms:** `Red Hat Standard EULA *.pdf` must exist for Red Hat runs
  and be absent for upstream runs. Its location is `Contents/License` on macOS,
  or beside the executable on Windows/Linux.
- **All platforms:** every entry in the installed `product.json`'s
  `extensions.remote` list requires
  `<resources>/extensions-extra/<name>/package.json`. These checks also apply
  with a custom asset list. An empty or omitted remote list adds no checks.

Universal macOS apps contain both architecture-specific installers; the suite
checks the current architecture. Linux has no bundled Podman installer/image
check. The default resource layout does not cover Flatpak.

### Custom asset list

`TEST_INSTALLATION_ASSETS` replaces the static default list with a non-empty
JSON array, for example:

```json
[
  {
    "name": "Podman installer",
    "platforms": ["win32"],
    "architectures": ["x64"],
    "root": "resources",
    "directory": "extensions/podman/packages/extension/assets",
    "pattern": "podman-installer-windows-amd64.msi",
    "presence": "present"
  }
]
```

`platforms` accepts `darwin`, `win32`, and `linux`; optional `architectures`
accepts `x64` and `arm64`. `root` is `resources` or `application` (`Contents`
on macOS, the executable's directory elsewhere). `directory` is relative to
that root or absolute; `pattern` matches regular filenames directly inside it.
Both support `{arch}`, `{product.name}`, and `{product.appId}` placeholders.
Product values come from the installed `product.json`, read during discovery.

`presence` is `present`, `absent`, `airgap`, or `redhat`. The latter two use
the environment defaults above; the installed appId does not select the variant.
Malformed inputs or no applicable checks fail. Checks cover file presence only,
without checksums, signatures, or executing the assets.
