# Quick-Add Transaction Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight quick-add transaction row that supports shorthand parsing, preview, direct save, and expansion into the existing full transaction modal.

**Architecture:** Keep the new entry surface inside `Topbar` so it can share the existing modal and transaction submission flow. Extract pure parsing and suggestion logic into a utility for testability, and extract transaction submission into a shared helper so both quick-add and full-form entry use the same network path.

**Tech Stack:** Next.js, React, TypeScript, Material UI, Node built-in test runner

---

## File Structure

- Create: `src/utils/quickAdd.ts`
- Create: `src/utils/transactions.ts`
- Create: `src/utils/quickAdd.test.ts`
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`
- Modify: `src/app/page.tsx`

### Task 1: Add parser and suggestion tests

**Files:**
- Create: `src/utils/quickAdd.test.ts`
- Test: `src/utils/quickAdd.test.ts`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run `node --test src/utils/quickAdd.test.ts` to verify failure**
- [ ] **Step 3: Implement the minimal parser and suggestion helpers**
- [ ] **Step 4: Run `node --test src/utils/quickAdd.test.ts` to verify pass**

### Task 2: Extract shared submission helper

**Files:**
- Create: `src/utils/transactions.ts`
- Modify: `src/components/Topbar/Topbar.tsx`

- [ ] **Step 1: Move transaction POST logic into a shared helper**
- [ ] **Step 2: Keep the full-form modal behavior unchanged**
- [ ] **Step 3: Verify quick-add and full-form can both call the helper**

### Task 3: Add quick-add UI

**Files:**
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add quick-add state and preview flow**
- [ ] **Step 2: Render the quick-add bar beneath the title row**
- [ ] **Step 3: Add direct save and edit-details actions**
- [ ] **Step 4: Pass historical transactions into `Topbar` for suggestion support**

### Task 4: Verify behavior

**Files:**
- Test: `src/utils/quickAdd.test.ts`
- Verify: `src/components/Topbar/Topbar.tsx`

- [ ] **Step 1: Run `node --test src/utils/quickAdd.test.ts`**
- [ ] **Step 2: Run `cmd /c npm run lint`**
- [ ] **Step 3: Review diffs for the touched files**
