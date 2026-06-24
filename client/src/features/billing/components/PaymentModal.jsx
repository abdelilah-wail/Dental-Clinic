import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { scaleIn } from "@/lib/motion"
import { PAYMENT_METHODS, formatDA } from "../billingMeta"
import { useAddPayment } from "../useBilling"
import { useToast } from "@/providers/ToastProvider"

export default function PaymentModal({ open, onClose, invoice }) {
	const { t } = useTranslation()
	const addPayment = useAddPayment()
	const toast = useToast()
	const [amount, setAmount] = useState(invoice ? invoice.balance : 0)
	const [method, setMethod] = useState("cash")
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

	if (!open || !invoice) return null

	const inputClass = "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"

	function handleSubmit(e) {
		e.preventDefault()
		const data = { amount: Number(amount) || 0, method: method, date: date }
		addPayment.mutate(
			{ id: invoice.id, data: data },
			{
				onSuccess: () => {
					toast.success(t("billing.recordPayment"), t("toast.paymentRecorded"))
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
			<motion.form variants={scaleIn} initial="hidden" animate="visible" onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-surface border border-border p-6">
				<h2 className="text-lg font-semibold mb-1">{t("billing.recordPayment")}</h2>
				<p className="text-xs text-muted mb-4">{invoice.invoiceNumber} · {t("billing.balance")}: {formatDA(invoice.balance)}</p>

				<label className="space-y-1 block">
					<span className="text-sm text-muted">{t("billing.paymentAmount")}</span>
					<input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} required />
				</label>

				<label className="space-y-1 block mt-4">
					<span className="text-sm text-muted">{t("billing.paymentMethod")}</span>
					<select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
						{PAYMENT_METHODS.map((m) => (
							<option key={m} value={m}>{t("billing.method_" + m)}</option>
						))}
					</select>
				</label>

				<label className="space-y-1 block mt-4">
					<span className="text-sm text-muted">{t("billing.paymentDate")}</span>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
				</label>

				<div className="flex justify-end gap-3 mt-6">
					<button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">{t("common.cancel")}</button>
					<button type="submit" disabled={addPayment.isPending} className="rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm disabled:opacity-60">{addPayment.isPending ? t("common.saving") : t("billing.confirmPayment")}</button>
				</div>
			</motion.form>
		</div>
	)
}
