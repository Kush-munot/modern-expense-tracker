# Personal Expense Tracker Spec Pack

These spec files are derived from:

- [Impact Wishlist](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/2026-06-08-personal-expense-tracker-impact-wishlist.md)
- `2025_expenses.xlsx` for real usage grounding

## Real Usage Signals Used

- 630 total rows in `2025_expenses.xlsx`
- 617 expense rows
- 592 non-investment lifestyle expense rows
- Top lifestyle categories by spend in 2025:
  - Utilities & Bills: about `Rs 190,375`
  - Travel: about `Rs 48,539`
  - Shopping: about `Rs 45,400`
  - Food & Beverages: about `Rs 45,269`
- Monthly lifestyle spend ranged from about `Rs 18,356` to `Rs 44,947`
- Repeated transaction patterns include `Bus to PG`, `Bus to Mandir`, `Vegetable`, `Coffee`, `Auto`, `Bus`, `Metro`, `Haircut`
- Payment behavior is heavily centered on `UPI` and `Credit Card`, with very low `Cash` usage

These signals are useful because they justify:

- faster recurring-entry flows
- period-aware monthly analytics
- anomaly and trend analysis
- obligation tracking
- better mobile entry ergonomics

## Specs

1. [Quick-add transaction bar](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/01-quick-add-transaction-bar.md)
2. [Favorites and templates](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/02-favorites-and-templates.md)
3. [Smarter defaults from history](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/03-smarter-defaults-from-history.md)
4. [Recurring transaction engine](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/04-recurring-transaction-engine.md)
5. [What changed this month panel](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/05-what-changed-this-month-panel.md)
6. [Spike and anomaly detection](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/06-spike-and-anomaly-detection.md)
7. [Personal spending rhythm view](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/07-personal-spending-rhythm-view.md)
8. [Essential vs optional spend truth view](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/08-essential-vs-optional-spend-truth-view.md)
9. [Upcoming obligations panel](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/09-upcoming-obligations-panel.md)
10. [Better mobile entry experience](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/10-better-mobile-entry-experience.md)
11. [Collapsible deep sections](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/11-collapsible-deep-sections.md)
12. [Progressive disclosure for advanced analytics](D:/Github/modern-expense-tracker-new/modern-expense-tracker/docs/specs/personal-expense-tracker/12-progressive-disclosure-for-advanced-analytics.md)

## Suggested Build Order

If you want the most practical implementation order later:

1. Quick-add transaction bar
2. Favorites and templates
3. Better mobile entry experience
4. Smarter defaults from history
5. Recurring transaction engine
6. Upcoming obligations panel
7. What changed this month panel
8. Spike and anomaly detection
9. Essential vs optional spend truth view
10. Personal spending rhythm view
11. Collapsible deep sections
12. Progressive disclosure for advanced analytics
