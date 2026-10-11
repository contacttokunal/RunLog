import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import AppScreen from '@/components/AppScreen';
import RunForm from '@/components/RunForm';
import RunLoadState from '@/components/RunLoadState';
import { getRunLogColors } from '@/constants/runlog-theme';
import { useRuns } from '@/hooks/use-runs';

function RecoveryButton({ children, onPress, colors }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.recoveryButton,
        { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.78 : 1 },
      ]}>
      <Text style={[styles.recoveryButtonText, { color: colors.text }]}>{children}</Text>
    </Pressable>
  );
}

export default function AddRunScreen() {
  const colors = getRunLogColors(useColorScheme());
  const { editId } = useLocalSearchParams();
  const runId = Array.isArray(editId) ? editId[0] : editId;
  const { runs, status, error, reload, addRun, updateRun } = useRuns();
  const existingRun = runId ? runs.find((run) => run.id === runId) : null;
  const isEditing = Boolean(runId);

  if (status !== 'ready') {
    return (
      <AppScreen contentContainerStyle={styles.stateContent}>
        <RunLoadState error={status === 'error' ? error : null} onRetry={reload} />
      </AppScreen>
    );
  }

  if (isEditing && !existingRun) {
    return (
      <AppScreen contentContainerStyle={styles.stateContent}>
        <View
          style={[
            styles.recoveryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.title, { color: colors.text }]}>Run not found</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            This run may have been removed. Return to your history and choose another run.
          </Text>
          <RecoveryButton onPress={() => router.replace('/history')} colors={colors}>
            Back to history
          </RecoveryButton>
        </View>
      </AppScreen>
    );
  }

  async function handleSubmit(run) {
    if (existingRun) {
      await updateRun(existingRun.id, run);
      router.replace('/history');
    } else {
      await addRun(run);
      router.replace('/');
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.muted }]}>
          {isEditing ? 'UPDATE YOUR MILESTONE' : 'A NEW MILESTONE'}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {isEditing ? 'Edit run' : 'Add a run'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {isEditing ? 'Update the details for this run.' : 'Add the details while they’re fresh.'}
        </Text>
      </View>

      <RunForm
        key={existingRun?.id ?? 'new-run'}
        initialRun={existingRun}
        onSubmit={handleSubmit}
        onCancel={() => router.replace(isEditing ? '/history' : '/')}
        submitLabel={isEditing ? 'Save changes' : 'Save run'}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  stateContent: {
    flexGrow: 1,
  },
  header: {
    marginTop: 15,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  recoveryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  recoveryButton: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 15,
    marginTop: 18,
  },
  recoveryButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
