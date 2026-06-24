import { createContext, useContext, useEffect, useState } from "react"

const RTL_LOCALES = ["ar"]
const DirectionContext = createContext(null)

export function DirectionProvider({ children }) {
	const [locale, setLocaleState] = useState(
		() => localStorage.getItem("dcms-locale") || "fr",
	)
	const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr"

	useEffect(() => {
		document.documentElement.setAttribute("lang", locale)
		document.documentElement.setAttribute("dir", dir)
		localStorage.setItem("dcms-locale", locale)
	}, [locale, dir])

	const setLocale = (l) => setLocaleState(l)
	const value = { locale, dir, setLocale }
	return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>
}

export function useDirection() {
	const ctx = useContext(DirectionContext)
	if (!ctx) throw new Error("useDirection must be used within DirectionProvider")
	return ctx
}
