# Ordering rules

Model the plan as a directed graph: edge `A -> B` means "B is blocked by A".

## When to add an edge

Add `A -> B` only if B cannot be built or merged without A:

- A introduces a component, API, store, schema or token that B consumes.
- A is a layout shell or slot system that B fills.
- A is a decision or spec-clarification item whose answer changes B.
- B is the consolidated E2E child: it is blocked by every feature child it covers.

## When not to add an edge

- B would merely be nicer after A, or A is "more important". Use ordering in the table, not an edge.
- Siblings that are independent. Edges between them serialize work for no reason.
- Transitive duplicates: if `A -> B` and `B -> C`, do not also add `A -> C`.

## Validation before showing the draft

1. No cycles. If one appears, the slicing is wrong: merge or re-split the children involved.
2. Longest chain: flag anything deeper than 3. It usually means the slicing is too fine or one
   child is a hidden bottleneck.
3. Fan-out: a child that blocks more than about 5 others is a bottleneck; say so and make sure it
   is small and first.
4. Compute "ready now": children with no blockers. Show them separately; this is the set that can
   be assigned today.

## Presentation

```
#  Child                         Blocked by   Blocks
1  Layout shell + slot system    -            2, 3, 4
2  Section A                     1            5
3  Section B                     1            5
4  Section C                     1            5
5  Consolidated E2E              2, 3, 4      -

Ready now: 1
```

Precedent: a layout-shell issue blocking the four section issues that fill its slots.
