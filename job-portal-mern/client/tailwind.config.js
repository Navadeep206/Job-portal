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
                primary: {
                    DEFAULT: '#4f46e5', // Indigo 600
                    hover: '#4338ca',   // Indigo 700
                    light: '#818cf8',   // Indigo 400
                },
                secondary: {
                    DEFAULT: '#0d9488', // Teal 600
                    hover: '#0f766e',   // Teal 700
                    light: '#2dd4bf',   // Teal 400
                },
                dark: {
                    900: '#0f172a', // Slate 900
                    800: '#1e293b', // Slate 800
                    700: '#334155', // Slate 700
                },
                light: {
                    50: '#f8fafc',  // Slate 50
                    100: '#f1f5f9', // Slate 100
                    200: '#e2e8f0', // Slate 200
                    300: '#cbd5e1', // Slate 300
                },
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
                text: {
                    main: '#0f172a', // Slate 900
                    muted: '#64748b', // Slate 500
                },
                success: '#10b981', // Emerald 500
                error: '#ef4444',   // Red 500
                warning: '#f59e0b', // Amber 500
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, #4f46e5, #818cf8)',
                'gradient-secondary': 'linear-gradient(to right, #0d9488, #2dd4bf)',
                'gradient-dark': 'linear-gradient(to right, #0f172a, #1e293b)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [],
}
