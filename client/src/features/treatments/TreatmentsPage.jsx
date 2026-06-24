import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Plus, Search, Stethoscope, Wallet, ClipboardList, Pencil, Trash2 } from "lucide-react"
import { fadeRise, stagger } from "@/lib/motion"
import { useTreatments, useDeleteTreatment } from "./useTreatments"
import { useDentists } from "@/features/appointments/useAppointments"
import { usePatients } from "@/features/patients/usePatients"
import { TREATMENT_STATUS, TREATMENT_STATUS_STYLES, formatDA } from "./treatmentMeta"
import TreatmentFormModal from "./components/TreatmentFormModal"
import { useToast } from "@/providers/ToastProvider"

function statusClass(status) {
	return TREATMENT_STATUS_STYLES[status] || "bg-white/10 text-muted"
}

export default function TreatmentsPage() {
	const { t } = useTranslation()
	const toast = useToast()
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState("")
	const [showForm, setShowForm] = useState(false)
	const [editing, setEditing] = useState(null)

	const { data, isFetching } = useTreatments({ search, status })
	const { data: patientsData } = usePatients({ pageSize: 100 })
	const { data: dentists } = useDentists()
	const remove = useDeleteTreatment()

	const items = data ? data.items : []
	const patients = patientsData ? patientsData.items : []
	const dentistList = dentists || []

	const completedRevenue = items
		.filter((it) => it.status === "completed")
		.reduce((sum, it) => sum + (Number(it.cost) || 0), 0)
	const plannedCount = items.filter((it) => it.status === "planned").length

	function openNew() {
		setEditing(null)
		setShowForm(true)
	}

	function openEdit(item) {
		setEditing(item)
		setShowForm(true)
	}

	function handleDelete(item) {
		remove.mutate(item.id, {
			onSuccess: () => toast.success(t("treatments.title"), t("toast.deleted")),
			onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
		})
	}

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">{t("treatments.title")}</h1>
					<p className="text-muted text-sm">{t("treatments.subtitle")}</p>
				</div>
				<button onClick={openNew} className="flex items-center gap-2 rounded-md bg-accent text-primary font-medium px-4 py-2.5 hover:bg-accent-hover transition-colors">
					<Plus size={16} />
					{t("treatments.add")}
				</button>
			</motion.div>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-accent/15 text-accent"><ClipboardList size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("treatments.totalRecords")}</p>
						<p className="text-lg font-semibold">{items.length}</p>
					</div>
				</div>
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-accent/15 text-accent"><Stethoscope size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("treatments.planned")}</p>
						<p className="text-lg font-semibold">{plannedCount}</p>
					</div>
				</div>
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-accent/15 text-accent"><Wallet size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("treatments.completedRevenue")}</p>
						<p className="text-lg font-semibold">{formatDA(completedRevenue)}</p>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<div className="relative flex-1 min-w-[200px]">
					<Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted" />
					<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("treatments.searchPlaceholder")} className="w-full rounded-md border border-border bg-bg ps-9 pe-3 py-2 text-sm outline-none focus:border-accent" />
				</div>
				<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent">
					<option value="">{t("treatments.allStatuses")}</option>
					{TREATMENT_STATUS.map((s) => (
						<option key={s} value={s}>{t("treatments.status_" + s)}</option>
					))}
				</select>
			</div>

			{items.length === 0 ? (
				<div className="rounded-lg bg-surface border border-border p-10 text-center text-muted text-sm">
					{isFetching ? t("common.loading") : t("treatments.empty")}
				</div>
			) : (
				<motion.div variants={stagger} initial="hidden" animate="visible" className="overflow-x-auto rounded-lg border border-border">
					<table className="w-full text-sm">
						<thead className="bg-surface text-muted text-xs uppercase">
							<tr>
								<th className="text-start font-medium px-4 py-3">{t("treatments.patient")}</th>
								<th className="text-start font-medium px-4 py-3">{t("treatments.procedure")}</th>
								<th className="text-start font-medium px-4 py-3">{t("treatments.tooth")}</th>
								<th className="text-start font-medium px-4 py-3">{t("treatments.date")}</th>
								<th className="text-start font-medium px-4 py-3">{t("treatments.cost")}</th>
								<th className="text-start font-medium px-4 py-3">{t("treatments.status")}</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<motion.tr key={item.id} variants={fadeRise} className="border-t border-border hover:bg-surface/60">
									<td className="px-4 py-3">{item.patientName}</td>
									<td className="px-4 py-3">{t("treatments.proc_" + item.procedureCode)}</td>
									<td className="px-4 py-3">{item.tooth || "—"}</td>
									<td className="px-4 py-3">{item.date}</td>
									<td className="px-4 py-3">{formatDA(item.cost)}</td>
									<td className="px-4 py-3">
										<span className={"px-2 py-0.5 rounded-full text-[11px] " + statusClass(item.status)}>
											{t("treatments.status_" + item.status)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-1">
											<button onClick={() => openEdit(item)} className="w-8 h-8 grid place-items-center rounded-md border border-border text-muted hover:text-text hover:border-accent transition-colors">
												<Pencil size={14} />
											</button>
											<button onClick={() => handleDelete(item)} className="w-8 h-8 grid place-items-center rounded-md border border-border text-danger hover:border-danger transition-colors">
												<Trash2 size={14} />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</motion.div>
			)}

			{showForm && (
				<TreatmentFormModal
					open={showForm}
					onClose={() => setShowForm(false)}
					initial={editing}
					patients={patients}
					dentists={dentistList}
				/>
			)}
		</div>
	)
}
