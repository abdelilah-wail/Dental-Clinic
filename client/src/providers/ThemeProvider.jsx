import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(() => {
		const saved = localStorage.getItem("dcms-theme")
		if (saved) return saved
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	})

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme)
		localStorage.setItem("dcms-theme", theme)
	}, [theme])

	const setTheme = (t) => setThemeState(t)
	const toggle = () => setThemeState((p) => (p === "light" ? "dark" : "light"))

	const value = { theme, toggle, setTheme }
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
	return ctx
}
