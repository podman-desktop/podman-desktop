# Child issue format

## Prefer the repo's template

List `.github/ISSUE_TEMPLATE/` (`.yml` and `.yaml`). Pick the template whose top-level `type:` is
`task` (or `feature` when the child adds user-visible behavior). Use its section headings, its
`projects:` and its auto-applied `labels:`. Put the content below into the template's main
textarea field.

## Fallback when the repo has no template

```markdown
### Description

<one paragraph: what to build and why, in the epic's terms>

### Scope

- <bullet per behavior, taken from the spec>

Out of scope: <what neighbouring children cover>

### Acceptance criteria

- [ ] <testable statement>
- [ ] Unit tests cover <rule>
- [ ] Covered by E2E #<n> (when a consolidated E2E child exists)

### Open questions

- <only if the spec is silent or ambiguous>

### References

- Epic: #<epic>
- Spec / mockup: <link>
- Code hints: <paths found in step 4>
- Blocked by: #<n> (only if dependencies cannot be written via the API)
```

## Rules

- Acceptance criteria are testable statements, not intentions.
- Quote or link the spec for every behavior; never add behavior the spec does not contain.
- Copy the epic's domain/area labels to the child; add only labels that exist in the repo.
- Embed the relevant mockup crop or link rather than the whole spec.
- Placeholders are written as real issue numbers only after creation; in the draft use `#<child-N>`
  and keep a mapping.
