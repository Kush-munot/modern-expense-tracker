# Essential vs Optional Spend Truth View Spec

## Summary

Add a more honest budgeting lens that separates fixed commitments, flexible essentials, discretionary spend, and investments.

## Why This Matters

Your current needs/wants/investments framing is useful, but it can be made much more decision-friendly. Some expenses are fixed commitments, some are essential but variable, and some are truly optional. Those distinctions are what matter when you need to adjust your month.

## Product Goal

Give a clearer picture of what part of your month was non-negotiable versus controllable.

## Current State

- Salary bifurcation categories exist
- Dashboard shows 50/30/20 style analysis
- The app does not distinguish fixed commitments from flexible essentials

## User Stories

- As the user, I want to know what portion of my month was effectively locked in.
- As the user, I want to see how much truly discretionary room I had.
- As the user, I want investments treated as their own lane when needed.

## Proposed Experience

### Spend Classes

1. fixed commitments
   - rent
   - subscriptions
   - recurring bills

2. flexible essentials
   - groceries
   - commute
   - medicine
   - daily food

3. discretionary
   - entertainment
   - non-essential shopping
   - optional dining or leisure

4. investments and allocations

## Real-World Grounding

Because utilities, travel, shopping, and food all carry meaningful share in your 2025 lifestyle data, a single needs-vs-wants split is not enough for high-quality decisions.

## Scope

### In Scope

- spend truth classification model
- dashboard view for class breakdown
- with-investments and without-investments interpretation

### Out of Scope

- automated financial advice
- tax classification

## Data and Logic

Needs a classification layer that can map:

- category
- recurring status
- template type
- optional manual override

## UX Requirements

- Show both amount and percent
- Make discretionary room visually obvious
- Keep investment treatment explicit and not mixed accidentally

## Edge Cases

- travel can be essential in one month and discretionary in another
- shopping can include family-support purchases
- utility bills may fluctuate widely but remain essential

## Success Criteria

- User can answer `what can I realistically cut?` from this view
- View is more decision-useful than a plain needs/wants split

## Acceptance Criteria

- App can classify spend into fixed, flexible essential, discretionary, and investment lanes
- User can inspect totals and percentages by lane
- Investments can be included or excluded explicitly
- User can override misleading classifications when needed

## Implementation Notes

- Start with user-owned mappings and deterministic defaults
- This is a high-value complement to the existing 50/30/20 panel
