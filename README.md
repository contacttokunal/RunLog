# RunLog

RunLog is a personal running tracker built with Expo, React Native, and JavaScript. It records runs on-device and summarizes distance, duration, average pace, and weekly distance.

## Features

- Dashboard totals and a Monday–Sunday distance chart.
- Add, edit, and delete runs with date, distance in kilometres, duration in minutes, and optional notes.
- Inline form validation, loading and storage-error states, and confirmation before deleting.
- Local persistence with AsyncStorage; no account, backend, GPS tracking, or paid service.

## Run the app

Install dependencies and start Expo:

```bash
npm install
npm run start
```

Open the app on an Android device or emulator using the Expo CLI prompts. An Android development environment is required for emulator/device workflows. Expo Go can be used where its bundled native modules support the installed SDK.

## Local data and sample runs

Sample records in `src/data/runs.json` are copied into AsyncStorage only when the RunLog storage key is absent on first launch. Existing records are not replaced with samples. Runs remain on the device under the versioned `@runlog/runs:v1` key; unreadable or invalid stored data is reported instead of silently reset.

## Checks

```bash
npm run lint
npx tsc --noEmit
```

The app implementation is JavaScript-based. The TypeScript command checks the existing project configuration and types.
