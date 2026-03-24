# Playwright Trace Analysis — Reference

## Agent behavior

If the user already supplied a usable `trace.zip` path or attached artifact, begin analysis immediately.

Ask a follow-up question only when:

- No trace path or artifact was provided
- The path cannot be resolved
- Multiple candidate trace archives exist and the target is unclear

Do not block the first pass on optional context like test name, CI logs, or expected behavior.

## Path handling

- Prefer absolute paths when calling MCP tools
- Resolve workspace-relative paths before the call
- If the user provides a directory, locate the relevant `trace.zip` inside it
- If more than one matching archive is present, ask one targeted clarification instead of guessing

## Trace archive layout

A `trace.zip` typically contains (layout varies by Playwright version):

| File/directory  | Contents                                                             |
| --------------- | -------------------------------------------------------------------- |
| `trace.trace`   | Newline-delimited JSON — actions, events, console logs, snapshots    |
| `trace.network` | Newline-delimited JSON — HAR-like network request/response data      |
| `resources/`    | Screenshots (JPEG), snapshot HTML, and media referenced by the trace |

When MCP tools can parse the trace, use them. When they cannot (common with manually-created traces — see below), parse the files directly using the format specification in this section.

## Manually-created vs automatic traces

Playwright supports two trace creation modes:

1. **Automatic** (per-test): configured via `playwright.config.ts` with `trace: 'on'` or `trace: 'retain-on-failure'`. Playwright creates one trace per test with rich metadata (test name, step annotations, source locations). MCP tools are designed for this format.

2. **Manual** (API-driven): the test framework calls `page.context().tracing.start()` and `tracing.stop({ path })` explicitly. This produces a valid trace zip but may lack per-test metadata, use continuous recording across multiple tests, or use non-standard file naming. The MCP tool may report "No trace files found" for these.

**Always verify the zip contents with `unzip -l` before concluding a trace is empty.** If `trace.trace` and `trace.network` exist, the data is there — it just needs manual parsing.

## trace.trace file format

Newline-delimited JSON. Each line is a self-contained JSON object with a `type` field.

### Entry types

| Type               | Description                                                  | Key fields                                                           |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `context-options`  | First line. Browser/Playwright config, env vars, launch args | `browserName`, `playwrightVersion`, `options.env`                    |
| `before`           | Action started (click, fill, expect, etc.)                   | `callId`, `apiName`, `params.selector`, `wallTime`                   |
| `after`            | Action completed                                             | `callId`, `error` (present only on failure)                          |
| `log`              | Playwright internal log (locator resolution, wait status)    | `message`                                                            |
| `console`          | Browser console output                                       | `messageType` (`log`, `error`, `warning`, `debug`), `args[].preview` |
| `frame-snapshot`   | DOM snapshot reference                                       | `sha1` (references a file in `resources/`)                           |
| `screencast-frame` | Screenshot frame reference                                   | `sha1`, `timestamp`                                                  |
| `input`            | User input event                                             | `type` (e.g., `mousedown`), coordinates                              |

### Critical fields for failure analysis

**`before` entries:**

```json
{
  "type": "before",
  "callId": "call@1716",
  "apiName": "expect.toBeVisible",
  "params": {
    "selector": "internal:role=region[name=\"Onboarding Body\"i] >> internal:label=\"Onboarding Status Message\"i >> ...",
    "isNot": false
  },
  "wallTime": 1774063988000
}
```

**`after` entries (with error):**

```json
{
  "type": "after",
  "callId": "call@1716",
  "error": { "name": "Expect", "message": "Expect failed" }
}
```

**`log` entries — locator resolution:**

```
locator resolved to <span contenteditable="false" class="hidden s-qNHuh0m3pQVo">...</span>
```

These entries are the most diagnostic for locator bugs. When the same `callId` produces repeated `log` entries showing resolution to the same element, it means Playwright is retrying the assertion and consistently matching that element. If the element is hidden or wrong, this reveals the root cause.

**`console` entries:**

```json
{
  "type": "console",
  "messageType": "error",
  "args": [{ "preview": "main ↪️", "type": "string" }]
}
```

Note: in Electron apps, console messages from the main process are forwarded to the renderer with a `main ↪️` prefix. These are often truncated in the `preview` field.

### Parsing scripts

**Full action timeline with errors and key logs:**

```python
import json
with open('trace.trace') as f:
    for line in f:
        obj = json.loads(line.strip())
        t = obj.get('type', '')
        if t == 'before':
            cid = obj.get('callId', '')
            api = obj.get('apiName', '')
            sel = obj.get('params', {}).get('selector', '')[:120]
            print(f'[{cid}] BEFORE {api} selector={sel}')
        elif t == 'after':
            cid = obj.get('callId', '')
            err = obj.get('error')
            if err:
                print(f'[{cid}] AFTER error={err}')
        elif t == 'log':
            msg = obj.get('message', '')[:200]
            if any(k in msg.lower() for k in ['error', 'fail', 'timeout', 'locator resolved']):
                print(f'  LOG: {msg}')
        elif t == 'console':
            args = obj.get('args', [])
            text = args[0].get('preview', '')[:200] if args else ''
            msgtype = obj.get('messageType', '')
            if msgtype == 'error' or 'rate limit' in text.lower():
                print(f'  CONSOLE [{msgtype}]: {text}')
```

**Summary of entry types (useful for orientation):**

```python
import json
from collections import Counter
types = Counter()
with open('trace.trace') as f:
    for line in f:
        obj = json.loads(line.strip())
        types[obj.get('type', 'unknown')] += 1
for t, c in types.most_common():
    print(f'{t}: {c}')
```

## trace.network file format

Newline-delimited JSON. Each line is a `resource-snapshot` entry with HAR-like structure:

```json
{
  "type": "resource-snapshot",
  "snapshot": {
    "pageref": "page@<hash>",
    "startedDateTime": "2026-03-21T03:33:03.269Z",
    "request": {
      "method": "GET",
      "url": "file:///path/to/resource.css",
      "headers": [...]
    },
    "response": {
      "status": 200,
      "statusText": "OK",
      "content": { "size": 168765, "mimeType": "text/css" }
    }
  }
}
```

**Electron caveat:** For Electron apps, the network log typically only captures renderer-process requests — local `file://` loads for CSS, JS, fonts, and images. API calls made by the main process (e.g., Octokit calls to GitHub, Docker API calls) are **not** captured because they run in Node.js, not the browser context. Do not expect to find external HTTP traffic here.

## Screenshot naming and timestamps

Screenshots in `resources/` follow the pattern:

```
page@<context-hash>-<unix-timestamp-ms>.jpeg
```

The timestamp is a Unix epoch in milliseconds. Use it to:

- Correlate screenshots with trace events (match against `wallTime` in `before` entries)
- Calculate elapsed time between screenshots
- Identify the visual state at any point during the test

To find screenshots around a specific event, compute the target timestamp from the trace and select the nearest screenshot filenames.

## CI artifact structure

CI runs typically package results in an outer archive containing multiple files. The trace zip is nested inside:

```
ci-artifact.zip
└── results/
    └── podman-desktop/
        ├── traces/<name>_trace.zip        ← the Playwright trace
        ├── videos/<name>.webm             ← screen recording
        ├── html-results/                  ← Playwright HTML report
        ├── json-results.json              ← structured test results with errors
        ├── junit-results.xml              ← JUnit XML for CI
        ├── output.log                     ← CI build/test output
        └── <test-hash>/error-context.md   ← page accessibility snapshot at failure
```

### json-results.json

Contains structured test results with the exact error message and locator call log. Parse it to extract failure details:

```python
import json
with open('json-results.json') as f:
    data = json.load(f)

def walk(suites):
    for suite in suites:
        for spec in suite.get('specs', []):
            for test in spec.get('tests', []):
                for result in test.get('results', []):
                    if result.get('status') not in ('passed', 'skipped'):
                        error = result.get('error', {})
                        print(f"FAILED: {spec['title']}")
                        print(f"  {error.get('message', '')[:500]}")
        walk(suite.get('suites', []))

walk(data.get('suites', []))
```

The error message often contains the exact locator used, the element it resolved to, and the retry count — which can directly reveal the root cause without needing to parse the trace at all.

### error-context.md

Contains the page's accessibility tree (ARIA snapshot) at the moment of failure. This shows what Playwright "saw" in the DOM, which may differ from what was visually rendered. Key uses:

- Verify whether an expected element exists in the DOM
- Check element text content and ARIA attributes
- Identify whether a dialog or overlay is present in the DOM tree
- Compare against screenshots to find discrepancies between DOM state and visual state

## MCP tool parameter reference

All tools require `traceZipPath` (string): the absolute path to the trace zip.

### analyze-trace

No additional parameters. Returns a combined overview of execution steps, network summary, and key screenshots. Always call this first.

### get-trace

| Parameter      | Type                                            | Default     | Description                                                                                                                                                     |
| -------------- | ----------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterPreset` | `"minimal"` \| `"moderate"` \| `"conservative"` | `"minimal"` | Controls how much trace data is retained (see escalation below)                                                                                                 |
| `raw`          | boolean                                         | `false`     | When `true`, returns the complete unfiltered trace including all DOM snapshots. Overrides `filterPreset`. Use only as a last resort — output can be very large. |

**Filter preset escalation:**

1. `minimal` — maximum filtering. Removes DOM snapshots and redundant entries. Retains error logs, action steps, and basic console output. Start here.
2. `moderate` — retains more console logs, context around actions, and additional event metadata. Use when `minimal` doesn't show enough detail around the failure.
3. `conservative` — retains almost everything except raw DOM snapshots. Use for complex failures where prior levels are inconclusive.
4. `raw: true` — completely unfiltered. Only use when even `conservative` is insufficient. Prefer the paginated tool instead to avoid output truncation.

### get-network-log

| Parameter | Type    | Default | Description                                                                                                   |
| --------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `raw`     | boolean | `false` | When `true`, includes analytics, third-party services, and verbose metadata that are filtered out by default. |

The filtered (default) view removes noise from analytics trackers and third-party scripts, focusing on app-relevant HTTP traffic.

### get-screenshots

No additional parameters. Returns screenshots around errors and critical actions, intelligently filtered to avoid timeout-duplicate frames.

### view-screenshot

| Parameter  | Type   | Required | Description                                                          |
| ---------- | ------ | -------- | -------------------------------------------------------------------- |
| `filename` | string | yes      | Screenshot filename from the trace, e.g., `page@hash-timestamp.jpeg` |

Use when `get-screenshots` omitted a frame you need, or when `analyze-trace` references a filename you want to inspect closely.

### get-raw-trace-paginated

| Parameter      | Type   | Default | Description                                      |
| -------------- | ------ | ------- | ------------------------------------------------ |
| `browserIndex` | number | `0`     | Browser session index (for multi-browser traces) |
| `page`         | number | `1`     | Page number (1-based)                            |
| `pageSize`     | number | `50`    | Number of trace entries per page                 |

Use when filtered trace tools lack the detail you need. Paginate through the full raw trace without hitting output size limits. Start at page 1 and increment until you find the relevant section, or jump to later pages if you know the failure occurred late in the test.

### get-raw-network-paginated

| Parameter      | Type   | Default | Description                         |
| -------------- | ------ | ------- | ----------------------------------- |
| `browserIndex` | number | `0`     | Browser session index               |
| `page`         | number | `1`     | Page number (1-based)               |
| `pageSize`     | number | `20`    | Number of network requests per page |

Same pagination approach as the raw trace tool. Useful when the filtered network log omits requests you suspect are relevant (e.g., requests to third-party auth providers).

## Signal correlation matrix

When diagnosing a failure, cross-reference signals from multiple sources:

| Primary signal                  | Secondary signal to check  | What the combination reveals                                            |
| ------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| Locator timeout (trace step)    | Screenshot at failure time | Whether the page rendered at all, or rendered wrong content             |
| Locator timeout (trace step)    | Network log                | Whether a required data-fetching call failed or is still pending        |
| Assertion mismatch (trace step) | Console output             | Whether a JS error prevented correct rendering                          |
| Assertion mismatch (trace step) | Network response body      | Whether the API returned unexpected data                                |
| Console error/exception         | Trace step before it       | Which user action or navigation triggered the error                     |
| Network 4xx/5xx                 | Trace steps after it       | Whether the test continued despite the failure (missing error handling) |
| Network timeout/no response     | Screenshot                 | Whether the UI shows a loading state or error message                   |
| Blank page in screenshot        | Console output             | Whether there's an uncaught exception or module load failure            |
| Wrong URL in trace step         | Network log                | Whether a redirect occurred or navigation was intercepted               |
| Slow action duration            | Network log at same time   | Whether a pending request is blocking the UI                            |
| Slow action duration            | Console output             | Whether a heavy computation or error-retry loop is running              |
| IPC/preload error in console    | Trace steps around it      | Which renderer action triggered the IPC failure                         |

## Minimal sufficient analysis

Unless the overview is already conclusive, a good first-pass analysis usually contains:

1. One `analyze-trace` result
2. The test source code read and understood
3. One or two corroborating signals from screenshots, console/steps, or network
4. A confidence-labeled conclusion with a concrete next step

Avoid dumping all available artifacts when one or two focused follow-up calls are enough.

## Source code correlation

After identifying the failing step, always read the test source to understand intent:

1. **Spec file**: read the test function containing the failure. Check whether the assertion and locator are reasonable given the current app state.
2. **Page objects**: if the failing action is in a POM method, read that method to understand what it does and what locators it uses.
3. **App source**: if the trace points to an app-side issue (wrong rendering, missing data, console exception), navigate to the relevant component or module.

This step prevents misdiagnosis. A locator timeout might look like an app bug from the trace alone, but reading the test source reveals the locator targets a removed element (test bug).

## Timing and duration analysis

Trace steps include duration information. Use it to identify:

| Duration pattern                        | Likely cause                                         | Investigation                                                    |
| --------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Single step 5-10x slower than peers     | Waiting on network, animation, or resource           | Check network log for pending request at that time               |
| Gradual slowdown across all steps       | Memory leak, DOM bloat, or resource exhaustion       | Check console for warnings; compare early vs late step durations |
| Step hits exact timeout (e.g., 30000ms) | Condition was never met                              | Focus on _why_ it wasn't met, not the timeout itself             |
| All steps slow                          | CI runner under load, or app startup not complete    | Check if the first action also took unusually long               |
| Click takes >2s                         | Element not yet actionable, or animation in progress | Check screenshot for overlay, spinner, or disabled state         |

## Interpreting screenshots

When viewing screenshots from `get-screenshots` or `view-screenshot`, look for:

| Visual signal                         | Implication                                                 |
| ------------------------------------- | ----------------------------------------------------------- |
| Blank/white page                      | App crashed, failed to load, or navigated to wrong URL      |
| Loading spinner or skeleton UI        | Data not loaded yet — timing issue, test asserted too early |
| Error dialog or toast notification    | App-level error — read the message text                     |
| Modal or overlay blocking content     | Locator is targeting an element behind the overlay          |
| Different page than expected          | Navigation didn't complete, or redirected elsewhere         |
| Partial render (missing sections)     | Component error or failed data dependency                   |
| Stale/old data displayed              | Cache issue or API returned outdated response               |
| Element present but visually obscured | CSS overlap, z-index issue, or off-screen position          |

### Sequential screenshot comparison

When `get-screenshots` returns multiple frames, compare consecutive screenshots to understand state transitions:

- **What changed** between action N and action N+1? A new element appearing, data loading, a navigation.
- **What didn't change** when it should have? A click that didn't navigate, a form submission that didn't update the UI.
- **What disappeared** unexpectedly? An element that was present then removed by a re-render.

This before/after comparison is often the fastest way to pinpoint the exact moment things went wrong.

## Flakiness investigation

### Common flakiness patterns

| Pattern                              | How it manifests in trace                                                    | Stabilization approach                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Race between data load and assertion | Assertion step fires while network request is still pending                  | Wait for the network response or use `expect` with auto-retry          |
| Animation/transition timing          | Click targets an element that's mid-animation                                | Add `waitFor({ state: 'stable' })` or wait for animation class removal |
| Non-deterministic list ordering      | `toHaveText` fails because items rendered in different order                 | Sort before comparing, or use `toContainText` for individual items     |
| Websocket reconnection               | Console shows disconnect/reconnect around failure                            | Wait for connection re-establishment before asserting                  |
| Shared state between tests           | Test passes in isolation but fails in suite                                  | Check for missing cleanup in `afterEach`/`afterAll`                    |
| Viewport-dependent rendering         | Element off-screen on CI runner's viewport size                              | Check viewport config; use `scrollIntoViewIfNeeded`                    |
| Stale Electron IPC state             | First test passes, later test sees stale data from previous test's IPC calls | Ensure proper state reset between tests                                |

### Confirming flakiness vs deterministic failure

A failure is more likely **deterministic** if:

- It reproduces on every retry (check CI retry history).
- The trace shows a clear app error (500 response, unhandled exception).
- The expected value in the assertion is fundamentally wrong (code change broke the contract).

A failure is more likely **flaky** if:

- It passes on retry without code changes.
- The trace shows the correct state arriving _after_ the assertion timeout.
- Network response times vary significantly between runs.

### Retry trace analysis

When multiple trace files exist for the same test (retry-0, retry-1, etc.):

1. Run `analyze-trace` on each retry's trace in parallel
2. Identify whether the failure is identical across retries (same step, same error, same screenshot state)
3. If the failure differs between retries, focus on what varies — this points to the nondeterministic factor
4. If a later retry passes, the failing retry's trace shows the flaky window — identify the timing-sensitive point

## Electron and Podman Desktop patterns

### IPC communication failures

- Console messages containing `ipcRenderer`, `ipcMain`, or channel name strings indicate IPC issues
- A missing or undefined return value from an IPC call causes downstream rendering failures
- Check whether the preload script exposed the expected API by looking for preload-related console errors

### Webview interactions

- Webviews in Electron have separate document contexts; a locator targeting the main page won't find webview content
- If the trace shows a click on a webview element that doesn't respond, the webview may not have finished loading
- Look for webview navigation events and `dom-ready` signals in console output

### Extension loading

- Extensions load asynchronously; tests that depend on extension-provided UI must wait for the extension to activate
- Console messages about extension activation, provider registration, or extension errors are key signals
- A missing provider or command often means the extension failed to load rather than an app bug

### Multi-window

- Electron apps can spawn multiple `BrowserWindow` instances
- Verify the trace corresponds to the correct window (check URL, page title, or content in screenshots)
- If the trace shows actions on the wrong window, the test's page reference may have shifted

## Git history correlation

When a failure looks like a regression, use git history to narrow the cause:

```bash
git log --oneline -10 -- path/to/affected/file
git log --oneline --since="3 days ago" -- path/to/affected/directory/
```

Useful when:

- The test was previously passing and started failing without test code changes
- The locator targets something that may have been renamed or restructured
- The assertion's expected value may be outdated after a product change

Include the relevant commit in the report when it strengthens the root cause explanation.

## CI artifact locations

Traces from this project's CI are typically stored at:

```
tests/playwright/output/traces/<test-name>_trace.zip
```

The naming pattern is `{videoAndTraceName}_trace.zip`, set by the test runner. Traces for passing tests are removed by default unless `KEEP_TRACES_ON_PASS` is set.

Other CI artifacts that may complement trace analysis:

| Artifact    | Location                                    | Use                                                          |
| ----------- | ------------------------------------------- | ------------------------------------------------------------ |
| Video       | `tests/playwright/output/videos/`           | Shows real-time playback; useful for animation/timing issues |
| HTML report | `tests/playwright/output/html-results/`     | Provides test-level pass/fail summary and embedded traces    |
| JUnit XML   | `tests/playwright/output/junit-results.xml` | Machine-readable results for CI integration                  |
| Screenshots | `tests/playwright/output/screenshots/`      | Failure screenshots captured by Playwright config            |

## CLI viewer

When MCP tools are unavailable:

```bash
pnpm exec playwright show-trace /absolute/path/to/trace.zip
```

The viewer provides:

- **Timeline**: visual step-by-step with duration bars
- **Actions**: each Playwright action with before/after screenshots
- **Console**: browser console output
- **Network**: request waterfall with timing
- **Source**: test source code highlighting the current line

Navigate to the failing step and work backwards from there.

## Evidence citation format

When writing the report, cite trace evidence consistently:

| Prefix     | Format                           | Example                                                                                   |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| Trace step | `[trace step N]`                 | `[trace step 14]: click on "Submit" button timed out after 30s`                           |
| Screenshot | `[screenshot: filename]`         | `[screenshot: page@abc-1234.jpeg]: shows empty data table with loading spinner`           |
| Network    | `[network: METHOD url → status]` | `[network: GET /api/containers → 500]: server returned internal error`                    |
| Console    | `[console: level] message`       | `[console: error] "TypeError: Cannot read property 'map' of undefined"`                   |
| Duration   | `[duration: step → time]`        | `[duration: step 14 → 28500ms]: approaching 30s timeout, element never became actionable` |
| Source     | `[source: file:line]`            | `[source: containers.spec.ts:42]: assertion expects 3 rows but API returned empty array`  |

This format makes it easy for the reader to trace each claim back to its evidence and re-inspect if needed.
