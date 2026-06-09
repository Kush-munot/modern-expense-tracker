# Upcoming Obligations Panel Spec

## Summary

Add a near-future obligations panel that shows what is coming due soon so the app becomes operational, not just historical.

## Why This Matters

A strong personal finance dashboard should help you see what is about to hit your month, not only what already happened.

## Product Goal

Surface the next 7 to 30 days of expected obligations so you can anticipate budget pressure.

## Dependencies

- Strongest when recurring transaction engine exists
- Can launch with manual obligation entries first

## Current State

- No future-looking obligations concept exists
- Bills and recurring items are only visible after they are entered

## User Stories

- As the user, I want to see upcoming bills, subscriptions, SIPs, rent, and other due items.
- As the user, I want to know how much upcoming obligations will consume.
- As the user, I want to confirm, skip, or edit obligations when they approach.

## Proposed Experience

### Panel Content

- due date
- obligation name
- amount
- category or class
- linked recurring rule, if any
- status

### Time Windows

- due this week
- due next week
- due this month

### Summary Signals

- total due in next 7 days
- total due in next 30 days
- largest upcoming items

## Real-World Grounding

Given your mix of utilities, investments, travel, and repeat categories, this panel is especially valuable for smoothing months before they become expensive.

## Scope

### In Scope

- obligations panel
- due-date sorting
- upcoming totals
- interaction with recurring rules or manual obligations

### Out of Scope

- direct payment integrations
- bank statement syncing

## Data Model

Potential fields:

- `name`
- `expectedAmount`
- `dueDate`
- `category`
- `class`
- `sourceType`
- `linkedRecurringRuleId`
- `status`

## UX Requirements

- Upcoming items should be visually separated from past transactions
- High-value near-term items should be obvious
- Panel should support both list and summary view

## Edge Cases

- amount is variable
- bill arrives earlier or later than expected
- skipped obligation should not disappear silently
- duplicate obligation and manual transaction both appear

## Success Criteria

- User can anticipate near-term financial pressure
- App becomes part of planning, not only bookkeeping

## Acceptance Criteria

- App can display upcoming obligations with due dates
- App can summarize next 7- and 30-day due totals
- User can link obligations to recurring rules or manual entries
- User can mark an obligation as handled, skipped, or edited

## Implementation Notes

- A manual-first version is acceptable if recurring engine is not ready yet
