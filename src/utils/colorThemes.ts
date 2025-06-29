import { ColorTheme } from '../types/resume';

export const predefinedThemes: ColorTheme[] = [
  {
    id: 'cyan',
    name: 'Cyan Professional',
    primary: '#00FFCC',
    secondary: '#00E6B8',
    accent: '#3DDC91',
    gradient: { from: '#00FFCC', to: '#3DDC91' }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    accent: '#60A5FA',
    gradient: { from: '#3B82F6', to: '#1D4ED8' }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    gradient: { from: '#8B5CF6', to: '#7C3AED' }
  },
  {
    id: 'green',
    name: 'Forest Green',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    gradient: { from: '#10B981', to: '#059669' }
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FBBF24',
    gradient: { from: '#F59E0B', to: '#D97706' }
  },
  {
    id: 'red',
    name: 'Crimson Red',
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#F87171',
    gradient: { from: '#EF4444', to: '#DC2626' }
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    gradient: { from: '#EC4899', to: '#DB2777' }
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
    gradient: { from: '#6366F1', to: '#4F46E5' }
  },
  {
    id: 'teal',
    name: 'Teal Professional',
    primary: '#14B8A6',
    secondary: '#0F766E',
    accent: '#5EEAD4',
    gradient: { from: '#14B8A6', to: '#0F766E' }
  },
  {
    id: 'slate',
    name: 'Modern Slate',
    primary: '#64748B',
    secondary: '#475569',
    accent: '#94A3B8',
    gradient: { from: '#64748B', to: '#475569' }
  }
];

export const createCustomTheme = (primary: string): ColorTheme => {
  // Convert hex to HSL for color variations
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const [h, s, l] = hexToHsl(primary);
  
  // Create variations
  const secondary = hslToHex(h, s, Math.max(l - 15, 10)); // Darker
  const accent = hslToHex(h, Math.max(s - 20, 30), Math.min(l + 15, 90)); // Lighter

  return {
    id: 'custom',
    name: 'Custom Color',
    primary,
    secondary,
    accent,
    gradient: { from: primary, to: secondary }
  };
};