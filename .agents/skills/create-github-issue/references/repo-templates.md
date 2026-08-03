# How to Read Issue Templates

Do not hardcode template filenames, field names, or body headings.
Read everything from the target repo's `.github/ISSUE_TEMPLATE/` at
runtime. Support both `.yml` and `.yaml` extensions.

## Match template to issue type

When the directory contains multiple templates, select the right one:

1. Read the top-level `type:` field from each template file
2. Select the template whose `type:` matches the classified issue type
3. If no exact match, ask the user which template to use

## Extract metadata from a template

Each template YAML file contains top-level fields and a `body:` array.
Parse these to build the issue:

| What to extract     | Where in the YAML                                                            |
| ------------------- | ---------------------------------------------------------------------------- |
| GitHub issue type   | `type:` (top-level)                                                          |
| Auto-applied labels | `labels:` (top-level)                                                        |
| Project board(s)    | `projects:` (top-level)                                                      |
| Body sections       | `body:` array — each element with a `label:` becomes a `### <label>` heading |
| Required fields     | Elements where `validations.required: true`                                  |
| Dropdown options    | Elements with `type: dropdown` — read `attributes.options`                   |

## Build the issue body

For each element in the `body:` array (skip `type: markdown` elements):

1. Read its `attributes.label` — this becomes the section heading
2. Check `validations.required` — if true, the section must be filled
3. For `type: dropdown`, pick from `attributes.options`
4. For `type: textarea` or `type: input`, fill from the user's description
