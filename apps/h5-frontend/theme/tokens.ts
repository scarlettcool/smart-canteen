
export const THEMES = {
  T1: {
    name: '政务蓝',
    primary: '#2F5BEA',
    secondary: '#EEF3FF',
    accent: '#F59E0B',
    success: '#22C55E',
    bg: '#F6F7FB',
  },
  T2: {
    name: '蓝灰高级',
    primary: '#334155',
    secondary: '#F1F5F9',
    accent: '#0EA5E9',
    success: '#10B981',
    bg: '#F8FAFC',
  },
  T3: {
    name: '蓝绿健康',
    primary: '#0891B2',
    secondary: '#ECFEFF',
    accent: '#10B981',
    success: '#059669',
    bg: '#F6F7FB',
  }
};

export type ThemeKey = keyof typeof THEMES;

export const injectTheme = (key: ThemeKey) => {
  const theme = THEMES[key] || THEMES.T2;
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--success', theme.success);
  root.style.setProperty('--bg', theme.bg);
  localStorage.setItem('user_theme', key);
};
