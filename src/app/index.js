import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';

import AppScreen from '@/components/AppScreen';
import MetricCard from '@/components/MetricCard';
import { getRunLogColors } from '@/constants/runlog-theme';
import runData from '@/data/runs.json';
import {
  calculateRunStats,
  formatDistance,
  formatDuration,
  formatPace,
} from '@/utils/runCalculations';

function ActionLink({ href, children, secondary = false, colors }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href)}
      style={[
        styles.actionButton,
        {
          backgroundColor: secondary ? colors.surfaceMuted : colors.accent,
        },
      ]}>
      <Text style={[styles.actionText, { color: secondary ? colors.text : colors.accentText }]}>
        {children}
      </Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const colors = getRunLogColors(useColorScheme());
  const { width } = useWindowDimensions();
  const stats = calculateRunStats(runData.runs);
  const hasRuns = stats.totalRuns > 0;
  const singleColumn = width < 342;

  return (
    <AppScreen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>RUNLOG</Text>
          <Text style={[styles.heading, { color: colors.text }]}>Your running, logged.</Text>
        </View>
        <View style={[styles.headerMark, { backgroundColor: colors.accent }]}>
          <Text style={styles.headerMarkText}>R</Text>
        </View>
      </View>

      <View style={[styles.distanceCard, { backgroundColor: colors.hero }]}>
        <View style={styles.distanceHeader}>
          <Text style={[styles.heroLabel, { color: colors.heroMuted }]}>TOTAL DISTANCE</Text>
          <View style={[styles.runCountPill, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
            <Text style={[styles.runCountText, { color: colors.heroMuted }]}>
              {stats.totalRuns} {stats.totalRuns === 1 ? 'RUN' : 'RUNS'}
            </Text>
          </View>
        </View>
        <View style={styles.distanceValueRow}>
          <Text style={styles.distanceValue}>{formatDistance(stats.totalDistanceKm)}</Text>
          <Text style={[styles.distanceUnit, { color: colors.heroMuted }]}>km</Text>
        </View>
        <Text style={[styles.heroHint, { color: colors.heroMuted }]}>
          {hasRuns ? 'A little progress, one run at a time.' : 'Every great running habit starts with one.'}
        </Text>
        <Text style={[styles.sampleNote, { color: colors.heroMuted }]}>
          Static sample data · not saved
        </Text>
        <View style={styles.heroAction}>
          <ActionLink href="/add-run" colors={colors}>
            Log a run
          </ActionLink>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>At a glance</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>ALL TIME</Text>
      </View>
      <View style={styles.metricsGrid}>
        {singleColumn ? (
          <View style={styles.metricsColumn}>
            <MetricCard label="Total runs" value={String(stats.totalRuns)} detail="All recorded runs" />
            <MetricCard
              label="Total duration"
              value={formatDuration(stats.totalDurationMinutes)}
              detail="Time on your feet"
            />
            <MetricCard
              label="Average pace"
              value={formatPace(stats.averagePaceMinutesPerKm)}
              detail="Minutes per kilometre"
            />
            <MetricCard
              label="This week"
              value={formatDistance(stats.weeklyDistanceKm)}
              unit="km"
              detail="Monday – Sunday"
            />
          </View>
        ) : (
          <>
            <View style={styles.metricsRow}>
              <MetricCard label="Total runs" value={String(stats.totalRuns)} detail="All recorded runs" />
              <MetricCard
                label="Total duration"
                value={formatDuration(stats.totalDurationMinutes)}
                detail="Time on your feet"
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Average pace"
                value={formatPace(stats.averagePaceMinutesPerKm)}
                detail="Minutes per kilometre"
              />
              <MetricCard
                label="This week"
                value={formatDistance(stats.weeklyDistanceKm)}
                unit="km"
                detail="Monday – Sunday"
              />
            </View>
          </>
        )}
      </View>

      <View style={[styles.weeklyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.weeklyTop}>
          <View>
            <Text style={[styles.weeklyTitle, { color: colors.text }]}>Your week</Text>
            <Text style={[styles.weeklySubtitle, { color: colors.muted }]}>Distance at a glance</Text>
          </View>
          <Text style={[styles.weeklyTotal, { color: colors.text }]}>
            {formatDistance(stats.weeklyDistanceKm)} km
          </Text>
        </View>
        <View style={[styles.emptyChart, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.emptyChartText, { color: colors.muted }]}>
            {stats.weeklyDistanceKm > 0
              ? 'Weekly chart visualization is coming soon.'
              : 'No runs logged this week yet.'}
          </Text>
        </View>
      </View>
      <View style={styles.historyAction}>
        <ActionLink href="/history" secondary colors={colors}>
          View running history
        </ActionLink>
      </View>

      {stats.invalidRecordCount > 0 ? (
        <Text accessibilityRole="alert" style={[styles.dataWarning, { color: colors.muted }]}>
          {stats.invalidRecordCount} invalid sample record
          {stats.invalidRecordCount === 1 ? ' was' : 's were'} skipped.
        </Text>
      ) : null}

    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },
  heading: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  headerMark: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  headerMarkText: {
    color: '#1A2711',
    fontSize: 21,
    fontWeight: '900',
  },
  distanceCard: {
    padding: 24,
    borderRadius: 26,
    marginBottom: 24,
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  runCountPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  runCountText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  distanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 17,
  },
  distanceValue: {
    color: '#FFFFFF',
    fontSize: 62,
    lineHeight: 68,
    fontWeight: '700',
    letterSpacing: -3,
    fontVariant: ['tabular-nums'],
  },
  distanceUnit: {
    fontSize: 17,
    fontWeight: '600',
  },
  heroHint: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 1,
  },
  sampleNote: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
  },
  heroAction: {
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  actionButton: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricsColumn: {
    gap: 12,
  },
  weeklyCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  weeklyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  weeklySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  weeklyTotal: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  emptyChart: {
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 15,
  },
  emptyChartText: {
    fontSize: 12,
    textAlign: 'center',
  },
  dataWarning: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  historyAction: {
    alignItems: 'center',
    marginTop: 14,
  },
});
