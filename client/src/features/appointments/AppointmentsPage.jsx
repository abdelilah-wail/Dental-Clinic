import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react"
import { fadeRise, stagger } from "@/lib/motion"
import { useAppointments, useDentists, useDeleteAppointment } from "./useAppointments"
import { usePatients } from "@/features/patients/usePatients"
import { APPOINTMENT_STATUS } from "./appointmentMeta"
import AppointmentCard from "./components/AppointmentCard"
import AppointmentFormModal from "./components/AppointmentFormModal"
import { useToast } from "@/providers/ToastProvider"

function todayIso() {
	const now = new Date()
	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, "0")
	const d = String(now.getDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}

function shiftIso(iso, days) {
	const d = new Date(iso + "T00:00:00")
	d.setDate(d.getDate() + days)
	const y = d.getFullYear()
	const mo = String(d.getMonth() + 1).padStart(2, "0")
	const da = String(d.getDate()).padStart(2, "0")
	return `${y}-${mo}-${da}`
}

export default function AppointmentsPage() {
	const { t, i18n } = useTranslation()
	const toast = useToast()
	const [date, setDate] = useState(todayIso())
	const [status, setStatus] = useState("")
	const [showForm, setShowForm] = useState(false)
	const [editing, setEditing] = useState(null)

	const { data, isFetching } = useAppointments({ date, status })
	const { data: patientsData } = usePatients({ pageSize: 100 })
	const { data: dentists } = useDentists()
	const remove = useDeleteAppointment()

	const items = data ? data.items : []
	const patients = patientsData ? patientsData.items : []
	const dentistList = dentists || []

	const prettyDate = new Date(date + "T00:00:00").toLocaleDateString(i18n.language, {
		weekday: "long", year: "numeric", month: "long", day: "numeric",
	})

	function openNew() {
		setEditing(null)
		setShowForm(true)
	}

	function openEdit(appt) {
		setEditing(appt)
		setShowForm(true)
	}

	function handleDelete(appt) {
		remove.mutate(appt.id, {
			onSuccess: () => toast.success(t("appointments.title"), t("toast.deleted")),
			onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
		})
	}

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">{t("appointments.title")}</h1>
					<p className="text-muted text-sm">{t("appointments.subtitle")}</p>
				</div>
				<button onClick={openNew} className="flex items-center gap-2 rounded-md bg-accent text-primary font-medium px-4 py-2.5 hover:bg-accent-hover transition-colors">
					<Plus size={16} />
					{t("appointments.add")}
				</button>
			</motion.div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<button onClick={() => setDate(shiftIso(date, -1))} className="w-9 h-9 grid place-items-center rounded-md border border-border hover:border-accent transition-colors">
						<ChevronLeft size={16} />
					</button>
					<button onClick={() => setDate(todayIso())} className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent transition-colors">
						{t("appointments.today")}
					</button>
					<button onClick={() => setDate(shiftIso(date, 1))} className="w-9 h-9 grid place-items-center rounded-md border border-border hover:border-accent transition-colors">
						<ChevronRight size={16} />
					</button>
					<span className="flex items-center gap-2 text-sm text-muted ms-2">
						<CalendarDays size={15} className="text-accent" />
						{prettyDate}
					</span>
				</div>
				<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent">
					<option value="">{t("appointments.allStatuses")}</option>
					{APPOINTMENT_STATUS.map((s) => (
						<option key={s} value={s}>{t("appointments.status_" + s)}</option>
					))}
				</select>
			</div>

			{items.length === 0 ? (
				<div className="rounded-lg bg-surface border border-border p-10 text-center text-muted text-sm">
					{isFetching ? t("common.loading") : t("appointments.empty")}
				</div>
			) : (
				<motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
					{items.map((appt) => (
						<motion.div key={appt.id} variants={fadeRise}>
							<AppointmentCard appt={appt} onEdit={openEdit} onDelete={handleDelete} />
						</motion.div>
					))}
				</motion.div>
			)}

			{showForm && (
				<AppointmentFormModal
					open={showForm}
					onClose={() => setShowForm(false)}
					initial={editing}
					date={date}
					patients={patients}
					dentists={dentistList}
				/>
			)}
		</div>
	)
}
