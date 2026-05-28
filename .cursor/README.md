# Cursor agent setup

Project-specific rules, skills, and local-doc templates for AI-assisted development.

## Rules (`.cursor/rules/`)

| Rule | Scope | Purpose |
|------|-------|---------|
| `quality-gate.mdc` | Always | Type-check, lint, tests before shipping |
| `docs-local.mdc` | Always | Local task/decision docs workflow |
| `project-structure.mdc` | Always | Layering, folders, and naming |
| `api-routes.mdc` | `src/app/api/**` | API route patterns |
| `react-components.mdc` | `src/**/*.tsx` | UI/component conventions |

## Skills (`.cursor/skills/`)

Workflow chain for non-trivial work:

1. **`/plan-task`** — scope + acceptance criteria → `docs-local/tasks/<slug>/plan.md`
2. **`/ship-task`** — implement + quality gate + `notes.md`
3. **`/review-solution`** — review diff + gate → `review.md`
4. **`/open-pr`** — push branch and open GitHub PR

## Local docs (`docs-local/`)

Not committed. Bootstrap once:

```bash
cp -R .cursor/templates/docs-local docs-local
```

## GitHub auth for `/open-pr`

Copy the template and add your token locally (never committed):

```bash
cp .cursor/secrets.example.env .cursor/secrets.env
# Edit secrets.env — set GITHUB_TOKEN
```

Before `gh` / authenticated `git push`:

```bash
set -a && source .cursor/secrets.env && set +a
```

Or use `gh auth login`. Never commit `.cursor/secrets.env` or `.cursor/secrets/`.
