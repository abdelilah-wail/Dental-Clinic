import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { fadeRise } from "@/lib/motion"
import { usePatients } from "./usePatients"
import { PATIENT_STATUS } from "./algeria"
import PatientTable from "./components/PatientTable"
import PatientFormModal from "./components/PatientFormModal"

const PAGE_SIZE = 10

export default function PatientsPage() {
	const { t } = useTranslation()
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState("")
	const [page, setPage] = useState(1)
	const [showForm, setShowForm] = useState(false)

	const params = { search, status, page, pageSize: PAGE_SIZE }
	const { data, isFetching } = usePatients(params)

	const items = data ? data.items : []
	const total = data ? data.total : 0
	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

	function onSearchChange(e) {
		setSearch(e.target.value)
		setPage(1)
	}

	function onStatusChange(e) {
		setStatus(e.target.value)
		setPage(1)
	}

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">{t("patients.title")}</h1>
					<p className="text-muted text-sm">{t("patients.subtitle")}</p>
				</div>
				<button onClick={() => setShowForm(true)} className="rounded-md bg-accent text-primary font-medium px-4 py-2.5 hover:bg-accent-hover transition-colors">
					+ {t("patients.add")}
				</button>
			</motion.div>

			<div className="flex flex-wrap items-center gap-3">
				<input
					type="search"
					value={search}
					onChange={onSearchChange}
					placeholder={t("patients.searchPlaceholder")}
					className="flex-1 min-w-[200px] rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
				/>
				<select value={status} onChange={onStatusChange} className="rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent">
					<option value="">{t("patients.allStatuses")}</option>
					{PATIENT_STATUS.map((s) => (
						<option key={s} value={s}>{t("patients.status_" + s)}</option>
					))}
				</select>
			</div>

			<div className="rounded-lg bg-surface border border-border p-2">
				<PatientTable items={items} />
			</div>

			<div className="flex items-center justify-between text-sm text-muted">
				<span>{isFetching ? t("common.loading") : total + " " + t("patients.records")}</span>
				<div className="flex items-center gap-2">
					<button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40 hover:border-accent transition-colors">
						{t("common.prev")}
					</button>
					<span>{page} / {pageCount}</span>
					<button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount} className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40 hover:border-accent transition-colors">
						{t("common.next")}
					</button>
				</div>
			</div>

			<PatientFormModal open={showForm} onClose={() => setShowForm(false)} />
		</div>
	)
}
