import { useTranslation } from "react-i18next"
import { useTheme } from "@/providers/ThemeProvider"
import { useDirection } from "@/providers/DirectionProvider"
import { useAuthStore } from "@/features/auth/authStore"
import { Sun, Moon, Search, PanelLeft } from "lucide-react"

const LANGS = [
	{ code: "ar", label: "ع" },
	{ code: "fr", label: "FR" },
	{ code: "en", label: "EN" },
]

function langClass(active) {
	const base = "px-2 py-0.5 text-xs rounded-full transition-colors "
	return base + (active ? "bg-accent text-text font-semibold" : "text-muted hover:text-text")
}

function initials(name) {
	if (!name) return "?"
	const parts = name.trim().split(" ")
	const first = parts[0] ? parts[0][0] : ""
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
	return (first + last).toUpperCase()
}

export default function Topbar({ onMenuClick }) {
	const { t, i18n } = useTranslation()
	const { theme, toggle } = useTheme()
	const { setLocale } = useDirection()
	const user = useAuthStore((s) => s.user)

	const { dir } = useDirection()

	function changeLang(code) {
		i18n.changeLanguage(code)
		setLocale(code)
	}

	return (
		<header className="sticky top-0 z-10 mx-3 mt-3 flex h-[52px] items-center gap-2.5 rounded-xl border border-border bg-surface/85 px-3 shadow-soft backdrop-blur-xl sm:mx-4 lg:mx-6">
			<button
				onClick={onMenuClick}
				className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-bg text-muted transition hover:border-accent hover:text-accent lg:hidden"
				aria-label="Open navigation"
			>
				<PanelLeft className="h-3.5 w-3.5" />
			</button>
			<div className="flex-1">
				<div className="relative w-full max-w-[220px]">
					<Search className="absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 shrink-0 text-muted pointer-events-none" />
					<input
						type="search"
						placeholder={t("nav.search")}
						className="app-input w-full py-1.5 ps-8 pe-3 text-xs"
					/>
				</div>
			</div>

			<div className="hidden items-center gap-0.5 rounded-full border border-border bg-bg p-0.5 sm:flex">
				{LANGS.map((l) => (
					<button key={l.code} onClick={() => changeLang(l.code)} className={langClass(i18n.language === l.code)}>
						{l.label}
					</button>
				))}
			</div>

			<button
				onClick={toggle}
				className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-bg text-muted transition hover:border-accent hover:text-accent"
				aria-label="Toggle theme"
			>
				{theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
			</button>

			<div className="flex items-center gap-1.5">
				<div className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
					{user ? initials(user.name) : "?"}
				</div>
				<div className="hidden sm:block text-xs leading-tight">
					<div className="font-semibold text-text">{user ? user.name : t("nav.guest")}</div>
					<div className="text-muted text-[10px] capitalize">{user ? user.role : ""}</div>
				</div>
			</div>
		</header>
	)
}
