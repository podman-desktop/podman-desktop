# AGENTS.md

This file provides **Podman Desktop-specific** guidance for E2E test automation in the `tests/playwright` directory.

> **For general Playwright patterns, best practices, and examples**, always refer to the [`playwright-testing` skill](../../.agents/skills/playwright-testing/SKILL.md) first. This document only covers what's **unique to Podman Desktop**.

## AI Agent Quick Reference

**When implementing Playwright tests for Podman Desktop:**

1. **Start with the skill**: [`playwright-testing`](../../.agents/skills/playwright-testing/SKILL.md) → [examples](../../.agents/skills/playwright-testing/examples.md) → [reference](../../.agents/skills/playwright-testing/reference.md)
2. **Apply PD-specific patterns** documented below
3. **Check existing tests** in [src/specs/](src/specs/) for reference

## Overview

- **Framework:** Playwright with Electron support (experimental)
- **Language:** TypeScript 5.9+ (strict mode)
- **Package:** `@podman-desktop/tests-playwright` (published to npm)
- **Architecture:** Electron app testing with custom fixtures

## Project Structure

```
tests/playwright/
├── src/
│   ├── specs/              # Test files (.spec.ts)
│   ├── special-specs/      # Special suites (installation, stress, etc.)
│   ├── model/
│   │   ├── pages/         # Page Object Models
│   │   ├── workbench/     # Navigation, StatusBar
│   │   ├── core/          # States, types, operations
│   │   └── components/    # Reusable UI components
│   ├── utility/           # Fixtures, operations, wait helpers
│   ├── runner/            # Electron app launcher
│   └── setupFiles/        # Global setup
├── resources/             # Test data (Containerfiles, YAML, etc.)
└── output/               # Traces, videos, reports (gitignored)
```

## Quick Commands

```bash
# From repository root
pnpm test:e2e              # Build + run E2E tests (excludes @k8s_e2e)
pnpm test:e2e:smoke        # Build + run smoke tests
pnpm test:e2e:k8s          # Build + run Kubernetes tests

# Build once, run multiple times (when codebase unchanged)
pnpm test:e2e:build        # Build test package
pnpm test:e2e:run          # Run tests without rebuild
pnpm test:e2e:smoke:run    # Run smoke tests without rebuild
pnpm test:e2e:k8s:run      # Run K8s tests without rebuild

# Development
pnpm exec playwright test tests/playwright/src/specs/volume-smoke.spec.ts --ui
pnpm exec playwright show-report tests/playwright/output/html-results
```

> **Tip:** After running `test:e2e:build` once, use the `:run` variants (e.g., `test:e2e:smoke:run`) to skip rebuilding if no code changes were made. This significantly speeds up iteration.

## Podman Desktop-Specific Patterns

### 1. Custom Fixtures

**Always use these fixtures** from [src/utility/fixtures.ts](src/utility/fixtures.ts):

```typescript
import { expect as playExpect, test } from '/@/utility/fixtures';
// NOT: import { expect, test } from '@playwright/test';

test('My test', async ({ runner, navigationBar, welcomePage, statusBar, page }) => {
  // runner: Electron app launcher
  // navigationBar: App navigation (openContainers, openImages, etc.)
  // welcomePage: Welcome page handler
  // statusBar: Status bar interactions
  // page: Main Playwright Page
});
```

### 2. Test Setup Pattern

**Standard test setup:**

```typescript
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('my-feature-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page); // If Podman machine needed
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});
```

### 3. Polling for Async State

Use `playExpect.poll()` for checking async operations:

```typescript
await playExpect
  .poll(async () => await volumesPage.waitForVolumeExists(volumeName), {
    timeout: 25_000,
  })
  .toBeTruthy();
```

### 4. Platform-Specific Tests

```typescript
import { isWindows } from '/@/utility/platform';

test('Linux/Mac only', async ({ navigationBar }) => {
  test.skip(!!isWindows, 'Skipped on Windows');
  // test implementation
});
```

### 5. Test Tags

```typescript
test.describe.serial('Feature', { tag: ['@smoke', '@windows_sanity'] }, () => {
  // tests
});
```

**Available tags:**

- `@smoke` - Core smoke tests
- `@windows_sanity` - Windows sanity check tests
- `@macos_sanity` - Mac OS sanity check tests
- `@k8s_e2e` - Kubernetes tests
- `@k8s_sanity` - Kubernetes sanity check tests
- `@pdmachine` - Podman machine tests
- `@update-install` - Update installation tests
- `@managed-configuration` - Managed configuration tests
- `@podman-remote` - Remote podman tests
- `@ui-stress` - Non functional UI stress tests

### 6. File Naming Convention

- Smoke tests: `[feature]-smoke.spec.ts`
- Feature tests: `[feature].spec.ts`
- Special: `special-specs/[category]/[feature].spec.ts`

## Test Execution Modes

### Development Mode

```bash
pnpm test:e2e  # Uses electron from node_modules
```

### Production Mode

```bash
pnpm compile:current
PODMAN_DESKTOP_BINARY="/path/to/dist/linux-unpacked/podman-desktop" pnpm test:e2e
```

### External Repository

```bash
export PODMAN_DESKTOP_ARGS="/path/to/podman-desktop"
pnpm test:e2e
```

## Essential Podman Desktop Utilities

**Key utility modules:**

- [src/utility/operations.ts](src/utility/operations.ts) - Container/image/volume operations (`deleteContainer`, `deleteImage`, etc.)
- [src/utility/wait.ts](src/utility/wait.ts) - Wait helpers (`waitForPodmanMachineStartup`, polling utilities)
- [src/utility/cleanup.ts](src/utility/cleanup.ts) - Resource cleanup functions
- [src/utility/platform.ts](src/utility/platform.ts) - Platform detection (`isWindows`, `isMac`, `isLinux`)
- [src/utility/kubernetes.ts](src/utility/kubernetes.ts) - Kubernetes helpers

**Key models:**

- [src/model/core/states.ts](src/model/core/states.ts) - Container/Pod/Volume states
- [src/model/core/types.ts](src/model/core/types.ts) - Type definitions

## Configuration Files

**Root project files:**

- [package.json](../../package.json) - All E2E test scripts (see scripts whose names start with `test:e2e:`)
- [playwright.config.ts](../../playwright.config.ts) - Output dir, timeout (90s), reporters, single worker

**CI workflows:**

- [.github/workflows/e2e-main.yaml](../../.github/workflows/e2e-main.yaml) - Main E2E workflow
- [.github/workflows/e2e-kubernetes-main.yaml](../../.github/workflows/e2e-kubernetes-main.yaml) - K8s tests
- [.github/workflows/pr-check.yaml](../../.github/workflows/pr-check.yaml) - PR validation

## CI Artifacts & Debugging

**Artifacts uploaded on CI failure:**

- Traces (`.zip`) - `pnpm exec playwright show-trace <file.zip>`
- Videos (`.webm`) - Screen recordings
- Screenshots - Embedded in HTML report
- HTML reports - `pnpm exec playwright show-report <path>`

**Download from GitHub:**

1. Navigate to failed workflow run
2. Download `e2e-tests` or `k8s-e2e-tests` artifact
3. Extract and view traces/reports locally

For detailed debugging techniques, see [skill debugging section](../../.agents/skills/playwright-testing/SKILL.md#debugging-tests).

## Fast Iteration Tips

**Run single test:**

```bash
pnpm exec playwright test tests/playwright/src/specs/volume-smoke.spec.ts --ui
```

**Filter by pattern:**

```bash
pnpm exec playwright test tests/playwright/src/specs/ --grep volume
pnpm test:e2e:smoke  # Runs @smoke tagged tests
```

**Temporarily modify package.json** npm script target `test:e2e:smoke:run` for repeated runs:

```json
"test:e2e:smoke:run": "... npx playwright test tests/playwright/src/specs/volume-smoke.spec.ts"
```

Then: `pnpm test:e2e:smoke:run` if you have run `test:e2e:build` before (Remember to revert!)

For more debugging methods, see [skill debugging section](../../.agents/skills/playwright-testing/SKILL.md#debugging-tests).

## Example: Podman Desktop Test

> See [skill examples](../../.agents/skills/playwright-testing/examples.md) for general patterns. This shows PD-specific usage.

```typescript
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const volumeName = 'test-volume';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('volume-example-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, navigationBar }) => {
  try {
    const volumesPage = await navigationBar.openVolumes();
    if (await volumesPage.waitForVolumeExists(volumeName)) {
      await volumesPage.deleteVolume(volumeName);
    }
  } finally {
    await runner.close();
  }
});

test.describe.serial('Volume operations', { tag: ['@smoke'] }, () => {
  test('Create and verify volume', async ({ navigationBar }) => {
    const volumesPage = await navigationBar.openVolumes();
    await playExpect(volumesPage.heading).toBeVisible();

    const createVolumePage = await volumesPage.openCreateVolumePage(volumeName);
    await createVolumePage.createVolume(volumeName);

    await playExpect
      .poll(async () => await volumesPage.waitForVolumeExists(volumeName), {
        timeout: 25_000,
      })
      .toBeTruthy();
  });
});
```

## AI Agent Skills for E2E Testing

The repository provides specialized AI skills in [.agents/skills/](../../.agents/skills/) for different E2E testing workflows. These skills work together to support the complete testing lifecycle.

### Available Skills

#### 1. [playwright-testing](../../.agents/skills/playwright-testing/SKILL.md)

**Purpose:** Write, update, and maintain Playwright E2E tests for Podman Desktop

**Use when:**

- Creating new test spec files
- Building or modifying page objects
- Debugging test failures
- Adding smoke tests
- Understanding the test framework

**Provides:**

- Electron runner and custom fixtures guidance
- Page Object Model (POM) patterns and hierarchy
- Test file structure and best practices
- Locator strategies and wait utilities
- RunnerOptions configuration

**Example prompts:**

- "Create an E2E test for the new navigation feature"
- "Add a page object for the settings dialog"
- "Fix this failing test"
- "How do I use custom fixtures?"

#### 2. [playwright-trace-analysis](../../.agents/skills/playwright-trace-analysis/SKILL.md)

**Purpose:** Analyze Playwright trace files to diagnose test failures and flaky behavior

**Use when:**

- A test failed and you have a `trace.zip` file
- Investigating flaky tests
- Need root cause analysis from CI artifacts
- Comparing passing vs failing traces

**Provides:**

- Step-by-step failure investigation
- Root cause identification with evidence
- Flakiness detection
- Timeline and screenshot analysis
- Manual trace parsing when needed

**Outputs:** Structured failure report with:

- Failure summary
- Event timeline with step references
- Evidence citations (screenshots, network logs, console errors)
- Root cause (Confirmed/Likely/Unknown)
- Recommended fix with file:line references

**Example prompts:**

- "Analyze this trace.zip file"
- "Why did this test fail?"
- "Is this failure flaky or deterministic?"
- "Compare these two traces"

#### 3. [investigate-gh-run](../../.agents/skills/investigate-gh-run/SKILL.md)

**Purpose:** Deep investigation of CI/CD test failures from GitHub Actions runs

**Use when:**

- Tests failed in CI and you need to understand why
- Investigating patterns across multiple CI runs
- Need to download and analyze CI artifacts
- Performing regression analysis

**Provides:**

- Automated artifact download and analysis
- Run history pattern detection (isolated, chronic, regression)
- Trace analysis delegation
- Commit correlation for regressions
- Platform-specific failure patterns

**Workflow:**

1. Gathers run data (logs, artifacts, history) in parallel
2. Classifies failure type (infra, build error, UI/test failure)
3. Downloads relevant artifacts
4. Delegates to trace-analysis if needed
5. Produces comprehensive failure report

**Example prompts:**

- "Investigate this CI run: https://github.com/owner/repo/actions/runs/12345"
- "Why did E2E tests fail on this PR?"
- "Analyze GitHub Actions run #12345"

### Skills Workflow Integration

These skills work together in the complete E2E testing lifecycle:

```
Implementation → Execution → Investigation → Fix
       ↓             ↓            ↓           ↓
      [1]           CI          [3]         [1]
                     ↓            ↓
               (if fails)      [2]
```

1. **playwright-testing** - Implement tests following POM patterns
2. CI execution (GitHub Actions)
3. **investigate-gh-run** - Analyze CI failure, download artifacts (if tests fail)
4. **playwright-trace-analysis** - Diagnose root cause from traces
5. **playwright-testing** - Fix test or identify app bug

### Quick Skill Selection Guide

| Scenario                               | Use This Skill              |
| -------------------------------------- | --------------------------- |
| Writing or modifying test code         | `playwright-testing`        |
| Test failed in CI, need to investigate | `investigate-gh-run`        |
| Have trace.zip, need diagnosis         | `playwright-trace-analysis` |
| Understanding why test is flaky        | `playwright-trace-analysis` |
| Comparing passing vs failing traces    | `playwright-trace-analysis` |
| Creating page objects                  | `playwright-testing`        |
| Understanding test framework patterns  | `playwright-testing`        |

## Resources

### For AI Agents

- **[AI Skills](../../.agents/skills/)** - Specialized skills for E2E testing workflows
  - [`playwright-testing`](../../.agents/skills/playwright-testing/SKILL.md) - Core patterns (POM, locators, assertions, waits)
  - [`playwright-trace-analysis`](../../.agents/skills/playwright-trace-analysis/SKILL.md) - Trace analysis and failure diagnosis
  - [`investigate-gh-run`](../../.agents/skills/investigate-gh-run/SKILL.md) - CI/CD failure investigation
- **[Reference docs](../../.agents/skills/playwright-testing/reference.md)** - Advanced features (fixtures, network mocking, etc.)
- **[Examples](../../.agents/skills/playwright-testing/examples.md)** - Complete test examples

### Project Documentation

- [README.md](README.md) - Comprehensive test framework guide
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contributing guidelines
- [Playwright docs](https://playwright.dev/) - Official documentation

## Package Distribution

Published as `@podman-desktop/tests-playwright` to npm. Public API: [src/index.ts](src/index.ts).

See [README.md](README.md) for external usage documentation.
