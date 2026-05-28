---
name: review-solution
description: Review implemented changes against plan, quality gate, and project standards; write review notes to docs-local. Use when the user asks for a review, quality check, or invokes /review-solution.
disable-model-invocation: true
---

# Review Solution

## Workflow

1. **Load context**: `docs-local/tasks/<slug>/plan.md`, `notes.md`, and full git diff
2. **Run quality gate**:

```bash
npm run type-check
npm run lint:strict
npm run test
```

3. **Review checklist**
   - [ ] Meets acceptance criteria in plan
   - [ ] No scope creep; diff is focused
   - [ ] Matches project patterns (types, API schema, components)
   - [ ] No secrets, debug logs, or dead code
   - [ ] Tests cover behavior changes

4. **Write** `docs-local/tasks/<slug>/review.md`:

```markdown
# Review: [Task title]

**Date:** YYYY-MM-DD  
**Verdict:** pass | pass-with-notes | fail

## Summary
[2–3 sentences]

## Quality gate
- type-check: pass | fail
- lint:strict: pass | fail
- test: pass | fail

## Findings
### Must fix
- [issue]

### Suggestions
- [optional improvement]

## Plan coverage
- [criterion]: met | not met
```

5. **Fix must-fix items** if verdict is `fail`; re-run gate and update review
6. **Tell user** verdict and whether ready for `/open-pr`

## Feedback severity

- **Must fix**: blocks merge (bugs, gate failures, missing criteria)
- **Suggestion**: optional improvement
- **Nice to have**: polish only
