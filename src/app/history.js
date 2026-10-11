import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RunLoadState from '@/components/RunLoadState';
import RunSummaryCard from '@/components/RunSummaryCard';
import { getRunLogColors } from '@/constants/runlog-theme';
import { useRuns } from '@/hooks/use-runs';

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

export default function HistoryScreen() {
  const colors = getRunLogColors(useColorScheme());
  const { runs, status, error, isSampleData, reload } = useRuns();
  const sortedRuns = [...runs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

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
        renderItem={({ item }) => <RunSummaryCard run={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <HistoryHeader colors={colors} isSampleData={isSampleData} error={error} />
        }
        ListEmptyComponent={<EmptyHistory colors={colors} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
});
