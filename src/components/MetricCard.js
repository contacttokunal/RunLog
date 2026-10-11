import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';

export default function MetricCard({ label, value, unit, detail, style }) {
  const colors = getRunLogColors(useColorScheme());

  return (
    <View
      accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {unit ? <Text style={[styles.unit, { color: colors.muted }]}>{unit}</Text> : null}
      </View>
      {detail ? <Text style={[styles.detail, { color: colors.muted }]}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 145,
    minHeight: 126,
    padding: 18,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 17,
  },
  value: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
  },
  detail: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
});
