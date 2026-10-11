import { Platform, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getRunLogColors } from '@/constants/runlog-theme';

export default function AppScreen({ children, contentContainerStyle, style }) {
  const colors = getRunLogColors(useColorScheme());

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 76 : 18,
    paddingBottom: 44,
  },
  inner: {
    width: '100%',
    maxWidth: 640,
  },
});
