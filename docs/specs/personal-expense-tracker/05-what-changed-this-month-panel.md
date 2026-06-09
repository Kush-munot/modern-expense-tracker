# What Changed This Cycle Panel Spec

## Summary

Add a cycle-based explanation panel that tells you what drove the difference between the current 14-to-14 cycle and the previous one.

## Why This Matters

The most important question after seeing a high-spend cycle is not `what is the total?` but `what changed?` This feature turns the dashboard into a reasoning tool.

## Product Goal

Explain cycle-over-cycle change in plain language using category movement, major transactions, and recurring shifts.

## Dependencies

- Requires cycle-aware analytics
- Stronger with investment exclusion toggle support

## Current State

- Dashboard surfaces totals and category ranking
- It does not explain the change driver behind a month

## User Stories

- As the user, I want to know why this cycle is higher or lower than the previous cycle.
- As the user, I want a short ranked explanation instead of manually comparing charts.
- As the user, I want to separate one-off spikes from normal recurring expenses.

## Proposed Experience

### Panel Output

The panel should list a ranked set of reasons such as:

- `Utilities & Bills increased by Rs 8,400 vs the previous cycle`
- `Travel spending appeared this cycle but was absent in the previous cycle`
- `Food & Beverages decreased by Rs 2,100`
- `A one-time transaction above Rs 5,000 contributed 18% of the variance`

### Explanation Sections

1. biggest increases
2. biggest decreases
3. new categories this cycle
4. missing categories from the previous cycle
5. one-off large transactions
6. recurring cost changes

## Data and Logic

Required cycle comparison primitives:

- current cycle total
- previous cycle total
- category delta
- transaction-level delta candidates
- recurring-message comparison

## Real-World Grounding

Your 2025 lifestyle spend ranges from roughly `Rs 18,356` to `Rs 44,947`, so cycle variance is significant enough to justify an explanation engine.

## Cycle Definition

This product uses a custom financial cycle rather than a calendar month.

The default cycle is:

- start: the 15th of a month
- end: the 14th of the next month

Examples:

- `May 14, 2026` to `June 13, 2026`
- `June 14, 2026` to `July 13, 2026`

All feature logic in this spec should use cycle boundaries, not calendar-month boundaries.

## Scope

### In Scope

- current cycle vs previous cycle explanation
- ranked drivers
- plain-language reason cards

### Out of Scope

- full AI narrative generation
- year-over-year explanations

## UX Requirements

- Keep the output concise and readable
- Surface explanations in order of likely importance
- Avoid overloading the panel with tiny changes

## Edge Cases

- no previous cycle data
- only partial current cycle loaded
- investment-heavy cycle distorts insights
- multiple medium changes rather than one dominant driver

## Success Criteria

- User can understand the main drivers of monthly variance in under a minute
- Explanations feel grounded and numerically believable

## Acceptance Criteria

- Panel compares the selected cycle against the previous cycle
- It identifies major positive and negative category deltas
- It can reference large individual transactions as drivers
- It suppresses noise from trivial changes

## Implementation Notes

- This feature becomes much better once the dashboard gains explicit cycle scoping
