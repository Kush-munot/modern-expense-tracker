# What Changed This Cycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dashboard panel that compares the current 14th-to-13th cycle against the previous cycle and explains the largest spending differences.

**Architecture:** Keep all period math and explanation logic in a pure utility so it can be tested independently from the UI. Add one new analytics component that renders the explanation cards, then wire it into the existing analytics stack without changing the rest of the dashboard behavior.

**Tech Stack:** Next.js, React, TypeScript, Material UI, Node built-in test runner

---

## File Structure

- Create: `src/utils/cycleAnalysis.ts`
- Create: `src/utils/cycleAnalysis.test.ts`
- Create: `src/components/Analytics/WhatChangedCycle.tsx`
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`

### Task 1: Add failing cycle-analysis tests

**Files:**
- Create: `src/utils/cycleAnalysis.test.ts`
- Test: `src/utils/cycleAnalysis.test.ts`

- [ ] **Step 1: Write failing tests for 14th-to-13th cycle bounds**
- [ ] **Step 2: Write failing tests for cycle comparison output**
- [ ] **Step 3: Run `node --test src/utils/cycleAnalysis.test.ts` to verify failure**
- [ ] **Step 4: Implement the minimal utility**
- [ ] **Step 5: Run `node --test src/utils/cycleAnalysis.test.ts` to verify pass**

### Task 2: Add the panel component

**Files:**
- Create: `src/components/Analytics/WhatChangedCycle.tsx`

- [ ] **Step 1: Render current and previous cycle labels**
- [ ] **Step 2: Render top increases, decreases, and large-transaction insights**
- [ ] **Step 3: Add sensible empty-state handling**

### Task 3: Wire the panel into the dashboard

**Files:**
- Modify: `src/components/TransactionAnd Analytics/Analytics.tsx`

- [ ] **Step 1: Insert the new panel after `AnalyticsSummary`**
- [ ] **Step 2: Pass full ledger data into the new component**

### Task 4: Verify behavior

**Files:**
- Test: `src/utils/cycleAnalysis.test.ts`
- Verify: `src/components/Analytics/WhatChangedCycle.tsx`

- [ ] **Step 1: Run `node --test src/utils/cycleAnalysis.test.ts`**
- [ ] **Step 2: Run `cmd /c npm run lint`**
- [ ] **Step 3: Review diffs for touched files**
