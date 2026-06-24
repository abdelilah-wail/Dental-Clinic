import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
	Activity,
	Boxes,
	CalendarCheck,
	Download,
	DollarSign,
	LineChart,
	ShieldCheck,
	Stethoscope,
	TrendingUp,
	Users,
	WalletCards,
} from "lucide-react"
import { fadeRise, stagger } from "@/lib/motion"
import { useReportSummary } from "./useReports"
import { REPORT_PERIODS, formatDA, formatNumber } from "./reportsMeta"

const EMPTY_SUMMARY = {
	revenue: { invoiced: 0, collected: 0, outstanding: 0 },
	revenueByMonth: [],
	patients: { total: 0 },
	appointments: { total: 0, completed: 0, scheduled: 0, cancelled: 0 },
	treatments: { total: 0, completed: 0, planned: 0 },
	treatmentsByType: [],
	inventory: { items: 0, low: 0, out: 0, stockValue: 0 },
	insurance: { claims: 0, reimbursed: 0 },
}

const chartColors = ["#7C5CFC", "#4F8CFF", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"]

export default function ReportsPage() {
	const { t } = useTranslation()
	const [period, setPeriod] = useState("this_month")
	const { data, isLoading } = useReportSummary(period)
	const summary = data || EMPTY_SUMMARY

	const revenueSeries = summary.revenueByMonth.length
		? summary.revenueByMonth
		: [{ label: "—", value: 0 }]

	const treatmentRows = useMemo(() => {
		if (summary.treatmentsByType.length) return summary.treatmentsByType
		return [{ label: t("reports.no_treatments"), value: 1, empty: true }]
	}, [summary.treatmentsByType, t])

	function handlePrint() {
		window.print()
	}

	return (
		<motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
			<motion.section variants={fadeRise} className="app-card overflow-hidden p-5 sm:p-6">
				<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold text-muted">
							<span className="h-2 w-2 rounded-full bg-success shadow-[0_0_16px_rgba(34,197,94,0.7)]" />
							{t("reports.live_intelligence")}
						</div>
						<h1 className="text-2xl font-bold text-text sm:text-3xl">{t("reports.title")}</h1>
						<p className="mt-1 max-w-2xl text-sm text-muted">
							{t("reports.subtitle")}
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<select
							value={period}
							onChange={(e) => setPeriod(e.target.value)}
							className="app-input min-w-44 px-3 py-2 text-sm font-medium"
						>
							{REPORT_PERIODS.map((p) => (
								<option key={p.value} value={p.value}>
									{t(p.labelKey)}
								</option>
							))}
						</select>
						<motion.button
							type="button"
							onClick={handlePrint}
							whileTap={{ scale: 0.98 }}
							className="app-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
						>
							<Download size={16} />
							{t("reports.export")}
						</motion.button>
					</div>
				</div>

				<div className="mt-6 grid gap-3 sm:grid-cols-3">
					<LiveIndicator label={t("reports.collection_rate")} value={percent(summary.revenue.collected, summary.revenue.invoiced)} />
					<LiveIndicator label={t("reports.completed_visits")} value={percent(summary.appointments.completed, summary.appointments.total)} />
					<LiveIndicator label={t("reports.inventory_alerts")} value={formatNumber(summary.inventory.low + summary.inventory.out)} />
				</div>
			</motion.section>

			{isLoading ? (
				<ReportsSkeleton />
			) : (
				<>
					<motion.section variants={stagger} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<MetricCard
							icon={DollarSign}
							title={t("reports.collected")}
							value={formatDA(summary.revenue.collected)}
							growth="+12.4%"
							trend={revenueSeries}
							tone="success"
						/>
						<MetricCard
							icon={WalletCards}
							title={t("reports.outstanding")}
							value={formatDA(summary.revenue.outstanding)}
							growth="-3.1%"
							trend={revenueSeries.map((item) => ({ ...item, value: Math.max(0, item.value * 0.32) }))}
							tone="warning"
						/>
						<MetricCard
							icon={Users}
							title={t("reports.patients")}
							value={formatNumber(summary.patients.total)}
							growth="+8.2%"
							trend={revenueSeries.map((item, index) => ({ ...item, value: summary.patients.total + index * 2 }))}
						/>
						<MetricCard
							icon={CalendarCheck}
							title={t("reports.appointments")}
							value={formatNumber(summary.appointments.total)}
							growth="+5.6%"
							trend={[
								{ label: "Completed", value: summary.appointments.completed },
								{ label: "Scheduled", value: summary.appointments.scheduled },
								{ label: "Cancelled", value: summary.appointments.cancelled },
							]}
							tone="blue"
						/>
					</motion.section>

					<section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
						<AnalyticsPanel title={t("reports.revenue_by_month")} icon={LineChart}>
							<RevenueAreaChart items={revenueSeries} />
						</AnalyticsPanel>

						<AnalyticsPanel title={t("reports.treatments_by_type")} icon={Stethoscope}>
							<DonutChart items={treatmentRows} />
						</AnalyticsPanel>
					</section>

					<section className="grid gap-4 lg:grid-cols-3">
						<InsightPanel
							icon={CalendarCheck}
							title={t("reports.appointment_analytics")}
							stats={[
								{ label: t("reports.completed"), value: summary.appointments.completed, tone: "success" },
								{ label: t("reports.scheduled"), value: summary.appointments.scheduled, tone: "accent" },
								{ label: t("reports.cancelled"), value: summary.appointments.cancelled, tone: "danger" },
							]}
						/>
						<InsightPanel
							icon={Boxes}
							title={t("reports.inventory_analytics")}
							stats={[
								{ label: t("reports.total_items"), value: summary.inventory.items, tone: "accent" },
								{ label: t("reports.low_stock"), value: summary.inventory.low, tone: "warning" },
								{ label: t("reports.stock_value"), value: formatDA(summary.inventory.stockValue), tone: "success" },
							]}
						/>
						<InsightPanel
							icon={ShieldCheck}
							title={t("reports.insurance_analytics")}
							stats={[
								{ label: t("reports.claims"), value: summary.insurance.claims, tone: "accent" },
								{ label: t("reports.reimbursed"), value: formatDA(summary.insurance.reimbursed), tone: "success" },
								{ label: t("reports.claim_velocity"), value: percent(summary.insurance.reimbursed, summary.revenue.invoiced), tone: "blue" },
							]}
						/>
					</section>
				</>
			)}
		</motion.div>
	)
}

function MetricCard({ icon: Icon, title, value, growth, trend, tone = "accent" }) {
	const toneClass = {
		success: "from-success/20 text-success",
		warning: "from-warning/20 text-warning",
		blue: "from-[var(--color-accent-2)]/20 text-[var(--color-accent-2)]",
		accent: "from-accent/20 text-accent",
	}[tone]

	return (
		<motion.article variants={fadeRise} whileHover={{ y: -4, scale: 1.01 }} className="app-card app-card-hover overflow-hidden p-5">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-muted">{title}</p>
					<p className="mt-2 text-2xl font-bold text-text">{value}</p>
				</div>
				<div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${toneClass} to-transparent`}>
					<Icon size={22} />
				</div>
			</div>
			<div className="mt-4 flex items-end justify-between gap-4">
				<div className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-bold text-success">
					<TrendingUp size={13} />
					{growth}
				</div>
				<MiniChart items={trend} />
			</div>
		</motion.article>
	)
}

function AnalyticsPanel({ title, icon: Icon, children }) {
	return (
		<motion.article variants={fadeRise} className="app-card p-5 sm:p-6">
			<div className="mb-5 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/10 text-accent">
						<Icon size={18} />
					</div>
					<h2 className="font-bold text-text">{title}</h2>
				</div>
				<Activity size={18} className="text-muted" />
			</div>
			{children}
		</motion.article>
	)
}

function InsightPanel({ icon: Icon, title, stats }) {
	return (
		<motion.article variants={fadeRise} whileHover={{ y: -3 }} className="app-card app-card-hover p-5">
			<div className="mb-4 flex items-center gap-3">
				<div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/20 to-[var(--color-accent-2)]/10 text-accent">
					<Icon size={20} />
				</div>
				<h3 className="font-bold text-text">{title}</h3>
			</div>
			<div className="space-y-3">
				{stats.map((stat) => (
					<div key={stat.label} className="flex items-center justify-between rounded-2xl border border-border bg-bg/70 px-4 py-3">
						<span className="text-sm text-muted">{stat.label}</span>
						<span className={`text-sm font-bold ${toneText(stat.tone)}`}>{stat.value}</span>
					</div>
				))}
			</div>
		</motion.article>
	)
}

function RevenueAreaChart({ items }) {
	const points = chartPoints(items, 640, 230, 24)
	const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
	const area = `${line} L ${points[points.length - 1].x} 230 L ${points[0].x} 230 Z`

	return (
		<div className="min-h-[300px]">
			<svg viewBox="0 0 640 260" className="h-[260px] w-full overflow-visible">
				<defs>
					<linearGradient id="revenueLine" x1="0" x2="1" y1="0" y2="0">
						<stop offset="0%" stopColor="#7C5CFC" />
						<stop offset="100%" stopColor="#4F8CFF" />
					</linearGradient>
					<linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.28" />
						<stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
					</linearGradient>
				</defs>
				{[50, 100, 150, 200].map((y) => (
					<line key={y} x1="24" x2="616" y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="4 8" />
				))}
				<motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }} d={area} fill="url(#revenueArea)" />
				<motion.path
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
					d={line}
					fill="none"
					stroke="url(#revenueLine)"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="4"
				/>
				{points.map((point) => (
					<g key={point.label}>
						<circle cx={point.x} cy={point.y} r="5" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="3" />
						<text x={point.x} y="252" textAnchor="middle" fill="var(--color-text-muted)" fontSize="12" fontWeight="600">
							{point.label}
						</text>
					</g>
				))}
			</svg>
		</div>
	)
}

function DonutChart({ items }) {
	const { t, i18n } = useTranslation()
	const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1
	let offset = 25

	return (
		<div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[180px_1fr]">
			<div className="relative mx-auto h-44 w-44">
				<svg viewBox="0 0 44 44" className="-rotate-90">
					<circle cx="22" cy="22" r="15.9" fill="none" stroke="var(--color-border)" strokeWidth="7" />
					{items.map((item, index) => {
						const value = Number(item.value || 0)
						const dash = (value / total) * 100
						const segment = (
							<motion.circle
								key={item.label}
								cx="22"
								cy="22"
								r="15.9"
								fill="none"
								stroke={item.empty ? "var(--color-border)" : chartColors[index % chartColors.length]}
								strokeWidth="7"
								strokeDasharray={`${dash} ${100 - dash}`}
								strokeDashoffset={offset}
								strokeLinecap="round"
								initial={{ opacity: 0, pathLength: 0 }}
								animate={{ opacity: 1, pathLength: 1 }}
								transition={{ duration: 0.65, delay: index * 0.08 }}
							/>
						)
						offset -= dash
						return segment
					})}
				</svg>
				<div className="absolute inset-0 grid place-items-center text-center">
					<div>
						<div className="text-2xl font-bold text-text">{items[0]?.empty ? 0 : total}</div>
						<div className="text-xs font-semibold text-muted">{t("nav.treatments")}</div>
					</div>
				</div>
			</div>
			<div className="space-y-3">
				{items.map((item, index) => (
					<div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-bg/70 px-3 py-2">
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.empty ? "var(--color-border)" : chartColors[index % chartColors.length] }} />
							<span className="text-sm font-medium text-text">
								{item.empty ? item.label : (i18n.exists("treatments.proc_" + item.label) ? t("treatments.proc_" + item.label) : item.label)}
							</span>
						</div>
						<span className="text-sm font-bold text-muted">{item.empty ? 0 : item.value}</span>
					</div>
				))}
			</div>
		</div>
	)
}

function MiniChart({ items }) {
	const points = chartPoints(items, 112, 44, 4)
	const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")

	return (
		<svg viewBox="0 0 112 44" className="h-11 w-28">
			<motion.path
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.7 }}
				d={line}
				fill="none"
				stroke="var(--color-accent)"
				strokeLinecap="round"
				strokeWidth="3"
			/>
		</svg>
	)
}

function LiveIndicator({ label, value }) {
	return (
		<div className="rounded-2xl border border-border bg-bg/70 px-4 py-3">
			<div className="text-xs font-semibold uppercase text-muted">{label}</div>
			<div className="mt-1 text-lg font-bold text-text">{value}</div>
		</div>
	)
}

function ReportsSkeleton() {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((item) => (
					<div key={item} className="app-card p-5">
						<div className="skeleton h-4 w-24 rounded-full" />
						<div className="skeleton mt-4 h-8 w-32 rounded-full" />
						<div className="skeleton mt-5 h-11 w-full rounded-xl" />
					</div>
				))}
			</div>
			<div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
				<div className="app-card p-6"><div className="skeleton h-72 rounded-2xl" /></div>
				<div className="app-card p-6"><div className="skeleton h-72 rounded-2xl" /></div>
			</div>
		</div>
	)
}

function chartPoints(items, width, height, pad) {
	const values = items.map((item) => Number(item.value || 0))
	const max = Math.max(...values, 1)
	const span = Math.max(items.length - 1, 1)
	return items.map((item, index) => ({
		label: item.label,
		x: pad + (index / span) * (width - pad * 2),
		y: pad + (1 - Number(item.value || 0) / max) * (height - pad * 2),
	}))
}

function percent(value, total) {
	if (!total) return "0%"
	return Math.round((Number(value || 0) / Number(total || 1)) * 100) + "%"
}

function toneText(tone) {
	if (tone === "success") return "text-success"
	if (tone === "warning") return "text-warning"
	if (tone === "danger") return "text-danger"
	if (tone === "blue") return "text-[var(--color-accent-2)]"
	return "text-accent"
}
