/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933",
        brand: "#1dbf73",
        navy: "#FAFAF8",
        cream: "#FFF8F0",
        "brand-dark": "#15a85f",
        "saffron-dark": "#e6851a",
        "ink": "#111111",
        "ink-light": "#555555",
        "ink-muted": "#999999",
        "surface": "#FFFFFF",
        "surface-2": "#F5F5F0",
        "border-light": "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      animation: {
        "flag-wave": "flagWave 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
        "slide-right": "slideRight 1.2s ease forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        flagWave: {
          "0%, 100%": { transform: "skewX(0deg) scaleX(1)" },
          "50%": { transform: "skewX(-2deg) scaleX(0.98)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: 0, transform: "translateX(-40px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(29, 191, 115, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(29, 191, 115, 0.6)" },
        },
      },
    },
  },
  plugins: [],
}
