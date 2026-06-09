# Dashboard Information Architecture

## Purpose

This document defines how the current dashboard should evolve as new personal-finance features are added.

Its job is to prevent UI drift.

The feature specs in this folder describe what to build. This document describes where those features belong, which current sections should stay or change, and how the dashboard should feel across desktop and mobile.

## Product Principle

The dashboard should stop behaving like one long analytics report and start behaving like a personal finance cockpit.

Each visit should answer four questions in this order:

1. `Where do I stand right now?`
2. `What just happened?`
3. `What needs attention next?`
4. `Why is this happening?`

That sequence should drive the layout.

## Current Dashboard Audit

## Existing Sections

From the current code and screenshots, the dashboard is effectively:

1. Topbar with add button
2. Summary KPI cards
   - total income
   - total expenses
   - net balance
   - savings rate
3. Recent transactions
4. Payment-method cards
   - credit card
   - UPI
   - cash
5. Key insights card
   - top expense category
   - average daily expense
   - total transactions
6. 50/30/20 rule analysis
7. Quick Transaction Stats
   - largest expenses
   - recent income
   - most active categories
8. Spending Pattern Analysis
   - category breakdown
   - budget category analysis
9. Smart Budget Recommendations

## Current Strengths

- The app already has real information density
- Recent transactions are visually strong and useful
- Core KPI cards are understandable
- The app already has enough data richness for advanced personal insight

## Current Layout Problems

- The page is too linear and too long
- Daily-use actions and deep analysis are mixed together
- Several sections partially duplicate each other
- Important insights are buried too low in the scroll
- Mobile likely feels heavier than necessary
- Payment method cards and some stats consume prime real estate without being top-priority daily decisions

## Duplication and Overlap Audit

### Areas with overlap

#### 1. Key Insights vs Quick Stats vs Spending Patterns

These sections all surface summary information about category ranking and activity. They are not wrong, but they compete with each other.

#### 2. 50/30/20 Rule Analysis vs Budget Recommendations

These are closely related and should feel like one budgeting intelligence family rather than separate heavyweight blocks.

#### 3. Payment Method Cards vs Broader Monthly Decision Surface

Payment method totals are useful, but they are secondary insights, not primary dashboard anchors.

#### 4. Recent Income inside Quick Stats

Recent income is currently separated from the top-level financial picture. It should either be integrated into the current-month surface or treated as a lightweight detail card.

## Target Dashboard Model

The target dashboard should be organized into three layers.

## Layer 1: Daily Control Surface

This is the default dashboard state.

It should contain:

1. Top navigation and quick add
2. Current month snapshot
3. Top alerts and obligations
4. Recent transactions
5. Optional compact action row

This is the layer that should support most daily visits.

## Layer 2: Review Insights

This is the second layer, still visible on the main dashboard but below the daily surface.

It should contain:

1. What changed this month
2. Spike and anomaly detection
3. Essential vs optional spend truth view
4. Personal spending rhythm summary

This layer should explain what deserves attention.

## Layer 3: Deep Analytics

This is the expandable or lower-priority layer.

It should contain:

1. Category breakdown details
2. Budget category analysis
3. Recommendation engine
4. Full transaction stats
5. Payment method analytics

This layer should answer deeper reflective questions without dominating the initial experience.

## Keep / Change / Merge / Remove Map

## Keep As Strong Anchors

### 1. Summary KPI cards

Keep, but reinterpret as `current period snapshot` rather than generic all-time totals.

Why keep:

- They are the fastest financial read on the page
- They are already visually legible

Required changes:

- make them period-aware
- make them month-first
- likely add comparison deltas later

### 2. Recent transactions

Keep as a core anchor.

Why keep:

- This is one of the strongest current sections
- It supports trust, recency, and editing flow

Required changes:

- better mobile compression
- eventual search and filter integration
- likely reduce default height on mobile

## Keep But Demote

### 3. Payment method cards

Keep, but move out of prime dashboard real estate.

Why demote:

- Useful as spending diagnostics
- Not important enough to sit above more urgent monthly signals

Future location:

- inside a collapsible deep analytics section
- or as a compact chip summary under trends

### 4. Quick Transaction Stats

Keep conceptually, but demote and partially split.

Why demote:

- Interesting, but not first-layer critical
- Contains a mix of useful and less essential views

Future location:

- layer 3 expandable insights

## Merge Into New Surfaces

### 5. Key Insights card

Do not keep as a standalone section in its current form.

Why merge:

- It is too small and too generic for the space it takes
- Its content belongs across stronger new surfaces

Where its contents should go:

- `Top Expense Category` into month snapshot or category insight summary
- `Average Daily Expense` into month snapshot or trend strip
- `Total Transactions` into compact period metadata row

### 6. 50/30/20 Rule Analysis

Do not keep as a standalone large card forever.

Why merge:

- It belongs inside a broader budgeting intelligence system

Where it should go:

- combined with essential vs optional spend truth view
- or integrated into a `Budget Health` section

### 7. Budget Recommendations

Keep the recommendation engine, but merge its presentation into a tighter `Attention and Advice` area.

Why merge:

- The logic is useful
- The current standalone block is visually heavy

Future location:

- layer 2 if alerts are important
- layer 3 if the content is passive

## Rebuild Substantially

### 8. Spending Pattern Analysis

Rebuild this section rather than keeping it structurally intact.

Why:

- It has valuable content
- It currently reads like a generic analytics dump

Future split:

- a compact rhythm and trend story in layer 2
- a deep category breakdown block in layer 3

## New Sections To Add

## Must Add

### 1. Quick-add transaction surface

This should become one of the primary anchors near the top of the page.

### 2. Upcoming obligations panel

This should live above deep analytics and close to the current month status.

### 3. What changed this month

This should become the main narrative insight surface.

### 4. Attention or alerts strip

This should summarize:

- anomalies
- overspending
- missed logging
- due obligations

### 5. Essential vs optional spend truth view

This should replace the old standalone 50/30/20 framing as the more decision-useful budget interpretation.

## Should Add

### 6. Personal spending rhythm summary

This is valuable for review mode and should likely appear as a compact card in layer 2.

### 7. Collapsible deep analytics container

This should become the home for the less urgent but still useful analytical modules.

## Sections To Remove As Standalone Blocks

These should not continue as independent first-class sections in the final dashboard:

- current `Key Insights`
- current `50/30/20 Rule Analysis`
- current `Payment Method` trio in top-middle placement
- current always-expanded `Quick Transaction Stats`

This does not mean delete the underlying concepts. It means stop giving them their own heavyweight placement.

## Recommended Final Desktop Order

## Desktop Layer 1

1. Topbar
2. Quick-add transaction bar
3. Current month snapshot cards
4. Alerts and upcoming obligations row
5. Recent transactions

## Desktop Layer 2

6. What changed this month
7. Budget health
   - essential vs optional truth
   - savings interpretation
8. Spike and anomaly detection
9. Personal spending rhythm summary

## Desktop Layer 3

10. Expandable deep analytics
   - category breakdown
   - budget category analysis
   - payment method analytics
   - quick stats
   - recommendations

## Recommended Final Mobile Order

Mobile should be even more aggressively prioritized.

## Mobile Layer 1

1. Topbar
2. Sticky quick add action
3. Month snapshot cards in swipe or compact stack
4. Alerts and obligations
5. Recent transactions

## Mobile Layer 2

6. What changed this month
7. Budget health
8. Core anomaly alerts

## Mobile Layer 3

9. Expandable `More Insights`
10. Expandable `Patterns`
11. Expandable `Recommendations`

Mobile should not force the user through every analytic block by default.

## Section Ownership Map

This maps the feature specs to the dashboard.

### Top Layer Owners

- `01-quick-add-transaction-bar.md`
- `09-upcoming-obligations-panel.md`
- `10-better-mobile-entry-experience.md`

### Mid Layer Owners

- `05-what-changed-this-month-panel.md`
- `06-spike-and-anomaly-detection.md`
- `07-personal-spending-rhythm-view.md`
- `08-essential-vs-optional-spend-truth-view.md`

### Deep Layer Owners

- `11-collapsible-deep-sections.md`
- `12-progressive-disclosure-for-advanced-analytics.md`

### Cross-Cutting Entry Intelligence

- `02-favorites-and-templates.md`
- `03-smarter-defaults-from-history.md`
- `04-recurring-transaction-engine.md`

## Layout Rules

These rules should govern future UI work.

### Rule 1

No new analytics block should be added as a standalone large section unless it clearly belongs in layer 1 or layer 2.

### Rule 2

If a feature only helps with reflection and not immediate action, it should default to lower placement or collapsed state.

### Rule 3

Recent transactions should remain highly visible because they support trust and correction.

### Rule 4

The top half of the dashboard should be usable even if the lower analytics layers are never opened.

### Rule 5

Mobile should optimize for logging and fast status reading, not full-report consumption.

## Transition Plan

To avoid breaking the UI during implementation, the dashboard should evolve in this order:

### Phase 1

- add quick-add
- add mobile entry improvements
- keep current analytics mostly intact

### Phase 2

- add upcoming obligations
- add what changed this month
- add anomaly surface

### Phase 3

- merge old key insights and 50/30/20 into new budget-health surfaces
- demote payment method cards
- make deep sections collapsible

### Phase 4

- implement full progressive disclosure
- finalize desktop and mobile information hierarchy

## Non-Goals

This architecture should not drift toward:

- a generic banking dashboard
- a cluttered KPI wall
- a chart-heavy analytics page with weak actionability
- a feature pile where every new idea gets equal visual weight

## Final Direction

The intended dashboard personality is:

- fast at entry
- calm at first glance
- sharp about what needs attention
- deep only when you ask for depth

That is the layout strategy that best fits a strong personal-use finance tracker.
