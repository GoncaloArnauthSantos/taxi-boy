---
name: open-pr
description: Push branch and open a GitHub pull request using gh CLI and local GitHub credentials from .cursor/secrets. Use when the user asks to open a PR, create a pull request, or invokes /open-pr.
disable-model-invocation: true
---

# Open PR

## Auth (required)

Load credentials before any `gh` or `git push` that needs auth.

**Option A — secrets file (recommended for agent)**

1. `mkdir -p .cursor/secrets && cp .cursor/secrets.example.env .cursor/secrets/github.env`
2. Set `GITHUB_TOKEN` (PAT with `repo` scope) or fine-grained token with PR access
3. Before `gh` / authenticated `git push`:

```bash
set -a && source .cursor/secrets/github.env && set +a
```

**Option B — gh CLI login**

If `gh auth status` succeeds, skip the secrets file.

Never commit `.cursor/secrets/` or paste tokens into chat or PR bodies.

## Prerequisites

- Review verdict `pass` or `pass-with-notes` in `docs-local/tasks/<slug>/review.md` (or user waived review)
- Quality gate green on current branch
- User asked to open a PR (do not open unprompted)

## Workflow

1. **Git state** (parallel):

```bash
git status
git diff
git log -5 --oneline
git rev-parse --abbrev-ref HEAD
git rev-parse --abbrev-ref @{upstream} 2>/dev/null || true
```

2. **Base branch**: default `main`; confirm with `git log main..HEAD` or user instruction
3. **Push** (needs network + auth):

```bash
git push -u origin HEAD
```

4. **Create PR** with `gh pr create`. Body should include summary from `docs-local/tasks/<slug>/` and a test plan:

```bash
gh pr create --title "..." --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] ...

EOF
)"
```

5. **Return** the PR URL to the user

## Commit policy

Only commit when the user explicitly requested it. Use HEREDOC commit messages; never amend pushed commits unless asked.

## On failure

- `401` / auth errors → verify `github.env` or run `gh auth login`
- No upstream → push with `-u origin HEAD` first
- Dirty tree → ask whether to commit or stash before PR
