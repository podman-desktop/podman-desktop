# Registry Operations

## Navigation

| Target             | Selector                                                           |
| ------------------ | ------------------------------------------------------------------ |
| Settings page      | `nav[aria-label="AppNavigation"] a[aria-label="Settings"]`         |
| Registries section | `nav[aria-label="PreferencesNavigation"] a:has-text("Registries")` |

## Page Structure

### RegistriesPage

```
[role="table"][aria-label="Registries"]
└── [role="row"][aria-label="{registryName}"]
    ├── button[aria-label="kebab menu"]
    ├── [title="Edit password"]
    └── [title="Remove"]
```

## Locators

### RegistriesPage

| Element             | Selector                                                                            |
| ------------------- | ----------------------------------------------------------------------------------- |
| Add registry button | `button:has-text("Add registry")`                                                   |
| Registries table    | `[role="table"][aria-label="Registries"]`                                           |
| Registry row        | `[role="table"][aria-label="Registries"] [role="row"][aria-label="{registryName}"]` |
| Kebab menu          | `[role="row"][aria-label="{registryName}"] button[aria-label="kebab menu"]`         |
| Edit password       | `[role="row"][aria-label="{registryName}"] [title="Edit password"]`                 |
| Remove              | `[role="row"][aria-label="{registryName}"] [title="Remove"]`                        |

### Add Registry Dialog

| Element        | Selector                                                                         |
| -------------- | -------------------------------------------------------------------------------- |
| Dialog         | `[role="dialog"][aria-label="Add Registry"]`                                     |
| URL input      | `[role="dialog"][aria-label="Add Registry"] [placeholder="https://registry.io"]` |
| Username input | `[role="dialog"][aria-label="Add Registry"] [placeholder="username"]`            |
| Password input | `[role="dialog"][aria-label="Add Registry"] [placeholder="Password"]`            |
| Cancel button  | `[role="dialog"][aria-label="Add Registry"] button:has-text("Cancel")`           |
| Add button     | `[role="dialog"][aria-label="Add Registry"] button:has-text("Add")`              |

### Registry Row (edit mode)

| Element        | Selector                                                             |
| -------------- | -------------------------------------------------------------------- |
| Username field | `[role="row"][aria-label="{registryName}"] [aria-label="Username"]`  |
| Password field | `[role="row"][aria-label="{registryName}"] [aria-label^="Password"]` |
| Login button   | `[role="row"][aria-label="{registryName}"] button:has-text("Login")` |

## Operations

### Navigate to Registries

1. Navigate: `click('nav[aria-label="AppNavigation"] a[aria-label="Settings"]')`
2. Wait for settings: `wait('nav[aria-label="PreferencesNavigation"]')`
3. Click Registries: `click('nav[aria-label="PreferencesNavigation"] a:has-text("Registries")')`
4. Wait for table: `wait('[role="table"][aria-label="Registries"]')`

### Add registry

1. Navigate to Registries (steps 1-4)
2. Click Add: `click('button:has-text("Add registry")')`
3. Wait for dialog: `wait('[role="dialog"][aria-label="Add Registry"]')`
4. Fill URL: `fill('[role="dialog"][aria-label="Add Registry"] [placeholder="https://registry.io"]', '{registryUrl}')`
5. Fill username: `fill('[role="dialog"][aria-label="Add Registry"] [placeholder="username"]', '{username}')`
6. Fill password: `fill('[role="dialog"][aria-label="Add Registry"] [placeholder="Password"]', '{password}')`
7. Click Add: `click('[role="dialog"][aria-label="Add Registry"] button:has-text("Add")')`

### Login to registry

1. Navigate to Registries
2. Open kebab menu: `click('[role="row"][aria-label="{registryName}"] button[aria-label="kebab menu"]')`
3. Click Edit password: `click('[role="row"][aria-label="{registryName}"] [title="Edit password"]')`
4. Fill username: `fill('[role="row"][aria-label="{registryName}"] [aria-label="Username"]', '{username}')`
5. Fill password: `fill('[role="row"][aria-label="{registryName}"] [aria-label^="Password"]', '{password}')`
6. Click Login: `click('[role="row"][aria-label="{registryName}"] button:has-text("Login")')`

### Remove registry

1. Navigate to Registries
2. Open kebab menu: `click('[role="row"][aria-label="{registryName}"] button[aria-label="kebab menu"]')`
3. Click Remove: `click('[role="row"][aria-label="{registryName}"] [title="Remove"]')`

## Gotchas

- Registries page is under Settings, not a top-level nav item
- Kebab menu must be clicked to reveal Edit/Remove options
- Default registries (docker.io, quay.io, ghcr.io) are pre-configured and cannot be removed
- Login credentials are stored per-session — they don't persist across app restarts in dev mode
- The Add dialog validates URL format before allowing submission
