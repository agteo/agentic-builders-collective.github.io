# ID Guidelines

IDs become anchors and relationship keys, so keep them stable, readable, and deterministic.

## Rule

Use lowercase kebab-case from the public name or title.

```text
Jane Doe -> jane-doe
Evals for Agents -> evals-for-agents
#7 - Agentic Builders at Example Labs on 2026-05-14 -> 2026-05-14-agentic-builders-at-example-labs
```

Event filenames and `eventId` values must start with the event date as `YYYY-MM-DD`, followed by a readable kebab-case event name.

Allowed characters are lowercase letters, numbers, and hyphens. Do not use spaces, underscores, punctuation, random numbers, or opaque numeric-only IDs.

Avoid IDs like `person-17`, `jane-doe-483`, or `event-12`. They are harder to review, cannot be reproduced by another agent, and do not explain what collision they were meant to solve.

## If There Is A Collision

Do not add random digits by default. Add the smallest meaningful deterministic suffix:

- People: add a middle initial, handle, or company if needed, for example `jane-q-doe` or `jane-doe-example-labs`.
- Events: the date prefix usually prevents collisions; if needed, add the venue or format, for example `2026-05-14-agentic-builders-at-example-labs-workshop`.
- Presentations: include the event or year, for example `evals-for-agents-2026-05-14-agentic-builders-at-example-labs`.
- Projects: include the maker or organisation, for example `eval-dashboard-jane-doe`.
- Articles: include the publication or year, for example `singapore-agent-builders-example-times`.

Use `-2` only as a last resort when no meaningful suffix exists.

## Check Before Editing

Search before adding a new ID:

```sh
rg -n "(id: jane-doe|personId: jane-doe|eventId: 2026-05-14-agentic-builders-at-example-labs)" src/content
rg --files src/content/events src/content/projects | rg "/2026-05-14-agentic-builders-at-example-labs\\.md$|/evals-for-agents\\.md$"
```

Then run:

```sh
pnpm check
pnpm build
```

`pnpm build` fails if a `personId` or `eventId` points at a missing person or event.
