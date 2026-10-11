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

**Exit criteria:** Calculations return correct values for known examples and safely exclude invalid static records. The JSON fixture is read-only; Phase 3 uses it only to seed a new local store.

## Phase 3 — Local persistence and shared run state

- [x] Add a storage service around AsyncStorage with a single versioned storage key.
- [x] Load and validate stored records without silently treating a storage failure as an empty collection.
- [x] Save valid record collections and surface read/write failures through the app’s UI.
- [x] Ensure malformed stored data is not overwritten before the user can recover or explicitly replace it.
- [x] Add a shared hook or state layer that exposes runs, loading/error state, and add/update/delete operations.
- [x] Connect dashboard and history to the shared local run state.
- [x] Seed the sample JSON only when the versioned storage key is absent; preserve stored user data.
- [x] Verify first-launch sample seeding, stored-run reload, dashboard/history synchronization, and malformed-data preservation in the browser storage backend.
- [ ] Verify persistence and non-destructive sample seeding across a full app restart on Android (Android runtime unavailable here).

**Exit criteria:** Valid run data persists locally; malformed or unreadable data is reported without being overwritten. Device-level restart verification remains outstanding.

## Phase 4 — Add and edit run forms

- [x] Build a reusable run form for date, distance, duration in minutes, and optional notes.
- [x] Validate required fields, date format, positive distance, and positive duration.
- [x] Show field-level validation messages and prevent invalid submissions.
- [x] Add a save-in-progress state and prevent duplicate submissions.
- [x] Implement the Add Run route and return to a useful screen after a successful save.
- [x] Implement the Edit Run flow using the same form and prefill the selected record.
- [x] Handle an unknown or deleted run ID with a clear recovery path.
- [x] Verify add and edit behavior with valid input and common invalid/incomplete input.

**Exit criteria:** Valid entries can be added and edited; invalid entries are explained and never persisted.
**Verification:** Browser flow checks covered blank fields, impossible dates, zero/negative numeric values, add/edit saves, edited history values, reload persistence, and recovery for an unknown run ID. Android device testing remains outstanding.

## Phase 5 — Running history and deletion

- [x] Build the history screen with runs in reverse chronological order.
- [x] Add an empty state with an action to create the first run.
- [x] Build a reusable run row/card showing date, distance, duration, pace, and notes when present.
- [x] Add an edit action for each run.
- [x] Add a delete action with an explicit confirmation prompt.
- [x] Keep loading, storage errors, and delete-in-progress states understandable.
- [x] Verify that cancelling deletion preserves the run and confirming deletion updates history and dashboard metrics.

**Exit criteria:** History supports empty and populated states, and confirmed edits/deletions propagate consistently.
**Verification:** Browser checks confirmed the cancel action leaves the run intact, confirmation removes it from history, and dashboard distance, duration, count, and pace recalculate immediately. Android device testing remains outstanding.

## Phase 6 — Weekly chart and polish

- [ ] Evaluate React Native chart options for Expo SDK compatibility and native/build requirements.
- [ ] Choose the simplest suitable chart dependency and install it using the Expo-compatible workflow when needed.
- [ ] Implement the weekly distance chart with accessible labels and a useful empty-week state.
- [ ] Verify chart values against the weekly-distance calculation for known records.

**Exit criteria:** The chart matches calculated weekly totals, and previously seeded sample records remain non-destructive.

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
