# Physcal

## Workflow

- Never commit to `main`. Every change goes on a feature branch and reaches `main` through a pull request.
- After pushing commits, always make sure an open PR exists for them. Run `gh pr list --head <branch> --state open` first: if the branch has no open PR (including when its earlier PR was already merged), create one with `gh pr create --base main`. Do not assume an earlier PR is still open.
- Pushing more commits to a branch whose PR was merged does not publish them. Start a new branch from `main`, or open a new PR, and say which PR the work is in.
- End every task that changes code by giving the user the PR URL.
- Do not merge a PR unless the user asks; merging to `main` triggers the GitHub Pages deploy.
- Commits follow Conventional Commits (enforced by commitlint).

## Stack

- Vite, React and TypeScript. Run `npm test` and `npm run build` before opening a PR.
- UI uses the `@grass-ds/css` classes and `@grass-ds/tokens` variables where the design system has a component; see README for details.
