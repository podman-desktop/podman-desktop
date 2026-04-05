---
name: investigate-gh-run
description: Deep investigation of CI/CD test failures - identifies root causes by analyzing logs, artifacts, git history, and source code
---

Investigate CI test failures for the given GitHub Actions run. The user will provide a run URL or run ID as: $ARGUMENTS

## Protocol

This is an adaptive-depth investigation. You gather all surface-level data in one parallel batch, classify the failure, then go only as deep as needed. An infra failure resolves in one round. A clear build error in two. A subtle UI regression gets the full trace analysis pipeline.

Wall-clock time is the enemy. Launch independent work in parallel. Never wait for one API call to decide whether to start another.

---

### Step 1: Gather Everything (one parallel batch)

Extract the run ID from the URL (`https://github.com/{owner}/{repo}/actions/runs/{run-id}`), then launch ALL of these in a single message:

```
# a) Run overview
gh run view {run-id} --repo {owner}/{repo}

# b) Failed job IDs
gh api repos/{owner}/{repo}/actions/runs/{run-id}/jobs --paginate \
  --jq '.jobs[] | select(.conclusion == "failure") | "\(.id) \(.name)"'

# c) Failed logs -> temp file (10-100x smaller than full logs)
gh run view {run-id} --repo {owner}/{repo} --log-failed \
  > /tmp/ci-logs-{run-id}.txt 2>&1

# d) Artifacts
gh api repos/{owner}/{repo}/actions/runs/{run-id}/artifacts \
  --jq '.artifacts[] | "\(.id) \(.name) \(.size_in_bytes)"'

# e) Workflow run history (workflow name unknown, so chain via ID)
WF_ID=$(gh api repos/{owner}/{repo}/actions/runs/{run-id} --jq '.workflow_id') && \
gh api "repos/{owner}/{repo}/actions/workflows/$WF_ID/runs?per_page=10" \
  --jq '.workflow_runs[] | "\(.id) \(.conclusion // "running") \(.created_at | split("T")[0])"'
```

Combine the branch-name fetch with the log save to reduce tool calls:

```
# f) Branch name
gh api repos/{owner}/{repo}/actions/runs/{run-id} --jq '.head_branch'
```

**Identify failing tests from the overview first.** The `gh run view` output (call a) already contains `🧪` annotations and `X` markers with test names. Read these before touching any log files — they tell you WHAT failed without any grepping.

Then grep the saved log file for error DETAILS (locator, expected, received):

```
echo "=== SUMMARY ===" && \
grep -E "failed$|🧪|passed \(" /tmp/ci-logs-{run-id}.txt | grep -v "STDERR\|npm warn" | head -15 && \
echo "=== FAILURES ===" && \
grep -B 1 -A 5 "Error:.*expect\|Error:.*Manifest\|Error:.*timeout\|Error encountered\|intercepts pointer\|no such file\|copier subprocess\|layer not known\|unable to copy" /tmp/ci-logs-{run-id}.txt | grep -v "STDERR\|echo\|npm\|curl\|jq\|matcherResult\|endWallTime\|Symbol\|stepId\|boxedStack\|stack:" | head -50
```

**`--log-failed` blind spot:** Many CI setups (podman-desktop/e2e, extension repos) mark the test step as ✓ (passed) even when Playwright reports failures — the exit code is 0 or `continue-on-error: true`. Only the "Publish Test Report" step fails (X). In this case, `--log-failed` captures the Publish step output which may NOT contain Playwright error details. The grep will return empty.

**When the grep returns empty but the overview shows test failures**, fall back immediately — don't retry different grep patterns:

1. **Download the individual job log** (contains ALL step output including the passed test step):
   ```
   gh api repos/{owner}/{repo}/actions/jobs/{job-id}/logs > /tmp/ci-job-{job-id}.txt 2>&1
   ```
2. **For blob-format logs** (entire output on one line), use `grep -o` with `cut` to extract error snippets:
   ```
   grep -o 'Error:.*expect[^\\]*' /tmp/ci-job-{job-id}.txt | cut -c1-300 | head -5
   grep -o 'Locator:.*' /tmp/ci-job-{job-id}.txt | cut -c1-200 | head -5
   ```
3. **For Testing Farm** (Playwright runs remotely): extract JUnit XML from artifacts:
   ```
   unzip -o ci-results.zip "*.xml" -d /tmp/ci-artifacts && \
   grep -A 20 "failure message" /tmp/ci-artifacts/junit*.xml | head -40
   ```

---

### Step 2: Classify and Route

With all data in hand, classify the failure and choose the investigation depth:

**A) Infra failure -> Report immediately**
Signals: "Create instance" step failed, "Missing file: host", tiny artifact (<10KB), "Artemis resource ended in error", "MAPT container failed", no JUnit results.
Action: Skip everything else. Write the report now. These are provisioning failures with nothing to analyze.

**B) Clear build/process error -> Report after confirming with run history**
Signals: error message is self-explanatory ("no such file or directory", "unable to copy from source docker://...", registry HTTP errors, "copier subprocess" failures). The error context page snapshot would just show a generic page.
Action: Check run history for pattern (isolated vs chronic), then report. Skip artifact download and trace analysis — the CI log error tells the whole story.

**C) UI/test failure -> Full investigation**
Signals: locator timeouts, assertion mismatches, "intercepts pointer events", strict mode violations, `expect(locator).toBeVisible()` failures. The error message says _what_ failed but not _why_.
Action: Continue to Steps 3-5. Download artifacts, read error-context.md, dispatch trace subagent.

**Also decide:**

- **Branch context:** If the run is on a feature branch (not `main`), failures may be expected during development. Check if later runs on the same branch pass — if so, it's a **resolved regression** and the fix is already in. Note this in the report and skip deep investigation.
- **Dedup:** Multiple jobs failing with the same test? Investigate one, note the rest share the root cause.
- **Multi-failure:** Multiple different failures in one job? Check if they cascade from the first (serial test block) or are independent.
- **Run history pattern:** Isolated (transient), regression (code change), chronic (systemic), alternating (flaky/environment), or **resolved** (failed then fixed — later runs pass). For resolved regressions, report what failed and note the fix, but skip deep investigation.

---

### Step 3: Artifacts + Trace Dispatch (Category C only)

Launch artifact download alongside any remaining greps. Pick the smallest artifact from a failed job that ran tests. **Skip artifacts >500MB** (videos, build outputs — will timeout). **If all artifacts show "(expired)"**, skip this entire step — older runs lose artifacts after the retention period (typically 90 days but can be as short as 1 day). You'll have to work with CI logs and run history only. Note this limitation in the report.

```
# Download + list key files in one shot
cd /tmp && gh api repos/{owner}/{repo}/actions/artifacts/{id}/zip > ci-results.zip && \
unzip -l ci-results.zip | grep -E "error-context|trace\.zip|junit" && \
unzip -o ci-results.zip "**/*error-context*" "**/*trace.zip" "*.xml" -d /tmp/ci-artifacts 2>/dev/null
```

**Artifact layouts:**

- **Standard (Azure/MAPT):** `results/podman-desktop/tests-.../error-context.md`, `traces/*_trace.zip`
- **Testing Farm (Fedora):** `results/e2e-test-1/data/traces/*_trace.zip`, `junit-playwright-results.xml` at root. No error-context.md.
- **Extension repos:** `extension-name/junit-results.xml`, `extension-name/...-chromium/error-context.md`

**Read error-context.md** — for UI failures (locator timeouts, assertion mismatches), this page snapshot often reveals the answer immediately. For build/process failures, skip it — the CI log error is more useful.

**Trace analysis** — if trace.zip exists, pre-extract and dispatch a background subagent:

```
mkdir -p /tmp/ci-traces/{name} && cd /tmp/ci-traces/{name} && unzip -o /path/to/trace.zip
```

Read the last 2-3 screenshots from `resources/*.jpeg | sort | tail -3`, then dispatch:

```
Agent(run_in_background=true, prompt="""
Analyze this Playwright trace for a CI test failure.

Trace: /path/to/trace.zip
Extracted: /tmp/ci-traces/{name}/
Failing test: [name from logs]
Error: [message from logs]
Error context: [paste error-context.md if available]
Screenshots: [describe what each shows]

Use the playwright-trace-analysis skill to perform the analysis.
MCP tools if available, otherwise read extracted files.

Return: failure summary, event timeline with step refs, evidence citations,
root cause [Confirmed|Likely|Unknown], failure type, recommended action with file:line.
""")
```

---

### Step 4: Regression Hunt + Source Code (parallel, Category C only)

Skip if the run history shows a chronic or isolated pattern. Launch in parallel:

1. **Verify last passing run:** `gh run view {id} --repo {owner}/{repo}`
2. **Check adjacent failures** for same test: `gh run view {id} --repo ... | grep -E "^X|🧪|❌"`
3. **Fetch test source:** `gh api repos/{owner}/{repo}/contents/{path} --jq '.content' | base64 --decode | sed -n '{start},{end}p'`
   (macOS base64 fallback: pipe through `python3 -c "import sys,base64;print(base64.b64decode(sys.stdin.read()).decode())"`)
4. **Commits between pass/fail:** `git log --oneline --since="{date}" --until="{date}" -- {paths}`

---

### Step 5: Report

Collect trace subagent results if dispatched. Correlate all evidence: CI logs, error context, trace findings, test source, regression history, platform comparison. If CI logs and trace disagree, trust traces for UI failures, logs for infra.

```
## CI Failure Investigation

### Summary
One-sentence root cause.

### What Failed
| Job | Test | Error | Duration |
|-----|------|-------|----------|

### Root Cause
- **What:** ...
- **Where:** file:line
- **When introduced:** commit or "N/A — transient"
- **Why:** mechanism
- **Evidence:** screenshot, log, trace step citations

### Classification
[App bug | Test bug | Likely flaky | Environment/infra] — [Confirmed | Likely | Unknown]

### Fix
Specific code change with rationale, or "No code fix — [explanation]".
```

---

## Investigation Playbook

Hard-earned patterns from real investigations. Use these to shortcut analysis.

### Error -> Diagnosis Shortcuts

| Error pattern                                                                      | Likely cause                                                          | Skip to                     |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------- |
| `Missing file: host` / `MAPT container failed` / `Artemis resource ended in error` | Azure/Testing Farm VM provisioning failure                            | Report (Category A)         |
| `Unable to download docker-compose binary: HttpErr`                                | GitHub API download failure; test only handles success + rate-limit   | Report (Category B)         |
| `overlay/.../merged: no such file or directory` / `copier subprocess`              | Container storage corruption, often after "Free up disk space" step   | Report (Category B)         |
| `unable to copy from source docker://...`                                          | Registry pull failure (network/rate limit)                            | Report (Category B)         |
| `intercepts pointer events` + `fade-bg` div                                        | Modal overlay blocking clicks; test doesn't wait for dialog dismissal | Trace analysis (Category C) |
| `strict mode violation: ... resolved to 2 elements`                                | Locator matches multiple DOM nodes; `.or()` compound locator issue    | Error context (Category C)  |
| `Expected: "RUNNING"` / `Received: "STOPPED"`                                      | Resource never reached target state within timeout                    | Platform comparison         |
| `Test timeout of N ms exceeded` + `Target page closed`                             | Long operation exceeded test timeout; browser was killed              | Build/process failure       |

### Platform Patterns

- **Win10 vs Win11:** Win10 CI runners are consistently slower. K8s deployments, image builds, and cluster operations often timeout on Win10 while passing on Win11 with identical code.
- **x86 vs ARM (macOS-26, Win11-ARM):** ARM runners have different timing characteristics. Tests with tight timeouts (5s) for UI rendering or provider initialization may pass on x86 but fail on ARM. If failures cluster on ARM platforms while x86 passes, suspect timing — increase timeouts.
- **WSL vs Hyper-V:** Different networking and filesystem behavior.
- **Linux (Testing Farm) vs Windows:** Different artifact layouts, auth file paths, filesystem watchers. No error-context.md on Testing Farm — use JUnit XML.
- **GPU vs Default (Testing Farm):** GPU pool has been chronically unavailable. If only GPU jobs fail with provisioning errors, it's infra.
- **Dev vs Prod mode:** Prod binaries may have different startup timing (minified, no sourcemaps, different Electron flags). A test passing in dev but failing in prod (or vice versa) on the same runner suggests mode-specific initialization differences.

### Workflow Patterns

- **✓ Run tests / X Publish Report:** The test step passes but the publish step fails. This means `--log-failed` won't contain Playwright errors — they're in the passed test step's log. Fall back to downloading the full job log. The `gh run view` annotations still show `🧪` with test names. This is the default pattern for podman-desktop/e2e, extension-bootc, and Testing Farm workflows.
- **X Run tests / X Publish Report:** Both fail. `--log-failed` contains Playwright errors from the test step. Grep works normally. This is the pattern for kortex, ai-lab main e2e, and workflows where the test step exits non-zero on failure.

### Noise to Ignore

- `Gtk: gtk_widget_add_accelerator: assertion failed` — Electron/Gtk compat on Linux
- `npm warn Unknown env config` — pnpm/npm config mismatch
- `cpu-features install: Error: Unable to detect compiler type` — optional native module
- `Error trying to run the version on docker-compose. Binary might not be there` — expected when compose isn't installed
- `Error: Failed to execute command: spawn kind ENOENT` — expected when kind isn't installed
