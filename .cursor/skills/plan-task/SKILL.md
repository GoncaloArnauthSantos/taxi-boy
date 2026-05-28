---
name: plan-task
description: Plan a development task using docs-local context and produce a structured plan with acceptance criteria. Use when the user asks to plan a task, scope work, write a plan, or start /plan-task.
disable-model-invocation: true
---

# Plan Task

## Workflow

1. **Bootstrap docs-local** if missing: `cp -R .cursor/templates/docs-local docs-local`
2. **Gather context**: read `docs-local/decisions/`, related `docs-local/tasks/`, and relevant source files
3. **Choose slug**: kebab-case (e.g. `admin-v2-bookings-filters`)
4. **Create** `docs-local/tasks/<slug>/plan.md` using the template below
5. **Present plan** to the user; wait for approval before implementing unless they said to proceed

## plan.md template

```markdown
# [Task title]

**Slug:** `<slug>`  
**Status:** planned | in-progress | done  
**Created:** YYYY-MM-DD

## Goal
[One paragraph — what and why]

## Context
- Relevant decisions: [links to docs-local/decisions/]
- Out of scope: [bullets]

## Approach
1. [Step]
2. [Step]

## Acceptance criteria
- [ ] [Testable outcome]
- [ ] Quality gate passes (type-check, lint:strict, test)

## Risks / open questions
- [Question or risk]
```

## Output to user

Summarize: goal, approach (3–5 bullets), acceptance criteria, and the path to `plan.md`.
