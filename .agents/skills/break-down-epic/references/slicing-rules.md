# Slicing rules

A child is "small enough" when one person can build it and one reviewer can review it in one sitting.

1. **One concern per child.** If the title needs "and" or "also", split it. Four independent
   filters are four children, not one "toolbar" child.
2. **Independently mergeable.** After the child merges, the product still works. If it cannot
   merge alone, it is part of a larger child or needs a flag.
3. **Plumbing first.** Shared components, APIs, stores, tokens or schemas the spec needs by
   several pieces get their own child, so the consumers stay small.
4. **Structure before content.** A layout shell with placeholder slots is a child; each section
   that fills a slot is another.
5. **Not too small.** A child that is a few lines with no behavior of its own (a rename, a single
   prop) is folded into the child that needs it, unless it is a prerequisite for several.
6. **Size guide.** S: one component or function plus tests. M: a few related files plus tests. L:
   anything bigger; try to split. Flag any L that cannot be split and say why.
7. **Decisions are children too.** When the spec is silent or contradicts itself, create a
   decision item (or an open question inside the affected child) instead of choosing silently.
8. **One consolidated E2E child last**, when the repo has E2E tests. Feature children reference it
   ("covered by #N") instead of each carrying E2E work.
9. **Respect existing children.** Skip or extend what already exists; never restate it.
10. **Follow repo conventions.** Honor rules found in `AGENTS.md` / `CONTRIBUTING.md` (e.g. "one
    concern per PR", "unit tests mandatory"). Put them in the acceptance criteria.

## Title style

Short, imperative, shared prefix when the epic is a single initiative:
`<Initiative>: <specific piece>`.
