/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Modern Slate Palette
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // Semantic Colors
                primary: {
                    DEFAULT: '#2563eb', // Blue 600 - Standard SaaS Blue
                    hover: '#1d4ed8',   // Blue 700
                    light: '#3b82f6',   // Blue 500
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                secondary: {
                    DEFAULT: '#475569', // Slate 600
                    hover: '#334155',   // Slate 700
                    light: '#64748b',   // Slate 500
                },
                accent: {
                    DEFAULT: '#0f172a', // Slate 900
                    hover: '#020617',   // Slate 950
                    light: '#1e293b',   // Slate 800
                },
                background: {
                    light: '#f8fafc', // Slate 50
                    dark: '#0f172a',  // Slate 900
                },
                surface: {
                    light: '#ffffff',
                    dark: '#1e293b',
                },
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                text: {
                    main: '#1e293b', // Dark Gray / Charcoal
                    muted: '#64748b',
                }
            },
            backgroundImage: {
                'gradient-primary': 'none',
                'gradient-secondary': 'none',
                'gradient-dark': 'none',
            },
            boxShadow: {
                'glass': 'none',
                'glass-sm': 'none',
                'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                'soft-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
