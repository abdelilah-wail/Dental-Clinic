import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { scaleIn } from "@/lib/motion"
import { PROCEDURES, TREATMENT_STATUS, priceFor } from "../treatmentMeta"
import { useSaveTreatment } from "../useTreatments"
import { useToast } from "@/providers/ToastProvider"

function defaults() {
	return {
		patientId: "",
		dentistId: "",
		procedureCode: "exam",
		tooth: "",
		date: new Date().toISOString().slice(0, 10),
		status: "planned",
		cost: priceFor("exam"),
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

export default function TreatmentFormModal({ open, onClose, initial, patients, dentists }) {
	const { t } = useTranslation()
	const save = useSaveTreatment()
	const toast = useToast()
	const [form, setForm] = useState(initial || defaults())

	if (!open) return null

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }))
	}

	function onProcedureChange(code) {
		setForm((f) => ({ ...f, procedureCode: code, cost: priceFor(code) }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		const id = initial ? initial.id : null
		const selectedPatient = patients.find((p) => p.id === form.patientId)
		const selectedDentist = dentists.find((d) => d.id === form.dentistId)
		const payload = {
			...form,
			cost: Number(form.cost) || 0,
			patientName: selectedPatient ? selectedPatient.firstName + " " + selectedPatient.lastName : form.patientName,
			dentistName: selectedDentist ? selectedDentist.name : form.dentistName,
		}
		save.mutate(
			{ id, data: payload },
			{
				onSuccess: () => {
					toast.success(
						t(id ? "treatments.editTitle" : "treatments.addTitle"),
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
				<h2 className="text-lg font-semibold mb-4">{initial ? t("treatments.editTitle") : t("treatments.addTitle")}</h2>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field label={t("treatments.patient")}>
						<select value={form.patientId} onChange={(e) => update("patientId", e.target.value)} className={inputClass} required>
							<option value="">—</option>
							{patients.map((p) => (
								<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
							))}
						</select>
					</Field>
					<Field label={t("treatments.dentist")}>
						<select value={form.dentistId} onChange={(e) => update("dentistId", e.target.value)} className={inputClass} required>
							<option value="">—</option>
							{dentists.map((d) => (
								<option key={d.id} value={d.id}>{d.name}</option>
							))}
						</select>
					</Field>
					<Field label={t("treatments.procedure")}>
						<select value={form.procedureCode} onChange={(e) => onProcedureChange(e.target.value)} className={inputClass}>
							{PROCEDURES.map((proc) => (
								<option key={proc.code} value={proc.code}>{t("treatments.proc_" + proc.code)}</option>
							))}
						</select>
					</Field>
					<Field label={t("treatments.tooth")}>
						<input type="text" value={form.tooth} onChange={(e) => update("tooth", e.target.value)} placeholder="16" className={inputClass} />
					</Field>
					<Field label={t("treatments.date")}>
						<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} required />
					</Field>
					<Field label={t("treatments.cost")}>
						<input type="number" min="0" value={form.cost} onChange={(e) => update("cost", e.target.value)} className={inputClass} required />
					</Field>
					<Field label={t("treatments.status")}>
						<select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
							{TREATMENT_STATUS.map((s) => (
								<option key={s} value={s}>{t("treatments.status_" + s)}</option>
							))}
						</select>
					</Field>
				</div>

				<label className="space-y-1 block mt-4">
					<span className="text-sm text-muted">{t("treatments.notes")}</span>
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
