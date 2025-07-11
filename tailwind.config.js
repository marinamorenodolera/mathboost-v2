/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Sistema de colores del branding
      colors: {
        brand: {
          background: '#FFFFFF',
          surface: '#F8FAFC',
          'surface-hover': '#F1F5F9',
          text: '#0F172A',
          'text-secondary': '#64748B',
          'text-tertiary': '#94A3B8',
          accent: '#F8FAFF',
          'accent-active': '#E0E7FF',
          success: '#ECFDF5',
          'success-text': '#059669',
          error: '#FEF2F2',
          'error-text': '#DC2626',
          border: 'rgba(0, 0, 0, 0.05)',
          shadow: 'rgba(0, 0, 0, 0.08)',
          'shadow-rich': 'rgba(0, 0, 0, 0.12)',
          primary: '#3B82F6',
          'primary-light': '#DBEAFE',
          secondary: '#8B5CF6',
          'secondary-light': '#EDE9FE'
        }
      },
      // Sistema de tipografía
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        display: ['Inter', '-apple-system', 'sans-serif'],
      },
      // Tamaños de fuente mobile-first
      fontSize: {
        // Display sizes (para títulos principales)
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],     // 32px
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],   // 40px
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],     // 48px
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],   // 56px
        'display-2xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],    // 64px
        
        // Math display (para números en el juego)
        'math-sm': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],          // 48px
        'math-md': ['4rem', { lineHeight: '1', letterSpacing: '-0.02em' }],          // 64px
        'math-lg': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],          // 80px
        'math-xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],          // 96px
        'math-2xl': ['7rem', { lineHeight: '1', letterSpacing: '-0.04em' }],         // 112px
      },
      // Espaciado consistente
      spacing: {
        // Touch-friendly sizes
        'touch': '44px',      // Mínimo para áreas táctiles
        'touch-lg': '52px',   // Áreas táctiles grandes
        'header': '64px',     // Altura del header
        'keyboard': '280px',  // Altura del teclado móvil
      },
      // Alturas personalizadas
      height: {
        'dvh': '100dvh',      // Dynamic viewport height
        'svh': '100svh',      // Small viewport height
        'lvh': '100lvh',      // Large viewport height
      },
      minHeight: {
        'touch': '44px',      // Mínimo para elementos táctiles
        'dvh': '100dvh',
      },
      // Animaciones suaves
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Backdrop filters
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      // Border radius mobile-friendly
      borderRadius: {
        'touch': '12px',      // Radio para elementos táctiles
        'card': '16px',       // Radio para tarjetas
        'modal': '20px',      // Radio para modales
      },
      // Z-index system
      zIndex: {
        'header': '100',
        'modal': '200',
        'keyboard': '300',
        'toast': '400',
      },
    },
    // Configuración de pantallas mobile-first
    screens: {
      'xs': '375px',     // iPhone SE/Mini
      'sm': '640px',     // Tablets pequeñas
      'md': '768px',     // Tablets
      'lg': '1024px',    // Desktop pequeño
      'xl': '1280px',    // Desktop
      '2xl': '1536px',   // Desktop grande
      // Breakpoints especiales
      'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
      'stylus': { 'raw': '(hover: none) and (pointer: fine)' },
      'pointer': { 'raw': '(hover: hover) and (pointer: fine)' },
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
    },
  },
  plugins: [],
}