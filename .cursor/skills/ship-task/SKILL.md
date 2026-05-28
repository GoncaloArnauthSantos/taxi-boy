---
name: ship-task
description: Implement an approved task plan with quality-gate validation and docs-local updates. Use when the user asks to ship, implement, build, or execute a planned task, or invokes /ship-task.
disable-model-invocation: true
---

# Ship Task

## Prerequisites

- Approved plan in `docs-local/tasks/<slug>/plan.md`, or user gave clear scope inline
- Read project rule **quality-gate** before coding

## Workflow

1. **Load plan**: read `docs-local/tasks/<slug>/plan.md`; set status to `in-progress`
2. **Implement**: minimal diff; follow existing conventions in touched files
3. **Validate** (fix until green):

```bash
npm run type-check
npm run lint:strict
npm run test
```

4. **Document**: append to `docs-local/tasks/<slug>/notes.md`:
   - Files changed and why
   - Deviations from plan (if any)
5. **Update plan**: set status to `done`; check off acceptance criteria met
6. **Report**: what shipped, commands run, remaining follow-ups

## Do not

- Commit unless the user explicitly asks
- Skip failing lint/type-check/tests
- Expand scope beyond the plan without asking

## Handoff

Suggest `/review-solution` before `/open-pr` when the change is non-trivial.
