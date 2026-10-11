import { validateRunRecord } from '@/utils/runCalculations';

export function validateRunForm(values, id) {
  const errors = {};
  const distanceKm = Number(values.distanceKm);
  const durationMinutes = Number(values.durationMinutes);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date.trim())) {
    errors.date = 'Enter the date as YYYY-MM-DD.';
  }
  if (!values.distanceKm.trim()) {
    errors.distanceKm = 'Enter the distance.';
  } else if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    errors.distanceKm = 'Distance must be greater than zero.';
  }
  if (!values.durationMinutes.trim()) {
    errors.durationMinutes = 'Enter the duration.';
  } else if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    errors.durationMinutes = 'Duration must be greater than zero.';
  }

  const date = values.date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Enter the date as YYYY-MM-DD.';
  } else {
    const candidate = {
      id,
      date,
      distanceKm: Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 1,
      durationMinutes:
        Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 1,
      notes: values.notes.trim(),
    };
    const recordErrors = validateRunRecord(candidate);
    if (recordErrors.some((message) => message.startsWith('Date'))) {
      errors.date = 'Enter a real calendar date as YYYY-MM-DD.';
    }
  }

  const run = {
    id,
    date,
    distanceKm,
    durationMinutes,
    notes: values.notes.trim(),
  };

  return {
    run: Object.keys(errors).length === 0 ? run : null,
    errors,
  };
}
