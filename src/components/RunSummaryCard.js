import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';
import { formatDistance, formatDuration, formatPace } from '@/utils/runCalculations';

function formatRunDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RunSummaryCard({ run }) {
  const colors = getRunLogColors(useColorScheme());

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: colors.muted }]}>{formatRunDate(run.date)}</Text>
        <Text style={[styles.distance, { color: colors.text }]}>{formatDistance(run.distanceKm)} km</Text>
      </View>
      <View style={styles.details}>
        <Text style={[styles.detail, { color: colors.muted }]}>{formatDuration(run.durationMinutes)}</Text>
        <Text style={[styles.separator, { color: colors.border }]}>·</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>
          {formatPace(run.durationMinutes / run.distanceKm)}
        </Text>
      </View>
      {run.notes ? <Text style={[styles.notes, { color: colors.text }]}>{run.notes}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  date: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  distance: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9,
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
  },
  separator: {
    fontSize: 14,
  },
  notes: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
});
