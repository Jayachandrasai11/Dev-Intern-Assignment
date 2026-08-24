# Assignment

Fix the four issues in [`ISSUE.md`](./ISSUE.md), then audit the test suite.

---

## Part 1 — The four bugs

For each of the four reports:

- **Find the root cause** — the specific file and line, and why that line
  produces that symptom. "Changed X and the symptom went away" is not a root
  cause and does not pass.
- **Fix it** with the smallest reasonable change. Do not restructure the
  token system, the composer, or the theming layer.
- **Add or update a test** that would have caught it.

Some of these sit further from their symptom than others. One fully understood
bug is better evidence than four half-diagnosed guesses.

## Part 2 — Audit the test suite

`npm test` reports **278 passing tests**. `README.md` states that the contract
between the CSS and the token model is *"enforced by
`src/tokens/css-contract.test.ts`, which also fails on any CSS variable that no
token emits."*

**How much of that green is real?** In `DECISIONS.md`, answer:

- Roughly how many of the 278 tests would fail if the thing they test were
  broken. Give a number and the method you used to get it — not an impression.
- Which tests you would not trust, and precisely why.
- Whether the suite would have caught each of the four bugs, and what let
  each one through.
- What you would change first, given one day to make the suite honest.

Part 2 carries the same weight as Part 1.

---

## Required work

- Preserve the public API of every module you touch.
- Keep changes focused; you may modify files under `src/`.
- Complete `DECISIONS.md` **personally**, after reviewing your final diff.
- Use commits for useful checkpoints. Commit count is not scored.
- Open the pull request manually, following "Where to submit" below.

## Where to submit

1. Fork this repository into your own GitHub account.
2. Keep your fork **public**, so we can read your pull request.
3. Work on a branch in your fork.
4. Open the pull request **into `main` on your own fork**.

Do not open a pull request against this repository. Pull requests opened here
are visible to every other candidate and will not be reviewed.

## How to submit

Opening the pull request is not the submission. Send your enrolled email address
and the pull request URL to the grader URL provided in your assignment
invitation:

```bash
curl -X POST "$GRADER_URL/submissions" \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","prUrl":"https://github.com/you/Dev-Intern-Assignment/pull/1"}'
```

Use only the invitation-provided grader URL. Send the pull request URL, not the
branch or repository URL. A successful submission returns HTTP `202` with a
receipt. If you spot a mistake later, push the fix to the same pull request and
submit it again; the newest submission replaces the previous one.

## Naming

Use a short, descriptive branch name and pull request title. Keep the branch
name, commit messages and title consistent with the work you performed. If you
get them wrong, fix them and say so in the pull request description — it is not
a rejection, but we would rather see it corrected.

## AI use

**Using AI agents is expected and encouraged.** Claude Code, Cursor, Copilot,
whatever you normally use. We are not testing whether you can work without
them — we are testing your judgement about what they tell you.

Do not ask an AI agent to:

- Write `DECISIONS.md` for you.
- Open the pull request for you.
- Push code you have not personally reviewed.

Your pull request is judged partly on whether your reasoning matches the code
you submitted. We will ask follow-up questions from your `DECISIONS.md`.

## Constraints

- Do not add dependencies.
- Do not weaken or delete existing tests.
- Do not commit credentials or generated output.

## How this is reviewed

A correct diff is the entry bar, not the score. The sections of `DECISIONS.md`
that carry the most weight are **3 (what you rejected or narrowed)**,
**6 (how you directed the investigation)** and **7 (the test-suite audit)**.
Those are what we will ask you about in person, so write them from what you
actually did.
