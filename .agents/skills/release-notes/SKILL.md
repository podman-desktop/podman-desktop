---
name: release-notes
description: >-
  Generate a Podman Desktop release notes blog post draft for a GitHub
  milestone, reproducing the output of the podman-desktop/tool-release-notes
  tool directly in the agent session. No external script, GITHUB_TOKEN
  export, or separately configured LLM backend (Ollama, a local AI Lab
  service, Anthropic, OpenAI, Gemini, or Vertex AI) is needed. Use this any
  time the user asks to draft, generate, or write release notes for a Podman
  Desktop version or milestone, prepare a release blog post, or summarize
  what shipped in a milestone. Trigger keywords: release notes, generate
  release notes, release notes draft, milestone changelog, release blog
  post.
---

# Release Notes

Reproduce what `podman-desktop/tool-release-notes` produces, but gather the
GitHub data with `gh` and have whichever agent is running this skill write
the "highlighted feature" blurbs itself, in the same turn. In the original
tool, Ollama, a local AI Lab service, the Anthropic API, OpenAI, Gemini, and
Vertex AI all exist to do one thing: turn a feature's PR title/body into a
short, polished blurb. An agent running this skill already is an LLM, so
that step collapses into "write it yourself" — no credentials, ports, or
model selection required.

## Prerequisites

- `gh` CLI authenticated (`gh auth status`)

## Inputs

Ask the user for whatever isn't already given:

- **milestone** (required) — e.g. `1.30.0`
- **username** (required) — GitHub username credited as the blog post author
- **org/repo** (optional) — defaults to `podman-desktop/podman-desktop`

## Workflow

### 1. Resolve the milestone

```
gh api repos/<org>/<repo>/milestones --paginate
```

Find the milestone whose `title` matches exactly. If none match, list the
available milestone titles and ask the user to pick one rather than
guessing.

### 2. Fetch PRs in the milestone

```
gh api repos/<org>/<repo>/issues --paginate -f milestone=<milestone_number> -f state=closed -f per_page=100
```

Keep only entries that:

- have a `pull_request` field (excludes plain issues)
- have a `user`
- `user.type != "Bot"`
- `user.login` is not `podman-desktop-bot` or `step-security-bot`

### 3. Categorize for the changelog

For each kept PR, match its title against
`^\s*(chore|feat|docs|fix|refactor|test|ci)` (case-insensitive). Drop PRs
whose title doesn't match any of these prefixes — same as the original
tool, so a title without a conventional-commit prefix never appears in the
changelog section. Override the category to `test` if the title contains
`(test` (e.g. `chore(test): ...`).

Group PRs by category, then order the categories `feat`, `fix`, `chore`,
followed by any remaining categories in the order they were encountered.

### 4. Find first-time contributors

```
gh api repos/<org>/<repo>/contributors --paginate -f per_page=100
```

This returns each contributor's **lifetime** contribution count. Separately
count how many PRs each author has **in this milestone** (from step 2's
filtered list). An author is a first-time contributor when their lifetime
count equals their milestone count and both are greater than zero — i.e.
every contribution they've ever made landed in this milestone. If they have
more than one PR in the milestone, keep only the oldest one (by
`created_at`).

### 5. Write the highlighted features

Take the PRs from step 2 whose title starts with `feat` or `chore`. For
each, strip everything from `### Screenshot / video of UI` onward in the PR
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

Follow `references/release-notes-template.md` exactly — it defines the
structure the original tool's template produces. Fill in:

- `version` — the milestone with the trailing `.0` stripped (e.g.
  `1.30.0` → `1.30`)
- `username` — the input username
- `highlighted` — step 5's list
- `firstTimeContributors` — step 4's list
- `changelog` — step 3's grouped, sorted categories

### 7. Write the file

Save to `./{today's date as YYYY-MM-DD}-release-{version}.md` in the repo
root — the same filename convention the original tool uses. Tell the user
the path, and remind them it still needs a banner image at
`/img/blog/podman-desktop-release-{version}/banner.png` and a human editing
pass before it moves into `website/blog/`.

## Notes

- This skill has no dependency on which model is generating the highlights
  — whatever agent is running the session when this skill triggers does
  step 5 itself. There is nothing to configure.
- The original tool's template hardcoded links to the `containers/podman-desktop`
  org (a legacy name from before the project moved orgs). This skill's
  template points at `podman-desktop/podman-desktop` instead, matching how
  the repo is addressed today.
