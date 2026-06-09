# Quick-Add Transaction Bar Spec

## Summary

Add a fast-entry transaction surface optimized for your most common personal logging behavior. The goal is to make frequent entries possible in a few seconds without opening the full modal every time.

## Why This Matters

Your 2025 data shows many repeated, low-friction expense patterns such as bus rides, vegetables, coffee, auto, metro, and small food spends. Those are exactly the kind of transactions that suffer when entry is too heavy.

If the app becomes dramatically faster for small and repeat entries, your data quality and consistency improve automatically.

## Product Goal

Let you add a common transaction in 3 to 8 seconds with minimal field interaction.

## Current State

- Transaction creation is driven by a full-screen modal flow.
- All fields are treated as equally important.
- There is no lightweight entry path for very common expenses.

## User Stories

- As the user, I want to log a quick daily expense without opening a full form.
- As the user, I want shorthand input for familiar patterns.
- As the user, I want the quick-add flow to gracefully fall back to the full form when confidence is low.

## Proposed Experience

### Entry Surface

Add a compact quick-add row near the top of the dashboard on desktop and a sticky bottom quick-add launcher on mobile.

### Input Modes

Support two paths:

1. Structured quick fields
   - amount
   - note
   - payment mode
   - optional category chip suggestions

2. Natural shorthand
   - examples:
     - `120 chai upi`
     - `30 bus`
     - `450 vegetables cc`

### Behavior

- Parse amount first
- Treat remaining text as note
- Infer category, salary bucket, and payment mode from text or history when possible
- Show one-line confirmation preview before save
- Provide `Edit details` to expand into full transaction modal

## Scope

### In Scope

- Quick-add input bar
- Shorthand parsing
- Confidence-based suggestions
- Save confirmation
- Expand to full form

### Out of Scope

- Voice input
- OCR receipt capture
- Fully conversational transaction entry

## UX Requirements

- Entry should feel distinct from the heavy modal
- The quick-add row should always remain visually available on desktop
- On mobile, the action should be thumb-friendly
- Avoid forcing all fields unless parsing confidence is weak

## Parsing Rules

- First numeric token becomes amount
- Known payment aliases:
  - `upi`
  - `cc`
  - `credit`
  - `cash`
- Remaining tokens become note text
- Category suggestion should be based on:
  - note keyword match
  - most frequent historical mapping for similar messages

## Data and Logic

No breaking schema changes required if quick-add only writes standard transaction objects.

Optional additions later:

- `entryMode`: `quick-add` or `full-form`
- `suggestionConfidence`

## Edge Cases

- Input has no amount
- Input has multiple numbers
- Input maps to conflicting historical categories
- Input is likely income, not expense
- User wants to enter split amount

## Success Criteria

- Common expenses can be logged in under 8 seconds
- User can complete common entry with no modal in most cases
- Incorrect parsing is recoverable before save

## Acceptance Criteria

- A visible quick-add surface exists on the main dashboard
- It can save a basic expense without opening the full modal
- It supports shorthand parsing for amount plus note
- It supports payment mode inference or direct override
- It offers a path to expand into the full form before save

## Implementation Notes

- Best paired with favorites/templates and smarter defaults
- Should reuse the existing transaction object shape to keep risk low
