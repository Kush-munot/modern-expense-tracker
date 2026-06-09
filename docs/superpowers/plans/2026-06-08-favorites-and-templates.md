# Favorites and Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable favorite templates and history-derived suggested templates that plug directly into the existing quick-add and full-form transaction flows.

**Architecture:** Keep template presentation in `Topbar` so favorites, suggestions, quick-add, and the full modal stay in one entry system. Extract pure template derivation and normalization logic into a utility with tests, and persist manual templates locally so the feature is useful immediately without needing backend schema changes.

**Tech Stack:** Next.js, React, TypeScript, Material UI, browser localStorage, Node built-in test runner

---

## File Structure

- Create: `src/utils/templates.ts`
- Create: `src/utils/templates.test.ts`
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`

### Task 1: Add failing template tests

**Files:**
- Create: `src/utils/templates.test.ts`
- Test: `src/utils/templates.test.ts`

- [ ] **Step 1: Write failing tests for suggested-template derivation and manual template normalization**
- [ ] **Step 2: Run `node --test src/utils/templates.test.ts` to verify failure**
- [ ] **Step 3: Implement the minimal template utility**
- [ ] **Step 4: Run `node --test src/utils/templates.test.ts` to verify pass**

### Task 2: Add local template model and persistence

**Files:**
- Create: `src/utils/templates.ts`
- Modify: `src/components/Topbar/Topbar.tsx`

- [ ] **Step 1: Define the template type and local storage key**
- [ ] **Step 2: Load and save manual templates from local storage**
- [ ] **Step 3: Merge manual favorites and derived suggestions for display**

### Task 3: Add Topbar template UI

**Files:**
- Modify: `src/components/Topbar/Topbar.tsx`
- Modify: `src/components/Topbar/styles.ts`

- [ ] **Step 1: Add favorite and suggested template sections near quick add**
- [ ] **Step 2: Add use-now and edit-before-save flows**
- [ ] **Step 3: Add create, edit, and delete template actions**

### Task 4: Verify behavior

**Files:**
- Test: `src/utils/templates.test.ts`
- Test: `src/utils/quickAdd.test.ts`
- Verify: `src/components/Topbar/Topbar.tsx`

- [ ] **Step 1: Run `node --test src/utils/templates.test.ts src/utils/quickAdd.test.ts`**
- [ ] **Step 2: Run `cmd /c npm run lint`**
- [ ] **Step 3: Review diffs for touched files**
