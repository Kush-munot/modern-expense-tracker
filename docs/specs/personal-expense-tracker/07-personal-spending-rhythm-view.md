# Personal Spending Rhythm View Spec

## Summary

Add a view that reveals when you tend to spend, not just what you spend on.

## Why This Matters

Personal finance behavior often follows timing patterns: commute days, weekends, salary week, travel windows, and late-month slowdowns. Those rhythms can guide better planning.

## Product Goal

Expose personal timing patterns in spending so the app can help explain behavior and support better habits.

## Current State

- Transactions are visible as records
- Timing patterns are not summarized meaningfully

## User Stories

- As the user, I want to know which weekdays are most expensive.
- As the user, I want to know whether early-month or late-month behavior differs.
- As the user, I want to understand my spending rhythm around salary timing and routine weeks.

## Proposed Experience

### Rhythm Lenses

1. weekday pattern
2. week-of-month pattern
3. early/mid/late month spend rhythm
4. payment-mode rhythm
5. category timing rhythm

### Example Insights

- `Fridays and Saturdays are your highest discretionary spend days`
- `Transportation clusters heavily on weekdays`
- `Late-month wants spending drops compared with the first two weeks`

## Real-World Grounding

Your 2025 data includes repeated small transport and food events, which makes timing analysis more valuable than it would be in a sparse ledger.

## Scope

### In Scope

- timing summaries
- timing heatmap or rhythm cards
- category overlays

### Out of Scope

- location-based analysis
- external calendar joins

## Data and Logic

Derived fields needed:

- day of week
- week of month
- salary-cycle phase
- weekend vs weekday

## UX Requirements

- Prioritize simple interpretation over chart novelty
- Use a compact visual like a heat strip, weekday bars, or mini rhythm cards
- Do not bury the main story in dense charting

## Edge Cases

- limited data for early months
- trips distort routine rhythm
- investment and rent should not dominate lifestyle rhythm analysis

## Success Criteria

- User can quickly identify high-spend timing patterns
- Insights help explain behavior in a way category summaries cannot

## Acceptance Criteria

- App can summarize spending by weekday
- App can summarize spend timing within the month
- User can inspect timing by category or spend class
- View is readable on both mobile and desktop

## Implementation Notes

- Best implemented after month selection exists
- Strong candidate for a compact expandable dashboard card
