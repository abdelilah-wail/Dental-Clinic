import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import ar from "./locales/ar.json"
import fr from "./locales/fr.json"
import en from "./locales/en.json"

const saved = localStorage.getItem("dcms-locale") || "fr"

i18n.use(initReactI18next).init({
	resources: {
		ar: { translation: ar },
		fr: { translation: fr },
		en: { translation: en },
	},
	lng: saved,
	fallbackLng: "fr",
	interpolation: { escapeValue: false },
})

export default i18n
