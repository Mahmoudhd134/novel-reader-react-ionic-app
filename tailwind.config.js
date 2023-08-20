/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ], theme: {
        extend: {
            keyframes: {
                'open-menu': {
                    '0%': {'transform': 'scaleX(0)'},
                    '80%': {'transform': 'scaleX(1)'},
                    '100%': {'transform': 'scaleX(.9)'}
                }
            },
            animation: {
                'open-menu': 'open-menu .8s ease-in-out forwards'
            }
        },
    },
    plugins: [],
}

