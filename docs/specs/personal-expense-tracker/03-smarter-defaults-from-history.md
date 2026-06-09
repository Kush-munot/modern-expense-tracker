# Smarter Defaults From History Spec

## Summary

Use your existing transaction history to prefill likely category, bucket, and payment mode choices during entry.

## Why This Matters

You already have enough data history to let the app learn useful patterns. For a personal tool, small automatic saves in typing and thinking matter a lot.

## Product Goal

Improve entry speed and consistency by using historical behavior as a recommendation engine.

## Current State

- The app does not learn from repeated note patterns
- Category and salary bucket selection are always manual
- Payment mode is not inferred from history

## User Stories

- As the user, I want the app to auto-suggest category and bucket when I type a familiar note.
- As the user, I want payment mode to default intelligently for familiar expenses.
- As the user, I want to override wrong suggestions easily.

## Proposed Experience

### Suggestion Triggers

- message text typed in quick-add
- message text typed in full form
- selected template
- repeat transaction based on exact or fuzzy message match

### Suggested Fields

- category
- mode of payment
- salary bifurcation category
- optional amount band hint

### Confidence Behavior

- high confidence: prefill automatically
- medium confidence: show recommendation chip
- low confidence: no automatic suggestion

## Real-World Grounding

The 2025 data includes repeated patterns such as:

- transit labels
- vegetables
- coffee
- haircut
- swiggy instamart

These are strong candidates for history-based mapping.

## Suggestion Logic

Rank candidate defaults using:

1. exact note match
2. normalized note match
3. keyword match
4. recent frequency
5. overall frequency

## Scope

### In Scope

- history-based suggestion engine
- confidence scoring
- visible override controls

### Out of Scope

- machine learning model training
- cloud-based personalization

## Data Requirements

Suggested new derived metadata:

- normalized message text
- message token index
- field suggestion confidence

## UX Requirements

- Suggestions should speed up input, not surprise the user
- Prefilled values should be visually identifiable as suggested
- One-click reset should be available

## Edge Cases

- Same note maps to different categories across months
- User intentionally changes a familiar payment mode
- Sparse history on new categories
- Similar notes like `Bus`, `Bus to PG`, `Bus to Mandir`

## Success Criteria

- Common transaction entry requires fewer manual selections
- Field consistency improves across repeated notes
- Overrides remain easy and predictable

## Acceptance Criteria

- App can suggest category from prior history
- App can suggest payment mode from prior history
- App can suggest salary bifurcation bucket from prior history
- User can override suggestions before save

## Implementation Notes

- Keep the first version deterministic and debuggable
- This should complement templates rather than replace them
