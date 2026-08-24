# Issues: four reports from the design systems team

All four are reproducible on `main` as you receive it. They are written the
way the reporters wrote them: what they saw, not where it lives.

---

## #1 — Gray tint does nothing

> In the playground's brand panel, changing **Gray tint** (Sand, Mauve, Slate,
> Sage, Olive) has no visible effect — every option renders the same neutrals.
> Accent colour, radius, scaling and typeface all work fine. This used to work.

Reproduce: `npm run dev` → http://localhost:5173 → brand panel → cycle Gray tint.

## #2 — Station cards lost their selected state

> Under Molecules → StationListCard, the `selected` variant looks identical to
> the default one. It should have a ring around it and sit slightly raised.
> Nothing in the console.

Reproduce: `npm run dev` → Components tab → Molecules → StationListCard.

## #3 — Exported JSX will not compile

> I opened the composer, went to the **Station detail** screen, hit *Copy JSX*
> and pasted it into a new file in our app repo. TypeScript says one of the
> imports does not resolve. The other screens I tried were fine.

Reproduce: `npm run dev` → http://localhost:5173/composer.html → Station detail
→ Export → Copy JSX.

## #4 — Theme settings leak across UI libraries

> I customized the Volt theme, then switched to Atlas Web. Atlas Web opened
> with the theme choices I had just made in Volt instead of its own theme. When
> I switched between the libraries again, their theme settings continued to
> affect each other. I see the same behavior in the playground and composer.

Reproduce: `npm run dev` → http://localhost:5173 → customize Volt's theme and
appearance → switch the active UI library to Atlas Web or Atlas Charge. Repeat
the same flow in the composer at http://localhost:5173/composer.html.

### Acceptance criteria

- Each UI library uses its own default theme when it has no saved customization.
- Customizing one UI library does not change another library's theme.
- Switching back to a previously customized library restores that library's
  own settings.
- Brand preset, accent color, gray tint, radius, scaling, typeface, panel style
  and light/dark appearance are isolated per library.
- The behavior is consistent in both the playground and the composer.

---

## While investigating

Each report is one symptom. Fix the cause, not the symptom — a change that
makes the reported case look right while leaving the underlying defect in
place will not pass review.

`npm test` is green on the starter repository. That is part of what you are
being asked to look at; see Part 2 in [`TASK.md`](./TASK.md).
