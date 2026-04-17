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

## Pull request workflow
- When changes need to be submitted, create pull requests instead of asking again for PR preference.
- When the user asks for a pull request to be auto-merged, after that pull request is merged, delete the local branch and the remote branch, then switch the local checkout to the latest `main`.
- This repository has two remotes:
- `origin` = `git@github.com:phenix3443/ppanel-frontend.git`
- `upstream` = `git@github.com:perfect-panel/frontend.git`
- By default, create two pull requests for the same task branch when submission is requested:
- one PR from the task branch in `origin` to `origin/main`
- one PR from the corresponding branch in `upstream` to `upstream/main`
- If only one remote can be used because of permissions, branch availability, or an explicit user instruction, state that clearly when reporting the result.

## Worktree workflow
```bash
git fetch origin
git worktree add ../ppanel-frontend-main main
git worktree add -b feat/your-change ../ppanel-frontend-feat main
```
