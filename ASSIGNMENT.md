# Take-home: Prism UI

Using AI agents is expected and encouraged — we are not testing whether you
can work without them, but your judgement about what they tell you.

## The codebase

Prism UI is an internal workbench our design systems team uses. It holds
several complete UI libraries (components + design tokens), a live theming
playground, and a composer for laying out screens from those components and
exporting them as JSX or as Figma-ready token files.

You have not seen it before. It is about 20,000 lines. **You are not expected
to read all of it** — part of what we are looking at is how you decide what
*not* to read.

```bash
npm install
npm run dev      # playground → http://localhost:5173
                 # composer   → http://localhost:5173/composer.html
npm test         # ~2 seconds
npm run build    # ~5 seconds
```

## Start here

1. Read [`ISSUE.md`](./ISSUE.md) — four bug reports.
2. Read [`TASK.md`](./TASK.md) — what to do, how to submit, how it is reviewed.
3. Run the app and reproduce all four.
4. Fix them, then answer the test-suite audit in [`DECISIONS.md`](./DECISIONS.md).

Fork this repository first and keep your fork public. See "Where to submit" in
[`TASK.md`](./TASK.md).

## Orientation

- `README.md` — architecture reference: token layers, libraries, export formats.

Treat AI suggestions as working hypotheses. You are responsible for checking
them against the repository before changing code.
