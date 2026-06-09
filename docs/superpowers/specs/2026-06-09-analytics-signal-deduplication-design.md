# Analytics Signal Deduplication Design

## Goal

Reduce repeated analytics on the personal dashboard so each section has one clear job, while keeping the app powerful for review sessions and lighter for everyday use.

## Problem

The current dashboard contains multiple sections that visually differ but communicate the same underlying ideas:

- cycle health appears in both the main summary and the 50/30/20 rule card
- spending movement appears in both `What Changed This Cycle` and `Spending Pattern Analysis`
- budget judgment appears in both `Spend Truth` and `Budget Recommendations`
- recent activity appears in both `Recent Transactions` and `Quick Transaction Stats`
- configuration UI appears inline in `Spend Truth`, which makes an important analysis panel feel heavier than necessary

The result is a dashboard that feels longer and more repetitive than it needs to be.

## Design Principles

- one panel, one primary question
- status before explanation
- explanation before optional detail
- exceptions before congratulations
- configuration behind disclosure

## Target Information Architecture

### Now

- Quick Add
- Current cycle status
- Recent transactions
- Upcoming obligations

### Attention

- What changed this cycle
- Essential vs optional spend truth

### Deep Review

- Spending pattern analysis
- Budget recommendations
- Quick transaction stats

## Responsibilities By Section

### Current Cycle Status

This becomes the single top-level health snapshot.

Keep:

- total income
- total expenses
- net balance
- savings rate
- payment-method totals
- top expense category
- average daily expense
- transaction count

Remove:

- standalone 50/30/20 rule card

Reason:

The 50/30/20 card overlaps too heavily with savings rate plus downstream recommendations. The summary section should answer `where do I stand right now?` once, clearly.

### Recent Transactions

This remains the main operational history surface.

Keep:

- most recent items
- strong amount visibility
- compact metadata chips

Reason:

This is the most useful everyday “what just happened?” view and should remain primary.

### Upcoming Obligations

This remains part of the operational layer.

Reason:

It answers `what is about to hit me next?`, which is distinct from recent history and distinct from analytics.

### What Changed This Cycle

This remains the explanation layer for movement.

Keep:

- biggest increases
- biggest decreases
- new or missing categories
- large-transaction impact

Reason:

This panel explains variance and should remain the main `why did this cycle change?` section.

### Essential Vs Optional Spend Truth

This remains the main budgeting lens.

Keep:

- visible total
- lane amounts
- lane percentages
- top categories within each lane

Change:

- move `Override Category Classification` behind a small `Edit classifications` disclosure

Reason:

The panel should lead with interpretation, not settings. Classification overrides are valuable, but they are configuration UI.

### Spending Pattern Analysis

This should stop competing with `What Changed This Cycle`.

Change:

- make this the stable structural breakdown panel
- keep category breakdown as the primary view
- de-emphasize or collapse the secondary budget-category breakdown

Reason:

`What Changed` explains movement; `Spending Patterns` should explain structure.

### Budget Recommendations

This should become exception-driven.

Change:

- show only the top 1 to 3 actionable recommendations
- prefer warnings, risks, and concrete next steps
- reduce or remove celebratory green blocks when nothing is wrong

Reason:

When things are healthy, the dashboard should get quieter, not busier.

### Quick Transaction Stats

This should become a lightweight deep-review helper instead of a second recent-activity section.

Change:

- reduce it to a compact strip or small cards
- keep only:
  - largest expense
  - latest income
  - most active category

Reason:

These are useful snapshots, but they should not compete with `Recent Transactions`.

## Interaction Design

- Desktop remains mostly expanded by default.
- Mobile keeps stronger progressive disclosure.
- Deep-review sections stay collapsible on mobile.
- When a section is healthy and has no urgent action, it should visually quiet down.
- When a section needs attention, it should become more explicit and concise.

## Expected User Experience

The dashboard should feel like:

`status -> activity -> why -> optional detail`

instead of:

`status -> status again -> pattern -> pattern again -> advice -> advice again`

## Files Likely To Change

- `src/components/Analytics/AnalyticsSummary.tsx`
- `src/components/Analytics/QuickStats.tsx`
- `src/components/Analytics/SpendingPatterns.tsx`
- `src/components/Analytics/BudgetRecommendations.tsx`
- `src/components/Analytics/SpendTruthView.tsx`
- `src/components/TransactionAnd Analytics/Analytics.tsx`

## Verification

- verify the dashboard still answers the three core questions:
  - where do I stand right now?
  - what deserves attention?
  - where do I go deeper if needed?
- verify fewer repeated ideas are visible on first load
- verify mobile remains compact and desktop remains review-friendly
