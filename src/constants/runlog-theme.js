export const runLogColors = {
  light: {
    background: '#F4F5F0',
    surface: '#FFFFFF',
    surfaceMuted: '#E9EDE6',
    text: '#18221B',
    muted: '#6F7A70',
    accent: '#C8F169',
    accentText: '#1A2711',
    hero: '#193E31',
    heroMuted: '#BDD0C4',
    border: '#E3E8E0',
    danger: '#B93838',
    tab: '#FFFFFF',
  },
  dark: {
    background: '#101713',
    surface: '#1B241F',
    surfaceMuted: '#263129',
    text: '#F0F4EF',
    muted: '#A2B0A5',
    accent: '#C8F169',
    accentText: '#1A2711',
    hero: '#203F33',
    heroMuted: '#C2D2C7',
    border: '#2D3931',
    danger: '#FF8B83',
    tab: '#1B241F',
  },
};

export function getRunLogColors(colorScheme) {
  return colorScheme === 'dark' ? runLogColors.dark : runLogColors.light;
}
