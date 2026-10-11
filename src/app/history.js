import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RunLoadState from '@/components/RunLoadState';
import RunSummaryCard from '@/components/RunSummaryCard';
import { getRunLogColors } from '@/constants/runlog-theme';
import { useRuns } from '@/hooks/use-runs';

function formatRunDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function HistoryHeader({ colors, isSampleData, error }) {
  return (
    <View style={styles.header}>
      <Text style={[styles.eyebrow, { color: colors.muted }]}>YOUR JOURNEY</Text>
      <Text style={[styles.title, { color: colors.text }]}>Running history</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Every run, all in one place.</Text>
      <Text style={[styles.storageNote, { color: colors.muted }]}>
        {isSampleData ? 'Sample runs · saved on this device' : 'Saved on this device'}
      </Text>
      {error ? (
        <Text accessibilityRole="alert" style={[styles.error, { color: colors.muted }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function EmptyHistory({ colors }) {
  return (
    <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
        <Text style={[styles.icon, { color: colors.text }]}>↗</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Your story starts here</Text>
      <Text style={[styles.emptyMessage, { color: colors.muted }]}>
        Add a run to keep your distance, time, and notes together.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/add-run')}
        style={[styles.button, { backgroundColor: colors.accent }]}>
        <Text style={[styles.buttonText, { color: colors.accentText }]}>Add your first run</Text>
      </Pressable>
    </View>
  );
}

function DeleteRunDialog({ run, colors, isDeleting, error, onCancel, onConfirm }) {
  if (!run) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={isDeleting ? undefined : onCancel}
      statusBarTranslucent>
      <View style={styles.modalBackdrop} accessibilityViewIsModal>
        <View
          accessibilityRole="alert"
          style={[
            styles.dialog,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.dialogTitle, { color: colors.text }]}>Delete this run?</Text>
          <Text style={[styles.dialogMessage, { color: colors.muted }]}>
            This will permanently remove the {run.distanceKm.toFixed(1)} km run from{' '}
            {formatRunDate(run.date)}. This can’t be undone.
          </Text>
          {error ? (
            <Text accessibilityRole="alert" style={[styles.dialogError, { color: colors.danger }]}>
              {error}
            </Text>
          ) : null}
          <View style={styles.dialogActions}>
            <Pressable
              accessibilityRole="button"
              disabled={isDeleting}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.dialogButton,
                {
                  backgroundColor: colors.surfaceMuted,
                  opacity: pressed || isDeleting ? 0.65 : 1,
                },
              ]}>
              <Text style={[styles.dialogButtonText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
              disabled={isDeleting}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.dialogButton,
                {
                  backgroundColor: colors.danger,
                  opacity: pressed || isDeleting ? 0.75 : 1,
                },
              ]}>
              {isDeleting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.dialogButtonText, styles.confirmText]}>Delete run</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function HistoryScreen() {
  const colors = getRunLogColors(useColorScheme());
  const { runs, status, error, isSampleData, reload, deleteRun } = useRuns();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingRunId, setDeletingRunId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const deleteInFlightRef = useRef(false);
  const sortedRuns = [...runs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  async function confirmDelete() {
    if (!pendingDelete || deleteInFlightRef.current) {
      return;
    }

    deleteInFlightRef.current = true;
    setDeletingRunId(pendingDelete.id);
    setDeleteError(null);
    try {
      await deleteRun(pendingDelete.id);
      setPendingDelete(null);
    } catch (deleteFailure) {
      setDeleteError(
        deleteFailure instanceof Error
          ? `Could not delete this run. It has been kept. ${deleteFailure.message}`
          : 'Could not delete this run. It has been kept. Please try again.'
      );
    } finally {
      deleteInFlightRef.current = false;
      setDeletingRunId(null);
    }
  }

  if (status !== 'ready') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.stateContainer}>
          <RunLoadState error={status === 'error' ? error : null} onRetry={reload} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <FlatList
        data={sortedRuns}
        keyExtractor={(run) => run.id}
        renderItem={({ item }) => (
          <RunSummaryCard
            run={item}
            isDeleting={deletingRunId === item.id}
            onDelete={(run) => {
              if (deleteInFlightRef.current) {
                return;
              }
              setDeleteError(null);
              setPendingDelete(run);
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <HistoryHeader colors={colors} isSampleData={isSampleData} error={error} />
        }
        ListEmptyComponent={<EmptyHistory colors={colors} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <DeleteRunDialog
        run={pendingDelete}
        colors={colors}
        isDeleting={deletingRunId !== null}
        error={deleteError}
        onCancel={() => {
          if (!deleteInFlightRef.current) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 44,
  },
  listContent: {
    flexGrow: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 680,
    paddingHorizontal: 20,
    paddingTop: 33,
    paddingBottom: 44,
  },
  header: {
    marginBottom: 19,
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
  storageNote: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  error: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
  },
  separator: {
    height: 11,
  },
  emptyCard: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    marginBottom: 18,
  },
  icon: {
    fontSize: 28,
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyMessage: {
    maxWidth: 280,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop: 22,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(11, 18, 13, 0.55)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dialogTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '700',
  },
  dialogMessage: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
  },
  dialogError: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  dialogButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  dialogButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmText: {
    color: '#FFFFFF',
  },
});
