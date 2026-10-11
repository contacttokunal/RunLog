import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { loadRuns, saveRuns } from '@/services/runStorage';
import { validateRunRecord, validateRunRecords } from '@/utils/runCalculations';

const RunsContext = createContext(null);

function toErrorMessage(error) {
  return error instanceof Error ? error.message : 'An unexpected run storage error occurred.';
}

export function RunsProvider({ children }) {
  const [runs, setRuns] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const runsRef = useRef([]);
  const statusRef = useRef('loading');
  const mountedRef = useRef(false);
  const mutationQueueRef = useRef(Promise.resolve());

  const fetchRuns = useCallback(async () => {
    try {
      const stored = await loadRuns();
      if (mountedRef.current) {
        runsRef.current = stored.runs;
        setRuns(stored.runs);
        setIsSampleData(stored.isSampleData);
        statusRef.current = 'ready';
        setStatus('ready');
      }
    } catch (loadError) {
      if (mountedRef.current) {
        statusRef.current = 'error';
        setError(toErrorMessage(loadError));
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadRuns()
      .then((stored) => {
        if (!mountedRef.current) {
          return;
        }
        runsRef.current = stored.runs;
        setRuns(stored.runs);
        setIsSampleData(stored.isSampleData);
        statusRef.current = 'ready';
        setStatus('ready');
      })
      .catch((loadError) => {
        if (!mountedRef.current) {
          return;
        }
        statusRef.current = 'error';
        setError(toErrorMessage(loadError));
        setStatus('error');
      });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reload = useCallback(() => {
    statusRef.current = 'loading';
    setStatus('loading');
    setError(null);
    return fetchRuns();
  }, [fetchRuns]);

  const mutate = useCallback((updateRuns) => {
    const operation = mutationQueueRef.current.then(async () => {
      if (statusRef.current !== 'ready') {
        throw new Error('Runs are not ready. Load them before making changes.');
      }

      const nextRuns = updateRuns(runsRef.current);
      const validation = validateRunRecords(nextRuns);
      if (validation.errors.length > 0) {
        throw new Error('The requested change contains invalid run data.');
      }

      try {
        await saveRuns(validation.runs);
      } catch (saveError) {
        if (mountedRef.current) {
          setError(toErrorMessage(saveError));
        }
        throw saveError;
      }

      if (mountedRef.current) {
        runsRef.current = validation.runs;
        setRuns(validation.runs);
        setIsSampleData(false);
        setError(null);
      }
      return validation.runs;
    });

    mutationQueueRef.current = operation.then(
      () => undefined,
      () => undefined
    );
    return operation;
  }, []);

  const addRun = useCallback(
    (run) =>
      mutate((currentRuns) => {
        const errors = validateRunRecord(run);
        if (errors.length > 0) {
          throw new Error(`Run is invalid. ${errors.join(' ')}`);
        }
        if (currentRuns.some((currentRun) => currentRun.id === run.id)) {
          throw new Error('A run with this ID already exists.');
        }
        return [...currentRuns, run];
      }),
    [mutate]
  );

  const updateRun = useCallback(
    (id, changes) =>
      mutate((currentRuns) => {
        const index = currentRuns.findIndex((run) => run.id === id);
        if (index < 0) {
          throw new Error('The run to update could not be found.');
        }
        const updatedRun = { ...currentRuns[index], ...changes, id };
        const errors = validateRunRecord(updatedRun);
        if (errors.length > 0) {
          throw new Error(`Run is invalid. ${errors.join(' ')}`);
        }
        return currentRuns.map((run, runIndex) => (runIndex === index ? updatedRun : run));
      }),
    [mutate]
  );

  const deleteRun = useCallback(
    (id) =>
      mutate((currentRuns) => {
        if (!currentRuns.some((run) => run.id === id)) {
          throw new Error('The run to delete could not be found.');
        }
        return currentRuns.filter((run) => run.id !== id);
      }),
    [mutate]
  );

  const value = useMemo(
    () => ({ runs, status, error, isSampleData, reload, addRun, updateRun, deleteRun }),
    [runs, status, error, isSampleData, reload, addRun, updateRun, deleteRun]
  );

  return <RunsContext.Provider value={value}>{children}</RunsContext.Provider>;
}

export function useRuns() {
  const context = useContext(RunsContext);
  if (!context) {
    throw new Error('useRuns must be used within a RunsProvider.');
  }
  return context;
}
