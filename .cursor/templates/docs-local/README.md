# docs-local

Local-only workspace for decisions, task plans, and release notes.  
**Not committed to git** — see `.cursor/rules/docs-local.mdc`.

## Structure

| Path | Purpose |
|------|---------|
| `decisions/` | Architecture and product decisions (ADRs) |
| `tasks/<slug>/` | Per-task plan, notes, review |
| `releases/<version>/` | Release scope and changelog drafts |

## Task workflow

1. `/plan-task` → `tasks/<slug>/plan.md`
2. `/ship-task` → implement + `notes.md`
3. `/review-solution` → `review.md`
4. `/open-pr` → GitHub PR using task docs for summary

Copy new tasks from `tasks/_template/`.
