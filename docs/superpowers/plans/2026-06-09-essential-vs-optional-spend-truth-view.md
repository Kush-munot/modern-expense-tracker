# Essential Vs Optional Spend Truth View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a budgeting view that classifies current-cycle spending into fixed commitments, flexible essentials, discretionary spend, and investments, with a visible investments toggle and local category override support.

**Architecture:** Keep classification logic in a pure utility so spend-truth math is tested independently from the UI. Add one dedicated analytics component that renders lane totals, percentages, and per-category rows, then wire it into the existing cycle-scoped dashboard.

**Tech Stack:** Next.js, React, TypeScript, Material UI, browser localStorage, Node built-in test runner

---

## File Structure

- Create: `src/utils/spendTruth.ts`
- Create: `src/utils/spendTruth.test.ts`
- Create: `src/components/Analytics/SpendTruthView.tsx`
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`

### Task 1: Add failing classification tests

**Files:**
- Create: `src/utils/spendTruth.test.ts`
- Test: `src/utils/spendTruth.test.ts`

- [ ] **Step 1: Write failing tests for default lane classification**
- [ ] **Step 2: Write failing tests for local override behavior and investment toggle totals**
- [ ] **Step 3: Run `node --test src/utils/spendTruth.test.ts` to verify failure**
- [ ] **Step 4: Implement the minimal utility**
- [ ] **Step 5: Run `node --test src/utils/spendTruth.test.ts` to verify pass**

### Task 2: Add the spend-truth component

**Files:**
- Create: `src/components/Analytics/SpendTruthView.tsx`

- [ ] **Step 1: Render the four spend lanes with totals and percentages**
- [ ] **Step 2: Add include/exclude investments toggle**
- [ ] **Step 3: Add category override controls backed by local storage**

### Task 3: Wire the component into the cycle-scoped dashboard

**Files:**
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`

- [ ] **Step 1: Insert the spend-truth component after the cycle comparison panel**
- [ ] **Step 2: Pass current-cycle transactions into it**

### Task 4: Verify behavior

**Files:**
- Test: `src/utils/spendTruth.test.ts`
- Verify: `src/components/Analytics/SpendTruthView.tsx`

- [ ] **Step 1: Run `node --test src/utils/spendTruth.test.ts`**
- [ ] **Step 2: Run `cmd /c npm run lint`**
- [ ] **Step 3: Review diffs for touched files**
