# Image Operations

## Navigation

| Target      | Selector                                                 |
| ----------- | -------------------------------------------------------- |
| Images page | `nav[aria-label="AppNavigation"] a[aria-label="Images"]` |

## Page Structure

### ImagesPage (list)

```
[role="region"][aria-label="images"]
├── [role="region"][aria-label="header"]
│   ├── [role="heading"]                        ← "Images"
│   └── [role="group"][aria-label="additionalActions"]
│       ├── button:has-text("Pull")
│       ├── button:has-text("Build")
│       └── button:has-text("Prune")
├── [role="region"][aria-label="search"]
│   └── [role="group"][aria-label="bottomAdditionalActions"]
│       └── button:has-text("Delete")           ← bulk delete
└── [role="region"][aria-label="content"]
    └── [role="table"]
        └── [role="row"][aria-label="{imageName}"]
```

### ImageDetailsPage

```
[role="region"][aria-label="Header"]
├── [role="navigation"][aria-label="Breadcrumb"]
├── [role="heading"]                            ← image name
└── [role="group"][aria-label="Control Actions"]
[role="region"][aria-label="Tabs"]
└── a:has-text("{tabName}")                     ← Summary, History, Inspect
[role="region"][aria-label="Tab Content"]
```

## Locators

### ImagesPage

| Element             | Selector                                                                     |
| ------------------- | ---------------------------------------------------------------------------- |
| Page heading        | `[role="region"][aria-label="images"] [role="heading"]`                      |
| Pull button         | `[aria-label="additionalActions"] button:has-text("Pull")`                   |
| Build button        | `[aria-label="additionalActions"] button:has-text("Build")`                  |
| Prune button        | `[aria-label="additionalActions"] button:has-text("Prune")`                  |
| Load Images button  | `[aria-label="Load Images"]`                                                 |
| Import Image button | `[aria-label="Import Image"]`                                                |
| Image row           | `[role="row"][aria-label="{imageName}"]`                                     |
| Image name cell     | `[role="row"][aria-label="{imageName}"] [role="cell"]:nth-child(4)`          |
| Image status        | `[role="row"][aria-label="{imageName}"] [role="status"]` (read `title` attr) |
| Select all checkbox | `[role="checkbox"][aria-label="Toggle all"]`                                 |
| Delete selected     | `[aria-label="bottomAdditionalActions"] button:has-text("Delete")`           |
| Prune confirm       | `button:has-text("All unused images")`                                       |
| No Container Engine | `[role="heading"]:has-text("No Container Engine")`                           |

### PullImagePage

| Element              | Selector                                                     |
| -------------------- | ------------------------------------------------------------ |
| Heading              | `[role="heading"]:has-text("Pull Image From a Registry")`    |
| Image name input     | `#imageName`                                                 |
| Pull button          | `button:has-text("Pull image")`                              |
| Close link           | `a:has-text("Close")`                                        |
| Go back to Images    | `a:has-text("Go back to Images")`                            |
| Manage registries    | `button:has-text("Manage registries")`                       |
| Search results rows  | `[aria-label="Tab Content"] [role="row"]`                    |
| Close (after pull)   | `[aria-label="Tab Content"] button:has-text("Close")`        |
| Cancel (during pull) | `[aria-label="Tab Content"] button:has-text("Cancel")`       |
| View details         | `[aria-label="Tab Content"] button:has-text("View details")` |
| Run (after pull)     | `[aria-label="Tab Content"] button:has-text("Run")`          |

### ImageDetailsPage

| Element         | Selector                                                         |
| --------------- | ---------------------------------------------------------------- |
| Heading         | `[aria-label="Header"] [role="heading"]:has-text("{imageName}")` |
| Run Image       | `[aria-label="Control Actions"] button:has-text("Run Image")`    |
| Delete Image    | `[aria-label="Control Actions"] button:has-text("Delete Image")` |
| Edit Image      | `[aria-label="Control Actions"] button:has-text("Edit Image")`   |
| Push Image      | `[aria-label="Control Actions"] button:has-text("Push Image")`   |
| Save Image      | `[aria-label="Control Actions"] button:has-text("Save Image")`   |
| Kebab menu      | `button[aria-label="kebab menu"]`                                |
| Summary tab     | `[aria-label="Tabs"] a:has-text("Summary")`                      |
| History tab     | `[aria-label="Tabs"] a:has-text("History")`                      |
| Inspect tab     | `[aria-label="Tabs"] a:has-text("Inspect")`                      |
| Save output dir | `#input-output-directory`                                        |
| Confirm save    | `[aria-label="Save images"]`                                     |
| Browse folder   | `[aria-label="Select output folder"]`                            |

### EditImagePage (dialog)

| Element          | Selector                                                             |
| ---------------- | -------------------------------------------------------------------- |
| Dialog           | `[role="dialog"][aria-label="Edit Image"]`                           |
| Image name input | `[role="dialog"][aria-label="Edit Image"] [aria-label="imageName"]`  |
| Image tag input  | `[role="dialog"][aria-label="Edit Image"] [aria-label="imageTag"]`   |
| Cancel           | `[role="dialog"][aria-label="Edit Image"] button:has-text("Cancel")` |
| Save             | `[role="dialog"][aria-label="Edit Image"] button:has-text("Save")`   |

### BuildImagePage

| Element             | Selector                                                              |
| ------------------- | --------------------------------------------------------------------- |
| Heading             | `[role="heading"]:has-text("Build Image from Containerfile")`         |
| Containerfile input | `[placeholder="Containerfile to build"]`                              |
| Context dir input   | `[placeholder="Directory to build in"]`                               |
| Image name input    | `[placeholder="Image name (e.g. quay.io/namespace/my-custom-image)"]` |
| Build button        | `button:has-text("Build")`                                            |
| Done button         | `button:has-text("Done")`                                             |
| Cancel button       | `button:has-text("Cancel")`                                           |
| Platform region     | `[aria-label="Build Platform Options"]`                               |
| ARM64 checkbox      | `[aria-label="Build Platform Options"] [aria-label="linux/arm64"]`    |
| AMD64 checkbox      | `[aria-label="Build Platform Options"] [aria-label="linux/amd64"]`    |
| Terminal output     | `.xterm-rows`                                                         |

## Operations

### Pull image

1. Navigate: `click('nav[aria-label="AppNavigation"] a[aria-label="Images"]')`
2. Wait for page: `wait('[role="region"][aria-label="images"] [role="heading"]')`
3. Click Pull: `click('[aria-label="additionalActions"] button:has-text("Pull")')`
4. Wait for pull page: `wait('[role="heading"]:has-text("Pull Image From a Registry")')`
5. Fill image name: `fill('#imageName', '{imageName}')`
6. Click Pull image: `click('button:has-text("Pull image")')`
7. Wait for completion: `wait('[aria-label="Tab Content"] button:has-text("Close")', { timeout: 60000 })`
8. Click Close: `click('[aria-label="Tab Content"] button:has-text("Close")')`

### Pull image and view details

1. Follow steps 1-6 from "Pull image"
2. Wait for View details: `wait('[aria-label="Tab Content"] button:has-text("View details")', { timeout: 60000 })`
3. Click View details: `click('[aria-label="Tab Content"] button:has-text("View details")')`
4. Wait for details: `wait('[aria-label="Header"] [role="heading"]')`

### Cancel pull

1. Follow steps 1-6 from "Pull image"
2. Click Cancel: `click('[aria-label="Tab Content"] button:has-text("Cancel")')`

### Open image details

1. Navigate to Images page (steps 1-2 from "Pull image")
2. Click image row: `click('[role="row"][aria-label="{imageName}"]')`
3. Wait for details: `wait('[aria-label="Header"] [role="heading"]:has-text("{imageName}")')`

### Check image details tabs

1. Open image details (above)
2. Verify Summary: `wait('[aria-label="Tabs"] a:has-text("Summary")')`
3. Verify History: `wait('[aria-label="Tabs"] a:has-text("History")')`
4. Verify Inspect: `wait('[aria-label="Tabs"] a:has-text("Inspect")')`

### Rename image (edit)

1. Open image details
2. Click Edit: `click('[aria-label="Control Actions"] button:has-text("Edit Image")')`
3. Wait for dialog: `wait('[role="dialog"][aria-label="Edit Image"]')`
4. Clear name: `fill('[role="dialog"][aria-label="Edit Image"] [aria-label="imageName"]', '{newName}')`
5. Clear tag: `fill('[role="dialog"][aria-label="Edit Image"] [aria-label="imageTag"]', '{newTag}')`
6. Click Save: `click('[role="dialog"][aria-label="Edit Image"] button:has-text("Save")')`
7. Wait for list: `wait('[role="region"][aria-label="images"] [role="heading"]')`

### Delete image

1. Open image details
2. Click Delete: `click('[aria-label="Control Actions"] button:has-text("Delete Image")')`
3. Wait for list: `wait('[role="region"][aria-label="images"] [role="heading"]')`

### Build image

1. Navigate to Images page
2. Click Build: `click('[aria-label="additionalActions"] button:has-text("Build")')`
3. Wait for build page: `wait('[role="heading"]:has-text("Build Image from Containerfile")')`
4. Fill Containerfile: `fill('[placeholder="Containerfile to build"]', '{containerfilePath}')`
5. Fill context dir: `fill('[placeholder="Directory to build in"]', '{contextDirectory}')`
6. Fill image name: `fill('[placeholder="Image name (e.g. quay.io/namespace/my-custom-image)"]', '{imageName}')`
7. Click Build: `click('button:has-text("Build")')`
8. Wait for Done: `wait('button:has-text("Done")', { timeout: 300000 })`
9. Click Done: `click('button:has-text("Done")')`

### Save image as tar

1. Open image details
2. Click Save: `click('[aria-label="Control Actions"] button:has-text("Save Image")')`
3. Fill output path: `fill('#input-output-directory', '{tarFilePath}')`
4. Click Save: `click('[aria-label="Save images"]')`
5. Wait for completion: `wait('[role="region"][aria-label="images"] [role="heading"]', { timeout: 60000 })`

### Prune images

1. Navigate to Images page
2. Click Prune: `click('[aria-label="additionalActions"] button:has-text("Prune")')`
3. Confirm: `click('button:has-text("All unused images")')`

### Check image status

```
evaluate('document.querySelector(\'[role="row"][aria-label="{imageName}"] [role="status"]\')?.title')
```

Returns: `UNUSED`, `USED`, `IN USE`, etc.

## Test Data

- Lightweight pull test: `ghcr.io/podmandesktop-ci/hello`
- Search test: `ghcr.io/linuxcontainers/alpine` (tag: `latest`)
- Built image names get `docker.io/library/` prefix automatically
- Timeouts: pull 60s, build 300s, delete 60s, prune 180s

## Gotchas

- After pulling, wait for `Close` or `View details` button before navigating away
- Built images are prefixed with `docker.io/library/` — use this in row selectors
- Image name input on PullImagePage triggers a search — wait briefly after filling before clicking Pull
- Save/Load operations require file system paths that the app can access
- Prune only deletes unused images — images with running containers are kept
