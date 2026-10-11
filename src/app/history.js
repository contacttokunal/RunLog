import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import AppScreen from '@/components/AppScreen';
import { getRunLogColors } from '@/constants/runlog-theme';

export default function HistoryScreen() {
  const colors = getRunLogColors(useColorScheme());

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.muted }]}>YOUR JOURNEY</Text>
        <Text style={[styles.title, { color: colors.text }]}>Running history</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Every run, all in one place.
        </Text>
      </View>

      <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.icon, { color: colors.text }]}>↗</Text>
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your story starts here</Text>
        <Text style={[styles.emptyMessage, { color: colors.muted }]}>
          Once you log a run, it will show up here with its distance, time, and notes.
        </Text>
        <Link href="/add-run" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accent, opacity: pressed ? 0.78 : 1 },
            ]}>
            <Text style={[styles.buttonText, { color: colors.accentText }]}>Add your first run</Text>
          </Pressable>
        </Link>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
  },
  header: {
    alignSelf: 'stretch',
    marginTop: 15,
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
  emptyCard: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    marginTop: 24,
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
