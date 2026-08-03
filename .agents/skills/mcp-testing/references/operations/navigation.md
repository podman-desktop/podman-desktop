# Navigation Operations

## Navigation

| Target     | Selector                                                     |
| ---------- | ------------------------------------------------------------ |
| Dashboard  | `nav[aria-label="AppNavigation"] a[aria-label="Dashboard"]`  |
| Containers | `nav[aria-label="AppNavigation"] a[aria-label="Containers"]` |
| Pods       | `nav[aria-label="AppNavigation"] a[aria-label="Pods"]`       |
| Images     | `nav[aria-label="AppNavigation"] a[aria-label="Images"]`     |
| Volumes    | `nav[aria-label="AppNavigation"] a[aria-label="Volumes"]`    |
| Networks   | `nav[aria-label="AppNavigation"] a[aria-label="Networks"]`   |
| Kubernetes | `nav[aria-label="AppNavigation"] a[aria-label="Kubernetes"]` |
| Extensions | `nav[aria-label="AppNavigation"] a[aria-label="Extensions"]` |
| Settings   | `nav[aria-label="AppNavigation"] a[aria-label="Settings"]`   |
| Back       | `button[aria-label="Back (hold for history)"]`               |
| Forward    | `button[aria-label="Forward (hold for history)"]`            |

## Page Structure

### Navigation bar

```
nav[aria-label="AppNavigation"]
├── a[aria-label="{Page}"]         ← sidebar links (Dashboard, Containers, etc.)
button[aria-label="Back (hold for history)"]
button[aria-label="Forward (hold for history)"]
```

### Detail page breadcrumb

```
[role="navigation"][aria-label="Breadcrumb"]
├── a[aria-label="Back"]           ← go to previous page
├── button[aria-label="Close"]     ← go to list page
└── [aria-label="Page Name"]
```

### Dashboard

```
[role="region"][aria-label="Dashboard"]
├── [role="region"][aria-label="header"]
├── [role="region"][aria-label="content"]
│   ├── [role="region"][aria-label="Notifications Box"]
│   └── [role="region"][aria-label="Podman Provider"]
└── [role="region"][aria-label="FeaturedExtensions"]
```

### Status bar

```
[role="contentinfo"][aria-label="Status Bar"]
├── [title="Current Kubernetes context"]
├── button matching /^v\d+\.\d+\.\d+/     ← version
├── [title="Update available"]
├── [title="Share your feedback"]
├── [title="Troubleshooting"]
├── [title="Tasks"]
└── [title="Help"]
```

## Locators

### Welcome page

| Element              | Selector                                         |
| -------------------- | ------------------------------------------------ |
| Welcome message      | text matching `/Welcome to.*Podman Desktop/`     |
| Telemetry checkbox   | `input[aria-label="Enable telemetry"]`           |
| Skip button          | `button:has-text("Skip")` (exact)                |
| Initializing heading | `[role="heading"]:has-text("Initializing...")`   |
| Start onboarding     | `button:has-text("Start onboarding")`            |
| Next step            | `button:has-text("Next Step")`                   |
| Cancel setup         | `button:has-text("Cancel Setup")`                |
| Onboarding status    | `[aria-label="Onboarding Status Message"]`       |
| Skip setup popup     | `[role="dialog"][aria-label="Skip Setup Popup"]` |
| OK (popup)           | popup `button:has-text("OK")`                    |
| Markdown content     | `[aria-label="markdown-content"]`                |

### Dashboard

| Element             | Selector                                                                                |
| ------------------- | --------------------------------------------------------------------------------------- |
| Page heading        | `[role="heading"]:has-text("Dashboard")`                                                |
| Notifications box   | `[role="region"][aria-label="Notifications Box"]`                                       |
| Featured extensions | `[role="region"][aria-label="FeaturedExtensions"]`                                      |
| Podman provider     | `[role="region"][aria-label="Podman Provider"]`                                         |
| Podman status       | `[role="region"][aria-label="Podman Provider"] [aria-label="Connection Status Label"]`  |
| Initialize & start  | `[role="region"][aria-label="Podman Provider"] button:has-text("Initialize and start")` |
| Transitioning state | `[role="region"][aria-label="Podman Provider"] [aria-label="Transitioning State"]`      |

### Status bar

| Element            | Selector                                        |
| ------------------ | ----------------------------------------------- |
| Status bar         | `[role="contentinfo"][aria-label="Status Bar"]` |
| Kubernetes context | `[title="Current Kubernetes context"]`          |
| Version button     | button matching `/^v\d+\.\d+\.\d+/`             |
| Update available   | `[title="Update available"]`                    |
| Feedback           | `[title="Share your feedback"]`                 |
| Troubleshooting    | `[title="Troubleshooting"]`                     |
| Tasks              | `[title="Tasks"]`                               |
| Help               | `[title="Help"]`                                |

## Operations

### Handle welcome page (skip)

1. Check for Skip button: `evaluate('!!Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim() === "Skip")')`
2. Disable telemetry: `evaluate('const t = document.querySelector("input[aria-label=\\"Enable telemetry\\"]"); if (t?.checked) t.click(); "done"')`
3. Click Skip: `click('button:has-text("Skip")')`
4. Wait for dashboard: `wait('[role="heading"]:has-text("Dashboard")')`

### Navigate to a page

1. Click nav link: `click('nav[aria-label="AppNavigation"] a[aria-label="{Page}"]')`
2. Wait for heading: `wait('h1:has-text("{Page}")')`

### Back/forward navigation

1. Go back: `click('button[aria-label="Back (hold for history)"]')`
2. Go forward: `click('button[aria-label="Forward (hold for history)"]')`

### Navigate back from detail page

1. Back link: `click('[role="navigation"][aria-label="Breadcrumb"] a[aria-label="Back"]')` — goes to previous page
2. Close button: `click('[role="navigation"][aria-label="Breadcrumb"] button[aria-label="Close"]')` — goes to list page

### Reset navigation state

1. Clear session: `evaluate('sessionStorage.clear()')`
2. Reload: `evaluate('location.reload()')`
3. Wait: `wait('nav[aria-label="AppNavigation"]')`

## Gotchas

- Clicking the same nav link twice does NOT add a duplicate to the history stack
- Navigating to a new page from the middle of the history stack truncates forward history
- `handleWelcomePage(true)` in POM equals: disable telemetry → click Skip
- Back/Forward buttons are disabled when at the start/end of history — check before clicking
