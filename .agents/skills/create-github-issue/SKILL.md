---
name: create-github-issue
description: >-
  Create GitHub issues using the gh CLI. Takes a plain-language description
  and produces a well-structured issue matching the target repo's templates.
  Use when the user wants to create a new issue, report a bug, request a
  feature, file a task, or create an epic. Trigger keywords: create issue,
  new issue, file bug, report bug, feature request, file a task, create epic,
  github issue, open issue.
---

# Create GitHub Issue

Create well-structured GitHub issues from plain-language descriptions using
the `gh` CLI. Issues conform to the target repository's YAML form templates
and are automatically assigned to the correct project board.

This skill is repo-agnostic — it reads template metadata (projects, labels,
required fields) from the repo's `.github/ISSUE_TEMPLATE/*.yml` files at
runtime rather than hardcoding them.

## Prerequisites

The `gh` CLI must be authenticated:

```bash
gh auth status
```

If not authenticated, prompt the user to run `gh auth login`.

## Input

The user provides one or more of:

- **Description** (required) — plain-language explanation of the bug, feature,
  task, or epic
- **Type override** (optional) — explicitly request bug, feature, task, or epic
- **Repo override** (optional) — `owner/repo` when not filing against the
  current working directory's repo
- **Labels** (optional) — specific labels to apply
- **Milestone** (optional) — target milestone
- **Assignees** (optional) — GitHub usernames to assign

## Workflow

Follow these steps in order. Do not skip any step.

### Step 1: Determine the target repository

Detect the repo from the current working directory:

```bash
gh repo view --json nameWithOwner --jq '.nameWithOwner'
```

If the user specified a repo explicitly, use that instead. Confirm the repo
with the user before proceeding.

### Step 2: Classify the issue type

Determine the type from context. If the user specified a type, use it.
Otherwise, infer from keywords in the description:

| Type    | Signal words                                                                  |
| ------- | ----------------------------------------------------------------------------- |
| Bug     | bug, broken, crash, error, fail, regression, wrong, not working, unexpected   |
| Feature | add, support, introduce, new, would be nice, should, enhance, improve, enable |
| Task    | refactor, update, migrate, rename, clean up, chore, debt, remove, upgrade     |
| Epic    | epic, initiative, multi-sprint, umbrella, group of features, high-level       |

When ambiguous, ask the user to clarify.

### Step 3: Analyze the codebase (bug reports only)

For bug reports, perform a brief code analysis before drafting to help
identify the root cause. This adds valuable context to the issue:

1. If the user mentions specific UI elements, file paths, or error
   messages, search the codebase for related code:
   ```bash
   rg "<error message or keyword>" --type ts --type svelte -l
   ```
2. Read the relevant source files to understand the current behavior
3. Summarize your findings in the bug description — include:
   - Which file(s) and function(s) are likely involved
   - What the current code does vs what the user expects
   - A brief root-cause hypothesis if one is apparent

This analysis is informational — include it in the issue body under
"Additional context" or inline in the bug description. Do not fix the
bug or propose code changes in the issue.

Skip this step for feature requests, tasks, and epics.

### Step 4: Search for duplicates

Before drafting, search for existing issues that might cover the same topic:

```bash
gh search issues "<3-5 keywords from description>" --repo <owner/repo> --limit 5 --json number,title,state,url
```

Present any matches to the user. If a duplicate exists, ask whether to
proceed, reference the existing issue, or abandon.

### Step 5: Read the repo's issue templates

Read the `.github/ISSUE_TEMPLATE/` directory from the repo to identify
the correct template and its metadata:

```bash
ls .github/ISSUE_TEMPLATE/*.yml
```

If the repo is not cloned locally, fetch templates via API:

```bash
gh api "repos/<owner>/<repo>/contents/.github/ISSUE_TEMPLATE" --jq '.[].name'
```

From the matching template file, extract:

- **`projects:`** — which project board(s) to assign
- **`labels:`** — which labels the template auto-applies (do not duplicate
  these via `--label`)
- **`type:`** — the GitHub issue type (handled by the template, not by labels)
- **Required/optional fields** — which body sections to include

See `references/repo-templates.md` for the shared template structure.

### Step 6: Gather metadata

**Labels** — fetch available labels and suggest matches:

```bash
gh label list --repo <owner/repo> --json name --jq '.[].name'
```

Suggest labels based on the description content and known domain mappings
(see Label Heuristics below). Never apply labels blindly — present
suggestions and let the user confirm. Do not duplicate labels that the
template already applies via its `labels:` field.

**Milestone** — fetch open milestones and suggest:

```bash
gh api "repos/<owner>/<repo>/milestones?state=open" --jq '.[].title'
```

Suggest the most recent open milestone unless the user specified one.

**Project** — use the project(s) from the template's `projects:` field.

### Step 7: Draft the issue — STOP and show to the user

Compose the title and body matching the template structure for the chosen
type (see Issue Body Templates below). Present the full draft to the user:

```
## Draft Issue — please review before I create it

**Repo:** <owner/repo>
**Type:** <bug|feature|task|epic>
**Title:** <title>
**Labels:** <label1, label2>
**Milestone:** <milestone>
**Project:** <project>
**Assignees:** <@user1, @user2>

**Body:**
<full markdown body>
```

**CRITICAL: You MUST stop here and wait for the user's response.**
Do NOT proceed to Step 8 in the same turn. End your turn after presenting
the draft. Use the AskQuestion tool to ask the user:

- "Create this issue" — proceed to Step 8
- "Edit the draft" — ask what to change, revise, and present again
- "Abandon" — stop without creating

Never run `gh issue create` without the user explicitly confirming.

### Step 8: Create the issue (only after explicit user confirmation)

**Only execute this step after the user has reviewed the draft from Step 7
and explicitly confirmed.** If the user has not yet confirmed, go back to
Step 7.

Build the `gh issue create` command with all metadata. Include one
`--project` flag per project listed in the template:

```bash
gh issue create \
  --repo <owner/repo> \
  --title "<title>" \
  --label "<label1>" --label "<label2>" \
  --milestone "<milestone>" \
  --assignee "<user1>" \
  --project "<project1>" --project "<project2>" \
  --body "$(cat <<'EOF'
<body content>
EOF
)"
```

### Step 9: Display the result

The `gh issue create` command outputs the issue URL. Display it as a
clickable markdown link:

```
Created issue [#123](https://github.com/owner/repo/issues/123)
```

## Issue Body Format

Build the issue body dynamically from the template file read in Step 5.
For each form element in the template's `body:` array that has a `label:`
field, create a markdown section heading (`### <label>`) followed by the
content derived from the user's description.

General format:

```bash
gh issue create \
  --repo <owner/repo> \
  --title "<concise title>" \
  --body "$(cat <<'EOF'
### <label from first form field>

<content for this field>

### <label from second form field>

<content for this field>

...
EOF
)"
```

**How to fill each field type:**

| Template field type   | How to populate                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| `textarea` (required) | Fill from the user's description. Ask the user if not enough info.          |
| `textarea` (optional) | Include if the user provided relevant info, otherwise write "_No response_" |
| `input`               | Fill from user's description or ask                                         |
| `dropdown`            | Pick the matching option from the template's `options:` list                |

For bug reports, include any code-analysis findings from Step 3 in the
appropriate section (typically "Bug description" or "Additional context").

## Label Heuristics

When suggesting labels, scan the user's description for these patterns.
Only suggest labels that actually exist in the target repo (verified via
`gh label list`).

### Domain labels

Fetch all labels from the target repo:

```bash
gh label list -L 300 --repo <owner/repo> --json name --jq '.[].name'
```

Filter for labels with a `domain/` prefix. Match the user's description
against these domain label names and suggest the best match. Only suggest
labels that actually exist in the repo.

### Priority labels

Suggest a priority label based on severity and impact cues in the
description. Only suggest if the repo has matching labels (check via
`gh label list`).

| Signal words                                                         | Suggested priority  |
| -------------------------------------------------------------------- | ------------------- |
| crash, data loss, security, blocker, cannot use, broken for everyone | `priority/critical` |
| regression, broken, blocks, urgent, important                        | `priority/high`     |
| should fix, annoying, inconvenient, workaround exists                | `priority/medium`   |
| nice to have, minor, cosmetic, polish                                | `priority/low`      |

## Hard Rules

1. **Always search for duplicates** before drafting (Step 4). Skipping this
   wastes everyone's time.
2. **Never create without user confirmation.** Always present the full draft,
   STOP your turn, and wait for explicit approval. Do NOT run `gh issue
create` in the same turn as presenting the draft.
3. **Never invent requirements.** The issue body must reflect only what the
   user described. If information is missing (e.g., OS for a bug report),
   ask the user rather than guessing.
4. **Always include project assignment.** Read the `projects:` field from
   the template and pass every project via `--project`.
5. **Display the created issue URL** as a clickable markdown link after
   creation.
6. **Do not duplicate template labels.** If the template's `labels:` field
   already applies labels (e.g. `kind/bug`), do not pass them again via
   `--label`. Only add additional domain/topic labels.
7. **Do not add type labels manually.** The `type:` field in the template
   sets the GitHub issue type automatically.
8. **Respect the template structure.** Use the section headings from the
   repo's actual template — do not substitute your own.
