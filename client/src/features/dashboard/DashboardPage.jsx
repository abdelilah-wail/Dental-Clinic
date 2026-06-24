import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { stagger, fadeRise } from "@/lib/motion"
import { useAuthStore } from "@/features/auth/authStore"
import { useDashboard } from "./useDashboard"
import {
	DollarSign,
	Calendar,
	Users,
	Receipt,
	Plus,
	Clock,
	CheckCircle2,
	ChevronRight,
	TrendingUp,
	TrendingDown,
	UserPlus,
	Stethoscope,
	ClipboardList,
	Boxes,
	BarChart3,
	Activity,
} from "lucide-react"

// Premium Sparkline Component
function Sparkline({ data, color = "#5B6CFF", positive = true }) {
	const height = 32
	const width = 100
	const max = Math.max(...data)
	const min = Math.min(...data)
	const range = max - min === 0 ? 1 : max - min

	const points = data
		.map((val, i) => {
			const x = (i / (data.length - 1)) * width
			const y = height - ((val - min) / range) * (height - 6) - 3 // 3px padding
			return `${x},${y}`
		})
		.join(" ")

	const strokeColor = positive ? "#10B981" : "#EF4444"
	const fillColor = positive ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)"

	return (
		<svg width={width} height={height} className="overflow-visible">
			<path
				d={`M 0,${height} L ${points} L ${width},${height} Z`}
				fill={fillColor}
			/>
			<polyline
				fill="none"
				stroke={strokeColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				points={points}
			/>
		</svg>
	)
}

export default function DashboardPage() {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const user = useAuthStore((s) => s.user)
	const { data } = useDashboard()
	const stats = data || {}

	const [revenueHoverIdx, setRevenueHoverIdx] = useState(null)
	const [patientHoverIdx, setPatientHoverIdx] = useState(null)

	// Fake/Seed timelines & recent activities
	const todayAppointments = [
		{ id: "a1", time: "08:30", patient: "Mohamed Belkacem", procedure: "Consultation", status: "completed", statusLabel: "Terminé" },
		{ id: "a2", time: "10:00", patient: "Lina Bouzid", procedure: "Détartrage", status: "waiting", statusLabel: "En attente" },
		{ id: "a3", time: "11:30", patient: "Amine Boudiaf", procedure: "Traitement Canalaire", status: "confirmed", statusLabel: "Confirmé" },
		{ id: "a4", time: "14:00", patient: "Sofiane Mansouri", procedure: "Pose de Couronne", status: "confirmed", statusLabel: "Confirmé" },
	]

	const recentActivities = [
		{ id: "act1", type: "patient", text: "Nouveau patient ajouté", desc: "Karim Meziane", time: "Il y a 10 min", avatar: "KM" },
		{ id: "act2", type: "invoice", text: "Facture générée", desc: "INV-2024-084 (15,000 DA)", time: "Il y a 25 min", avatar: "I" },
		{ id: "act3", type: "appointment", text: "Rendez-vous confirmé", desc: "Amine Boudiaf - 11:30", time: "Il y a 1 heure", avatar: "AB" },
		{ id: "act4", type: "treatment", text: "Traitement marqué terminé", desc: "Détartrage - Lina Bouzid", time: "Il y a 2 heures", avatar: "LB" },
	]

	// Performance Analytics Seed Data
	const revenueTrend = [
		{ month: "Jan", val: 820000 },
		{ month: "Fév", val: 980000 },
		{ month: "Mar", val: 910000 },
		{ month: "Avr", val: 1150000 },
		{ month: "Mai", val: 1240000 },
		{ month: "Juin", val: 1420000 },
	]

	const patientGrowth = [
		{ month: "Jan", val: 65 },
		{ month: "Fév", val: 98 },
		{ month: "Mar", val: 120 },
		{ month: "Avr", val: 110 },
		{ month: "Mai", val: 155 },
		{ month: "Juin", val: 195 },
	]

	// Format Date
	const todayDateString = new Date().toLocaleDateString(i18n.language === "ar" ? "ar-DZ" : "fr-DZ", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})

	return (
		<div className="space-y-5 pb-8 max-w-[1600px] mx-auto">
			{/* SECTION 1 — WELCOME HERO */}
			<motion.div
				variants={fadeRise}
				initial="hidden"
				animate="visible"
				className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-surface border border-border p-5 rounded-2xl shadow-sm"
			>
				<div>
					<h1 className="text-xl font-bold text-text flex items-center gap-1.5">
						{t("dashboard.greeting")}, <span className="text-[#5B6CFF]">{user ? user.name : "Docteur"}</span>
					</h1>
					<p className="text-muted text-xs mt-0.5">{todayDateString}</p>
					<div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-success bg-success/15 px-2.5 py-1 rounded-full w-fit">
						<span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
						<span>Votre clinique fonctionne normalement aujourd'hui</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => navigate("/patients")}
						className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] hover:bg-[#5B6CFF]/20 px-3.5 py-2 text-xs font-semibold transition"
					>
						<UserPlus size={14} />
						<span>Patient</span>
					</button>
					<button
						onClick={() => navigate("/appointments")}
						className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] hover:bg-[#5B6CFF]/20 px-3.5 py-2 text-xs font-semibold transition"
					>
						<Calendar size={14} />
						<span>Rendez-vous</span>
					</button>
					<button
						onClick={() => navigate("/treatments")}
						className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] hover:bg-[#5B6CFF]/20 px-3.5 py-2 text-xs font-semibold transition"
					>
						<Stethoscope size={14} />
						<span>Traitement</span>
					</button>
					<button
						onClick={() => navigate("/billing")}
						className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B6CFF] text-white hover:bg-[#4a5be6] px-3.5 py-2 text-xs font-semibold transition shadow-sm"
					>
						<Plus size={14} />
						<span>Facture</span>
					</button>
				</div>
			</motion.div>

			{/* SECTION 2 — KPI CARDS */}
			<motion.div
				variants={stagger}
				initial="hidden"
				animate="visible"
				className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
			>
				<KpiCard
					title={t("dashboard.revenue")}
					value={stats.revenue ? stats.revenue.value : "—"}
					delta={stats.revenue ? stats.revenue.delta : 12}
					icon={<DollarSign size={18} />}
					sparkData={[8, 12, 10, 15, 13, 18, stats.revenue ? 20 : 12]}
					color="#10B981"
				/>
				<KpiCard
					title={t("dashboard.appointments")}
					value={stats.appointments ? stats.appointments.value : "—"}
					delta={stats.appointments ? stats.appointments.delta : 4}
					icon={<Calendar size={18} />}
					sparkData={[14, 18, 15, 20, 16, 22, 18]}
					color="#5B6CFF"
				/>
				<KpiCard
					title={t("dashboard.patients")}
					value={stats.patients ? stats.patients.value : "—"}
					delta={stats.patients ? stats.patients.delta : 7}
					icon={<Users size={18} />}
					sparkData={[950, 1020, 1080, 1120, 1180, 1240, 1284]}
					color="#10B981"
				/>
				<KpiCard
					title={t("dashboard.invoices")}
					value={stats.invoices ? stats.invoices.value : "—"}
					delta={stats.invoices ? stats.invoices.delta : -2}
					icon={<Receipt size={18} />}
					sparkData={[10, 8, 9, 7, 5, 8, 6]}
					color="#EF4444"
				/>
			</motion.div>

			{/* SECTION 3 — TODAY OVERVIEW */}
			<div className="grid gap-4 lg:grid-cols-3">
				{/* Today's Appointments Timeline */}
				<motion.div
					variants={fadeRise}
					initial="hidden"
					animate="visible"
					className="lg:col-span-2 rounded-2xl bg-white dark:bg-surface border border-border p-5 shadow-sm flex flex-col"
				>
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="font-bold text-text text-sm">Agenda du Jour</h2>
							<p className="text-muted text-[11px]">Consultez et suivez la file d'attente</p>
						</div>
						<button
							onClick={() => navigate("/appointments")}
							className="text-[#5B6CFF] text-[11px] font-semibold hover:underline inline-flex items-center gap-0.5"
						>
							<span>Voir tout</span>
							<ChevronRight size={12} className="rtl:rotate-180" />
						</button>
					</div>

					<div className="space-y-3.5 flex-1">
						{todayAppointments.map((app) => (
							<div
								key={app.id}
								className="flex items-center gap-3.5 p-3 rounded-xl border border-border/50 hover:bg-bg dark:hover:bg-bg/40 transition-colors"
							>
								<div className="flex items-center gap-2 text-muted font-mono text-xs border-e border-border/70 pe-3.5 shrink-0">
									<Clock size={13} className="text-[#5B6CFF]" />
									<span>{app.time}</span>
								</div>

								<div className="flex-1 min-w-0">
									<div className="font-semibold text-xs text-text truncate">{app.patient}</div>
									<div className="text-[10px] text-muted truncate">{app.procedure}</div>
								</div>

								<span
									className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
										app.status === "completed"
											? "bg-success/15 text-success"
											: app.status === "waiting"
											? "bg-warning/15 text-warning"
											: "bg-[#5B6CFF]/15 text-[#5B6CFF]"
									}`}
								>
									{app.statusLabel}
								</span>
							</div>
						))}
					</div>
				</motion.div>

				{/* Clinic Status Cards */}
				<motion.div
					variants={fadeRise}
					initial="hidden"
					animate="visible"
					className="rounded-2xl bg-white dark:bg-surface border border-border p-5 shadow-sm flex flex-col justify-between"
				>
					<div>
						<h2 className="font-bold text-text text-sm mb-0.5">Statut de la Clinique</h2>
						<p className="text-muted text-[11px] mb-4">Mesures clés aujourd'hui</p>
					</div>

					<div className="grid grid-cols-2 gap-3 flex-1 justify-center align-middle">
						<StatusGridCard label="Patients du jour" val="12" />
						<StatusGridCard label="Traitements du jour" val="8" />
						<StatusGridCard label="Revenu du jour" val="32,000 DA" color="text-success" />
						<StatusGridCard label="Factures impayées" val="3" color="text-danger" />
					</div>
				</motion.div>
			</div>

			{/* SECTION 4 & 5 — PERFORMANCE & ACTIVITY */}
			<div className="grid gap-4 lg:grid-cols-3">
				{/* Analytics Chart (2 Columns Wide on large displays) */}
				<motion.div
					variants={fadeRise}
					initial="hidden"
					animate="visible"
					className="lg:col-span-2 rounded-2xl bg-white dark:bg-surface border border-border p-5 shadow-sm"
				>
					<div className="flex items-center justify-between mb-5">
						<div>
							<h2 className="font-bold text-text text-sm">Performance de la Clinique</h2>
							<p className="text-muted text-[11px]">Aperçu du semestre en cours</p>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Custom SVG Line Chart */}
						<div className="relative border border-border/40 p-4 rounded-xl">
							<div className="flex justify-between items-center mb-3">
								<span className="text-xs font-semibold text-text">Revenu Mensuel (DA)</span>
								<span className="text-[10px] text-muted">Jan - Juin</span>
							</div>
							<div className="h-44 w-full relative">
								<svg
									viewBox="0 0 240 120"
									className="w-full h-full overflow-visible"
									onMouseMove={(e) => {
										const rect = e.currentTarget.getBoundingClientRect()
										const x = e.clientX - rect.left
										const idx = Math.min(5, Math.max(0, Math.round((x / rect.width) * 5)))
										setRevenueHoverIdx(idx)
									}}
									onMouseLeave={() => setRevenueHoverIdx(null)}
								>
									<defs>
										<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="#5B6CFF" stopOpacity="0.25" />
											<stop offset="100%" stopColor="#5B6CFF" stopOpacity="0.0" />
										</linearGradient>
									</defs>

									{/* Grid Lines */}
									<line x1="0" y1="20" x2="240" y2="20" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />
									<line x1="0" y1="60" x2="240" y2="60" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />
									<line x1="0" y1="100" x2="240" y2="100" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />

									{/* Fill Area */}
									<path
										d="M 0,110 L 0,80 L 48,60 L 96,70 L 144,40 L 192,30 L 240,15 L 240,110 Z"
										fill="url(#chartGradient)"
									/>

									{/* Main Line */}
									<path
										d="M 0,80 L 48,60 L 96,70 L 144,40 L 192,30 L 240,15"
										fill="none"
										stroke="#5B6CFF"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>

									{/* Data Dots */}
									{[80, 60, 70, 40, 30, 15].map((y, i) => (
										<circle
											key={i}
											cx={i * 48}
											cy={y}
											r={revenueHoverIdx === i ? "5" : "3.5"}
											fill={revenueHoverIdx === i ? "#5B6CFF" : "#FFF"}
											stroke="#5B6CFF"
											strokeWidth="2"
											className="transition-all duration-150 cursor-pointer"
										/>
									))}
								</svg>

								{/* Tooltip Overlay */}
								{revenueHoverIdx !== null && (
									<div className="absolute top-2 left-1/2 -translate-x-1/2 bg-surface border border-border px-2 py-1 rounded shadow-md text-[10px] z-10 flex flex-col items-center">
										<span className="font-semibold text-text">{revenueTrend[revenueHoverIdx].month}</span>
										<span className="text-[#5B6CFF]">{revenueTrend[revenueHoverIdx].val.toLocaleString()} DA</span>
									</div>
								)}
							</div>
							<div className="flex justify-between text-[9px] text-muted mt-2 font-mono">
								<span>Jan</span>
								<span>Fév</span>
								<span>Mar</span>
								<span>Avr</span>
								<span>Mai</span>
								<span>Juin</span>
							</div>
						</div>

						{/* Custom SVG Bar Chart */}
						<div className="relative border border-border/40 p-4 rounded-xl">
							<div className="flex justify-between items-center mb-3">
								<span className="text-xs font-semibold text-text">Nouveaux Patients</span>
								<span className="text-[10px] text-muted">Abonnements</span>
							</div>
							<div className="h-44 w-full relative">
								<svg
									viewBox="0 0 240 120"
									className="w-full h-full overflow-visible"
									onMouseMove={(e) => {
										const rect = e.currentTarget.getBoundingClientRect()
										const x = e.clientX - rect.left
										const idx = Math.min(5, Math.max(0, Math.round((x / rect.width) * 5)))
										setPatientHoverIdx(idx)
									}}
									onMouseLeave={() => setPatientHoverIdx(null)}
								>
									{/* Grid Lines */}
									<line x1="0" y1="20" x2="240" y2="20" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />
									<line x1="0" y1="60" x2="240" y2="60" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />
									<line x1="0" y1="100" x2="240" y2="100" stroke="currentColor" className="text-border/30" strokeDasharray="3 3" />

									{/* Bars */}
									{[40, 60, 75, 68, 95, 110].map((h, i) => (
										<rect
											key={i}
											x={i * 42 + 8}
											y={110 - h}
											width="16"
											height={h}
											rx="3.5"
											fill={patientHoverIdx === i ? "#5B6CFF" : "#5B6CFF/20"}
											className="transition-colors duration-150 fill-accent/30 dark:fill-accent/20 cursor-pointer"
											style={{
												fill: patientHoverIdx === i ? "#5B6CFF" : undefined,
											}}
										/>
									))}
								</svg>

								{/* Tooltip Overlay */}
								{patientHoverIdx !== null && (
									<div className="absolute top-2 left-1/2 -translate-x-1/2 bg-surface border border-border px-2 py-1 rounded shadow-md text-[10px] z-10 flex flex-col items-center">
										<span className="font-semibold text-text">{patientGrowth[patientHoverIdx].month}</span>
										<span className="text-[#5B6CFF]">{patientGrowth[patientHoverIdx].val} Patients</span>
									</div>
								)}
							</div>
							<div className="flex justify-between text-[9px] text-muted mt-2 font-mono">
								<span>Jan</span>
								<span>Fév</span>
								<span>Mar</span>
								<span>Avr</span>
								<span>Mai</span>
								<span>Juin</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* SECTION 4 — ACTIVITY CENTER */}
				<motion.div
					variants={fadeRise}
					initial="hidden"
					animate="visible"
					className="rounded-2xl bg-white dark:bg-surface border border-border p-5 shadow-sm flex flex-col"
				>
					<div className="flex items-center gap-2 mb-4">
						<Activity size={16} className="text-[#5B6CFF]" />
						<h2 className="font-bold text-text text-sm">Centre d'Activité</h2>
					</div>

					<div className="relative border-s border-border/80 ms-2.5 pl-4 space-y-4.5 flex-1">
						{recentActivities.map((act) => (
							<div key={act.id} className="relative">
								{/* Activity Circle */}
								<span className="absolute -left-[24.5px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white dark:bg-surface border border-[#5B6CFF] text-[8px] font-bold text-[#5B6CFF] ring-4 ring-white dark:ring-surface shrink-0">
									{act.avatar}
								</span>

								<div className="text-[11px] leading-tight">
									<div className="font-semibold text-text">{act.text}</div>
									<div className="text-muted text-[10px] mt-0.5">{act.desc}</div>
									<div className="text-muted text-[9px] mt-0.5 flex items-center gap-1 font-mono">
										<span>{act.time}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>

			{/* SECTION 6 — QUICK ACCESS */}
			<motion.div
				variants={fadeRise}
				initial="hidden"
				animate="visible"
				className="rounded-2xl bg-white dark:bg-surface border border-border p-5 shadow-sm"
			>
				<h2 className="font-bold text-text text-sm mb-4">Raccourcis Utiles</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
					<ShortcutCard label="Patients" icon={UserPlus} path="/patients" color="text-accent" />
					<ShortcutCard label="Rendez-vous" icon={Calendar} path="/appointments" color="text-accent" />
					<ShortcutCard label="Traitements" icon={Stethoscope} path="/treatments" color="text-accent" />
					<ShortcutCard label="Facturation" icon={ClipboardList} path="/billing" color="text-accent" />
					<ShortcutCard label="Stock" icon={Boxes} path="/inventory" color="text-accent" />
					<ShortcutCard label="Rapports" icon={BarChart3} path="/reports" color="text-accent" />
				</div>
			</motion.div>
		</div>
	)
}

// KPI Card Component
function KpiCard({ title, value, delta, icon, sparkData, color }) {
	const positive = delta >= 0
	return (
		<motion.div
			variants={fadeRise}
			whileHover={{ y: -3 }}
			className="rounded-2xl border border-border bg-white dark:bg-surface p-4 shadow-sm relative overflow-hidden flex flex-col justify-between"
		>
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs text-muted font-medium">{title}</span>
				<span className="grid place-items-center w-8 h-8 rounded-lg bg-[#5B6CFF]/10 text-[#5B6CFF]">
					{icon}
				</span>
			</div>

			<div className="flex items-end justify-between">
				<div>
					<div className="text-lg font-bold text-text tracking-tight">{value}</div>
					<div className="mt-1 flex items-center gap-1">
						<span
							className={`inline-flex items-center text-[10px] font-bold ${
								positive ? "text-success" : "text-danger"
							}`}
						>
							{positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
							<span className="ms-0.5">{Math.abs(delta)}%</span>
						</span>
					</div>
				</div>

				<div className="shrink-0 pt-2">
					<Sparkline data={sparkData} color={color} positive={positive} />
				</div>
			</div>
		</motion.div>
	)
}

// Clinic Status Component
function StatusGridCard({ label, val, color = "text-text" }) {
	return (
		<div className="rounded-xl border border-border/40 bg-bg/50 dark:bg-bg/10 p-3 flex flex-col justify-center">
			<span className="text-[10px] text-muted font-medium truncate">{label}</span>
			<span className={`text-sm font-bold mt-1 tracking-tight truncate ${color}`}>{val}</span>
		</div>
	)
}

// Shortcut Card Component
function ShortcutCard({ label, icon: Icon, path, color }) {
	const navigate = useNavigate()
	return (
		<button
			onClick={() => navigate(path)}
			className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-bg/30 hover:bg-bg hover:border-accent hover:shadow-soft transition-all text-center"
		>
			<div className={`p-2.5 rounded-xl bg-surface border border-border group-hover:border-accent/40 group-hover:scale-105 transition-all text-[#5B6CFF]`}>
				<Icon size={18} />
			</div>
			<span className="text-[11px] font-bold text-text mt-2.5">{label}</span>
		</button>
	)
}
