# RunLog Task Breakdown

This checklist expands [RUNLOG-IMPLEMENTATION-PLAN.md](./RUNLOG-IMPLEMENTATION-PLAN.md) into small, verifiable tasks. Complete tasks in order unless a task is marked independent. Check off a task only after its verification passes.

## Phase 0 — Project reconnaissance

- [ ] Review the existing Expo Router layout, routes, shared components, theme, and app configuration.
- [ ] Confirm the installed Expo SDK version and consult its matching documentation before changing Expo APIs.
- [ ] Inspect the existing AsyncStorage dependency and project scripts; preserve unrelated worktree changes.
- [ ] Identify which starter TypeScript files are active and decide the smallest safe JavaScript migration path.
- [ ] Record the current baseline lint/type-check results so pre-existing issues are distinguishable from regressions.

**Exit criteria:** Implementation targets and existing conventions are understood; no configuration has been replaced without reason.

## Phase 1 — Navigation and dashboard shell

- [ ] Create or adapt the Expo Router layout for Dashboard, History, and Add Run navigation.
- [ ] Replace the starter Home screen with a mobile-first dashboard shell.
- [ ] Add a reusable screen container that respects safe areas and small screen widths.
- [ ] Add a reusable metric card component and dashboard placeholders for distance, run count, duration, and average pace.
- [ ] Add an initial empty state and a route/action to open Add Run.
- [ ] Remove or repurpose starter routes and components only where needed by the new navigation.
- [ ] Verify navigation and dashboard rendering on Android.

**Exit criteria:** The app opens to the dashboard and the primary routes are reachable without runtime or layout errors.

## Phase 2 — Run data and calculations

- [ ] Define and document the run record shape: stable ID, date, distance in km, duration in minutes, and optional notes.
- [ ] Implement record validation for loaded and newly entered runs.
- [ ] Implement total distance, run count, and total duration calculations.
- [ ] Implement average pace calculation from total duration divided by total distance.
- [ ] Implement `mm:ss /km` formatting, including rounding and seconds carry.
- [ ] Implement current-week distance calculation using a Monday–Sunday week.
- [ ] Add focused tests or equivalent checks for valid values, empty data, zero distance, and pace rounding.

**Exit criteria:** Calculations return correct values for known examples and safely handle empty or invalid inputs.

## Phase 3 — Local persistence and shared run state

- [ ] Add a storage service around AsyncStorage with a single versioned storage key.
- [ ] Load and validate stored records without silently treating a storage failure as an empty collection.
- [ ] Save valid record collections and surface read/write failures through the app’s UI.
- [ ] Ensure malformed stored data is not overwritten before the user can recover or explicitly replace it.
- [ ] Add a shared hook or state layer that exposes runs, loading/error state, and add/update/delete operations.
- [ ] Verify that creating or updating runs refreshes dashboard and history data consistently.
- [ ] Verify persistence after a full app restart.

**Exit criteria:** Valid runs persist locally; storage failures are visible and cannot silently erase user data.

## Phase 4 — Add and edit run forms

- [ ] Build a reusable run form for date, distance, duration in minutes, and optional notes.
- [ ] Validate required fields, date format, positive distance, and positive duration.
- [ ] Show field-level validation messages and prevent invalid submissions.
- [ ] Add a save-in-progress state and prevent duplicate submissions.
- [ ] Implement the Add Run route and return to a useful screen after a successful save.
- [ ] Implement the Edit Run route using the same form and prefill the selected record.
- [ ] Handle an unknown or deleted run ID with a clear recovery path.
- [ ] Verify add and edit behavior with valid input and common invalid/incomplete input.

**Exit criteria:** Valid entries can be added and edited; invalid entries are explained and never persisted.

## Phase 5 — Running history and deletion

- [ ] Build the history screen with runs in reverse chronological order.
- [ ] Add an empty state with an action to create the first run.
- [ ] Build a reusable run row/card showing date, distance, duration, pace, and notes when present.
- [ ] Add an edit action for each run.
- [ ] Add a delete action with an explicit confirmation prompt.
- [ ] Keep loading, storage errors, and delete-in-progress states understandable.
- [ ] Verify that cancelling deletion preserves the run and confirming deletion updates history and dashboard metrics.

**Exit criteria:** History supports empty and populated states, and confirmed edits/deletions propagate consistently.

## Phase 6 — Weekly chart and sample records

- [ ] Evaluate React Native chart options for Expo SDK compatibility and native/build requirements.
- [ ] Choose the simplest suitable chart dependency and install it using the Expo-compatible workflow when needed.
- [ ] Implement the weekly distance chart with accessible labels and a useful empty-week state.
- [ ] Verify chart values against the weekly-distance calculation for known records.
- [ ] Define a clearly identifiable sample dataset for local testing.
- [ ] Seed sample records only when storage is confirmed to contain no user records.
- [ ] Verify that existing user data is never overwritten or mixed with samples unexpectedly.

**Exit criteria:** The chart matches calculated weekly totals, and sample data is strictly non-destructive.

## Phase 7 — Polish, documentation, and final validation

- [ ] Apply consistent typography, spacing, colors, and touch target sizing across screens.
- [ ] Check behavior on narrow screens and Android system font scaling.
- [ ] Review accessibility labels and readable contrast for controls, chart, and status messages.
- [ ] Update the README with app scope, local storage behavior, and Android run instructions.
- [ ] Run the available lint command and resolve task-related findings.
- [ ] Run the available type check and resolve task-related findings without expanding the TypeScript scope.
- [ ] Start the Expo app and verify the completed flows on Android.
- [ ] Review the final diff for unrelated changes, accidental configuration replacement, and unhandled errors.

**Exit criteria:** Required checks pass, core flows have been exercised on Android, and documented limitations are explicit.

## Definition of done

- [ ] Dashboard metrics, average pace, and weekly distance are calculated from persisted runs.
- [ ] Add, edit, history, and confirmed delete flows work with local storage.
- [ ] Empty, loading, validation, and storage-error states are handled.
- [ ] Sample records never overwrite existing user data.
- [ ] The app remains JavaScript-based and preserves the existing Expo setup.
- [ ] No authentication, backend, GPS tracking, or paid service has been added.
- [ ] Lint, type checks, and Android verification have been run and their results reported accurately.
