import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';
import { RunsProvider } from '@/hooks/use-runs';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = getRunLogColors(colorScheme);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RunsProvider>
        <NativeTabs
          backgroundColor={colors.tab}
          indicatorColor={colors.accent}
          iconColor={colors.muted}
          selectedIconColor={colors.text}
          labelStyle={{ color: colors.muted }}
          selectedLabelStyle={{ color: colors.text }}>
          <NativeTabs.Trigger name="index">
            <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf="house" md="home" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="history">
            <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf="clock" md="history" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="add-run">
            <NativeTabs.Trigger.Label>Add Run</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf="plus" md="add" />
          </NativeTabs.Trigger>
        </NativeTabs>
      </RunsProvider>
    </ThemeProvider>
  );
}
