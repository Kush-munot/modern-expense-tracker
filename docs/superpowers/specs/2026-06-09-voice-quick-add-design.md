# Voice Quick Add Design

## Goal

Add a small voice-entry control to Quick Add so spoken expense phrases can flow into the existing quick-save parser with minimal new complexity.

## Chosen Approach

Use browser-native speech recognition to capture a short spoken phrase, write the transcript into the existing quick-add input, and reuse the current parsing and suggestion pipeline.

## Why This Approach

- fastest to build
- least disruptive to current architecture
- keeps one source of truth for quick entry parsing
- best fit for a personal-use app where Chrome or Edge support is acceptable

## UX

- Add a small mic icon button in the Quick Add row near the quick-save controls.
- Tap once to start listening.
- While listening:
  - show active visual state
  - prevent duplicate start actions
- When speech completes:
  - write the transcript into the quick-add input
  - let the current quick-add parser derive amount, note, payment, category, and salary classification hints
- If the transcript is imperfect:
  - keep the text in the quick-add field
  - let the user edit before saving

## Example Phrases

- `120 chai upi`
- `30 bus cash`
- `250 milk needs`
- `1500 rent credit card`
- `500 sip investments`

## Parsing Expectations

The voice feature should work by improving the quick-add parser rather than bypassing it.

The parser should understand:

- payment aliases
  - `upi`
  - `cash`
  - `credit card`
  - `cc`
- salary classification aliases
  - `needs`
  - `wants`
  - `investments`
  - `parents fund`
  - `trips`

Category inference should continue using the current keyword suggestion model unless the spoken phrase clearly maps through new parsing rules.

## Technical Design

### Browser API

Use the Web Speech API via:

- `window.SpeechRecognition`
- fallback to `window.webkitSpeechRecognition`

This is acceptable because the app is for personal use and Chrome or Edge support is enough.

### State

Add small UI state for:

- browser support available or not
- listening or not
- transcript in progress if needed

### Flow

1. user taps mic
2. recognition starts
3. transcript result arrives
4. transcript is inserted into `quickInput`
5. existing `buildQuickAddDraft(...)` logic recomputes suggestions
6. user either saves immediately or edits the text first

## Failure Modes

- unsupported browser:
  - hide or disable the mic button
  - show a short snackbar if interaction is attempted
- permission denied:
  - stop listening
  - show snackbar error
- recognition ends with partial transcript:
  - keep partial transcript in the field
- no transcript:
  - leave input unchanged
  - show a small error snackbar

## Files Likely To Change

- `src/components/Topbar/Topbar.tsx`
- `src/components/Topbar/styles.ts`
- `src/utils/quickAdd.ts`
- `src/utils/quickAdd.test.ts`

## Verification

- parser should correctly understand spoken-style payment and salary-category aliases
- voice transcript should populate the quick-add field
- mic button should reflect listening state
- quick save should continue to work exactly as before after transcript insertion
