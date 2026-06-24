import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Plus, Trash2, Download } from "lucide-react"
import { scaleIn } from "@/lib/motion"
import { INVOICE_STATUS, formatDA } from "../billingMeta"
import { useSaveInvoice } from "../useBilling"
import { useTreatments } from "@/features/treatments/useTreatments"
import { useToast } from "@/providers/ToastProvider"

function defaults(date) {
	return {
		patientId: "",
		date: date,
		lineItems: [{ label: "", amount: 0 }],
		insuranceShare: 0,
		status: "unpaid",
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

export default function InvoiceFormModal({ open, onClose, initial, date, patients }) {
	const { t } = useTranslation()
	const save = useSaveInvoice()
	const toast = useToast()
	const [form, setForm] = useState(initial || defaults(date))
	const { data: treatmentsData } = useTreatments({ patientId: form.patientId })

	if (!open) return null

	const inputClass = "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }))
	}

	function updateItem(index, key, value) {
		setForm(function (f) {
			const lineItems = f.lineItems.map((li, i) => (i === index ? { ...li, [key]: value } : li))
			return { ...f, lineItems: lineItems }
		})
	}

	function addItem() {
		setForm((f) => ({ ...f, lineItems: f.lineItems.concat([{ label: "", amount: 0 }]) }))
	}

	function removeItem(index) {
		setForm((f) => ({ ...f, lineItems: f.lineItems.filter((li, i) => i !== index) }))
	}

	function importTreatments() {
		const rows = (treatmentsData ? treatmentsData.items : [])
			.filter((it) => it.status !== "cancelled")
			.map((it) => ({
				label: t("treatments.proc_" + it.procedureCode) + (it.tooth ? " — " + it.tooth : ""),
				amount: Number(it.cost) || 0,
			}))
		if (rows.length) setForm((f) => ({ ...f, lineItems: rows }))
	}

	const subtotal = form.lineItems.reduce((s, li) => s + (Number(li.amount) || 0), 0)
	const patientDue = Math.max(subtotal - (Number(form.insuranceShare) || 0), 0)

	function handleSubmit(e) {
		e.preventDefault()
		const id = initial ? initial.id : null
		const selectedPatient = patients.find((p) => p.id === form.patientId)
		const payload = {
			...form,
			insuranceShare: Number(form.insuranceShare) || 0,
			lineItems: form.lineItems.map((li) => ({ label: li.label, amount: Number(li.amount) || 0 })),
			patientName: selectedPatient ? selectedPatient.firstName + " " + selectedPatient.lastName : form.patientName,
		}
		save.mutate(
			{ id, data: payload },
			{
				onSuccess: () => {
					toast.success(
						t(id ? "billing.editTitle" : "billing.addTitle"),
						t(id ? "toast.updated" : "toast.created"),
					)
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
			<motion.form variants={scaleIn} initial="hidden" animate="visible" onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg bg-surface border border-border p-6 max-h-[90vh] overflow-y-auto">
				<h2 className="text-lg font-semibold mb-4">{initial ? t("billing.editTitle") : t("billing.addTitle")}</h2>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field label={t("billing.patient")}>
						<select value={form.patientId} onChange={(e) => update("patientId", e.target.value)} className={inputClass} required>
							<option value="">—</option>
							{patients.map((p) => (
								<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
							))}
						</select>
					</Field>
					<Field label={t("billing.date")}>
						<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} required />
					</Field>
				</div>

				<div className="mt-5">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">{t("billing.lineItems")}</span>
						<div className="flex items-center gap-2">
							<button type="button" onClick={importTreatments} disabled={!form.patientId} className="flex items-center gap-1 text-xs rounded-md border border-border px-2 py-1 hover:border-accent transition-colors disabled:opacity-50">
								<Download size={13} />
								{t("billing.importFromTreatments")}
							</button>
							<button type="button" onClick={addItem} className="flex items-center gap-1 text-xs rounded-md border border-border px-2 py-1 hover:border-accent transition-colors">
								<Plus size={13} />
								{t("billing.addLineItem")}
							</button>
						</div>
					</div>
					<div className="space-y-2">
						{form.lineItems.map((li, index) => (
							<div key={index} className="flex items-center gap-2">
								<input value={li.label} onChange={(e) => updateItem(index, "label", e.target.value)} placeholder={t("billing.lineItemLabel")} className={inputClass} />
								<input type="number" min="0" value={li.amount} onChange={(e) => updateItem(index, "amount", e.target.value)} className="w-32 rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent" />
								<button type="button" onClick={() => removeItem(index)} className="w-9 h-9 grid place-items-center rounded-md border border-border text-danger hover:border-danger transition-colors shrink-0">
									<Trash2 size={14} />
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 mt-5">
					<Field label={t("billing.insuranceShare")}>
						<input type="number" min="0" value={form.insuranceShare} onChange={(e) => update("insuranceShare", e.target.value)} className={inputClass} />
					</Field>
					<Field label={t("billing.status")}>
						<select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
							{INVOICE_STATUS.map((s) => (
								<option key={s} value={s}>{t("billing.status_" + s)}</option>
							))}
						</select>
					</Field>
				</div>

				<div className="mt-4 rounded-md bg-bg border border-border p-3 text-sm space-y-1">
					<div className="flex justify-between"><span className="text-muted">{t("billing.subtotal")}</span><span>{formatDA(subtotal)}</span></div>
					<div className="flex justify-between"><span className="text-muted">{t("billing.patientDue")}</span><span className="font-semibold text-accent">{formatDA(patientDue)}</span></div>
				</div>

				<label className="space-y-1 block mt-4">
					<span className="text-sm text-muted">{t("billing.notes")}</span>
					<textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} className={inputClass} />
				</label>

				<div className="flex justify-end gap-3 mt-6">
					<button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">{t("common.cancel")}</button>
					<button type="submit" disabled={save.isPending} className="rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm disabled:opacity-60">{save.isPending ? t("common.saving") : t("common.save")}</button>
				</div>
			</motion.form>
		</div>
	)
}
