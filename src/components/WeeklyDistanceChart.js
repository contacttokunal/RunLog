import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';
import { formatDistance } from '@/utils/runCalculations';

const SECTION_COUNT = 3;

export default function WeeklyDistanceChart({ days, totalDistanceKm }) {
  const colors = getRunLogColors(useColorScheme());
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = Math.min(520, Math.max(180, windowWidth - 80));
  const barWidth = Math.min(26, Math.max(10, Math.floor((chartWidth - 40) / 13)));
  const spacing = Math.max(4, (chartWidth - barWidth * days.length - 24) / (days.length - 1));
  const maxDailyDistance = Math.max(...days.map((day) => day.value), 0);
  const stepValue = maxDailyDistance > 0 ? Math.ceil(maxDailyDistance / SECTION_COUNT) : 1;
  const hasRunsThisWeek = totalDistanceKm > 0;
  const accessibleSummary = days
    .map((day) => `${day.fullLabel}: ${formatDistance(day.value)} kilometres`)
    .join('. ');
  const chartData = days.map((day) => ({
    value: day.value,
    labelComponent: () => (
      <Text style={[styles.dayLabel, { color: colors.text }]}>{day.label}</Text>
    ),
    frontColor: day.value > 0 ? colors.accent : colors.border,
    topLabelComponent:
      day.value > 0
        ? () => (
            <Text style={[styles.valueLabel, { color: colors.muted }]}>
              {formatDistance(day.value)}
            </Text>
          )
        : undefined,
  }));

  return (
    <View>
      {hasRunsThisWeek ? null : (
        <Text style={[styles.emptyMessage, { color: colors.muted }]}>
          No runs logged this week yet.
        </Text>
      )}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Weekly running distance. ${accessibleSummary}. Total ${formatDistance(
          totalDistanceKm
        )} kilometres.`}
        style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={124}
          barWidth={barWidth}
          spacing={spacing}
          initialSpacing={12}
          endSpacing={12}
          maxValue={stepValue * SECTION_COUNT}
          noOfSections={SECTION_COUNT}
          stepValue={stepValue}
          yAxisThickness={0}
          hideYAxisText
          xAxisThickness={1}
          xAxisColor={colors.border}
          rulesColor={colors.border}
          rulesThickness={StyleSheet.hairlineWidth}
          barBorderRadius={5}
          disableScroll
          isAnimated={false}
          labelsExtraHeight={4}
          topLabelTextStyle={[styles.valueLabel, { color: colors.muted }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  emptyMessage: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  dayLabel: {
    color: '#18221B',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  valueLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontVariant: ['tabular-nums'],
  },
});
