import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { X, Save } from "lucide-react"
import { useSaveClaim } from "./useInsurance"
import { INSURANCE_PROVIDERS, CLAIM_STATUSES } from "./insuranceMeta"
import { useToast } from "@/providers/ToastProvider"

const backdrop = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
}

const panel = {
	hidden: { opacity: 0, y: 20, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: 20, scale: 0.98 },
}

export default function InsuranceClaimModal({ claim, patients, onClose }) {
	const { t } = useTranslation()
	const save = useSaveClaim()
	const toast = useToast()
	const [form, setForm] = useState({
		patientId: claim?.patientId || "",
		provider: claim?.provider || "cnas",
		policyNumber: claim?.policyNumber || "",
		invoiceId: claim?.invoiceId || "",
		amountClaimed: claim?.amountClaimed || "",
		amountReimbursed: claim?.amountReimbursed || 0,
		status: claim?.status || "draft",
		submittedDate: claim?.submittedDate ? claim.submittedDate.slice(0, 10) : "",
		notes: claim?.notes || "",
	})

	const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

	const handleSubmit = (e) => {
		e.preventDefault()
		const selected = patients.find((p) => p.id === form.patientId)
		const data = {
			...form,
			amountClaimed: Number(form.amountClaimed) || 0,
			amountReimbursed: Number(form.amountReimbursed) || 0,
			patientName: selected ? `${selected.firstName} ${selected.lastName}` : "",
			submittedDate: form.submittedDate || null,
		}
		save.mutate(
			{ id: claim?.id, data },
			{
				onSuccess: () => {
					toast.success(
						t(claim ? "insurance.edit_claim" : "insurance.new_claim"),
						t(claim ? "toast.updated" : "toast.created"),
					)
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<motion.div variants={backdrop} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
			<motion.div variants={panel} className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6" onClick={(e) => e.stopPropagation()}>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-text">{claim ? t("insurance.edit_claim") : t("insurance.new_claim")}</h2>
					<button onClick={onClose} className="text-muted hover:text-text"><X size={20} /></button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-xs text-muted">{t("insurance.col_patient")}</label>
						<select required value={form.patientId} onChange={(e) => setField("patientId", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text">
							<option value="">{t("insurance.select_patient")}</option>
							{patients.map((p) => (
								<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.col_provider")}</label>
							<select value={form.provider} onChange={(e) => setField("provider", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text">
								{INSURANCE_PROVIDERS.map((p) => (
									<option key={p.value} value={p.value}>{p.label}</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.policy_number")}</label>
							<input value={form.policyNumber} onChange={(e) => setField("policyNumber", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.amount_claimed")}</label>
							<input type="number" value={form.amountClaimed} onChange={(e) => setField("amountClaimed", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
						</div>
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.amount_reimbursed")}</label>
							<input type="number" value={form.amountReimbursed} onChange={(e) => setField("amountReimbursed", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.col_status")}</label>
							<select value={form.status} onChange={(e) => setField("status", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text">
								{CLAIM_STATUSES.map((s) => (
									<option key={s.value} value={s.value}>{t("insurance.status_" + s.value)}</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs text-muted">{t("insurance.submitted_date")}</label>
							<input type="date" value={form.submittedDate} onChange={(e) => setField("submittedDate", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
						</div>
					</div>

					<div>
						<label className="mb-1 block text-xs text-muted">{t("insurance.invoice_id")}</label>
						<input value={form.invoiceId} onChange={(e) => setField("invoiceId", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
					</div>

					<div>
						<label className="mb-1 block text-xs text-muted">{t("insurance.notes")}</label>
						<textarea rows={3} value={form.notes} onChange={(e) => setField("notes", e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text" />
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text">{t("common.cancel")}</button>
						<button type="submit" disabled={save.isPending} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary hover:bg-accent-hover"><Save size={16} />{t("common.save")}</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	)
}
