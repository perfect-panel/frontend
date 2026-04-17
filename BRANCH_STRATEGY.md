# Branch Strategy

This repository uses a main-first task branch model.

## Long-lived branches
- `main` is the only long-lived development branch.

## Working branches
- Create feature work on `feat/*` directly from `main`.
- Create bug-fix work on `fix/*` directly from `main`.
- Open pull requests from `feat/*` and `fix/*` back into `main`.

## Protection and deployment rules
- Never push directly to `main`.
- `main` must only be updated by task branch pull requests.
- The k3s prod environment deploys the latest `main`.

## Worktree workflow
```bash
git fetch origin
git worktree add ../ppanel-frontend-main main
git worktree add -b feat/your-change ../ppanel-frontend-feat main
```
