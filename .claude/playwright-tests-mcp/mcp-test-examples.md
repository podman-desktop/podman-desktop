# MCP Test Command Examples

Ready-to-use MCP command examples for testing Podman Desktop. Copy these into Claude conversations for quick testing.

## Connection Examples

### Connect to Development Server (CDP Port 9223)

```
Connect to Podman Desktop using CDP at http://localhost:9223
```

**Prerequisites:** Running `pnpm watch` in another terminal.

### Connect to Standalone Instance (CDP Port 9222)

```
Connect to Podman Desktop using CDP at http://localhost:9222
```

**Prerequisites:** Running `bash .claude/playwright-tests-mcp/start-with-cdp.sh` in another terminal.

### Launch Production Binary

```
Launch Podman Desktop from the compiled binary at dist/linux-unpacked/podman-desktop
```

**Prerequisites:** Binary compiled with `pnpm compile:current`.

## Navigation Workflows

### Navigate to Settings Page

```
Navigate to the Settings page in Podman Desktop
```

**Expected:** Settings page loads, showing Preferences, Resources, etc.

### Navigate to Containers View

```
Click on the Containers link in the navigation sidebar
```

**Expected:** Containers view loads, showing list of containers (if any).

### Open Dashboard

```
Navigate to the Dashboard page
```

**Expected:** Dashboard loads, showing provider status and quick actions.

### Access Extensions Panel

```
Navigate to the Extensions page
```

**Expected:** Extensions page loads, showing installed and available extensions.

### Navigate to Kubernetes Resources

```
Go to the Pods page
```

**Expected:** Pods view loads (if Kubernetes is enabled).

## Form Interaction

### Fill Configuration Form

```
Navigate to Settings > Preferences, toggle the "Enable experimental features" checkbox, and verify it's enabled
```

**Expected:** Checkbox state changes, setting is saved.

### Submit Search Query

```
Navigate to Containers, fill in the search box with "nginx", and press Enter
```

**Expected:** Container list filters to show only containers matching "nginx".

### Toggle Settings

```
Go to Settings > Resources and toggle the "Auto-start Podman" switch
```

**Expected:** Setting toggles, auto-start configuration changes.

### Create Container Form

```
Navigate to Images, find the nginx image, click "Run Image", fill in container name as "test-nginx", and start the container
```

**Expected:** Container creation form appears, fields are filled, container starts.

## Element Inspection

### Get Text Content from Elements

```
What is the text of the main heading on the Dashboard page?
```

**Expected:** Returns heading text (e.g., "Dashboard").

### Check Visibility of UI Components

```
Navigate to Settings and check if the "Kubernetes" tab is visible
```

**Expected:** Returns true/false based on visibility.

### Count Elements (Container List)

```
Navigate to Containers and count how many container cards are displayed
```

**Expected:** Returns count of container elements in the list.

### Get Element Attributes

```
Get the data-testid attribute of the Settings navigation button
```

**Expected:** Returns the test ID value (e.g., "settings-nav-button").

### Check Button State

```
Navigate to Dashboard, find the Podman provider, and check if the "Start" button is enabled
```

**Expected:** Returns button enabled state.

## Screenshot & Debugging

### Capture Full-Page Screenshot

```
Take a screenshot of the current page and save it
```

**Expected:** Screenshot captured and saved to file.

### Take Element-Specific Screenshot

```
Navigate to Containers, take a screenshot of just the container list section
```

**Expected:** Screenshot of container list area only.

### Get Accessibility Snapshot

```
Get an accessibility snapshot of the Settings page to see the element tree
```

**Expected:** Returns accessibility tree structure showing headings, buttons, inputs, etc.

### Capture Error State

```
Navigate to Extensions, try to install a non-existent extension, and take a screenshot of the error message
```

**Expected:** Screenshot showing error state.

## Advanced Scenarios

### Complete Container Creation Workflow

```
1. Navigate to Images page
2. Search for "redis" image
3. Click "Pull Image" if not already available
4. Wait for pull to complete
5. Find the redis image and click "Run Image"
6. Fill in container name as "test-redis"
7. Set port mapping from 6379 to 6379
8. Click "Start Container"
9. Navigate to Containers and verify "test-redis" is running
10. Take a screenshot of the running container
```

**Expected:** Complete workflow from image pull to running container with verification.

### Test Extension Installation Flow

```
1. Navigate to Extensions page
2. Get a snapshot to see available extensions
3. Find the "Docker" extension
4. Click "Install" if not already installed
5. Wait for installation to complete
6. Verify the extension appears in the installed list
7. Take a screenshot
```

**Expected:** Extension installs successfully and appears in installed list.

### Verify Provider Status Changes

```
1. Navigate to Dashboard
2. Find the Podman provider card
3. Check current status (should be "Running" or "Stopped")
4. If running, click "Stop"; if stopped, click "Start"
5. Wait 5 seconds for status change
6. Verify the status changed
7. Take a screenshot of the new status
```

**Expected:** Provider status changes as expected.

### Test Multi-Step Settings Changes

```
1. Navigate to Settings > Preferences
2. Get current value of "Enable experimental features"
3. Toggle the checkbox
4. Click "Save" or wait for auto-save
5. Navigate away to Dashboard
6. Return to Settings > Preferences
7. Verify the setting persisted
```

**Expected:** Setting changes persist across navigation.

### Container Lifecycle Test

```
1. Navigate to Containers
2. Create a new container from nginx image named "lifecycle-test"
3. Verify it starts successfully
4. Stop the container
5. Restart the container
6. Delete the container
7. Verify it's removed from the list
```

**Expected:** Full container lifecycle from creation to deletion.

### Kubernetes Context Switch

```
1. Navigate to Settings > Kubernetes
2. Get list of available contexts
3. Select a different context
4. Apply the change
5. Navigate to Pods
6. Verify pods from new context are displayed
```

**Expected:** Kubernetes context switches, pods update.

### Image Pull and Inspect

```
1. Navigate to Images
2. Click "Pull Image" button
3. Enter image name "alpine:latest"
4. Click "Pull"
5. Wait for pull to complete
6. Find the alpine image in the list
7. Click on it to view details
8. Verify image size and tags are displayed
```

**Expected:** Image pulls successfully, details are visible.

### Volume Creation and Mounting

```
1. Navigate to Volumes
2. Click "Create Volume"
3. Enter volume name "test-volume"
4. Create the volume
5. Navigate to Containers
6. Create a new container with the volume mounted
7. Verify volume is attached
```

**Expected:** Volume created and successfully mounted to container.

### Extension Settings Configuration

```
1. Navigate to Extensions
2. Find the Podman extension
3. Click on settings/configuration
4. Modify a setting (e.g., socket path)
5. Save changes
6. Verify setting is applied
```

**Expected:** Extension settings update successfully.

### Provider Installation Check

```
1. Navigate to Dashboard
2. Check all provider cards
3. For each provider, verify:
   - Name is displayed
   - Status is shown (Running/Stopped/Not Installed)
   - Version information if available
4. Take a screenshot of provider overview
```

**Expected:** All providers display correct status and information.

## Debugging Scenarios

### Investigate Slow Page Load

```
1. Navigate to Containers page
2. Take a screenshot immediately
3. Wait 2 seconds
4. Take another screenshot
5. Compare to identify lazy-loading elements
```

**Expected:** Identifies elements that load asynchronously.

### Check Console Errors

```
1. Navigate to Settings
2. Get accessibility snapshot
3. Look for error indicators or warning icons
4. Click on any error to expand details
```

**Expected:** Identifies UI-visible errors or warnings.

### Verify Responsive Layout

```
1. Navigate to Dashboard
2. Take full-page screenshot
3. Get window size
4. Verify main sections are visible
```

**Expected:** Confirms layout renders correctly at current size.

### Test Keyboard Navigation

```
1. Navigate to Settings
2. Press Tab key 5 times
3. Take screenshot showing focus state
4. Verify focus is visible and logical
```

**Expected:** Focus indicators are visible and follow logical tab order.

## Continuous Testing Workflows

### Daily Smoke Test

```
Run this daily to verify core functionality:

1. Connect to running Podman Desktop
2. Navigate to Dashboard - verify it loads
3. Navigate to Containers - count containers
4. Navigate to Images - count images
5. Navigate to Extensions - verify Podman extension is loaded
6. Navigate to Settings - verify Preferences tab is accessible
7. Take screenshot of Dashboard
8. Disconnect
```

**Expected:** All pages load without errors.

### Pre-Release Verification

```
Before releasing a new version:

1. Compile production binary: pnpm compile:current
2. Launch with CDP: bash .claude/playwright-tests-mcp/start-with-cdp.sh
3. Connect via MCP
4. Run complete container lifecycle test
5. Test extension installation/removal
6. Verify all settings pages load
7. Test provider start/stop
8. Capture screenshots of key pages
9. Verify no console errors
```

**Expected:** All critical workflows function correctly in production build.

### Regression Testing After Changes

```
After making code changes:

1. Start development mode: pnpm watch
2. Connect via MCP to port 9223
3. Navigate to affected page/feature
4. Test the specific functionality changed
5. Test related functionality for regressions
6. Verify no new errors appear
7. Take before/after screenshots if UI changed
```

**Expected:** Changes work as intended, no regressions introduced.

## Tips for Effective Testing

### Start Every Session With:

```
Connect to Podman Desktop and get an accessibility snapshot of the current page
```

This gives you context about what's visible and available.

### Use Test IDs When Available:

```
Click the button with data-testid="create-container-button"
```

More reliable than text or CSS selectors.

### Wait for Dynamic Content:

```
Navigate to Containers, wait 3 seconds for the list to load, then count the containers
```

Prevents race conditions with async operations.

### Chain Related Actions:

```
Navigate to Images, pull alpine:latest, wait for completion, then run a container from it named "test-alpine"
```

Tests complete workflows in single conversation.

### Verify After Actions:

```
Create a container named "test", then navigate to Containers and verify "test" appears in the list
```

Always confirm actions succeeded.

## Common Selectors Reference

Based on Podman Desktop's codebase patterns:

### Navigation

- Dashboard: `[data-testid="dashboard-nav"]` or `text="Dashboard"`
- Containers: `[data-testid="containers-nav"]` or `text="Containers"`
- Images: `[data-testid="images-nav"]` or `text="Images"`
- Pods: `[data-testid="pods-nav"]` or `text="Pods"`
- Volumes: `[data-testid="volumes-nav"]` or `text="Volumes"`
- Settings: `[data-testid="settings-nav"]` or `text="Settings"`
- Extensions: `[data-testid="extensions-nav"]` or `text="Extensions"`

### Buttons

- Create: `role=button[name="Create"]`
- Start: `role=button[name="Start"]`
- Stop: `role=button[name="Stop"]`
- Delete: `role=button[name="Delete"]`
- Pull Image: `role=button[name="Pull Image"]`

### Forms

- Search box: `role=searchbox` or `[placeholder="Search"]`
- Text input: `role=textbox`
- Checkbox: `role=checkbox`
- Select dropdown: `role=combobox`

### Common Patterns

- Provider cards: `[data-testid*="provider-card"]`
- Container cards: `[data-testid*="container-card"]`
- Image rows: `[data-testid*="image-row"]`
- Extension cards: `[data-testid*="extension-card"]`

**Note:** Always verify selectors with `snapshot()` as they may vary by version.
