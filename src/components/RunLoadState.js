import { ActivityIndicator, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';

export default function RunLoadState({ error, onRetry }) {
  const colors = getRunLogColors(useColorScheme());

  return (
    <View
      accessibilityRole={error ? 'alert' : undefined}
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {error ? (
        <>
          <Text style={[styles.title, { color: colors.text }]}>Runs couldn’t be loaded</Text>
          <Text style={[styles.message, { color: colors.muted }]}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={[styles.buttonText, { color: colors.accentText }]}>Try again</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator color={colors.text} />
          <Text style={[styles.message, { color: colors.muted }]}>Loading your runs…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    maxWidth: 290,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
  },
  button: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 15,
    marginTop: 18,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
