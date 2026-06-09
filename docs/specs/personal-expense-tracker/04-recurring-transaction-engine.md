# Recurring Transaction Engine Spec

## Summary

Add a recurring transaction system for predictable personal finance events like rent, SIP, subscriptions, salary, and routine bills.

## Why This Matters

A large amount of personal finance friction comes from logging the same predictable items over and over. This feature turns the tracker into a more operational system and makes upcoming obligations possible.

## Product Goal

Eliminate repeated manual entry for predictable recurring financial events.

## Current State

- No recurring rule support exists
- Repeat financial events must be manually logged
- There is no concept of planned future entries

## User Stories

- As the user, I want to define recurring rules for bills, salary, investments, and subscriptions.
- As the user, I want recurring entries to appear as drafts or reminders before they are finalized.
- As the user, I want to skip, edit, or confirm each occurrence.

## Proposed Experience

### Recurrence Types

- daily
- weekly
- monthly
- custom monthly date
- end-of-month

### Recurring Rule Fields

- rule name
- transaction template fields
- recurrence cadence
- start date
- optional end date
- reminder lead time
- auto-create draft or reminder-only mode

### Output Modes

1. Reminder only
2. Draft transaction
3. Auto-created transaction, only for highly trusted cases later

## Initial Personal Use Targets

- rent
- SIP
- subscriptions
- salary
- utilities
- parental support

## Scope

### In Scope

- recurring rules
- draft generation
- due reminders
- skip or confirm flow

### Out of Scope

- bank sync
- external calendar sync
- automatic payment execution

## Data Model

Add recurring rule entity:

- `id`
- `name`
- `transactionTemplate`
- `cadence`
- `startDate`
- `endDate`
- `nextDueDate`
- `leadDays`
- `mode`
- `isActive`
- `lastGeneratedAt`

Add generated occurrence entity or derived transaction metadata:

- `recurringRuleId`
- `occurrenceDate`
- `status`: `draft`, `confirmed`, `skipped`

## UX Requirements

- Rules should be editable without losing history
- Drafts must be visibly different from confirmed transactions
- Confirming a recurring expense should be low-friction

## Edge Cases

- Month length changes
- Rule due date falls on weekend
- Rule amount changes over time
- Missed previous occurrence
- Duplicate manual entry for same obligation

## Success Criteria

- Fewer manual entries for predictable items
- Better coverage of monthly obligations
- Strong foundation for obligation forecasting

## Acceptance Criteria

- User can create a recurring transaction rule
- App can generate due drafts or reminders from rules
- User can confirm, edit, skip, or pause a rule
- Generated items stay linked to their originating rule

## Implementation Notes

- First version should prefer reminder and draft flows over full auto-posting
- This spec should be implemented before or alongside upcoming obligations
