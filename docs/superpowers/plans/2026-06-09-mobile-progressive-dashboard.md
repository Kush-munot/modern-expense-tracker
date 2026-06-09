# Mobile Progressive Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile transaction entry, add mobile-first progressive disclosure to deep analytics, and clean up repeated analytics structure without disrupting the desktop dashboard.

**Architecture:** Separate dashboard layering concerns from analytics content by introducing a reusable collapsible section wrapper and small summary helpers for the deep analytics panels. Refactor the entry dialog into a responsive mobile-first experience while keeping existing quick-add, template, and submission logic intact.

**Tech Stack:** Next.js, React, TypeScript, Material UI, browser localStorage, Node built-in test runner

---

## File Structure

- Create: `src/utils/dashboardDisclosure.ts`
- Create: `src/utils/dashboardDisclosure.test.ts`
- Create: `src/components/Analytics/CollapsibleAnalyticsSection.tsx`
- Modify: `src/components/Analytics/AnalyticsSummary.tsx`
- Modify: `src/components/Analytics/RecentTransactions.tsx`
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`

### Task 1: Add deep-section summary helpers

**Files:**
- Create: `src/utils/dashboardDisclosure.ts`
- Create: `src/utils/dashboardDisclosure.test.ts`

- [ ] **Step 1: Write failing tests for quick-stats, spending-pattern, and recommendation summary helpers**
- [ ] **Step 2: Run `node --test src/utils/dashboardDisclosure.test.ts` to verify failure**
- [ ] **Step 3: Implement the helper functions**
- [ ] **Step 4: Run `node --test src/utils/dashboardDisclosure.test.ts` to verify pass**

### Task 2: Add reusable collapsible analytics wrapper

**Files:**
- Create: `src/components/Analytics/CollapsibleAnalyticsSection.tsx`

- [ ] **Step 1: Build a responsive wrapper with local-storage-backed expand state**
- [ ] **Step 2: Show summary chips in the collapsed header**
- [ ] **Step 3: Default mobile to collapsed and desktop to expanded**

### Task 3: Restructure analytics layout

**Files:**
- Modify: `src/components/Analytics/AnalyticsSummary.tsx`
- Modify: `src/components/Analytics/RecentTransactions.tsx`
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`

- [ ] **Step 1: Remove `RecentTransactions` from `AnalyticsSummary`**
- [ ] **Step 2: Rebuild `Analytics.tsx` into `Now`, `Attention`, and `Deep Dive` layers**
- [ ] **Step 3: Wrap deep analytics sections with the new collapsible component**

### Task 4: Improve mobile transaction entry

**Files:**
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`

- [ ] **Step 1: Convert the entry modal into a responsive dialog or sheet**
- [ ] **Step 2: Prioritize amount and message fields on mobile**
- [ ] **Step 3: Add mobile quick-pick controls and sticky primary actions**
- [ ] **Step 4: Move advanced fields behind a mobile disclosure panel**

### Task 5: Verify behavior

**Files:**
- Test: `src/utils/dashboardDisclosure.test.ts`
- Verify: `src/components/TransactionAnd Analytics/Analytics.tsx`
- Verify: `src/components/Topbar/Topbar.tsx`

- [ ] **Step 1: Run `node --test src/utils/dashboardDisclosure.test.ts`**
- [ ] **Step 2: Run `cmd /c npm run lint`**
- [ ] **Step 3: Review the diff for layout regressions**
