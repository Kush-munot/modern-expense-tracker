# Favorites and Templates Spec

## Summary

Add reusable transaction templates for your repeated personal spending patterns so recurring manual entry becomes much faster and more consistent.

## Why This Matters

Your 2025 sheet shows clear repetition across transit, groceries, coffee, and other small lifestyle entries. Personal finance tools benefit heavily from memory and shortcuts, especially when the same note-category-payment combinations repeat.

## Product Goal

Reduce repeated manual data entry and improve classification consistency.

## Current State

- Every transaction starts from blank fields
- No reusable transaction presets exist
- Common repeated entries depend entirely on memory and manual typing

## User Stories

- As the user, I want to save frequent entries as templates.
- As the user, I want to launch a template and only edit amount or date when needed.
- As the user, I want the app to offer favorite templates based on my real behavior.

## Proposed Experience

### Template Types

1. Manual favorites
   - explicitly saved by user

2. System-suggested templates
   - inferred from repeated transaction patterns

### Template Fields

- title
- default amount, optional
- transaction type
- category
- payment mode
- salary bifurcation category
- default note
- optional recurrence hint

### Launch Points

- quick-add bar suggestions
- full form template picker
- mobile quick action sheet

## Scope

### In Scope

- template create, edit, delete
- save from existing transaction
- favorites list
- suggested templates based on repetition

### Out of Scope

- full automation scheduling
- shared templates across multiple users

## Suggested Initial Templates

Based on your 2025 data, likely good starter templates are:

- bus commute
- metro
- auto
- coffee
- vegetables
- haircut
- swiggy instamart
- rent
- SIP

## Data Model

Add a lightweight template entity:

- `id`
- `name`
- `transactionType`
- `amount`
- `category`
- `modeOfPayment`
- `salaryBifercationCat`
- `message`
- `isFavorite`
- `source`: `manual` or `suggested`
- `usageCount`
- `lastUsedAt`

## UX Requirements

- Using a template should feel one tap away from saving
- Templates should support `use now` and `edit before save`
- Suggested templates should never feel intrusive

## Edge Cases

- Template exists for expense but user wants income
- Template note is outdated
- Amount should be blank for variable-cost templates
- Similar templates exist with only payment mode difference

## Success Criteria

- Repeated transactions become significantly faster to log
- Category and bucket consistency improve over time
- Suggested templates remain relevant rather than noisy

## Acceptance Criteria

- User can create a template from a transaction
- User can launch a transaction from a template
- User can edit or delete templates
- App can suggest templates from repeated historical patterns

## Implementation Notes

- This feature should integrate tightly with quick-add and recurring transactions
- Variable-amount templates are important for groceries, transport, and dining
