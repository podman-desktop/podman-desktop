# Compose Operations

## Navigation

| Target          | Selector                                                          |
| --------------- | ----------------------------------------------------------------- |
| Extensions page | `nav[aria-label="AppNavigation"] a[aria-label="Extensions"]`      |
| Settings page   | `nav[aria-label="AppNavigation"] a[aria-label="Settings"]`        |
| CLI Tools       | `nav[aria-label="PreferencesNavigation"] a:has-text("CLI Tools")` |

## Page Structure

### OnboardingPage (shared pattern)

```
[role="region"][aria-label="Onboarding Body"]
├── [aria-label="Onboarding Component"]
├── [aria-label="Onboarding Status Message"]
├── button:has-text("Next Step")
├── button:has-text("Cancel Setup")
└── button:has-text("Skip this entire setup")
```

### CLIToolsPage

```
[role="region"][aria-label="CLI Tools"]
├── [role="heading"]:has-text("CLI Tools")
└── [role="table"][aria-label="cli-tools"]
    └── [role="row"][aria-label="{toolName}"]
        ├── [aria-label="cli-version"]
        ├── [aria-label="Install"]
        └── [aria-label="Uninstall"]
```

## Locators

### OnboardingPage

| Element              | Selector                                        |
| -------------------- | ----------------------------------------------- |
| Body region          | `[role="region"][aria-label="Onboarding Body"]` |
| Skip entire setup    | `button:has-text("Skip this entire setup")`     |
| Onboarding component | `[aria-label="Onboarding Component"]`           |
| Status message       | `[aria-label="Onboarding Status Message"]`      |
| Next step            | `button:has-text("Next Step")`                  |
| Cancel setup         | `button:has-text("Cancel Setup")`               |

### CLIToolsPage

| Element          | Selector                                                                       |
| ---------------- | ------------------------------------------------------------------------------ |
| Main region      | `[role="region"][aria-label="CLI Tools"]`                                      |
| Heading          | `[role="heading"]:has-text("CLI Tools")`                                       |
| Tools table      | `[role="table"][aria-label="cli-tools"]`                                       |
| Tool row         | `[role="table"][aria-label="cli-tools"] [role="row"][aria-label="{toolName}"]` |
| Install button   | `[role="row"][aria-label="{toolName}"] [aria-label="Install"]`                 |
| Uninstall button | `[role="row"][aria-label="{toolName}"] [aria-label="Uninstall"]`               |
| Version label    | `[role="row"][aria-label="{toolName}"] [aria-label="cli-version"]`             |
| No version       | `[role="row"][aria-label="{toolName}"] [aria-label="no-cli-version"]`          |
| Version dialog   | `[role="dialog"][aria-label="drop-down-dialog"]`                               |
| Version input    | `[role="dialog"][aria-label="drop-down-dialog"] [role="textbox"]`              |

## Operations

### Run Compose onboarding

1. Navigate to Extensions page
2. Find Compose extension and open its details
3. Start onboarding from extension's onboarding tab
4. Wait for onboarding: `wait('[role="region"][aria-label="Onboarding Body"]')`
5. Click Next Step: `click('button:has-text("Next Step")')`
6. Repeat Next Step for each onboarding screen
7. Check status: `getText('[aria-label="Onboarding Status Message"]')`

### Skip Compose onboarding

1. Start onboarding (steps 1-4)
2. Click Skip: `click('button:has-text("Skip this entire setup")')`

### Cancel onboarding

1. Start onboarding (steps 1-4)
2. Click Cancel: `click('button:has-text("Cancel Setup")')`

### Navigate to CLI Tools

1. Navigate: `click('nav[aria-label="AppNavigation"] a[aria-label="Settings"]')`
2. Wait for settings: `wait('nav[aria-label="PreferencesNavigation"]')`
3. Click CLI Tools: `click('nav[aria-label="PreferencesNavigation"] a:has-text("CLI Tools")')`
4. Wait for page: `wait('[role="heading"]:has-text("CLI Tools")')`

### Install CLI tool

1. Navigate to CLI Tools (steps 1-4)
2. Click Install: `click('[role="row"][aria-label="{toolName}"] [aria-label="Install"]')`
3. Check for version dialog: `evaluate('!!document.querySelector(\'[role="dialog"][aria-label="drop-down-dialog"]\')')` — returns `true` if multiple versions are available
4. If dialog appeared, select version and confirm
5. Wait for install: check version label appears

### Uninstall CLI tool

1. Navigate to CLI Tools
2. Click Uninstall: `click('[role="row"][aria-label="{toolName}"] [aria-label="Uninstall"]')`

### Check CLI tool version

```
getText('[role="row"][aria-label="{toolName}"] [aria-label="cli-version"]')
```

### Check if CLI tool is installed

```
evaluate('!!document.querySelector(\'[role="row"][aria-label="{toolName}"] [aria-label="cli-version"]\')')
```

## Gotchas

- Onboarding is a shared pattern used by Compose, Podman, and other extensions
- The onboarding wizard is multi-step — each "Next Step" advances to the next screen
- CLI Tools page is under Settings > CLI Tools, not a standalone page
- Version dialog appears when multiple versions are available for installation
- Tool names in the CLI tools table vary — use the exact display name
- Compose onboarding may require Docker Compose binary to be available on PATH
