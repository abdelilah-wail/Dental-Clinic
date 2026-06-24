/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["selector", '[data-theme="dark"]'],
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				surface: "var(--color-surface)",
				accent: {
					DEFAULT: "var(--color-accent)",
					hover: "var(--color-accent-hover)",
				},
				success: "var(--color-success)",
				warning: "var(--color-warning)",
				danger: "var(--color-danger)",
				gold: "var(--color-gold)", // premium only
				border: "var(--color-border)",
				muted: "var(--color-text-muted)",
				text: "var(--color-text)",
				bg: {
					DEFAULT: "var(--color-bg)",
					elevated: "var(--color-bg-elevated)",
				},
			},
			borderRadius: {
				sm: "var(--radius-sm)",
				md: "var(--radius-md)",
				lg: "var(--radius-lg)",
			},
			boxShadow: {
				soft: "var(--shadow-soft)",
				card: "var(--shadow-card)",
				pop: "var(--shadow-pop)",
			},
			fontFamily: {
				sans: ['"Inter Variable"', "system-ui", "sans-serif"],
				arabic: ['"Cairo"', "sans-serif"],
			},
			transitionTimingFunction: {
				lux: "cubic-bezier(0.22, 1, 0.36, 1)",
			},
		},
	},
	plugins: [],
}

export default config
