/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-primary": "#ffffff",
        "surface": "#f8f9ff",
        "heatmap-active": "#10B981",
        "surface-tint": "#4d44e3",
        "on-surface": "#0b1c30",
        "on-secondary-fixed-variant": "#005236",
        "surface-container-lowest": "#ffffff",
        "on-tertiary": "#ffffff",
        "outline-variant": "#c7c4d8",
        "secondary": "#006c49",
        "surface-container-high": "#dce9ff",
        "on-error": "#ffffff",
        "on-tertiary-fixed": "#2a1700",
        "on-surface-variant": "#464555",
        "inverse-primary": "#c3c0ff",
        "secondary-container": "#6cf8bb",
        "xp-bar-fill": "#3B82F6",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#3323cc",
        "on-primary-container": "#dad7ff",
        "secondary-fixed": "#6ffbbe",
        "on-secondary": "#ffffff",
        "on-background": "#0b1c30",
        "tertiary-fixed-dim": "#ffb95f",
        "surface-container-highest": "#d3e4fe",
        "background": "#f8f9ff",
        "on-secondary-fixed": "#002113",
        "tertiary-container": "#885500",
        "on-tertiary-fixed-variant": "#653e00",
        "primary": "#3525cd",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "streak-flame": "#FB923C",
        "outline": "#777587",
        "surface-dim": "#cbdbf5",
        "on-secondary-container": "#00714d",
        "surface-container": "#e5eeff",
        "surface-dark": "#0F172A",
        "primary-container": "#4f46e5",
        "surface-bright": "#f8f9ff",
        "secondary-fixed-dim": "#4edea3",
        "surface-light": "#F8FAFC",
        "primary-fixed": "#e2dfff",
        "error": "#ba1a1a",
        "tertiary": "#684000",
        "surface-container-low": "#eff4ff",
        "surface-variant": "#d3e4fe",
        "error-container": "#ffdad6",
        "heatmap-base": "#E2E8F0",
        "primary-fixed-dim": "#c3c0ff",
        "tertiary-fixed": "#ffddb8",
        "on-tertiary-container": "#ffd4a4",
        "on-primary-fixed": "#0f0069",
        "error-rose": "#F43F5E"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "48px",
        "max-width-content": "800px",
        base: "8px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "body-md": ["Inter"],
        "label-md": ["JetBrains Mono"],
        "body-lg": ["Inter"],
        "headline-lg-mobile": ["Lexend"],
        "headline-lg": ["Lexend"],
        "headline-xl": ["Lexend"],
        "stats-number": ["Lexend"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-xl": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "stats-number": ["24px", { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "700" }]
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'streak-pop': 'streak-pop 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        },
        'streak-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
