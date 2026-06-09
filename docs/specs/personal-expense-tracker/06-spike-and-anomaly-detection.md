# Spike and Anomaly Detection Spec

## Summary

Add rule-based anomaly detection that flags unusually large or behaviorally unexpected spending patterns.

## Why This Matters

Personal finance decisions are often driven by exceptions, not averages. Spikes are where attention is most needed.

## Product Goal

Help you catch outlier spending early and distinguish normal variation from genuine behavior drift.

## Current State

- The app shows totals and category summaries
- It does not explicitly surface unusual behavior compared with personal history

## User Stories

- As the user, I want to know when a category is unusually high for me.
- As the user, I want to know when a single transaction is a large outlier.
- As the user, I want anomaly alerts to feel personal, not generic.

## Proposed Experience

### Alert Examples

- `Food is 1.8x your usual weekly average`
- `This is your largest Utilities payment in 6 months`
- `Travel spend is unusually high this month`
- `You logged 3 shopping transactions above your usual range`

### Alert Levels

- informational
- caution
- high attention

## Detection Types

1. single transaction outlier
2. category-level monthly spike
3. week-over-week spike
4. new recurring obligation candidate
5. unusual timing pattern

## Real-World Grounding

Because your lifestyle monthly spend shows a wide range and your categories include both predictable and volatile buckets, anomaly detection should use personal baselines rather than fixed thresholds.

## Detection Logic

Use deterministic thresholds in v1:

- compare against last `n` months
- compare against rolling weekly average
- compare against personal category median and max
- ignore categories with too little history

## Scope

### In Scope

- deterministic anomaly rules
- category and transaction alerts
- alert explanations

### Out of Scope

- advanced statistical modeling
- predictive fraud detection

## UX Requirements

- Alerts must explain why something is flagged
- Show baseline and comparison period
- Avoid flooding the user with weak warnings

## Edge Cases

- travel month creates expected spike
- sparse history for new categories
- investment entries distort variance
- seasonal bills like insurance or annual fees

## Success Criteria

- Alerts feel believable and actionable
- Noise remains low enough that you do not ignore the panel

## Acceptance Criteria

- App can flag large single-transaction outliers
- App can flag unusual category spend compared with history
- Each alert includes a reason and comparison baseline
- User can dismiss or hide low-value alerts

## Implementation Notes

- Start simple and auditable
- Pair closely with the `What changed this month` panel
