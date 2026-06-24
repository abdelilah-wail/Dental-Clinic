import { motion } from "framer-motion"
import { fadeRise } from "@/lib/motion"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function StatCard({ title, value, delta, icon, premium = false }) {
	const positive = delta == null || delta >= 0
	const cardClass = premium
		? "app-card app-card-hover p-5 shadow-card"
		: "app-card app-card-hover p-5"
	const iconClass = premium
		? "grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-[var(--color-accent-2)] text-text text-lg shadow-card"
		: "grid place-items-center w-11 h-11 rounded-2xl bg-accent/10 text-accent text-lg"

	return (
		<motion.div variants={fadeRise} whileHover={{ y: -3 }} className={cardClass}>
			<div className="flex items-center justify-between mb-3">
				<span className="text-sm text-muted">{title}</span>
				<span className={iconClass}>{icon}</span>
			</div>
			<div className="text-2xl font-bold text-text">{value}</div>
			{delta != null && (
				<div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
					{positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
					<span>{Math.abs(delta)}%</span>
				</div>
			)}
		</motion.div>
	)
}
