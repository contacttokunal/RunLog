import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import AppScreen from '@/components/AppScreen';
import MetricCard from '@/components/MetricCard';
import { getRunLogColors } from '@/constants/runlog-theme';

function ActionLink({ href, children, secondary = false, colors }) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: secondary ? colors.surfaceMuted : colors.accent,
            opacity: pressed ? 0.78 : 1,
          },
        ]}>
        <Text style={[styles.actionText, { color: secondary ? colors.text : colors.accentText }]}>
          {children}
        </Text>
      </Pressable>
    </Link>
  );
}

export default function DashboardScreen() {
  const colors = getRunLogColors(useColorScheme());

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
            <Text style={[styles.runCountText, { color: colors.heroMuted }]}>0 RUNS</Text>
          </View>
        </View>
        <View style={styles.distanceValueRow}>
          <Text style={styles.distanceValue}>0.0</Text>
          <Text style={[styles.distanceUnit, { color: colors.heroMuted }]}>km</Text>
        </View>
        <Text style={[styles.heroHint, { color: colors.heroMuted }]}>
          Every great running habit starts with one.
        </Text>
        <View style={styles.heroAction}>
          <ActionLink href="/add-run" colors={colors}>
            Log your first run
          </ActionLink>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>At a glance</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>ALL TIME</Text>
      </View>
      <View style={styles.metricsGrid}>
        <MetricCard label="Total runs" value="0" detail="A fresh start" />
        <MetricCard label="Total duration" value="0h" unit="00m" detail="Time on your feet" />
        <MetricCard label="Average pace" value="—" detail="Minutes per kilometre" />
        <MetricCard label="This week" value="0.0" unit="km" detail="Monday – Sunday" />
      </View>

      <View style={[styles.weeklyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.weeklyTop}>
          <View>
            <Text style={[styles.weeklyTitle, { color: colors.text }]}>Your week</Text>
            <Text style={[styles.weeklySubtitle, { color: colors.muted }]}>Distance at a glance</Text>
          </View>
          <Text style={[styles.weeklyTotal, { color: colors.text }]}>0.0 km</Text>
        </View>
        <View style={[styles.emptyChart, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.emptyChartText, { color: colors.muted }]}>
            Your first run will start the chart.
          </Text>
        </View>
      </View>

      <View style={styles.footerActions}>
        <Text style={[styles.footerTitle, { color: colors.text }]}>Ready when you are.</Text>
        <ActionLink href="/history" secondary colors={colors}>
          View running history
        </ActionLink>
      </View>
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
    padding: 22,
    borderRadius: 28,
    marginBottom: 27,
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
  heroAction: {
    alignSelf: 'flex-start',
    marginTop: 20,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  weeklyCard: {
    padding: 18,
    borderRadius: 22,
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
  footerActions: {
    alignItems: 'center',
    gap: 11,
    marginTop: 25,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
});
