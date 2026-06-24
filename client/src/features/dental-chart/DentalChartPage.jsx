import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Save, RotateCcw } from "lucide-react"
import { fadeRise } from "@/lib/motion"
import { usePatient } from "@/features/patients/usePatients"
import { useDentalChart, useSaveDentalChart } from "./useDentalChart"
import { useToast } from "@/providers/ToastProvider"
import { CONDITIONS, emptyTooth } from "./conditions"
import Odontogram from "./components/Odontogram"
import ChartLegend from "./components/ChartLegend"
import ToothPanel from "./components/ToothPanel"

function isWhole(key) {
	return Boolean(CONDITIONS[key] && CONDITIONS[key].whole)
}

export default function DentalChartPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { data: patient } = usePatient(id)
	const { data: chartData } = useDentalChart(id)
	const save = useSaveDentalChart(id)
	const toast = useToast()

	const [chart, setChart] = useState({})
	const [active, setActive] = useState("caries")
	const [selected, setSelected] = useState(null)

	useEffect(() => {
		if (chartData && chartData.teeth) setChart(chartData.teeth)
	}, [chartData])

	function applyTo(toothId, surface) {
		setSelected(toothId)
		setChart((prev) => {
			const current = prev[toothId] || emptyTooth()
			let updated
			if (active === "healthy") {
				updated = emptyTooth()
			} else if (isWhole(active)) {
				updated = { ...current, whole: active }
			} else {
				const surfaces = { ...current.surfaces, [surface]: active }
				updated = { ...current, whole: null, surfaces: surfaces }
			}
			const next = { ...prev }
			next[toothId] = updated
			return next
		})
	}

	function setNote(toothId, value) {
		setChart((prev) => {
			const current = prev[toothId] || emptyTooth()
			const next = { ...prev }
			next[toothId] = { ...current, note: value }
			return next
		})
	}

	function clearTooth(toothId) {
		setChart((prev) => {
			const next = { ...prev }
			next[toothId] = emptyTooth()
			return next
		})
	}

	const patientName = patient ? patient.firstName + " " + patient.lastName : ""

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<button onClick={() => navigate("/patients/" + id)} className="flex items-center gap-1 text-sm text-muted hover:text-text transition-colors mb-1">
						<ArrowLeft size={14} />
						{t("chart.back")}
					</button>
					<h1 className="text-2xl font-semibold">{t("chart.title")}</h1>
					<p className="text-muted text-sm">{t("chart.forPatient")}: {patientName}</p>
				</div>
				<div className="flex items-center gap-2">
					<button onClick={() => setChart({})} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent transition-colors">
						<RotateCcw size={15} />
						{t("chart.reset")}
					</button>
					<button
						onClick={() =>
							save.mutate(chart, {
								onSuccess: () => toast.success(t("chart.title"), t("toast.updated")),
								onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
							})
						}
						disabled={save.isPending}
						className="flex items-center gap-2 rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm disabled:opacity-60"
					>
						<Save size={15} />
						{save.isPending ? t("chart.saving") : t("chart.save")}
					</button>
				</div>
			</motion.div>

			<ChartLegend active={active} onPick={setActive} />

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Odontogram
						chart={chart}
						selected={selected}
						onSelectSurface={applyTo}
						onSelectTooth={setSelected}
					/>
				</div>
				<ToothPanel
					toothId={selected}
					tooth={selected ? chart[selected] : null}
					onClose={() => setSelected(null)}
					onClear={clearTooth}
					onNote={setNote}
				/>
			</div>
		</div>
	)
}
