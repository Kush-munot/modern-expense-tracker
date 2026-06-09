# Better Mobile Entry Experience Spec

## Summary

Redesign transaction entry for mobile so logging stays fast, comfortable, and low-friction on a phone.

## Why This Matters

For a personal tracker, mobile ergonomics directly determine whether the app survives as a daily habit. Even strong analytics cannot compensate for painful entry.

## Product Goal

Make mobile transaction logging feel native, fast, and thumb-friendly.

## Current State

- The current modal is desktop-first in feel
- The form makes every field visually similar in importance
- Repeated mobile entry likely requires too much scrolling and precision tapping

## User Stories

- As the user, I want to log expenses comfortably on my phone with minimal taps.
- As the user, I want the most common fields easiest to reach.
- As the user, I want quick-save and full-detail flows to coexist cleanly.

## Proposed Experience

### Mobile Priorities

1. amount first
2. note second
3. smart suggestions next
4. optional details hidden behind expansion

### Design Changes

- larger touch targets
- sticky bottom primary action
- segmented category or mode shortcuts where useful
- condensed vertical spacing
- easier dismissal and recovery

### Flow Modes

1. quick mobile add
2. expanded details
3. template-assisted entry

## Scope

### In Scope

- mobile-first form layout
- sticky CTA
- reduced cognitive load
- better field ordering

### Out of Scope

- native mobile app
- voice input

## UX Requirements

- primary actions must stay reachable without awkward scrolling
- common actions should fit into a short viewport
- field hierarchy should reflect actual frequency of use

## Edge Cases

- split amount still needs access
- income mode may require different prioritization
- keyboard open state can hide CTA on small screens

## Success Criteria

- Mobile entry becomes faster and less annoying
- User is less likely to postpone logging until later

## Acceptance Criteria

- Transaction entry layout is clearly improved for small screens
- Amount and note are prioritized visually and spatially
- Primary save action remains easily reachable
- Advanced fields remain available without cluttering the default mobile flow

## Implementation Notes

- Strongly paired with quick-add and templates
- Should be verified against real phone viewport behavior
