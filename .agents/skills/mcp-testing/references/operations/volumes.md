# Volume Operations

## Navigation

| Target       | Selector                                                  |
| ------------ | --------------------------------------------------------- |
| Volumes page | `nav[aria-label="AppNavigation"] a[aria-label="Volumes"]` |

## Page Structure

### VolumesPage (list)

```
[role="region"][aria-label="volumes"]
├── [role="region"][aria-label="header"]
│   ├── [role="heading"]                        ← "Volumes"
│   └── [role="group"][aria-label="additionalActions"]
│       ├── button:has-text("Create")
│       ├── button:has-text("Prune")
│       └── button:has-text("Gather volume sizes")
├── [role="region"][aria-label="search"]
└── [role="region"][aria-label="content"]
    └── [role="table"]
        └── [role="row"][aria-label="{volumeName}"]
```

### VolumeDetailsPage

```
[role="region"][aria-label="Header"]
├── [role="navigation"][aria-label="Breadcrumb"]
├── [role="heading"]                            ← volume name
└── [role="group"][aria-label="Control Actions"]
[role="region"][aria-label="Tabs"]
└── a:has-text("{tabName}")                     ← Summary, Inspect
[role="region"][aria-label="Tab Content"]
```

## Locators

### VolumesPage

| Element       | Selector                                                                     |
| ------------- | ---------------------------------------------------------------------------- |
| Page heading  | `[role="region"][aria-label="volumes"] [role="heading"]`                     |
| Create button | `[aria-label="additionalActions"] button:has-text("Create")`                 |
| Prune button  | `[aria-label="additionalActions"] button:has-text("Prune")`                  |
| Gather sizes  | `[aria-label="additionalActions"] button:has-text("Gather volume sizes")`    |
| Volume row    | `[role="row"][aria-label="{volumeName}"]`                                    |
| Name cell     | `[role="row"][aria-label="{volumeName}"] [role="cell"]:nth-child(4)`         |
| Delete (row)  | `[role="row"][aria-label="{volumeName}"] button[aria-label="Delete Volume"]` |

### CreateVolumePage

| Element           | Selector                                       |
| ----------------- | ---------------------------------------------- |
| Heading           | `[role="heading"]:has-text("Create a volume")` |
| Volume name input | `[aria-label="Volume Name"]`                   |
| Create button     | `button:has-text("Create")`                    |
| Done button       | `button:has-text("Done")`                      |
| Close link        | `a:has-text("Close")`                          |
| Close button      | `button:has-text("Close")`                     |

### VolumeDetailsPage

| Element       | Selector                                                          |
| ------------- | ----------------------------------------------------------------- |
| Heading       | `[aria-label="Header"] [role="heading"]:has-text("{volumeName}")` |
| Delete Volume | `[aria-label="Control Actions"] button:has-text("Delete Volume")` |
| Used status   | `[aria-label="Header"] [title="USED"]`                            |
| Summary tab   | `[aria-label="Tabs"] a:has-text("Summary")`                       |
| Inspect tab   | `[aria-label="Tabs"] a:has-text("Inspect")`                       |

## Operations

### Create volume

1. Navigate: `click('nav[aria-label="AppNavigation"] a[aria-label="Volumes"]')`
2. Wait for page: `wait('[role="region"][aria-label="volumes"] [role="heading"]')`
3. Click Create: `click('[aria-label="additionalActions"] button:has-text("Create")')`
4. Wait for create page: `wait('[role="heading"]:has-text("Create a volume")')`
5. Fill name: `fill('[aria-label="Volume Name"]', '{volumeName}')`
6. Click Create: `click('button:has-text("Create")')`
7. Wait for Done: `wait('button:has-text("Done")')`
8. Click Done: `click('button:has-text("Done")')`

### Open volume details

1. Navigate to Volumes page (steps 1-2)
2. Click volume row: `click('[role="row"][aria-label="{volumeName}"]')`
3. Wait for details: `wait('[aria-label="Header"] [role="heading"]:has-text("{volumeName}")')`

### Delete volume (from details)

1. Open volume details
2. Click Delete: `click('[aria-label="Control Actions"] button:has-text("Delete Volume")')`
3. Wait for list: `wait('[role="region"][aria-label="volumes"] [role="heading"]')`

### Delete volume (from list)

1. Navigate to Volumes page
2. Click Delete: `click('[role="row"][aria-label="{volumeName}"] button[aria-label="Delete Volume"]')`

### Prune volumes

1. Navigate to Volumes page
2. Click Prune: `click('[aria-label="additionalActions"] button:has-text("Prune")')`
3. Confirm: `click('button:has-text("Prune")')`

### Gather volume sizes

1. Navigate to Volumes page
2. Click Gather sizes: `click('[aria-label="additionalActions"] button:has-text("Gather volume sizes")')`

### Check if volume is used

```
evaluate('!!document.querySelector(\'[role="row"][aria-label="{volumeName}"] [title="USED"]\')')
```

## Gotchas

- Volumes have only two tabs: Summary and Inspect (no Logs or Terminal)
- Volume names are user-defined or auto-generated hashes
- Prune deletes all unused volumes — volumes mounted to containers are kept
- Gather volume sizes triggers a background scan that updates size column
