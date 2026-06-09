# Mobile Progressive Dashboard Design

## Goal

Implement the personal expense tracker specs for better mobile entry, collapsible deep sections, and progressive disclosure without weakening the desktop dashboard.

## Direction

- Desktop stays mostly expanded and review-friendly.
- Mobile becomes layered and lighter by default.
- Repeated structure is cleaned up so `Recent Transactions` is no longer embedded inside `AnalyticsSummary`.

## Information Architecture

### Layer 1: Now

- quick add
- current cycle summary
- recent transactions
- upcoming obligations

### Layer 2: Attention

- what changed this cycle
- essential vs optional spend truth

### Layer 3: Deep Dive

- quick transaction stats
- spending pattern analysis
- smart budget recommendations

## Mobile Entry Design

- Use a mobile-first dialog layout instead of a cramped desktop modal feel.
- Prioritize `amount` and `message` at the top.
- Keep the main save action sticky at the bottom on mobile.
- Surface fast-pick controls for transaction type, payment method, category, and salary classification.
- Hide `split amount` and full fallback selectors behind an expandable `More details` area.

## Dashboard Disclosure Design

- Create a reusable collapsible section wrapper.
- On mobile, deep-dive sections start collapsed and show 1 to 3 summary chips in the header.
- On desktop, those same sections stay expanded by default.
- Persist expand/collapse state in local storage so repeat usage feels stable.

## Cleanup

- Move `RecentTransactions` out of `AnalyticsSummary`.
- Keep `AnalyticsSummary` focused on cycle status, payment-method totals, and high-level insights.
- Add clear section headers for `Now`, `Attention`, and `Deep Dive`, with stronger emphasis on mobile.

## Verification

- Run targeted utility tests for the deep-section summary helpers.
- Run lint.
- Verify responsive behavior, especially the mobile entry dialog and collapsed analytics flow.
