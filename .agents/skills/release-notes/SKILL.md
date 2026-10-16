---
name: release-notes
description: >-
  Use when the user asks to draft, generate, or write Podman Desktop release
  notes for a version or GitHub milestone, prepare a release blog post, or
  summarize what shipped in a milestone.
---

# Release Notes

Draft a Podman Desktop release blog post from GitHub milestone data. Gather
PRs and contributors with `gh`, then write user-facing highlights and a
grouped changelog using the release notes template.

## Prerequisites

- `gh` CLI authenticated (`gh auth status`)

## Inputs

Ask the user for whatever isn't already given:

- **milestone** (required) — e.g. `1.30.0`
- **publication date** (required) — planned publication date in `YYYY-MM-DD`
  format; reuse the published post's date when regenerating an existing release
- **username** (required) — GitHub username credited as the blog post author
- **org/repo** (optional) — defaults to `podman-desktop/podman-desktop`

## Workflow

### 1. Resolve the milestone

```
gh api --method GET repos/<org>/<repo>/milestones --paginate -f state=all
```

Find the milestone whose `title` matches exactly. If none match, list the
available milestone titles and ask the user to pick one rather than
guessing.

### 2. Fetch PRs in the milestone

```
gh api --method GET repos/<org>/<repo>/issues --paginate -f milestone=<milestone_number> -f state=closed -f per_page=100
```

Keep only entries that:

- have a `pull_request` field (excludes plain issues)
- have a `user`
- `user.type != "Bot"`
- `user.login` is not `podman-desktop-bot` or `step-security-bot`

### 3. Categorize for the changelog

For each kept PR, match its title against
`^\s*(chore|feat|docs|fix|refactor|test|ci)` (case-insensitive). Drop PRs
whose title doesn't match any of these prefixes, so a title without a conventional-commit prefix never appears in the
changelog section. Override the category to `test` if the title contains
`(test` (e.g. `chore(test): ...`).

Group PRs by category, then order the categories `feat`, `fix`, `chore`,
followed by any remaining categories in the order they were encountered.

### 4. Find first-time contributors

```
gh api --method GET repos/<org>/<repo>/pulls --paginate -f state=all -f per_page=100
```

Use this repository PR history to find each milestone author's oldest PR.
An author is a first-time contributor when their oldest PR belongs to this
milestone. If they have more than one PR in the milestone, keep only the
oldest one (by `created_at`).

### 5. Write the highlighted features

Take user-visible `feat` and `fix` PRs from step 2 as highlight candidates.
Keep chores in the detailed changelog. For each candidate, strip everything from `### Screenshot / video of UI` onward in the PR
body — that section is for reviewers, not readers. If the body contains
`Closes #N` or `Fixes #N`, fetch that issue
(`gh issue view N --repo <org>/<repo>`) and prepend its body; issues often
carry more user-facing context than the PR description.

From this material, pick up to 5 of the most interesting, user-impactful
items and write, in your own words:

- `title` — short and original, no colon or "Feature:"/"Title:" prefix
- `shortDesc` — 1-2 sentences
- `longDesc` — 2-4 sentences, more detail than shortDesc

Write in a natural, user-facing changelog voice. Never refer to "this PR"
or an issue number — describe it as a feature or fix that shipped. Don't
repeat the same phrasing across entries. Use fewer than 5 if fewer qualify;
if none qualify, skip the highlights sections entirely (the template below
still reads fine without them).

### 6. Render the output

Follow `references/release-notes-template.md`, matching the published posts
in `website/blog/`. Fill in:

- `version` — the milestone with the trailing `.0` stripped (e.g.
  `1.30.0` → `1.30`)
- `publicationDate` — the planned date in `YYYY-MM-DD` format
- `username` — the input username
- `highlighted` — step 5's list
- `firstTimeContributors` — step 4's list
- `changelog` — step 3's grouped, sorted categories

### 7. Write the file

Save to `website/blog/{publication-date}-release-{version}.mdx`, matching
existing filenames such as `website/blog/2026-07-30-release-1.29.mdx`. Use
the planned publication date, not the date the draft is generated. If the
file already exists, ask before replacing it.

Tell the user the path and remind them it needs a banner image at
`website/static/img/blog/podman-desktop-release-{version}/banner.png` and a
human editing pass, including verification of first-time contributors.
