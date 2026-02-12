/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    hover: '#4f46e5',   // Indigo 600
                },
                secondary: '#ec4899', // Pink 500
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
                text: {
                    main: '#1e293b', // Slate 800
                    muted: '#64748b', // Slate 500
                },
                border: '#e2e8f0', // Slate 200
                error: '#ef4444',
                success: '#22c55e',
            },
            borderRadius: {
                DEFAULT: '0.5rem',
                lg: '0.75rem',
            },
        },
    },
    plugins: [],
}
