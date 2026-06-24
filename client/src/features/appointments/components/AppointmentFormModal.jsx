import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { scaleIn } from "@/lib/motion"
import { APPOINTMENT_TYPES, APPOINTMENT_STATUS } from "../appointmentMeta"
import { useSaveAppointment } from "../useAppointments"
import { useToast } from "@/providers/ToastProvider"

function defaults(date) {
	return {
		patientId: "",
		dentistId: "",
		date: date,
		startTime: "09:00",
		endTime: "09:30",
		type: "consultation",
		status: "scheduled",
		notes: "",
	}
}

function Field({ label, children }) {
	return (
		<label className="space-y-1 block">
			<span className="text-sm text-muted">{label}</span>
			{children}
		</label>
	)
}

export default function AppointmentFormModal({ open, onClose, initial, date, patients, dentists }) {
	const { t } = useTranslation()
	const save = useSaveAppointment()
	const toast = useToast()
	const [form, setForm] = useState(initial || defaults(date))

	if (!open) return null

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		const id = initial ? initial.id : null
		const selectedPatient = patients.find((p) => p.id === form.patientId)
		const selectedDentist = dentists.find((d) => d.id === form.dentistId)
		const payload = {
			...form,
			patientName: selectedPatient ? selectedPatient.firstName + " " + selectedPatient.lastName : form.patientName,
			dentistName: selectedDentist ? (selectedDentist.fullName || `${selectedDentist.firstName} ${selectedDentist.lastName}`) : form.dentistName,
		}
		save.mutate(
			{ id, data: payload },
			{
				onSuccess: () => {
					toast.success(
						t(id ? "appointments.editTitle" : "appointments.addTitle"),
						t(id ? "toast.updated" : "toast.created"),
					)
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	const inputClass = "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
			<motion.form variants={scaleIn} initial="hidden" animate="visible" onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-surface border border-border p-6 max-h-[90vh] overflow-y-auto">
				<h2 className="text-lg font-semibold mb-4">{initial ? t("appointments.editTitle") : t("appointments.addTitle")}</h2>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field label={t("appointments.patient")}>
						<select value={form.patientId} onChange={(e) => update("patientId", e.target.value)} className={inputClass} required>
							<option value="">—</option>
							{patients.map((p) => (
								<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
							))}
						</select>
					</Field>
					<Field label={t("appointments.dentist")}>
						<select value={form.dentistId} onChange={(e) => update("dentistId", e.target.value)} className={inputClass} required>
							<option value="">—</option>
							{dentists.map((d) => (
								<option key={d.id} value={d.id}>{d.fullName || `${d.firstName} ${d.lastName}`}</option>
							))}
						</select>
					</Field>
					<Field label={t("appointments.date")}>
						<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} required />
					</Field>
					<Field label={t("appointments.type")}>
						<select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputClass}>
							{APPOINTMENT_TYPES.map((ty) => (
								<option key={ty} value={ty}>{t("appointments.type_" + ty)}</option>
							))}
						</select>
					</Field>
					<Field label={t("appointments.startTime")}>
						<input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} className={inputClass} required />
					</Field>
					<Field label={t("appointments.endTime")}>
						<input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} className={inputClass} required />
					</Field>
					<Field label={t("appointments.status")}>
						<select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
							{APPOINTMENT_STATUS.map((s) => (
								<option key={s} value={s}>{t("appointments.status_" + s)}</option>
							))}
						</select>
					</Field>
				</div>

				<label className="space-y-1 block mt-4">
					<span className="text-sm text-muted">{t("appointments.notes")}</span>
					<textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className={inputClass} />
				</label>

				<div className="flex justify-end gap-3 mt-6">
					<button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">{t("common.cancel")}</button>
					<button type="submit" disabled={save.isPending} className="rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm disabled:opacity-60">{save.isPending ? t("common.saving") : t("common.save")}</button>
				</div>
			</motion.form>
		</div>
	)
}
