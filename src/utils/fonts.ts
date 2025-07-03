export interface FontFamily {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  subsets: string[];
  popularity: number;
  isProfessional: boolean;
  description?: string;
}

// Curated list of professional fonts perfect for resumes
export const PROFESSIONAL_FONTS: FontFamily[] = [
  // Sans-Serif Fonts (Most Professional)
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 95,
    isProfessional: true,
    description: 'Modern, highly legible font designed for digital interfaces'
  },
  {
    family: 'Roboto',
    category: 'sans-serif',
    variants: ['300', '400', '500', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 90,
    isProfessional: true,
    description: 'Clean, geometric font with friendly curves'
  },
  {
    family: 'Open Sans',
    category: 'sans-serif',
    variants: ['300', '400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 88,
    isProfessional: true,
    description: 'Humanist sans serif with optimized legibility'
  },
  {
    family: 'Lato',
    category: 'sans-serif',
    variants: ['300', '400', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 85,
    isProfessional: true,
    description: 'Elegant, humanist sans serif with warm character'
  },
  {
    family: 'Source Sans Pro',
    category: 'sans-serif',
    variants: ['300', '400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 82,
    isProfessional: true,
    description: 'Clean, readable font designed for UI design'
  },
  {
    family: 'Nunito Sans',
    category: 'sans-serif',
    variants: ['300', '400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 80,
    isProfessional: true,
    description: 'Rounded edges with professional appearance'
  },
  {
    family: 'Poppins',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 78,
    isProfessional: true,
    description: 'Geometric sans serif with distinctive character'
  },
  
  // Serif Fonts (Traditional Professional)
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 75,
    isProfessional: true,
    description: 'High-contrast, elegant serif for sophisticated resumes'
  },
  {
    family: 'Merriweather',
    category: 'serif',
    variants: ['300', '400', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 73,
    isProfessional: true,
    description: 'Readable serif font designed for screens'
  },
  {
    family: 'Lora',
    category: 'serif',
    variants: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 70,
    isProfessional: true,
    description: 'Contemporary serif with calligraphic influences'
  },
  {
    family: 'Source Serif Pro',
    category: 'serif',
    variants: ['400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 68,
    isProfessional: true,
    description: 'Readable serif companion to Source Sans Pro'
  },
  {
    family: 'Crimson Text',
    category: 'serif',
    variants: ['400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 65,
    isProfessional: true,
    description: 'Classic book-style serif font'
  },
  
  // Display Fonts (Creative Professional)
  {
    family: 'Montserrat',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 77,
    isProfessional: true,
    description: 'Urban typography inspired by Buenos Aires'
  },
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 72,
    isProfessional: true,
    description: 'Condensed sans serif with strong personality'
  },
  {
    family: 'Raleway',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 70,
    isProfessional: true,
    description: 'Elegant sans serif with thin strokes'
  }
];

// Additional popular fonts for variety
export const ADDITIONAL_FONTS: FontFamily[] = [
  {
    family: 'Fira Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 62,
    isProfessional: true,
    description: 'Humanist sans serif designed for Firefox OS'
  },
  {
    family: 'PT Sans',
    category: 'sans-serif',
    variants: ['400', '700'],
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    popularity: 60,
    isProfessional: true,
    description: 'Paratype font with Cyrillic support'
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 58,
    isProfessional: true,
    description: 'Mid-contrast sans serif optimized for work environments'
  },
  {
    family: 'IBM Plex Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 56,
    isProfessional: true,
    description: 'Corporate font family designed by IBM'
  },
  {
    family: 'Libre Baskerville',
    category: 'serif',
    variants: ['400', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 54,
    isProfessional: true,
    description: 'Classic serif based on American Type Founder\'s Baskerville'
  },
  {
    family: 'Ubuntu',
    category: 'sans-serif',
    variants: ['300', '400', '500', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 52,
    isProfessional: true,
    description: 'Humanist sans serif designed for clarity on screen'
  },
  {
    family: 'Rubik',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 50,
    isProfessional: true,
    description: 'Sans serif with slightly rounded corners'
  },
  {
    family: 'Noto Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 48,
    isProfessional: true,
    description: 'Google\'s font to support all languages'
  },
  {
    family: 'Karla',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 46,
    isProfessional: true,
    description: 'Grotesque sans serif with friendly appearance'
  },
  {
    family: 'Barlow',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 44,
    isProfessional: true,
    description: 'Slightly condensed, versatile sans serif'
  },
  {
    family: 'Mulish',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 42,
    isProfessional: true,
    description: 'Minimalist sans serif designed for versatility'
  },
  {
    family: 'DM Sans',
    category: 'sans-serif',
    variants: ['400', '500', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 40,
    isProfessional: true,
    description: 'Low-contrast geometric sans serif'
  },
  {
    family: 'Manrope',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 38,
    isProfessional: true,
    description: 'Modern geometric sans serif with personality'
  },
  // Additional Serif Fonts
  {
    family: 'Cormorant Garamond',
    category: 'serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 36,
    isProfessional: true,
    description: 'Display serif inspired by Claude Garamond'
  },
  {
    family: 'Spectral',
    category: 'serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 34,
    isProfessional: true,
    description: 'Serif optimized for digital reading'
  },
  {
    family: 'Vollkorn',
    category: 'serif',
    variants: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 32,
    isProfessional: true,
    description: 'Quiet and soft serif for continuous reading'
  },
  {
    family: 'Bitter',
    category: 'serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 30,
    isProfessional: true,
    description: 'Contemporary slab serif for small sizes'
  },
  {
    family: 'Alegreya',
    category: 'serif',
    variants: ['400', '500', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 28,
    isProfessional: true,
    description: 'Calligraphic serif designed for literature'
  },
  // Creative Professional Fonts
  {
    family: 'Overpass',
    category: 'sans-serif',
    variants: ['300', '400', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 26,
    isProfessional: true,
    description: 'Inspired by Highway Gothic road signage'
  },
  {
    family: 'Space Grotesk',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    popularity: 24,
    isProfessional: true,
    description: 'Modern grotesque based on Space Mono'
  }
];

// Combine all fonts
export const ALL_FONTS = [...PROFESSIONAL_FONTS, ...ADDITIONAL_FONTS];

// Font loading utilities
export const loadGoogleFont = (fontFamily: string, variants: string[] = ['400']) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@${variants.join(';')}&display=swap`;
  document.head.appendChild(link);
};

export const loadAllProfessionalFonts = () => {
  PROFESSIONAL_FONTS.forEach(font => {
    loadGoogleFont(font.family, font.variants);
  });
};

// Font search and filtering
export const searchFonts = (query: string, fonts: FontFamily[] = ALL_FONTS): FontFamily[] => {
  if (!query.trim()) return fonts;
  
  const lowercaseQuery = query.toLowerCase();
  return fonts.filter(font => 
    font.family.toLowerCase().includes(lowercaseQuery) ||
    font.category.toLowerCase().includes(lowercaseQuery) ||
    font.description?.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterFontsByCategory = (category: string, fonts: FontFamily[] = ALL_FONTS): FontFamily[] => {
  if (category === 'all') return fonts;
  return fonts.filter(font => font.category === category);
};

export const getFontsByPopularity = (fonts: FontFamily[] = ALL_FONTS): FontFamily[] => {
  return [...fonts].sort((a, b) => b.popularity - a.popularity);
};

// Font application utilities
export const getFontCSS = (fontFamily: string, weight: string = '400'): string => {
  return `font-family: '${fontFamily}', ${getFallbackStack(fontFamily)}; font-weight: ${weight};`;
};

export const getFallbackStack = (fontFamily: string): string => {
  const font = ALL_FONTS.find(f => f.family === fontFamily);
  if (!font) return 'system-ui, sans-serif';
  
  switch (font.category) {
    case 'serif':
      return 'Georgia, Times, "Times New Roman", serif';
    case 'sans-serif':
      return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'monospace':
      return '"Courier New", Courier, monospace';
    case 'display':
      return 'system-ui, sans-serif';
    case 'handwriting':
      return 'cursive';
    default:
      return 'system-ui, sans-serif';
  }
};

// Font categories for UI
export const FONT_CATEGORIES = [
  { id: 'all', name: 'All Fonts', icon: '📝' },
  { id: 'sans-serif', name: 'Sans Serif', icon: '🔤' },
  { id: 'serif', name: 'Serif', icon: '📰' },
  { id: 'display', name: 'Display', icon: '🎨' },
  { id: 'monospace', name: 'Monospace', icon: '💻' },
];

// Default font for new resumes
export const DEFAULT_FONT = 'Inter'; 