import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Plus, ScanLine, ImageOff } from "lucide-react"
import { stagger, fadeRise } from "@/lib/motion"
import { usePatients } from "@/features/patients/usePatients"
import { useXrays } from "./useXray"
import { XRAY_TYPES, xrayTypeLabel, formatDate } from "./xrayMeta"
import XrayUploadModal from "./XrayUploadModal"
import XrayLightbox from "./XrayLightbox"

function chipClass(active) {
	const base = "px-3 py-1.5 text-xs rounded-full border transition-colors "
	return base + (active ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-text")
}

export default function XrayPage() {
	const { t } = useTranslation()
	const [patientId, setPatientId] = useState("")
	const [type, setType] = useState("")
	const [uploadOpen, setUploadOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)

	const patientsQuery = usePatients({ pageSize: 100 })
	const patients = patientsQuery.data ? patientsQuery.data.items : []

	const filters = useMemo(
		() => ({ patientId: patientId || undefined, type: type || undefined }),
		[patientId, type],
	)
	const { data, isLoading } = useXrays(filters)
	const images = data || []

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold flex items-center gap-2">
						<ScanLine size={22} className="text-accent" />
						{t("xray.title")}
					</h1>
					<p className="text-muted text-sm">{t("xray.subtitle")}</p>
				</div>
				<button
					onClick={() => setUploadOpen(true)}
					className="inline-flex items-center gap-2 rounded-md bg-accent text-primary font-medium px-4 py-2 hover:bg-accent-hover transition-colors"
				>
					<Plus size={16} />
					{t("xray.add")}
				</button>
			</motion.div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<select
					value={patientId}
					onChange={(e) => setPatientId(e.target.value)}
					className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
				>
					<option value="">{t("xray.allPatients")}</option>
					{patients.map((p) => (
						<option key={p.id} value={p.id}>
							{p.firstName + " " + p.lastName}
						</option>
					))}
				</select>

				<div className="flex flex-wrap items-center gap-1.5">
					<button onClick={() => setType("")} className={chipClass(type === "")}>
						{t("xray.allTypes")}
					</button>
					{XRAY_TYPES.map((it) => (
						<button key={it.value} onClick={() => setType(it.value)} className={chipClass(type === it.value)}>
							{t(it.labelKey)}
						</button>
					))}
				</div>
			</div>

			{/* Gallery */}
			{isLoading ? (
				<p className="text-muted text-sm">{t("xray.loading")}</p>
			) : images.length === 0 ? (
				<div className="rounded-lg border border-dashed border-border bg-surface/50 p-12 text-center">
					<ImageOff size={32} className="mx-auto text-muted mb-3" />
					<p className="text-muted text-sm">{t("xray.empty")}</p>
				</div>
			) : (
				<motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{images.map((img, index) => (
						<motion.button
							key={img.id}
							variants={fadeRise}
							onClick={() => setActiveIndex(index)}
							className="group text-start rounded-lg overflow-hidden border border-border bg-surface hover:border-accent transition-colors"
						>
							<div className="aspect-square bg-black/40 overflow-hidden">
								<img src={img.imageUrl} alt={img.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
							</div>
							<div className="p-3">
								<div className="text-sm font-medium">{t(xrayTypeLabel(img.type))}</div>
								<div className="text-xs text-muted">{img.patientName + " · " + formatDate(img.date)}</div>
							</div>
						</motion.button>
					))}
				</motion.div>
			)}

			<XrayUploadModal
				open={uploadOpen}
				onClose={() => setUploadOpen(false)}
				patients={patients}
				defaultPatientId={patientId}
			/>

			<XrayLightbox
				images={images}
				index={activeIndex}
				onClose={() => setActiveIndex(-1)}
				onNavigate={setActiveIndex}
			/>
		</div>
	)
}
