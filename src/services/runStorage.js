import AsyncStorage from '@react-native-async-storage/async-storage';

import sampleData from '@/data/runs.json';
import { validateRunRecords } from '@/utils/runCalculations';

const STORAGE_KEY = '@runlog/runs:v1';
const STORAGE_VERSION = 1;

export class RunStorageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RunStorageError';
  }
}

function validateAllRuns(runs) {
  const result = validateRunRecords(runs);
  if (result.errors.length > 0) {
    const details = result.errors
      .map((entry) => {
        if (typeof entry === 'string') {
          return entry;
        }
        return `Run ${entry.index + 1}: ${entry.messages.join(' ')}`;
      })
      .join(' ');
    throw new RunStorageError(`Run data is invalid and was not changed. ${details}`);
  }
  return result.runs;
}

function parseRunDocument(serialized) {
  let document;
  try {
    document = JSON.parse(serialized);
  } catch {
    throw new RunStorageError('Saved run data could not be read because it is damaged.');
  }

  if (
    !document ||
    typeof document !== 'object' ||
    Array.isArray(document) ||
    document.version !== STORAGE_VERSION ||
    !['sample', 'user'].includes(document.source) ||
    !Array.isArray(document.runs)
  ) {
    throw new RunStorageError(
      'Saved run data has an unsupported format. It was left unchanged.'
    );
  }

  return {
    runs: validateAllRuns(document.runs),
    isSampleData: document.source === 'sample',
  };
}

async function writeRunDocument(runs, source) {
  const validRuns = validateAllRuns(runs);
  const document = JSON.stringify({
    version: STORAGE_VERSION,
    source,
    runs: validRuns,
  });

  try {
    await AsyncStorage.setItem(STORAGE_KEY, document);
  } catch {
    throw new RunStorageError('Run data could not be saved. Please try again.');
  }
}

export async function loadRuns() {
  let serialized;
  try {
    serialized = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    throw new RunStorageError('Run data could not be loaded. Please try again.');
  }

  if (serialized !== null) {
    return parseRunDocument(serialized);
  }

  if (
    !sampleData ||
    sampleData.version !== STORAGE_VERSION ||
    !Array.isArray(sampleData.runs)
  ) {
    throw new RunStorageError('The sample run data is missing or has an unsupported format.');
  }

  const runs = validateAllRuns(sampleData.runs);
  await writeRunDocument(runs, 'sample');
  return { runs, isSampleData: true };
}

export async function saveRuns(runs) {
  await writeRunDocument(runs, 'user');
}
