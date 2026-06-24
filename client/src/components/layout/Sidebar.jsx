import { NavLink, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
	LayoutDashboard,
	Users,
	CalendarDays,
	Stethoscope,
	ScanLine,
	CreditCard,
	ShieldCheck,
	Boxes,
	UserCog,
	BarChart3,
	LogOut,
	X,
} from "lucide-react"
import { useAuthStore } from "@/features/auth/authStore"
import { hasPermission } from "@/features/auth/roles"

const NAV_ITEMS = [
	{ to: "/dashboard", icon: LayoutDashboard, key: "nav.dashboard", permission: null },
	{ to: "/patients", icon: Users, key: "nav.patients", permission: "patients.read" },
	{ to: "/appointments", icon: CalendarDays, key: "nav.appointments", permission: "appointments.read" },
	{ to: "/treatments", icon: Stethoscope, key: "nav.treatments", permission: "treatments.read" },
	{ to: "/xrays", icon: ScanLine, key: "nav.xrays", permission: "xray.read" },
	{ to: "/billing", icon: CreditCard, key: "nav.billing", permission: "billing.read" },
	{ to: "/insurance", icon: ShieldCheck, key: "nav.insurance", permission: "insurance.read" },
	{ to: "/inventory", icon: Boxes, key: "nav.inventory", permission: "inventory.read" },
	{ to: "/staff", icon: UserCog, key: "nav.staff", permission: "staff.read" },
	{ to: "/reports", icon: BarChart3, key: "nav.reports", permission: "reports.read" },
]

export default function Sidebar({ mobileOpen = false, onClose }) {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const user = useAuthStore((s) => s.user)
	const clearSession = useAuthStore((s) => s.clearSession)
	const role = user ? user.role : "guest"

	const items = NAV_ITEMS.filter((item) => !item.permission || hasPermission(role, item.permission))

	function logout() {
		clearSession()
		if (onClose) onClose()
		navigate("/login", { replace: true })
	}

	const asideClass = mobileOpen
		? "fixed inset-y-0 start-0 z-40 flex h-screen w-56 shrink-0 p-2"
		: "fixed top-0 start-0 hidden h-screen w-56 shrink-0 p-2.5 lg:flex"

	return (
		<>
		{mobileOpen && (
			<button
				type="button"
				onClick={onClose}
				className="fixed inset-0 z-30 bg-primary/45 backdrop-blur-sm lg:hidden"
				aria-label="Close navigation"
			/>
		)}
		<aside className={asideClass}>
			<div className="glass flex h-full w-full flex-col rounded-[20px] shadow-card">
			<div className="flex items-center gap-2.5 px-3.5 py-3.5">
				<div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-[var(--color-accent-2)] text-xs font-bold text-white shadow-card">
					DC
				</div>
				<div className="leading-tight min-w-0">
					<span className="block text-sm font-bold text-text truncate">Dental Clinic</span>
					<span className="text-[10px] font-medium text-muted">Management System</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="ms-auto grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-bg text-muted transition hover:text-text lg:hidden"
					aria-label="Close navigation"
				>
					<X size={14} />
				</button>
			</div>

			<nav className="flex-1 min-h-0 overflow-y-auto space-y-0.5 px-2 py-1">
				{items.map((item) => {
					const Icon = item.icon
					return (
						<NavLink
							key={item.to}
							to={item.to}
							onClick={onClose}
							className={({ isActive }) =>
								`group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-200 ${
									isActive
										? "bg-accent text-white shadow-card"
										: "text-muted hover:bg-bg/80 hover:text-text"
								}`
							}
						>
							{({ isActive }) => (
								<>
									{isActive && (
										<motion.span
											layoutId="sidebar-active"
											className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-white/90"
											transition={{ type: "spring", stiffness: 420, damping: 34 }}
										/>
									)}
									<span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition ${isActive ? "bg-white/15 text-white" : "bg-bg text-accent group-hover:bg-accent/10"}`}>
										<Icon size={15} />
									</span>
									<span className="truncate">{t(item.key)}</span>
								</>
							)}
						</NavLink>
					)
				})}
			</nav>

			<div className="border-t border-border px-2 py-2.5">
				<div className="mb-1.5 rounded-xl bg-bg/70 px-2.5 py-2">
					<div className="text-xs font-semibold text-text truncate">{user ? user.name : ""}</div>
					<div className="text-[10px] text-muted truncate">{user ? user.email : ""}</div>
				</div>
				<button
					onClick={logout}
					className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-danger/10 hover:text-danger"
				>
					<LogOut size={15} />
					{t("nav.logout")}
				</button>
			</div>
			</div>
		</aside>
		</>
	)
}
