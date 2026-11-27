---
name: break-down-epic
description: >-
  Use when a GitHub epic with specs, mockups or design links has no implementation plan and needs
  splitting into small, assignable, reviewable child issues with acceptance criteria and
  blocked-by/blocking ordering. Triggers: "break down epic #N", "split this epic", "slice the epic",
  "child issues for epic", "plan the work for this epic", "specs without an implementation plan".
argument-hint: '<epic issue number | URL | owner/repo#N>'
allowed-tools: Bash(gh issue view:*) Bash(gh issue list:*) Bash(gh api:*) Bash(gh repo view:*) Read Grep Glob
---

# Break down an epic

Target: `$ARGUMENTS`.

Turn an epic and its linked specs into a reviewed set of child issues, each small enough to assign
and review, ordered with native GitHub sub-issue and dependency links.

This skill is repo-agnostic. Never assume a repo, label, project board or template: discover them
at runtime from the target repo.

## Principles

- Read-only until the user approves the draft. Creating issues is outward-facing and hard to undo.
- Only what the epic and its linked specs say. Anything inferred is written as an open question.
- Slices follow the code and the spec, not the other way round.

## Workflow

### 1. Resolve the target

Parse `$ARGUMENTS` into `owner/repo` and issue number. If only a number is given, use
`gh repo view --json nameWithOwner`. Pass `-R owner/repo` on every `gh` call: the local remote may
be a fork and then `gh issue view N` fails to resolve.

Children are created in the epic's repo (v1: no cross-repo children).

### 2. Gather

Read, in this order:

1. The epic: title, body, labels, issue type, comments.
2. Existing sub-issues: `gh api repos/{o}/{r}/issues/{n}/sub_issues`. Keep them; never duplicate.
3. Every linked issue, PR, spec doc and Figma/mockup link. Open image attachments and read them.
4. The repo's `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` and `.github/ISSUE_TEMPLATE/`.

If the `issue-requirements` skill is available, use it for steps 1 and 3.

### 3. Check the epic can be split

Stop and report, without drafting, if:

- there is no spec, mockup or goals list: say exactly what is missing;
- the epic is a tracker of repeated identical work (one item per repo, page, or extension): say it
  needs a checklist or one template child per item, not a design breakdown.

### 4. Map the code

For each part of the spec, find the components, modules and interfaces it touches in the repo.
Use this to size slices and to find shared plumbing. Record file paths as hints in child bodies,
not as instructions to change code.

### 5. Slice

Apply `references/slicing-rules.md`. Add one consolidated E2E/integration child last when the repo
has end-to-end tests. Turn every ambiguity in the spec into a decision item or an open question.

### 6. Order

Derive blocked-by edges per `references/ordering-rules.md`. Validate: no cycles, no needless edges,
no chain deeper than 3 without a flag. Compute the set of children with no blockers ("ready now").

### 7. Draft and STOP

Show the draft as:

1. A table: `#`, title, labels, size (S/M/L), blocked by, blocks.
2. The "ready now" list.
3. Each child's full body per `references/child-issue-format.md`.
4. Open questions for the epic owner.

End the turn. Ask: create all, edit the draft, or abandon. Never run a write call before an
explicit "create".

### 8. Create (only after confirmation)

Create children with the repo's template, issue type and labels, link each as a sub-issue of the
epic, write dependency edges, then read them back to verify. Report created issue URLs and any
edge that failed. If the epic lacks a Scope or Acceptance criteria section, offer the text; never
edit the epic without being asked.

## Hard rules

1. No creation, linking or editing without explicit confirmation of the draft.
2. No invented requirements. Unknown means open question.
3. Check for duplicates of each proposed child (`gh issue list -R ... --search`) before drafting.
4. Use the repo's own template headings, labels and project; do not substitute your own.
5. Every child has testable acceptance criteria.
6. Do not duplicate existing sub-issues.
7. Dependencies only where B cannot be built or merged without A.

## Quick reference

| Step   | Output                                           |
| ------ | ------------------------------------------------ |
| Gather | epic, specs, existing children, repo conventions |
| Slice  | child list, one concern each                     |
| Order  | blocked-by edges, ready-now set                  |
| Draft  | table + bodies + questions, then stop            |
| Create | issues, sub-issue links, dependencies, read-back |
