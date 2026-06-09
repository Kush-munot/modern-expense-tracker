# Progressive Disclosure for Advanced Analytics Spec

## Summary

Reorganize the dashboard so everyday usage starts with the most important decisions and only reveals deeper analytics when you ask for them.

## Why This Matters

Not every visit is a deep review. Many visits are simply:

- log something
- check where the month stands
- see if anything needs attention

Advanced analysis should stay available, but it should not compete with the daily control surface.

## Product Goal

Turn the dashboard into a layered experience: daily control first, deep analysis second.

## Current State

- Summary and deep analytics live in one long continuum
- The page does not strongly separate daily-use signals from review-mode insights

## User Stories

- As the user, I want a simple top layer for frequent check-ins.
- As the user, I want richer analytics available when I enter review mode.
- As the user, I want the dashboard to feel lighter without losing depth.

## Proposed Experience

### Layer 1: Daily Control Surface

- quick add
- current month status
- recent transactions
- upcoming obligations
- top alerts

### Layer 2: Review Insights

- what changed this month
- anomaly detection
- spending rhythm
- essential vs optional truth view

### Layer 3: Deep Analytics

- detailed category patterns
- recommendation panels
- advanced historical comparisons

## Scope

### In Scope

- dashboard information architecture redesign
- layered section ordering
- reveal mechanics

### Out of Scope

- complete visual redesign of every analytics component

## UX Requirements

- Top layer should answer `where do I stand right now?`
- Second layer should answer `what deserves attention?`
- Deep layer should answer `why is this happening?`

## Edge Cases

- user prefers always-expanded classic mode
- important insight gets buried too far down
- mobile layout needs stronger sequencing than desktop

## Success Criteria

- Frequent visits feel lighter and faster
- Review sessions still have access to deep analysis
- Dashboard feels intentionally structured instead of stacked

## Acceptance Criteria

- Dashboard is reorganized into layered information depth
- Advanced analytics are available without dominating the initial view
- Daily control functions remain immediately accessible
- Structure works cleanly on mobile and desktop

## Implementation Notes

- This should be treated as an information-architecture feature, not just a UI polish pass
- Best paired with collapsible deep sections
