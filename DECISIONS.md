ISSUE #1 — GRAY TINT DOES NOTHING

Status:
Implemented and validated.

Problem:
Changing the Gray Tint control in the playground did not produce visibly
different gray palettes.

Affected options:
- gray
- mauve
- slate
- sage
- olive
- sand

Expected behavior:
Each Gray Tint option should produce its corresponding gray palette in both
light and dark modes.

ROOT CAUSE:

Issue #1 had two independent causes. Both were required to be fixed for the
reported playground behavior to work correctly.

CAUSE 1 — GRAY GENERATION COLLAPSED THE TINT

File:
src/tokens/radixColors.ts

The selected gray tint was reduced to a single seed color and passed through
the generic getScaleFromColor() algorithm.

That algorithm is appropriate for generated accent palettes, but gray seeds
have very low chroma. The algorithm normalizes the generated scale toward the
seed chroma, causing the hue differences between the six gray tints to
collapse into nearly neutral colors.

The repository already contains precomputed Radix gray ramps for:

- gray
- mauve
- slate
- sage
- olive
- sand

These ramps contain the intended Radix gray tint values, but the gray
generation path was not using them directly.

FIX FOR CAUSE 1:

generateRadixColors() now accepts the grayTint value.

When grayTint is supplied, the generator selects the corresponding
precomputed lightGrayColors or darkGrayColors ramp and clones it before use.

getScaleFromColor() remains unchanged and continues to be used for accent
generation.

src/tokens/brand.ts passes brand.grayTint into both the light and dark
generateRadixColors() calls.

CAUSE 2 — SEMANTIC GRAYS WERE BEING OVERWRITTEN DURING EMISSION

File:
src/theme/ThemeProvider.tsx

The emitted theme layers were previously ordered as:

[semantic, globalTokens, ...extraLayers]

The global layer contains the fixed/global gray scale. Because globalTokens
came after semantic, its gray tokens overwrote the brand-generated semantic
gray tokens during emission.

Therefore, even after Cause 1 was fixed and the semantic gray values became
different for each tint, the browser could still receive the global gray
values.

Evidence:
The DOM/CSS variables remained constant before the layer-order correction,
showing that the generated semantic gray values were being overwritten during
emission.

FIX FOR CAUSE 2:

The layer order was changed to:

[globalTokens, semantic, ...extraLayers]

This allows the brand-generated semantic gray tokens to take precedence over
the colliding global gray tokens.

This is a one-line precedence correction and does not restructure the
theming layer.

IMPLEMENTATION:

src/tokens/radixColors.ts
- Added GrayTint support.
- Uses the existing Radix gray ramps for the selected tint.
- Clones the selected ramp before use.
- Keeps getScaleFromColor() unchanged for accent generation.
- Preserves the existing fallback path when grayTint is not supplied.

src/tokens/brand.ts
- Passes brand.grayTint to both light and dark color generation.
- Retains the existing GRAY_SEED mapping for fallback compatibility.

src/tokens/brand.test.ts
- Added regression coverage for all six gray tints.
- Verifies light and dark gray.6 values against the corresponding Radix P3
  source values.

src/theme/ThemeProvider.tsx
- Corrected semantic/global emission precedence so generated semantic gray
  tokens are not overwritten by global gray tokens.

GRAY TINT COVERAGE:

All six supported gray tints are covered:

- gray
- mauve
- slate
- sage
- olive
- sand

Both light and dark modes are covered.

REGRESSION TEST:

Test:
each gray tint maps to the corresponding Radix P3 ramp

The test verifies:

- all six gray tints
- light mode
- dark mode
- gray.6
- corresponding Radix P3 source values

The expected values come from @radix-ui/colors rather than hardcoded hex
values.

ADDITIONAL VALIDATION:

Confirmed that:

- gray alpha tokens remain generated
- wide-gamut gray values remain valid
- monochrome-accent fallback remains valid
- accent generation remains unchanged
- the six gray tints produce distinct CSS variable values in the playground

LIGHT MODE:

The gray variables do change correctly in light mode.

However, the largest light-mode surfaces, such as the page background and
some panel values, are intentionally hard-coded near white. Therefore the
visual difference between Radix gray tints is more subtle in light mode.

The tint differences are more noticeable in consumers such as borders,
secondary text, dividers, chips, and similar UI elements.

This was investigated and is not considered a separate Issue #1 defect.

TEST RESULT:

The full test run was affected by environment-dependent Vitest timeouts.

The chronic failures were:

- manifest › volt › loads & satisfies
- css-contract › volt › every --ev-* emitted

These tests dynamically load the Volt package and exceeded the local Vitest
5-second test limit.

The failures were reproduced on the pristine baseline and therefore are not
caused by the Issue #1 changes.

Two additional tests:

- manifest › volt › codegen emitters
- css-contract › volt › raw color scales

also timed out during one heavily loaded full run, but passed during an
isolated rerun.

No test assertions were weakened and no timeout values were changed.

DECISION:

Keep the ThemeProvider.tsx change.

Although the gray-generation fix is in the token layer, the reported issue
is a playground rendering issue. Correct token generation alone is
insufficient when the generated semantic gray tokens are subsequently
overwritten during emission.

The ThemeProvider change fixes the second part of the actual rendering
defect.

Reverting it would allow the global gray tokens to overwrite the correctly
generated semantic gray tokens and would leave Issue #1 reproducible in the
playground.

Therefore the final Issue #1 implementation fixes both:

1. Gray tint generation.
2. Semantic/global emission precedence.

No unrelated theming-layer restructuring was performed.


