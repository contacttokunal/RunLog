import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';
import { formatDistance, formatDuration, formatPace } from '@/utils/runCalculations';

function formatRunDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RunSummaryCard({ run, onEdit, onDelete, isDeleting = false }) {
  const colors = getRunLogColors(useColorScheme());
  const dateLabel = formatRunDate(run.date);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: colors.text }]}>{dateLabel}</Text>
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
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit run on ${dateLabel}`}
          disabled={isDeleting}
          onPress={() => {
            if (onEdit) {
              onEdit(run);
            } else {
              router.push(`/add-run?editId=${encodeURIComponent(run.id)}`);
            }
          }}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.surfaceMuted, opacity: pressed || isDeleting ? 0.65 : 1 },
          ]}>
          <Text style={[styles.editText, { color: colors.text }]}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete run on ${dateLabel}`}
          accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
          disabled={isDeleting}
          onPress={() => onDelete?.(run)}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.surfaceMuted,
              opacity: pressed || isDeleting ? 0.65 : 1,
            },
          ]}>
          {isDeleting ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={[styles.deleteText, { color: colors.danger }]}>Delete</Text>
          )}
        </Pressable>
      </View>
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  date: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  distance: {
    flexShrink: 0,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 13,
  },
  actionButton: {
    minHeight: 44,
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
