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

- [x] Create or adapt the Expo Router layout for Dashboard, History, and Add Run navigation.
- [x] Replace the starter Home screen with a mobile-first dashboard shell.
- [x] Add a reusable screen container that respects safe areas and small screen widths.
- [x] Add a reusable metric card component and dashboard placeholders for distance, run count, duration, and average pace.
- [x] Add an initial empty state and a route/action to open Add Run.
- [x] Remove or repurpose starter routes and components only where needed by the new navigation.
- [x] Build the Android JavaScript bundle with Expo.
- [x] Check the Dashboard, History, and Add Run routes and responsive dashboard in the browser export.
- [ ] Run navigation and layout smoke tests on an Android device or emulator (pending: no Android SDK/emulator is available in this environment).

**Exit criteria:** The Android bundle builds and the routes render in the browser export. An Android device/emulator smoke test remains outstanding.

## Phase 2 — Run data and calculations

- [x] Define the run record shape in `src/data/runs.json`: stable ID, date (`YYYY-MM-DD`), distance in km, duration in minutes, and optional notes.
- [x] Add fixed, read-only sample run records in the static JSON file.
- [x] Implement record validation for the static records, including date/numeric-field checks and unique IDs.
- [x] Implement total distance, run count, and total duration calculations.
- [x] Implement average pace calculation from total duration divided by total distance.
- [x] Implement `mm:ss /km` formatting, including rounding and seconds carry.
- [x] Implement current-week distance calculation using a Monday–Sunday week.
- [x] Connect dashboard metrics to the static run data and identify it as sample data.
- [x] Check valid records, empty data, invalid/zero-distance records, pace rounding, and week boundaries.

**Exit criteria:** Calculations return correct values for known examples and safely exclude invalid static records. The JSON fixture is read-only and does not persist user edits; AsyncStorage remains a later phase.

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
