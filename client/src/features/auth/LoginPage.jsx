import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { fadeRise, scaleIn, stagger, hoverLift, tapPress } from "@/lib/motion"
import { useDirection } from "@/providers/DirectionProvider"
import { useLogin } from "./useAuth"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Users, Calendar, BarChart3 } from "lucide-react"
import { Tooth } from "@/components/ui/ToothIcon"

function ToothLogo({ className }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M12 3c-2.2-1.4-5-1.2-6.4.6C4 5.7 4.2 8.4 5 11c.6 2 .8 4 1.2 6 .3 1.6.7 3 1.6 3 1 0 1.1-1.6 1.4-3.2.2-1.2.5-2.3 1.8-2.3s1.6 1.1 1.8 2.3c.3 1.6.4 3.2 1.4 3.2.9 0 1.3-1.4 1.6-3 .4-2 .6-4 1.2-6 .8-2.6 1-5.3-.6-7.4C17 1.8 14.2 1.6 12 3Z"
				stroke="currentColor"
				strokeWidth="1.3"
			/>
		</svg>
	)
}

const FEATURES = [
	{ icon: Users, key: "features.patients" },
	{ icon: Calendar, key: "features.appointments" },
	{ icon: Tooth, key: "features.treatments" },
	{ icon: BarChart3, key: "features.reports" },
]

const LANGS = [
	{ code: "ar", label: "ع" },
	{ code: "fr", label: "FR" },
	{ code: "en", label: "EN" },
]

export default function LoginPage() {
	const { t, i18n } = useTranslation()
	const { setLocale } = useDirection()
	const login = useLogin()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [remember, setRemember] = useState(true)

	function changeLang(code) {
		i18n.changeLanguage(code)
		setLocale(code)
	}

	function handleSubmit(e) {
		e.preventDefault()
		login.mutate({ email, password })
	}

	return (
		<div className="min-h-screen grid lg:grid-cols-5 bg-[linear-gradient(180deg,#F8FAFF_0%,#F3F6FC_100%)] dark:bg-none dark:bg-bg text-[#0F172A] dark:text-text">
			{/* Left — luxury imagery */}
			<div className="relative hidden lg:col-span-3 lg:block overflow-hidden">
				<div className="absolute inset-0 bg-[url('/Login_img.png')] bg-cover bg-center dark:brightness-75" />
				<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.15),rgba(15,23,42,0.05))] dark:bg-black/40" />

				<motion.div
					variants={stagger}
					initial="hidden"
					animate="visible"
					className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/10 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
				>
					{FEATURES.map((f) => (
						<motion.div
							key={f.key}
							variants={fadeRise}
							className="flex flex-col items-center gap-1 px-3 text-center"
						>
							<f.icon className="w-4 h-4 text-white dark:text-white/80 mb-0.5 drop-shadow-sm" />
							<span className="text-[10px] text-white dark:text-white/80 max-w-[72px] font-medium drop-shadow-sm">{t(f.key)}</span>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Right — auth panel */}
			<div className="relative flex items-center justify-center px-4 py-4 lg:col-span-2">
				{/* Language switcher */}
				<div className="absolute top-4 end-4 flex items-center gap-1 rounded-full border border-[#E7ECF5] dark:border-border bg-white dark:bg-surface p-1 shadow-sm">
					{LANGS.map((l) => (
						<button
							key={l.code}
							onClick={() => changeLang(l.code)}
							className={
								"px-3 py-1 text-xs rounded-full transition-colors " +
								(i18n.language === l.code
									? "bg-[#F3F6FC] dark:bg-accent text-[#0F172A] dark:text-white font-semibold"
								: "text-[#64748B] dark:text-text-muted hover:text-[#0F172A] dark:hover:text-white")
							}
						>
							{l.label}
						</button>
					))}
				</div>

				<motion.div
					variants={scaleIn}
					initial="hidden"
					animate="visible"
					className="w-full max-w-md bg-white dark:bg-surface rounded-[24px] border border-[#E7ECF5] dark:border-border shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-card p-6 sm:p-8"
				>
					{/* Brand */}
					<div className="flex flex-col items-center text-center mb-5">
						<div className="grid place-items-center w-12 h-12 rounded-xl bg-[#F8FAFF] dark:bg-black/20 border border-[#E7ECF5] dark:border-border shadow-[0_0_15px_rgba(91,108,255,0.15)] mb-3">
							<ToothLogo className="w-7 h-7 text-[#5B6CFF] dark:text-accent" />
						</div>
						<h1 className="text-xl font-bold tracking-wide text-[#0F172A] dark:text-text">{t("brand.name")}</h1>
						<p className="text-[10px] tracking-[0.2em] text-[#64748B] dark:text-text-muted uppercase mt-1">{t("brand.subtitle")}</p>
					</div>

					<motion.h2 variants={fadeRise} className="text-[20px] font-bold mb-1 text-[#0F172A] dark:text-text text-center">
						{t("auth.welcome")}
					</motion.h2>
					<p className="text-[#64748B] dark:text-text-muted mb-5 text-[13px] text-center">{t("auth.subtitle")}</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<label className="block text-[13px] font-semibold text-[#334155] dark:text-text-muted">{t("auth.email")}</label>
							<div className="flex items-center gap-2 rounded-[12px] border border-[#CBD5E1] dark:border-border bg-white dark:bg-black/20 px-3 h-11 hover:border-[#5B6CFF] dark:hover:border-accent focus-within:border-[#5B6CFF] dark:focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(91,108,255,0.12)] dark:focus-within:shadow-[0_0_0_4px_rgba(124,92,252,0.15)] transition-all">
								<Mail className="w-4 h-4 text-[#94A3B8] dark:text-text-muted shrink-0" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="admin@clinic.dz"
									className="w-full bg-transparent outline-none placeholder:text-[#94A3B8] dark:placeholder:text-text-muted text-[#0F172A] dark:text-text text-[13px]"
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="block text-[13px] font-semibold text-[#334155] dark:text-text-muted">{t("auth.password")}</label>
							<div className="flex items-center gap-2 rounded-[12px] border border-[#CBD5E1] dark:border-border bg-white dark:bg-black/20 px-3 h-11 hover:border-[#5B6CFF] dark:hover:border-accent focus-within:border-[#5B6CFF] dark:focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(91,108,255,0.12)] dark:focus-within:shadow-[0_0_0_4px_rgba(124,92,252,0.15)] transition-all">
								<Lock className="w-4 h-4 text-[#94A3B8] dark:text-text-muted shrink-0" />
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="w-full bg-transparent outline-none placeholder:text-[#94A3B8] dark:placeholder:text-text-muted text-[#0F172A] dark:text-text text-[13px]"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword((p) => !p)}
									className="text-[#94A3B8] dark:text-text-muted hover:text-[#334155] dark:hover:text-text focus:outline-none transition-colors shrink-0 p-1"
								>
									{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between text-[13px] pt-0.5">
							<label className="flex items-center gap-1.5 text-[#475569] dark:text-text-muted font-medium cursor-pointer">
								<input
									type="checkbox"
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
									className="w-3.5 h-3.5 rounded border-[#CBD5E1] dark:border-border text-[#5B6CFF] dark:text-accent focus:ring-[#5B6CFF] dark:focus:ring-accent bg-white dark:bg-black/20"
								/>
								{t("auth.rememberMe")}
							</label>
							<button type="button" className="text-[#5B6CFF] dark:text-accent font-semibold hover:underline">
								{t("auth.forgotPassword")}
							</button>
						</div>

						{login.isError && (
							<p className="text-red-500 dark:text-danger text-xs font-medium">{t("auth.error")}</p>
						)}

						<motion.button
							type="submit"
							whileHover={{ translateY: -1 }}
							whileTap={tapPress}
							disabled={login.isPending}
							className="w-full flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#5B6CFF,#7C5CFC)] dark:bg-[linear-gradient(135deg,#7c5cfc,#4f8cff)] text-white font-bold h-11 shadow-[0_12px_30px_rgba(91,108,255,0.25)] dark:shadow-card disabled:opacity-60 hover:brightness-110 transition-all group mt-1 text-[14px]"
						>
							{login.isPending ? t("auth.signingIn") : t("auth.signIn")}
							<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 shrink-0" />
						</motion.button>
					</form>

					{/* Divider */}
					<div className="flex items-center gap-3 my-5 text-[#94A3B8] dark:text-text-muted text-[11px] font-semibold uppercase tracking-wider">
						<div className="h-px flex-1 bg-[#E7ECF5] dark:bg-border" />
						{t("auth.or")}
						<div className="h-px flex-1 bg-[#E7ECF5] dark:bg-border" />
					</div>

					<button
						type="button"
						className="w-full flex items-center justify-center gap-2.5 rounded-[12px] border border-[#DCE3F0] dark:border-border bg-white dark:bg-surface h-11 hover:bg-[#F8FAFF] dark:hover:bg-white/5 text-[#334155] dark:text-text font-semibold transition-colors text-[13px]"
					>
						<svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
						</svg>
						{t("auth.google")}
					</button>

					<p className="mt-5 text-center text-[11px] text-[#94A3B8] dark:text-text-muted flex items-center justify-center gap-1">
						<ShieldCheck className="w-3.5 h-3.5 text-[#5B6CFF] dark:text-accent" />
						<span>{t("auth.secureNote")}</span>
					</p>

					{/* ── Dev-only credentials hint ── */}
					{/* {import.meta.env.DEV && (
						<div className="mt-5 rounded-[12px] border border-[#E2E8F0] dark:border-border bg-[#F8FAFF] dark:bg-black/20 px-4 py-3 text-[12px] space-y-1.5">
							<p className="text-[#0F172A] dark:text-text font-bold mb-2">🔧 Dev mock credentials</p>
							<div className="flex justify-between text-[#475569] dark:text-text bg-white dark:bg-surface px-2.5 py-1.5 rounded-lg border border-[#E7ECF5] dark:border-border">
								<span className="font-medium">admin@clinic.dz</span><span className="text-[#94A3B8] dark:text-text-muted">password</span>
							</div>
							<div className="flex justify-between text-[#475569] dark:text-text bg-white dark:bg-surface px-2.5 py-1.5 rounded-lg border border-[#E7ECF5] dark:border-border">
								<span className="font-medium">dentist@clinic.dz</span><span className="text-[#94A3B8] dark:text-text-muted">password</span>
							</div>
						</div>
					)} */}
				</motion.div>
			</div>
		</div>
	)
}
