# Test Requirements: Navigation History & Breadcrumbs

## Issue Information

- **Issue**: [#16678](https://github.com/podman-desktop/podman-desktop/issues/16678)
- **Title**: Gather acceptance criteria and propose a test plan to cover the functionality, include the necessary documentation and update testing sheet
- **Type**: Testing/Documentation
- **Related**:
  - Epic [#15021](https://github.com/podman-desktop/podman-desktop/issues/15021) - Navigation history & breadcrumbs
  - PR [#15600](https://github.com/podman-desktop/podman-desktop/pull/15600) - feat: added button history navigation (MERGED)
  - PR [#15605](https://github.com/podman-desktop/podman-desktop/pull/15605) - feat: added shortcuts to navigation history (MERGED)
  - PR [#15609](https://github.com/podman-desktop/podman-desktop/pull/15609) - feat: added back/forward commands to command palette (MERGED)
  - PR [#15567](https://github.com/podman-desktop/podman-desktop/pull/15567) - feat: added navigation history dropdown when long pressing (OPEN)

## Feature Overview

The Navigation History & Breadcrumbs feature (Epic #15021) introduces browser-style navigation controls to Podman Desktop. Phase 1 implementation includes:

- **Back/forward navigation buttons** in the title bar with browser-style arrows
- **Keyboard shortcuts** for navigation (platform-specific)
- **Mouse/trackpad gestures** for back/forward navigation
- **Command palette integration** for "Go Back" and "Go Forward" commands
- **History management** with 20-entry limit, resets on app restart
- **Hierarchical breadcrumbs** showing current location in app hierarchy

This test requirements document focuses on Phase 1 features that have been merged to main.

**E2E Test Implementation Status**: 17 of 22 test cases have been implemented across two spec files (77% coverage). See Implementation Checklist and Test Coverage Summary sections for details.

## Requirements

### Functional Requirements

1. **Back/Forward Button Navigation**
   - Back button (left arrow) navigates to previous page in navigation history
   - Forward button (right arrow) navigates to next page in navigation history
   - Buttons are positioned in the title bar near search functionality
   - Back button is disabled when at the beginning of history (index = 0)
   - Forward button is disabled when at the end of history (index = stack.length - 1)
   - Buttons show hover state with background color change
   - Button tooltips display: "Back (hold for history)" and "Forward (hold for history)"

2. **Keyboard Shortcuts**
   - **Windows/Linux**: `Alt + Left Arrow` (back), `Alt + Right Arrow` (forward)
   - **macOS**: `Cmd + Left Arrow` or `Cmd + [` (back), `Cmd + Right Arrow` or `Cmd + ]` (forward)
   - Shortcuts should not trigger when focus is in input fields, textareas, or contenteditable elements
   - Shortcuts work globally across the application

3. **Mouse/Trackpad Navigation**
   - **Mouse button 3** (back button) triggers back navigation
   - **Mouse button 4** (forward button) triggers forward navigation
   - **Trackpad horizontal swipe**: deltaX > 30 threshold for forward, deltaX < -30 threshold for back
   - **Swipe cooldown**: 500ms delay between swipe gestures to prevent rapid navigation
   - **Scroll wheel**: Vertical scrolling (deltaY) should NOT trigger navigation

4. **Command Palette Integration**
   - "Go Back" command available in Navigation category
   - "Go Forward" command available in Navigation category
   - Commands accessible via `Cmd/Ctrl + K` then searching for "Go Back" or "Go Forward"
   - Commands execute the same logic as button clicks

5. **History Stack Management**
   - **New navigation**: Truncates forward history when navigating to new page from middle of stack
   - **Duplicate URLs**: Consecutive duplicate URLs are not added to stack
   - **Submenu base routes**: `/kubernetes` handled based on context (see edge cases

### Technical Requirements

1. **State Management**
   - Navigation history stored in reactive Svelte store: `navigationHistory`
   - Stack structure: `{ stack: string[], index: number }`
   - Router subscription monitors navigation and updates stack
   - `isNavigatingHistory` flag prevents circular updates

2. **Router Integration**
   - Uses Tinro router for actual navigation (`router.goto()`)
   - Router subscription detects all navigation events
   - Navigation history logic integrated with router lifecycle

3. **Platform Detection**
   - Detects platform via `window.getOsPlatform()` for conditional keyboard shortcuts
   - macOS: uses metaKey (Cmd)
   - Windows/Linux: uses altKey (Alt)

4. **Event Handling**
   - Global event listeners for keyboard, mouse, and wheel events
   - Event listeners registered in `onMount`, cleaned up on component destruction
   - Prevents default browser behavior for navigation shortcuts

### Edge Cases

1. **Deleted Resources**
   - When navigating back to a deleted container/image/volume details page
   - Expected behavior: Show placeholder page with "This resource no longer exists" message
   - Link to return to list view
   - Test with: Create container → Navigate to details → Delete container → Navigate back

2. **Stopped Podman Machines**
   - When navigating back to details of a stopped Podman machine
   - Expected behavior: Allow navigation (machine resource still exists, just in different state)
   - Details page should show current stopped state

3. **Kubernetes Submenu Routing**
   - **Scenario 1**: No Kubernetes context exists
     - Navigate to `/kubernetes` → Shows empty state page
     - `/kubernetes` SHOULD be added to history (user stays on this page)

   - **Scenario 2**: Kubernetes context exists
     - Navigate to `/kubernetes` → Immediately redirects to `/kubernetes/dashboard`
     - `/kubernetes` SHOULD NOT be added to history (redirect is immediate)
     - Only `/kubernetes/dashboard` added to history

4. **Search Query Preservation**
   - When navigating away from a page with search filters/queries
   - Navigate back using back button
   - Expected: Search queries/filters should be preserved (in Phase 1)

5. **Form State**
   - **Out of scope for Phase 1**: Form state is NOT restored when navigating back
   - Forms will be reset to initial state on back navigation
   - Future consideration for Phase 2+

### Out of Scope (Phase 1)

The following items are explicitly excluded from Phase 1 testing:

1. **History Dropdown Menu** (Phase 2)
   - Long-press on back/forward buttons to show dropdown
   - PR #15567 is still open/in progress

2. **Form State Restoration** (Deferred)
   - Restoring form inputs when navigating back
   - Complex implementation, potential stale data issues

3. **History Persistence** (Not planned)
   - History does NOT persist across app restarts
   - Each app launch starts with empty history

4. **Extension API Integration** (Future)
   - Extensions cannot yet contribute to navigation history
   - No API for extensions to register navigation events

5. **Additional Keyboard Shortcuts** (Phase 2)
   - Custom shortcuts beyond basic back/forward

## Acceptance Criteria

### Feature: Back Button Navigation

**Given** the user has navigated from Dashboard → Containers → Images
**When** the user clicks the back button
**Then** the application navigates to the Containers page
**And** the back button remains enabled (can go back to Dashboard)
**And** the forward button becomes enabled (can go forward to Images)
**And** a `navigation.back` telemetry event is tracked

### Feature: Forward Button Navigation

**Given** the user has navigated Dashboard → Containers → Images → back to Containers
**When** the user clicks the forward button
**Then** the application navigates to the Images page
**And** the forward button becomes disabled (at end of history)
**And** a `navigation.forward` telemetry event is tracked

### Feature: Button Disabled States

**Given** the user has just launched Podman Desktop
**When** the Dashboard page loads
**Then** the back button is disabled (no previous pages)
**And** the forward button is disabled (no forward pages)

**Given** the user is at the end of navigation history
**When** viewing the current page
**Then** the forward button is disabled
**And** the back button is enabled (if history exists)

### Feature: Keyboard Shortcuts (Windows/Linux)

**Given** the user has navigated through multiple pages on Windows or Linux
**When** the user presses `Alt + Left Arrow`
**Then** the application navigates back to the previous page
**And** the same behavior occurs as clicking the back button

**Given** the user is typing in an input field
**When** the user presses `Alt + Left Arrow`
**Then** no navigation occurs (shortcut is blocked in input fields)

### Feature: Keyboard Shortcuts (macOS)

**Given** the user has navigated through multiple pages on macOS
**When** the user presses `Cmd + [` or `Cmd + Left Arrow`
**Then** the application navigates back to the previous page

**When** the user presses `Cmd + ]` or `Cmd + Right Arrow`
**Then** the application navigates forward to the next page

### Feature: Mouse Button Navigation

**Given** the user has navigated through multiple pages
**When** the user clicks mouse button 3 (back button)
**Then** the application navigates to the previous page

**When** the user clicks mouse button 4 (forward button)
**Then** the application navigates to the next page

### Feature: Trackpad Swipe Navigation

**Given** the user has navigated through multiple pages
**When** the user swipes right on the trackpad (deltaX < -30)
**Then** the application navigates back to the previous page
**And** subsequent swipes are blocked for 500ms (cooldown)

**When** the user swipes left on the trackpad (deltaX > 30)
**Then** the application navigates forward to the next page

**When** the user scrolls vertically (deltaY)
**Then** no navigation occurs (only horizontal swipes trigger navigation)

### Feature: Command Palette Integration

**Given** the user has navigated through multiple pages
**When** the user opens the command palette (`Cmd/Ctrl + K`)
**And** searches for "Go Back"
**And** executes the command
**Then** the application navigates to the previous page

**When** the user executes "Go Forward" from command palette
**Then** the application navigates to the next page

### Feature: History Truncation on New Navigation

**Given** the user has navigated A → B → C → D
**When** the user navigates back twice (now at B)
**And** the user navigates to a new page E
**Then** the history stack becomes A → B → E
**And** forward navigation to C or D is no longer possible
**And** the forward button is disabled

### Feature: Duplicate URL Handling

**Given** the user is on the Containers page
**When** the user clicks the Containers navigation link again
**Then** the duplicate URL is not added to history
**And** clicking back navigates to the page before Containers

### Feature: Kubernetes Submenu Routing (No Context)

**Given** no Kubernetes context exists
**When** the user navigates to `/kubernetes`
**Then** the empty Kubernetes state page is shown
**And** `/kubernetes` is added to the history stack
**When** the user clicks back
**Then** the user navigates to the previous page

### Feature: Kubernetes Submenu Routing (With Context)

**Given** a Kubernetes context exists
**When** the user clicks Kubernetes in the navigation
**Then** the application immediately redirects to `/kubernetes/dashboard`
**And** only `/kubernetes/dashboard` is added to history (not `/kubernetes`)
**When** the user clicks back
**Then** the user navigates to the page before clicking Kubernetes (skipping `/kubernetes`)

### Feature: Deleted Resource Handling

**Given** the user has navigated to a container details page
**And** navigated to another page
**And** the container has been deleted
**When** the user clicks back to return to the container details
**Then** a placeholder page is shown indicating "This resource no longer exists"
**And** a link is provided to return to the containers list

## Test Plan

### Scope

**In Scope:**

- Back/forward button navigation
- Keyboard shortcuts (all platform variations)
- Mouse button navigation (button 3/4)
- Trackpad swipe gestures
- Command palette integration
- History stack management (add, truncate, limit)
- Deleted resource handling
- Kubernetes submenu routing edge cases
- Telemetry event tracking
- Platform-specific behavior (Windows, Linux, macOS)

**Out of Scope:**

- History dropdown menu (Phase 2 - PR #15567)
- Form state restoration
- History persistence across app restarts
- Extension API integration
- Custom keyboard shortcuts beyond basic back/forward

### Test Environment

**Prerequisites:**

- Podman Desktop installed and running
- Podman machine started and running
- Test platform: Windows 11, macOS, or Linux (Ubuntu/Fedora)
- Multiple resources created for navigation testing (containers, images, volumes)

**Optional (for specific tests):**

- Kubernetes cluster/context for K8s routing tests
- Mouse with back/forward buttons for hardware navigation tests
- Trackpad for swipe gesture tests

### Test Cases

#### TC-001: Back Button Navigation (@smoke)

**Objective**: Verify back button navigates to the previous page

**Preconditions:**

- Podman Desktop is running
- User is on Dashboard page

**Steps:**

1. Navigate to Containers page via sidebar
2. Navigate to Images page via sidebar
3. Click the back button (left arrow) in title bar

**Expected Results:**

- Application navigates to Containers page
- Back button remains enabled
- Forward button becomes enabled
- Telemetry event `navigation.back` is tracked

**Cleanup:** None required

---

#### TC-002: Forward Button Navigation (@smoke)

**Objective**: Verify forward button navigates to the next page

**Preconditions:**

- Podman Desktop is running
- Navigation history exists: Dashboard → Containers → Images
- User has navigated back to Containers

**Steps:**

1. Click the forward button (right arrow) in title bar

**Expected Results:**

- Application navigates to Images page
- Forward button becomes disabled (at end of history)
- Back button remains enabled
- Telemetry event `navigation.forward` is tracked

**Cleanup:** None required

---

#### TC-003: Button Disabled States (@smoke)

**Objective**: Verify buttons are disabled when navigation is not possible

**Preconditions:**

- Podman Desktop is freshly launched

**Steps:**

1. Observe back and forward button states on Dashboard
2. Navigate to Containers
3. Observe back button state
4. Navigate to Images
5. Observe back button state
6. Observe forward button state

**Expected Results:**

- Initially: Both buttons disabled
- After one navigation: Back enabled, forward disabled
- After multiple navigations: Back enabled, forward disabled
- Both buttons show disabled styling (opacity 30%, no hover effect)

**Cleanup:** None required

---

#### TC-008: Alt+Left navigates back on Windows/Linux

**Objective**: Verify Alt+Left Arrow navigates back on Windows/Linux

**Preconditions:**

- Running on Windows or Linux
- Navigation history exists: Dashboard → Containers → Images

**Steps:**

1. Press `Alt + Left Arrow`
2. Verify navigation
3. Press `Alt + Left Arrow` again

**Expected Results:**

- First press: Navigates to Containers
- Second press: Navigates to Dashboard
- Same behavior as clicking back button
- Telemetry events tracked

**Cleanup:** None required

---

#### TC-009: Alt+Right navigates forward on Windows/Linux

**Objective**: Verify Alt+Right Arrow navigates forward on Windows/Linux

**Preconditions:**

- Running on Windows or Linux
- Navigation history: Dashboard → Containers → Images
- Currently on Containers (navigated back once)

**Steps:**

1. Press `Alt + Right Arrow`

**Expected Results:**

- Navigates forward to Images
- Same behavior as clicking forward button

**Cleanup:** None required

---

#### TC-015: Navigation shortcuts blocked when focus in input field

**Objective**: Verify navigation shortcuts don't trigger when typing

**Preconditions:**

- Running on any platform
- Search input field is visible

**Steps:**

1. Click into a search input field
2. Press `Alt + Left Arrow` (or `Cmd + [` on macOS)
3. Type some text
4. Verify no navigation occurred

**Expected Results:**

- No navigation occurs
- Text input behaves normally
- Cursor position may change but page stays the same

**Cleanup:** None required

---

#### TC-010: Cmd+[ navigates back on macOS

**Objective**: Verify Cmd+[ navigates back on macOS

**Preconditions:**

- Running on macOS
- Navigation history exists: Dashboard → Containers → Images

**Steps:**

1. Press `Cmd + [` (Meta+BracketLeft)
2. Verify navigation to Containers page

**Expected Results:**

- Application navigates back to Containers page
- Same behavior as clicking back button
- Test is skipped on non-macOS platforms

**Cleanup:** None required

---

#### TC-011: Cmd+Arrow navigates on macOS

**Objective**: Verify Cmd+Arrow navigates on macOS

**Preconditions:**

- Running on macOS
- Navigation history exists: Dashboard → Containers → Images

**Steps:**

1. Press `Cmd + Left Arrow` (Meta+ArrowLeft)
2. Verify navigation to Containers
3. Press `Cmd + Right Arrow` (Meta+ArrowRight)
4. Verify navigation to Images

**Expected Results:**

- `Cmd + Left Arrow` navigates back to Containers
- `Cmd + Right Arrow` navigates forward to Images
- Test is skipped on non-macOS platforms

**Cleanup:** None required

---

#### TC-012: Mouse button 3 (back) navigates backward

**Objective**: Verify mouse button 3 navigates back

**Preconditions:**

- Mouse with back button (button 3)
- Navigation history exists: Dashboard → Containers → Images

**Steps:**

1. Simulate mouse button 3 click (back button)
2. Verify navigation to Containers page

**Expected Results:**

- Mouse button 3 navigates back to Containers
- Same behavior as clicking UI back button

**Cleanup:** None required

---

#### TC-013: Trackpad swipe left navigates to previous page

**Objective**: Verify right swipe (deltaX < -30) navigates back

**Preconditions:**

- Device with trackpad
- Navigation history exists: Dashboard → Containers → Images

**Steps:**

1. Simulate trackpad swipe right (wheel event with deltaX: -50)
2. Verify navigation to Containers page

**Expected Results:**

- Trackpad swipe right (deltaX < -30 threshold) navigates back to Containers
- Navigation occurs correctly

**Cleanup:** None required

---

#### TC-014: Trackpad swipe right navigates forward

**Objective**: Verify left swipe (deltaX > 30) navigates forward

**Preconditions:**

- Device with trackpad
- Navigation history: Dashboard → Containers → Images
- User has navigated back (currently on Containers with forward available)

**Steps:**

1. Simulate trackpad swipe left (wheel event with deltaX: 50)
2. Verify navigation to Images page

**Expected Results:**

- Trackpad swipe left (deltaX > 30 threshold) navigates forward to Images
- Navigation occurs correctly

**Cleanup:** None required

---

#### TC-016: Vertical scroll does not trigger navigation

**Objective**: Verify vertical scrolling doesn't trigger navigation

**Preconditions:**

- Device with trackpad
- Navigation history exists: Dashboard → Containers

**Steps:**

1. Simulate vertical scroll (wheel event with deltaY: 100, deltaX: 0)
2. Verify still on Containers page (no navigation occurred)

**Expected Results:**

- Page scrolls normally or stays in place
- No back/forward navigation occurs
- Only horizontal swipes (deltaX) trigger navigation, not vertical (deltaY)

**Cleanup:** None required

---

#### TC-004: Command Palette Go Back (@smoke)

**Objective**: Verify "Go Back" command in command palette

**Preconditions:**

- Navigation history exists: Dashboard → Containers

**Steps:**

1. Press `Cmd/Ctrl + K` to open command palette
2. Type "Go Back"
3. Select and execute the command

**Expected Results:**

- Command palette shows "Go Back" in Navigation category
- Executing command navigates back to Dashboard
- Same behavior as clicking back button

**Cleanup:** None required

---

#### TC-005: Command Palette Go Forward navigates forward

**Objective**: Verify "Go Forward" command in command palette

**Preconditions:**

- Navigation history: Dashboard → Containers → Images
- User has navigated back to Containers (forward history exists)

**Steps:**

1. Press `Cmd/Ctrl + K` to open command palette
2. Type "Go Forward"
3. Select and execute the command

**Expected Results:**

- Command palette shows "Go Forward" in Navigation category
- Executing command navigates forward to Images
- Same behavior as clicking forward button

**Cleanup:** None required

---

#### TC-006: History truncated when navigating to new page from middle of stack (@smoke)

**Objective**: Verify forward history is truncated when navigating to new page from middle of stack

**Preconditions:**

- Navigation history: Dashboard → Containers → Images → Volumes

**Steps:**

1. Click back button twice (now at Containers)
2. Navigate to Pods page via sidebar
3. Verify forward button state

**Expected Results:**

- After navigating to Pods, forward button is disabled
- History is now: Dashboard → Containers → Pods
- Cannot navigate forward to Images or Volumes (forward history truncated)

**Cleanup:** None required

---

#### TC-007: Clicking same navigation link does not add duplicate (@smoke)

**Objective**: Verify duplicate consecutive URLs are not added to history

**Preconditions:**

- Navigation history: Dashboard → Containers

**Steps:**

1. Click Containers link in sidebar again (navigating to same page)
2. Click back button

**Expected Results:**

- Clicking Containers again doesn't add duplicate to stack
- Back button navigates to Dashboard (not to Containers again)
- Duplicate consecutive URLs are prevented

**Cleanup:** None required

---

#### TC-017: Can go to Kubernetes and back, regression check for #15636

**Objective**: Verify navigation to/from Kubernetes works correctly (regression test for issue #15636)

**Preconditions:**

- Kubernetes context configured (Kind/Minikube running)
- User is on Dashboard

**Steps:**

1. Navigate to Kubernetes section
2. Navigate back using back button
3. Verify navigation works correctly

**Expected Results:**

- Navigation to Kubernetes works
- Navigation back works without issues
- No regression of issue #15636

**Status**: SKIPPED - Requires Kubernetes context setup

**Cleanup:** None required

---

#### TC-018: Kubernetes submenu navigation

**Objective**: Verify Kubernetes submenu routing and history behavior

**Preconditions:**

- Kubernetes context may or may not be configured
- User is on Dashboard

**Steps:**

1. Navigate to Kubernetes section
2. Observe routing behavior based on context
3. Navigate back using back button
4. Verify history correctness

**Expected Results:**

- Navigation to Kubernetes works correctly
- History management handles Kubernetes routing appropriately
- Back navigation works as expected

**Status**: SKIPPED - Requires Kubernetes context setup

**Cleanup:** None required

---

#### TC-019: Navigating back to deleted container shows error placeholder

**Objective**: Verify navigation to deleted container shows placeholder/error state

**Preconditions:**

- Container exists (e.g., "nav-history-test-container")

**Steps:**

1. Pull alpine image (ghcr.io/linuxcontainers/alpine)
2. Create and start container from alpine image
3. Navigate to container details page
4. Navigate away to Images page
5. Delete the container
6. Navigate back twice (should go to deleted container page, then to Images)

**Expected Results:**

- Placeholder/empty page is displayed when navigating to deleted container
- No crash or error occurs
- Container details heading is NOT visible
- Container content is NOT visible
- Application shows empty page gracefully

**Cleanup:** Container already deleted

---

#### TC-020: Navigating to stopped Podman machine shows current state

**Objective**: Verify navigation to stopped machine details works correctly

**Preconditions:**

- Podman machine exists and is running
- User has navigated to machine details

**Steps:**

1. Navigate away from machine details
2. Stop the Podman machine
3. Navigate back using back button

**Expected Results:**

- Machine details page loads successfully
- Page shows stopped state
- No error or crash

**Status**: SKIPPED - Complex machine state management required

**Cleanup:** Restart Podman machine

---

#### TC-021: Navigating in the extension webView

**Objective**: Verify navigation history works correctly within extension webViews

**Preconditions:**

- Extension with webView is installed
- User is interacting with extension webView

**Steps:**

1. Navigate within extension webView
2. Use back/forward buttons
3. Verify navigation behavior

**Expected Results:**

- Navigation history works correctly in extension webView context
- Back/forward buttons function appropriately
- No conflicts with main application navigation

**Status**: SKIPPED - Advanced test case requiring extension setup

**Cleanup:** None required

---

#### TC-022: Navigating back from containers details with tty attached, regression #15994

**Objective**: Verify navigation back from container details with TTY attached works correctly (regression test for issue #15994)

**Preconditions:**

- Container with TTY attached exists
- User has navigated to container details with TTY

**Steps:**

1. Create/navigate to container with TTY attached
2. Navigate to container details
3. Navigate away
4. Navigate back using back button

**Expected Results:**

- Navigation back works correctly
- No regression of issue #15994
- TTY attachment doesn't interfere with navigation

**Status**: SKIPPED - Pending bug fix resolution

**Cleanup:** Remove test container

---

## Tests Overview

**Priority smoke tests:**

- TC-001: Back button navigation
- TC-002: Forward button navigation
- TC-003: Button disabled states
- TC-004: Command palette Go Back
- TC-005: Command palette Go Forward
- TC-006: History truncation
- TC-007: Duplicate URL handling

**Platform coverage:**

- Windows: TC-008, TC-009, TC-015 (Alt+Left, Alt+Right, shortcuts blocked in input)
- macOS: TC-010, TC-011, TC-015 (Cmd+[, Cmd+Arrow, shortcuts blocked in input)
- Linux: TC-008, TC-009, TC-015 (Alt+Left, Alt+Right, shortcuts blocked in input)
- All platforms: TC-012, TC-013, TC-014, TC-016 (Mouse, trackpad gestures, vertical scroll)

#### Smoke Tests (navigation-history-smoke.spec.ts)

- **7 test cases** (TC-001 through TC-007)
- All tests passing and tagged with `@smoke`
- Cover: Back/forward buttons, command palette, history truncation, duplicate URL handling

#### Comprehensive Tests (navigation-history.spec.ts)

- **15 test cases** (TC-008 through TC-022)
- **10 active tests** passing and tagged with `@smoke`
- **5 skipped tests** (require K8s setup, machine state management, or pending bug fixes)
- Cover: Keyboard shortcuts, mouse/trackpad navigation, input field protection, edge cases

#### Test Coverage by Feature

| Feature                            | Coverage | Test Cases             |
| ---------------------------------- | -------- | ---------------------- |
| Back/Forward Buttons               | Complete | TC-001, TC-002, TC-003 |
| Command Palette                    | Complete | TC-004, TC-005         |
| History Management                 | Complete | TC-006, TC-007         |
| Keyboard Shortcuts (Windows/Linux) | Complete | TC-008, TC-009         |
| Keyboard Shortcuts (macOS)         | Complete | TC-010, TC-011         |
| Mouse Navigation                   | Complete | TC-012                 |
| Trackpad Gestures                  | Complete | TC-013, TC-014, TC-016 |
| Input Field Protection             | Complete | TC-015                 |
| Deleted Resource Handling          | Complete | TC-019                 |
| Kubernetes Routing                 | Pending  | TC-017, TC-018         |
| Stopped Machine State              | Pending  | TC-020                 |
