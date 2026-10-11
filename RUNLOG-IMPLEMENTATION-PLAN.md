# RunLog Implementation Plan

## Project context

RunLog is a personal running tracker for Android built with React Native and Expo. The existing project uses Expo Router under `src/app/`. AsyncStorage is already present in the current package changes. Preserve the existing Expo configuration and routing conventions.

The starter app currently contains TypeScript files. The app implementation should use JavaScript, converting the active app code to `.js` files rather than adding more `.tsx` files.

## Proposed folder structure

```text
src/
  app/
    _layout.js             # Router navigation and app providers
    index.js               # Dashboard
    history.js             # Run history
    add-run.js              # Add-run form
    edit-run/[id].js        # Edit an existing run
  components/
    AppScreen.js
    MetricCard.js
    RunCard.js
    RunForm.js
    WeeklyDistanceChart.js
    EmptyState.js
    LoadingState.js
    ConfirmDeleteDialog.js
  constants/
    theme.js
  hooks/
    useRuns.js              # Load and update local run data
  services/
    runStorage.js           # AsyncStorage read/write and data validation
  data/
    runs.json               # Read-only sample records used to seed a new local store
  utils/
    runCalculations.js      # Record validation, totals, weekly distance, pace formatting
```

These are proposed destinations, not a requirement to replace existing configuration or starter files wholesale. Inspect and adapt existing code before making changes.

## Implementation stages

### 1. Navigation and dashboard

- Replace the starter Home/Explore navigation with Dashboard, History, and Add Run routes, following the existing Expo Router conventions.
- Create the dashboard layout and reusable metric cards.
- Build the dashboard with clear empty-state placeholders; Phase 2 populates metrics from a read-only JSON fixture before user persistence is added.
- Check the SDK 57 documentation before changing Expo Router or chart-related APIs.

**Verification:** Launch the app and check route navigation and responsive layout on Android.

### 2. Run model and calculations

- Define run records with a stable ID, date (`YYYY-MM-DD`), distance in km, duration in minutes, and optional notes in `src/data/runs.json`.
- Use the JSON as a read-only fixture for validating records and calculating dashboard totals, average pace, and current-week distance.
- Calculate pace as duration in minutes divided by distance in km; format as `mm:ss /km`, handling rounding and seconds carry correctly.
- Define weekly distance as the current Monday–Sunday week.
- Keep the static fixture read-only; user-created data is persisted in AsyncStorage from Phase 3 onward.

**Verification:** Check calculations against known values, empty data, invalid records, zero distance, pace rounding, and week boundaries.

### 3. Local persistence and shared run state

- Replace the static JSON data source with AsyncStorage for user-created runs.
- Preserve sample records as non-destructive seed data; seed only when storage is confirmed to contain no user data.
- Surface storage errors and never silently replace data that cannot be read or validated.
- Use shared app state so dashboard and history stay synchronized.

**Verification:** Add or update runs, verify persistence after app restart, and confirm existing user data is never replaced by sample data.

### 4. Add and edit runs

- Build a reusable form for date, distance, duration, and optional notes.
- Validate required fields, positive numeric values, and date input; show actionable inline validation errors.
- Reuse the form for add and edit flows, including loading and save states.

**Verification:** Submit valid runs, try incomplete and invalid values, edit a run, and confirm changes persist.

### 5. Running history and delete

- Display runs in a useful date order and show an empty state when there are no records.
- Provide edit and delete actions.
- Require confirmation before deleting a run.
- Keep dashboard totals and history synchronized after changes.

**Verification:** Add, edit, and delete runs, then check that both history and dashboard metrics reflect the changes.

### 6. Weekly chart and polish

- Select a React Native chart library after confirming compatibility with the project’s Expo SDK and installation requirements.
- Keep chart dependencies limited to those required by the selected library.
- Polish shared styling, loading and storage-error states, and small-screen behavior.
- Update the README with app usage.

**Verification:** Check the chart with empty and populated weeks; run available lint and type checks; and verify the Android app.

## Scope constraints

- No authentication, backend, GPS tracking, or paid services.
- Keep the app JavaScript-based.
- Preserve the existing Expo setup and routing conventions.
- Handle invalid data and storage errors visibly and safely.
- Do not claim the app works until implementation and verification are complete.
