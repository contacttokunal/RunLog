function parseRunDate(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function validateRunRecord(run) {
  const errors = [];

  if (!run || typeof run !== 'object' || Array.isArray(run)) {
    return ['Run must be an object.'];
  }

  if (typeof run.id !== 'string' || run.id.trim().length === 0) {
    errors.push('Run ID must be a non-empty string.');
  }
  if (!parseRunDate(run.date)) {
    errors.push('Date must be a valid YYYY-MM-DD date.');
  }
  if (!Number.isFinite(run.distanceKm) || run.distanceKm <= 0) {
    errors.push('Distance must be a positive number of kilometres.');
  }
  if (!Number.isFinite(run.durationMinutes) || run.durationMinutes <= 0) {
    errors.push('Duration must be a positive number of minutes.');
  }
  if (run.notes !== undefined && typeof run.notes !== 'string') {
    errors.push('Notes must be text when provided.');
  }

  return errors;
}

export function validateRunRecords(records) {
  if (!Array.isArray(records)) {
    return {
      runs: [],
      errors: ['Run data must be an array.'],
    };
  }

  const runs = [];
  const errors = [];
  const ids = new Set();

  records.forEach((record, index) => {
    const recordErrors = validateRunRecord(record);
    if (recordErrors.length === 0 && ids.has(record.id)) {
      recordErrors.push('Run IDs must be unique.');
    }

    if (recordErrors.length > 0) {
      errors.push({ index, messages: recordErrors });
      return;
    }

    ids.add(record.id);
    runs.push(record);
  });

  return { runs, errors };
}

function roundTo(value, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const start = startOfLocalDay(date);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

export function calculateWeeklyRunDistances(records, now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new TypeError('The reference date must be a valid Date.');
  }

  const weekStart = startOfWeek(now);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      date: formatDateKey(date),
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      fullLabel: date.toLocaleDateString(undefined, { weekday: 'long' }),
      value: 0,
    };
  });
  const dayIndexes = new Map(days.map((day, index) => [day.date, index]));
  const { runs } = validateRunRecords(records);

  runs.forEach((run) => {
    const dayIndex = dayIndexes.get(run.date);
    if (dayIndex !== undefined) {
      days[dayIndex].value += run.distanceKm;
    }
  });

  return days;
}

export function calculateRunStats(records, now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new TypeError('The reference date must be a valid Date.');
  }

  const { runs, errors } = validateRunRecords(records);
  const totalDistanceKm = roundTo(
    runs.reduce((total, run) => total + run.distanceKm, 0),
    2
  );
  const totalDurationMinutes = roundTo(
    runs.reduce((total, run) => total + run.durationMinutes, 0),
    2
  );
  const weekStart = startOfWeek(now);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const weeklyDistanceKm = roundTo(
    runs.reduce((total, run) => {
      const runDate = parseRunDate(run.date);
      return runDate >= weekStart && runDate < nextWeekStart
        ? total + run.distanceKm
        : total;
    }, 0),
    2
  );

  return {
    totalDistanceKm,
    totalRuns: runs.length,
    totalDurationMinutes,
    averagePaceMinutesPerKm:
      totalDistanceKm > 0 ? totalDurationMinutes / totalDistanceKm : null,
    weeklyDistanceKm,
    invalidRecordCount: errors.length,
    validationErrors: errors,
  };
}

export function formatDistance(distanceKm) {
  return Number.isFinite(distanceKm) && distanceKm >= 0 ? distanceKm.toFixed(1) : '0.0';
}

export function formatDuration(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return '0m';
  }

  const roundedMinutes = Math.round(totalMinutes);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  return hours > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`;
}

export function formatPace(minutesPerKm) {
  if (!Number.isFinite(minutesPerKm) || minutesPerKm <= 0) {
    return '—';
  }

  const totalSeconds = Math.round(minutesPerKm * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')} /km`;
}
