---
name: issue-requirements
description: >-
  Reads a GitHub issue and all its linked issues, PRs, and comments to extract
  requirements and context. Invoke for any request combining a GitHub issue
  reference (#123, owner/repo#123, or URL) with a need to understand what the
  issue asks for — extracting acceptance criteria, understanding scope,
  gathering requirements before implementation or testing, or analyzing what
  changed. Extracts only what is explicitly stated in the issue and its linked
  references — does not invent or assume. Not for writing code, running tests,
  or debugging.
---

# Issue Requirements Collector

Gather requirements from a GitHub issue by extracting what is explicitly
stated — without touching source code and without inventing or assuming. The
output is structured so a downstream agent can pick it up and act on it —
whether for testing, implementation, or review.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status` should succeed)

## Input

The user provides one of:

- A full GitHub issue URL: `https://github.com/owner/repo/issues/123`
- A short reference: `owner/repo#123`
- Just an issue number (when working inside a cloned repo): `#123`

## Workflow

### 1. Fetch the root issue

```bash
gh issue view <number> --repo <owner/repo> --json title,body,labels,comments,state,milestone,assignees
```

Extract:

- Title and description
- Labels (they often encode priority, area, or type — e.g. `kind/feature`, `area/tests`)
- Every comment (these frequently contain clarifications, revised requirements, or acceptance criteria that supersede the original description)
- Milestone (gives release context)

### 2. Discover linked issues and PRs

Only follow references that appear explicitly in the issue body, comments, or
GitHub's timeline (cross-references). **Do not search the repo by keywords** —
broad searches produce noise and slow the workflow down.

Sources of linked references (check in this order):

1. **Issue body and comments** — scan for:
   - `#<number>` — same-repo issue or PR
   - `owner/repo#<number>` — cross-repo reference
   - Full GitHub URLs to issues or PRs
   - "Depends on", "Blocked by", "Related to", "Part of", "Follow-up to" phrases followed by a reference
   - Checkbox task lists that reference other issues

2. **Timeline cross-references** — fetch the issue timeline to find PRs and
   issues that link back to this one:
   ```bash
   gh api "repos/<owner>/<repo>/issues/<number>/timeline" --paginate \
     --jq '.[] | select(.event == "cross-referenced") | .source.issue.number'
   ```

For each discovered reference, fetch it:

```bash
# For issues
gh issue view <number> --repo <owner/repo> --json title,body,labels,comments,state

# For PRs — these are especially valuable because they contain implementation details
gh pr view <number> --repo <owner/repo> --json title,body,labels,comments,state,files
```

### 3. Recurse one more level

Repeat the discovery step on each linked issue/PR's body and comments. Stop
after this second level — going deeper rarely adds signal and risks drowning in
noise.

Keep a visited set to avoid re-fetching the same reference.

### 4. Synthesize the requirements

Read through everything you gathered and produce the output below.

**Critical rule: only extract, never invent.** Every acceptance criterion,
scenario, and precondition in your output must trace back to something
explicitly stated in the issue body, a comment, or a linked issue/PR. If the
issue doesn't describe specific scenarios, don't make them up — list what the
issue says and let a downstream agent investigate further.

Your job is to collect and organize the raw material, not to imagine what
_could_ be required. A downstream agent will fill in any gaps.

## Output Format

Present the output directly in conversation using this structure. Every section
is mandatory — if you genuinely cannot fill one, say so explicitly rather than
omitting it silently.

```markdown
# Requirements: <concise feature name>

## Source

- **Root issue:** <owner/repo#number> — <title>
- **Related issues:** <list with links>
- **Related PRs:** <list with links>

## Feature Summary

<2-4 sentences: what the feature does from the user's perspective, what problem
it solves, and why it matters. Do not copy-paste the issue description — distill
it.>

## Acceptance Criteria

<Numbered list of concrete conditions extracted from the issue. Each criterion
should be verifiable with a pass/fail outcome. Derive these from the issue
description, comments, and linked issues — look for words like "should",
"must", "expected", "verify that".>

1. ...
2. ...

## Scenarios

<Only include scenarios that are explicitly described or clearly implied by the
issue, comments, or linked PRs. Do NOT invent scenarios. If the issue does not
describe specific scenarios, state that and move on.>

- **Scenario: <name>** (cite source: issue body / comment by @user / PR #N)
  - Preconditions: ...
  - Steps: ...
  - Expected: ...

## Dependencies & Preconditions

<What must be in place — services, configuration, test data, environment
variables, feature flags.>

## Open Questions

<Anything ambiguous, contradictory, or missing from the issues that someone
acting on this would need answered. If the issue has unresolved discussion
threads, flag them here.>

## References

<Bullet list of every issue and PR you investigated, with title and link.>
```

## Guidance for Good Output

- **Never invent.** Every item in the output must be traceable to the issue
  body, a comment, or a linked issue/PR. If the issue is sparse, the output
  will be sparse — that is correct. A downstream agent will fill in the gaps.

- **Be specific when the source is specific.** If the issue says "clicking
  Start on a stopped container should transition it to Running within 30s",
  preserve that detail. But don't add precision that isn't in the source.

- **Preserve important context from comments.** Issue comments frequently
  contain revised requirements, edge cases discovered during review, or design
  decisions that change the original proposal. These are not noise — they are
  the most current source of truth.

- **Flag contradictions.** If the issue description says one thing and a later
  comment says another, call it out in Open Questions rather than silently
  picking one.

- **Cite your sources.** For each acceptance criterion or scenario, note where
  it came from (issue body, comment by @user, PR #N). This lets the reader
  verify and a downstream agent prioritize.
