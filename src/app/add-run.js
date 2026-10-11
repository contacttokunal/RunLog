import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import AppScreen from '@/components/AppScreen';
import { getRunLogColors } from '@/constants/runlog-theme';

export default function AddRunScreen() {
  const colors = getRunLogColors(useColorScheme());

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.muted }]}>A NEW MILESTONE</Text>
        <Text style={[styles.title, { color: colors.text }]}>Add a run</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Your next entry is just around the corner.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
          <Text style={[styles.icon, { color: colors.accentText }]}>+</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Make it your first</Text>
        <Text style={[styles.cardMessage, { color: colors.muted }]}>
          The run entry form is coming in the next build step. Your dashboard is ready and waiting.
        </Text>
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.78 : 1 },
            ]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Back to dashboard</Text>
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
  card: {
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
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardMessage: {
    maxWidth: 290,
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
