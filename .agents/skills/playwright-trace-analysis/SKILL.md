---
name: playwright-trace-analysis
description: >-
  Analyzes Playwright trace archives (`trace.zip`) to diagnose test failures,
  flaky behavior, and unexpected UI states using trace steps, console output,
  network activity, and screenshots. Use when the user provides a trace path or
  trace artifact, asks why a Playwright or E2E test failed, wants root-cause
  analysis from CI artifacts, mentions the trace viewer, or asks whether a
  failure is flaky or an application bug.
---

# Playwright Trace Analysis

## When to use

Apply when the user provides:

- A `trace.zip` path
- A trace artifact to inspect
- A failing Playwright/E2E test and asks for root-cause analysis from the trace
- Two traces to compare, such as passing vs failing or retry-0 vs retry-1

## Immediate behavior

If the user already provided a usable trace path or attached trace artifact, start analysis immediately.

Do **not** ask for extra context up front unless one of these is true:

- The trace path is missing
- The path is ambiguous or unresolved
- The user supplied multiple traces and did not say which one to analyze

Optional context like test title, CI log, expected behavior, or retry history can help, but it is not required for the first analysis pass.

## Inputs

- Absolute path to `trace.zip`
- Or a workspace-relative path you can resolve safely
- Optional: test title, spec file, CI snippet, expected behavior, retry history, second trace

If the user points to a directory instead of a zip, locate the trace archive inside it before analyzing. If multiple candidate zips exist, ask one focused follow-up question.

## MCP tools

Use the `user-playwright-analyzer` MCP server.

Before the first MCP call in a session, read the server tool descriptors from the Cursor MCP directory and use the schema exactly as written. Do not guess parameter names.

All current tools require `traceZipPath`.

| toolName                    | Use                                                     | Important parameters               |
| --------------------------- | ------------------------------------------------------- | ---------------------------------- |
| `analyze-trace`             | Combined first-pass overview. **Start here.**           | —                                  |
| `get-trace`                 | Step-by-step actions and console context                | `filterPreset`, `raw`              |
| `get-network-log`           | Request/response details                                | `raw`                              |
| `get-screenshots`           | Relevant screenshots around errors and critical actions | —                                  |
| `view-screenshot`           | Inspect one screenshot by filename                      | `filename`                         |
| `get-raw-trace-paginated`   | Raw trace when filtered output is insufficient          | `browserIndex`, `page`, `pageSize` |
| `get-raw-network-paginated` | Raw network when filtered output is insufficient        | `browserIndex`, `page`, `pageSize` |

### MCP fallback — manually-created traces

Some test frameworks create traces manually using Playwright's tracing API (`tracing.start()` / `tracing.stop()`) rather than relying on Playwright's built-in per-test trace mechanism. These traces are structurally valid but may use naming conventions or internal layouts that the MCP tool does not recognize.

**When the MCP tool returns "No trace files found" or similar errors but the zip does contain `trace.trace` / `trace.network` files, fall back to manual analysis.** Do not assume the trace is empty or broken — verify by listing the zip contents first.

See the [Manual trace parsing](#manual-trace-parsing) section below and [reference.md](reference.md) for the detailed file format and parsing scripts.

### Escalation rules

Prefer the smallest useful call sequence:

1. `analyze-trace`
2. If the MCP tool returns errors or empty results, verify the zip contents (`unzip -l`) and fall back to [manual trace parsing](#manual-trace-parsing)
3. `get-trace` with `filterPreset: "minimal"` if the overview is not enough
4. One or more corroborating calls based on the failure signal:
   - `get-screenshots` for locator, visibility, or wrong-page problems
   - `get-network-log` for failed or missing requests
   - `get-trace` with `filterPreset: "moderate"` for console-heavy or sequence-heavy failures
5. `get-trace` with `filterPreset: "conservative"` only if prior calls are still inconclusive
6. Raw paginated tools only as a last resort

Avoid jumping to `raw: true` early. Large raw payloads are harder to reason about and more likely to be truncated.

### Parallel tool calls

When the overview suggests you need multiple corroborating signals, call them in parallel rather than sequentially. For example, if a locator timed out and you suspect both a visual issue and a network issue, call `get-screenshots` and `get-network-log` in the same tool-call batch.

Good parallel combinations:

- `get-screenshots` + `get-network-log` — locator timeout with possible data-loading cause
- `get-screenshots` + `get-trace` (moderate) — wrong visual state with unknown trigger
- `get-network-log` + `get-trace` (moderate) — API failure with unclear console context

Do not parallelize calls that depend on each other's output (e.g., don't call `view-screenshot` until you know the filename from `get-screenshots`).

## Standard workflow

### Step 1: Run the overview

Call `analyze-trace` first and extract:

- The failing test or action if available
- The exact error text
- The first meaningful failing step
- Any obvious screenshot or network clues
- Action durations — note any step that took significantly longer than its peers

### Step 2: Read the test source

Once you know the failing test file and approximate line, read the relevant spec file and any page objects it uses. This gives you:

- **Intent**: what the test was trying to verify
- **Locator context**: whether the locator is reasonable or brittle
- **Assertion context**: whether the expected value still makes sense
- **Flow context**: what earlier steps should have set up the state for the failing assertion

If the test file path is not in the trace output, search the workspace for the test name or assertion text.

### Step 3: Find the first meaningful failure

Prioritize the earliest causal failure, not the later cascade.

Build a mental timeline by mapping:

1. The last successful action before the failure
2. Any console errors or warnings between success and failure
3. Any network requests initiated or completed in that window
4. The screenshot state at the moment of failure

Examples of likely causal signals:

- Assertion mismatch
- Locator timeout or actionability failure
- Navigation timeout or unexpected URL
- Console exception before the failing assertion
- 4xx/5xx request or a required request never being sent
- Action duration spike (a step taking 10x longer than similar steps)

### Step 4: Corroborate with additional signals

Before concluding, check at least one additional source unless the trace already contains a direct smoking gun.

Recommended pairings:

| Primary signal                | Best corroboration                         |
| ----------------------------- | ------------------------------------------ |
| Locator timeout               | Screenshots                                |
| Assertion mismatch            | Network or console                         |
| Wrong page / navigation issue | Screenshots and network                    |
| Console exception             | Trace step immediately before it           |
| API failure                   | Network details and screenshot state       |
| Slow action duration          | Network log (pending request?) and console |

### Step 5: Correlate with code changes (when useful)

If the failure looks like a regression (test was previously passing), check recent changes:

- Run `git log --oneline -10 -- <failing-source-file>` on the app code the trace points to
- Run `git log --oneline -10 -- <spec-file>` on the test itself
- Check if the locator targets something that was recently renamed or restructured

This is especially valuable when the failure classification is "app bug" or "test bug" — it often reveals the introducing commit.

### Step 6: Classify the failure

Use one of these buckets:

- **App bug**: the trace shows the application produced the wrong state or errored
- **Test bug**: the trace shows the app behaved correctly but the test asserted the wrong thing or used a bad locator
- **Likely flaky**: the trace shows a timing-sensitive race, loading state, animation, or ordering issue
- **Environment / infra**: the failure is caused by CI runner state, missing dependencies, or external service unavailability
- **Unknown**: the available trace data is insufficient

Do not classify unless the trace supports it. State your confidence level explicitly.

### Step 7: Report

See the reporting contract below. Lead with the root cause, back every claim with trace evidence, and propose a specific fix.

## Decision guide

| What you see                                            | What to do next                                                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| MCP returns "No trace files found" or similar error     | List zip contents with `unzip -l`; if `trace.trace` exists, use [manual trace parsing](#manual-trace-parsing)  |
| Clear assertion mismatch and obvious cause in overview  | Report it; extra MCP calls may be unnecessary                                                                  |
| Locator timeout or hidden element                       | Run `get-screenshots`                                                                                          |
| Overview mentions console errors but not enough context | Run `get-trace` with `filterPreset: "minimal"` or `"moderate"`                                                 |
| Network summary shows 4xx/5xx or missing response       | Run `get-network-log`                                                                                          |
| Screenshot looks wrong but not enough detail            | Run `view-screenshot` for the named frame                                                                      |
| Filtered output omits the needed detail                 | Escalate to `conservative`, then raw paginated tools                                                           |
| Multiple browser sessions exist                         | Use `browserIndex` on paginated raw tools                                                                      |
| Failure looks like a regression                         | Check git history for the affected file                                                                        |
| Test source uses a brittle locator                      | Read the spec file and propose a resilient alternative                                                         |
| CI artifact is a nested zip (not a direct trace zip)    | Extract the inner trace zip first, then analyze                                                                |
| Multiple runs fail the same way                         | Do **not** default to flaky; run [exhaustive console analysis](#exhaustive-console-analysis) across all traces |

## Common patterns

### Locator and actionability failures

- `waiting for locator(...)` then timeout: element never appeared, selector changed, or page never reached the expected state
- `not visible` / `not enabled`: overlay, modal, disabled control, or incomplete render
- `strict mode violation`: selector is too broad and matched multiple elements

Check screenshots first, then console or network if the UI looks incomplete.

### Assertion failures

- Expected text/value/count differs from actual: stale data, wrong element, race with data loading, or changed product behavior
- Expected visible but got hidden: render failure, delayed data, or transient UI state

Check whether the expected state arrives later than the assertion window before calling it flaky.

### Navigation failures

- `goto` or `waitForURL` timeout: redirect loop, app crash, auth redirect, slow load, or wrong expectation
- Unexpected page in screenshot: navigation intercepted or user flow diverged earlier

Check network and screenshots together.

### Network failures

- 4xx before assertion: auth/session/request contract issue
- 5xx: backend failure
- Request never sent: frontend logic never fired, earlier JS error blocked it, or user action failed
- CORS/preflight issue: cross-origin misconfiguration

### Timing and duration anomalies

- A single action taking 5-10x longer than peers: likely waiting on a network response, animation, or resource load
- Gradual slowdown across steps: possible memory leak or resource exhaustion
- Timeout at exactly the configured limit (e.g., 30000ms): the condition was never met, not just slow

### Electron-specific patterns

- **IPC failures**: console errors mentioning `ipcRenderer`, `ipcMain`, or channel names indicate broken communication between main and renderer processes
- **Webview loading**: if the test interacts with a webview, check whether the webview's `document` loaded (look for webview-related console messages or navigation events)
- **Multi-window issues**: Electron apps can have multiple `BrowserWindow` instances; verify the trace is from the correct window
- **Preload script errors**: errors during preload indicate the renderer lacks expected APIs — check console output for preload-related messages

### Flakiness indicators

Treat as likely flaky only when the trace suggests timing or nondeterminism, for example:

- Screenshot shows spinner/loading/skeleton instead of final UI
- Expected state appears after the timeout window
- Animation or transition seems to block the action
- Request ordering matters and looks variable
- Retry history or CI context indicates pass-on-retry behavior

If you suspect flakiness, say why and recommend the stabilization point, such as waiting for a specific response, element state, or post-animation condition.

### Deterministic failures across multiple runs

When multiple traces from separate CI runs are provided and they all fail the same way, **raise the bar significantly before classifying as flaky**. A failure that reproduces N/N times across independent runs is almost certainly deterministic. Even if the test has `continue-on-error: true` or is known to be occasionally flaky, consistent reproduction points to an app bug or environment regression — not timing luck.

In this scenario:

1. **Do not default to "likely flaky"** — consistent reproduction is strong counter-evidence against flakiness.
2. **Perform an exhaustive console log scan** (see [Exhaustive console analysis](#exhaustive-console-analysis) below) before drawing conclusions. The root cause often hides in a log-level message that a severity-filtered search misses.
3. **Look for a common causal event** across all traces rather than analyzing each in isolation. If the same console error, network failure, or UI state appears in every trace, that is almost certainly the root cause.
4. Classify as flaky only if the traces show genuinely different failure modes or if some runs pass and others fail.

## Reporting contract

Every analysis must include all of the sections below. The report should be structured so a developer can read it top-to-bottom in under 2 minutes and know exactly what happened, why, and what to do.

### Required sections

1. **Failure summary** — One or two sentences: what failed and the most likely cause.
2. **Event timeline** — A compact chronological sequence of the key events leading to the failure. Include timestamps or step numbers when available. This gives the reader the narrative arc.
3. **Evidence** — Each claim must cite a specific artifact from the trace. Use this format:
   - `[trace step N]` — reference to a specific action or event in the trace
   - `[screenshot: filename]` — reference to a screenshot, with a brief description of what it shows
   - `[network: METHOD url → status]` — reference to a specific request
   - `[console: level] message` — reference to a console log entry
4. **Root cause** — A confidence-labeled explanation. Format: `[Confirmed|Likely|Unknown] explanation`. If `Likely` or `Unknown`, briefly state what additional evidence would upgrade the confidence.
5. **What was ruled out** — Briefly list alternative hypotheses you investigated and why they don't fit. This builds trust in the conclusion and saves the developer from re-investigating dead ends.
6. **Recommended action** — A specific, actionable fix. When the fix is in test code, include the file path, the problematic line or locator, and the suggested replacement. When the fix is in application code, point to the relevant source file and describe the expected behavior change.

### Report template

Use markdown headers matching the required sections above. Cite evidence with these prefixes: `[trace step N]`, `[screenshot: filename]`, `[network: METHOD url → status]`, `[console: level] message`. See [reference.md](reference.md) for the full citation format reference.

For test code fixes, include the file path, problematic line/locator, and suggested replacement. For app code fixes, point to the relevant source file and describe the expected behavior change.

### Severity annotation (optional but encouraged)

When context is available, annotate the failure with severity:

- **Blocking**: test suite cannot proceed, or the failure indicates a critical app regression
- **Significant**: test fails reliably, indicating a real but non-critical issue
- **Minor**: cosmetic or low-impact, or the test itself is overly strict
- **Infra-only**: failure is caused by CI environment, not application or test code

## Multi-trace comparison

When two traces are provided:

1. Run `analyze-trace` on both (in parallel)
2. Find where their step sequences diverge
3. Compare screenshots and network behavior at the divergence point
4. Report the **delta**, not two separate full summaries

Focus on: "the failing trace diverges here, and this is the first difference that plausibly explains the failure."

### Retry-trace comparison

When Playwright retries produce multiple traces for the same test:

1. Compare the traces to determine whether the failure is consistent or intermittent
2. If the retry passes, focus on what differs — typically network timing, element ordering, or data availability
3. A consistent failure across retries is likely deterministic; a pass-on-retry is likely flaky
4. Report the specific divergence point and the stabilization needed

### Batch analysis

When multiple traces from a CI run are provided:

1. Run `analyze-trace` on each (in parallel, up to 3-4 at a time)
2. Look for common failure patterns — same error message, same failing API endpoint, same console exception
3. Group failures by root cause rather than reporting each individually
4. If a single root cause explains multiple failures, say so explicitly and list the affected tests

## If the trace is insufficient

State that directly. Good examples:

- "The trace shows the assertion timing out, but not why the data never loaded."
- "I can confirm the UI was still loading, but I cannot tell from this trace alone whether the delay came from the app or the test environment."

Then name the single best next action:

- Escalate `get-trace` to `moderate` or `conservative`
- Inspect `get-network-log` (possibly with `raw: true` if the filtered version omits relevant requests)
- Compare with a passing trace
- Review the failing locator or assertion in the test source
- Check for a video artifact alongside the trace
- Look at CI runner logs for environment issues (OOM, disk, network)

Do not leave the analysis open-ended. Always propose a concrete next step even when the trace is insufficient.

## Exhaustive console analysis

Console messages in Playwright traces carry a `messageType` field (`log`, `debug`, `info`, `warning`, `error`). **Do not filter solely by `error` or `warning` severity.** Application code frequently logs critical errors at `log` or `info` level — for example, a `catch` block that calls `console.log(\`Error while ...: ${err}\`)`instead of`console.error(...)`. Filtering only by severity will miss these, potentially causing you to misdiagnose the failure entirely.

### Required console scanning procedure

When performing manual trace parsing, always run **two passes** over console messages:

1. **Severity pass** — collect all `error` and `warning` messages.
2. **Keyword pass** — collect messages at **any** severity level whose text matches failure-related patterns. Use a broad keyword set:

```
error, fail, TypeError, ReferenceError, SyntaxError, reject, crash,
abort, ECONNREFUSED, ENOTFOUND, ETIMEDOUT, fetch failed, tls, cert,
ssl, socket, refused, timeout, 4xx, 5xx, unauthorized, forbidden,
not found, unreachable, cannot, unable
```

Report the union of both passes. When a message appears at an unexpected severity (e.g., an error message at `log` level), flag the mismatch explicitly — it often indicates a swallowed error in the application code that is central to the failure.

### Why this matters

A real-world example: `TypeError: fetch failed` from the Kubernetes client was logged via `console.log()` (not `console.error()`). Filtering only for `error`-level messages missed it entirely, leading to a misdiagnosis of "test flakiness / timing issue" when the actual root cause was the app's `fetch()` calls failing due to a build configuration change. The error was present in all traces and was the direct cause of "Cluster not reachable" — but it was invisible to a severity-only filter.

## Manual trace parsing

When the MCP tool cannot parse the trace (common with manually-created traces), analyze the files directly. The trace zip typically contains three components: `trace.trace`, `trace.network`, and `resources/` with screenshots.

### Step 1: Verify zip contents and extract

```bash
unzip -l /path/to/trace.zip | head -20
```

Look for `trace.trace`, `trace.network`, and `resources/*.jpeg`. If the trace zip is nested inside a CI artifact archive, extract the inner zip first.

### Step 2: Parse actions and locator resolutions from trace.trace

The `trace.trace` file is newline-delimited JSON. Each line is an object with a `type` field. The key types for failure analysis are `before` (action start), `after` (action result), `log` (Playwright internal logs), and `console` (browser console output). See [reference.md](reference.md) for the full format specification and ready-to-use parsing scripts.

Extract the action timeline and errors:

```bash
python3 -c "
import json
with open('trace.trace') as f:
    for line in f:
        obj = json.loads(line.strip())
        t = obj.get('type', '')
        if t == 'before':
            cid = obj.get('callId', '')
            api = obj.get('apiName', '')
            sel = obj.get('params', {}).get('selector', '')[:100]
            print(f'[{cid}] {api} selector={sel}')
        elif t == 'after' and obj.get('error'):
            print(f'[{obj[\"callId\"]}] ERROR: {obj[\"error\"]}')
        elif t == 'log':
            msg = obj.get('message', '')[:200]
            if any(k in msg.lower() for k in ['error', 'fail', 'timeout', 'locator resolved']):
                print(f'  LOG: {msg}')
        elif t == 'console':
            args = obj.get('args', [])
            text_parts = [a.get('preview', '') or a.get('value', '') for a in args]
            text = ' '.join(str(p) for p in text_parts if p)[:300]
            msg_type = obj.get('messageType', '')
            # Always show error/warning level
            if msg_type in ('error', 'warning'):
                print(f'  CONSOLE [{msg_type}]: {text}')
            # Also show ANY level if text matches failure keywords
            elif text and any(k in text.lower() for k in [
                'error', 'fail', 'typeerror', 'referenceerror', 'reject',
                'crash', 'abort', 'econnrefused', 'enotfound', 'etimedout',
                'fetch failed', 'tls', 'cert', 'ssl', 'socket', 'refused',
                'timeout', 'unauthorized', 'forbidden', 'unreachable',
                'cannot', 'unable']):
                print(f'  CONSOLE [{msg_type}]: {text}')
"
```

**Important:** The console extraction above scans messages at **all** severity levels for failure-related keywords, not just `error`/`warning`. This is essential — application code may log critical errors via `console.log()` rather than `console.error()`. See [Exhaustive console analysis](#exhaustive-console-analysis) for the rationale.

The `log` entries with "locator resolved to" are critical — they show exactly which DOM element Playwright matched for each retry of an assertion. Repeated resolution to a hidden or wrong element (as seen in `.first()` matching a `class="hidden"` span) is a strong signal for locator bugs.

### Step 3: View screenshots at specific timestamps

Screenshot filenames encode timestamps: `page@<hash>-<timestamp>.jpeg`. Use the timestamps to correlate with trace events, or use `view-screenshot` from the MCP tool (which still works even when trace parsing fails).

### Step 4: Check network log

```bash
python3 -c "
import json
with open('trace.network') as f:
    for line in f:
        obj = json.loads(line.strip())
        snap = obj.get('snapshot', {})
        url = snap.get('request', {}).get('url', '')
        status = snap.get('response', {}).get('status', '')
        if not url.startswith('file://'):
            print(f'{snap[\"request\"][\"method\"]} {url} -> {status}')
"
```

For Electron apps, the network log typically only captures renderer-process requests (local `file://` resource loads). API calls made by the main process (e.g., Octokit calls to GitHub) are not captured in the trace.

## CI artifact structure

CI artifacts nest traces inside larger archives. Extract the inner trace zip before analyzing. See [reference.md](reference.md) for the full layout, `json-results.json` parsing scripts, and `error-context.md` usage.

```bash
unzip -l artifact.zip | grep trace.zip
unzip artifact.zip "path/to/trace.zip" -d /tmp/analysis
```

## If MCP is unavailable

Fall back to the Playwright CLI viewer. See [reference.md](reference.md) for details.

```bash
pnpm exec playwright show-trace /absolute/path/to/trace.zip
```

## After analysis

- If the likely issue is in the Playwright spec, page object, or test config, follow the [playwright-testing skill](../playwright-testing/SKILL.md).
- If the trace points to application code, navigate to the relevant source and propose a fix grounded in the trace evidence.
- When proposing fixes, always include the specific file path and line reference — never leave the developer to hunt for the right location.

## Additional resources

- Extended tool details, signal correlation, and Electron-specific guidance: [reference.md](reference.md)
