import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Plus, Search, FileText, Wallet, AlertCircle, CreditCard, Pencil, Trash2 } from "lucide-react"
import { fadeRise, stagger } from "@/lib/motion"
import { useInvoices, useDeleteInvoice } from "./useBilling"
import { usePatients } from "@/features/patients/usePatients"
import { INVOICE_STATUS, INVOICE_STATUS_STYLES, formatDA } from "./billingMeta"
import InvoiceFormModal from "./components/InvoiceFormModal"
import PaymentModal from "./components/PaymentModal"
import { useToast } from "@/providers/ToastProvider"

function statusClass(status) {
	return INVOICE_STATUS_STYLES[status] || "bg-white/10 text-muted"
}

function todayIso() {
	return new Date().toISOString().slice(0, 10)
}

export default function BillingPage() {
	const { t } = useTranslation()
	const toast = useToast()
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState("")
	const [showForm, setShowForm] = useState(false)
	const [editing, setEditing] = useState(null)
	const [paying, setPaying] = useState(null)

	const { data, isFetching } = useInvoices({ search, status })
	const { data: patientsData } = usePatients({ pageSize: 100 })
	const remove = useDeleteInvoice()

	const items = data ? data.items : []
	const patients = patientsData ? patientsData.items : []

	const totalBilled = items.reduce((s, it) => s + (Number(it.patientDue) || 0), 0)
	const outstanding = items.reduce((s, it) => s + (Number(it.balance) || 0), 0)
	const collected = items.reduce((s, it) => s + (Number(it.paidAmount) || 0), 0)

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
			onSuccess: () => toast.success(t("billing.title"), t("toast.deleted")),
			onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
		})
	}

	return (
		<div className="space-y-6">
			<motion.div variants={fadeRise} initial="hidden" animate="visible" className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">{t("billing.title")}</h1>
					<p className="text-muted text-sm">{t("billing.subtitle")}</p>
				</div>
				<button onClick={openNew} className="flex items-center gap-2 rounded-md bg-accent text-primary font-medium px-4 py-2.5 hover:bg-accent-hover transition-colors">
					<Plus size={16} />
					{t("billing.add")}
				</button>
			</motion.div>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-accent/15 text-accent"><FileText size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("billing.totalBilled")}</p>
						<p className="text-lg font-semibold">{formatDA(totalBilled)}</p>
					</div>
				</div>
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-warning/15 text-warning"><AlertCircle size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("billing.outstanding")}</p>
						<p className="text-lg font-semibold">{formatDA(outstanding)}</p>
					</div>
				</div>
				<div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3">
					<div className="w-10 h-10 grid place-items-center rounded-md bg-success/15 text-success"><Wallet size={18} /></div>
					<div>
						<p className="text-xs text-muted">{t("billing.collected")}</p>
						<p className="text-lg font-semibold">{formatDA(collected)}</p>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<div className="relative flex-1 min-w-[200px]">
					<Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted" />
					<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("billing.searchPlaceholder")} className="w-full rounded-md border border-border bg-bg ps-9 pe-3 py-2 text-sm outline-none focus:border-accent" />
				</div>
				<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent">
					<option value="">{t("billing.allStatuses")}</option>
					{INVOICE_STATUS.map((s) => (
						<option key={s} value={s}>{t("billing.status_" + s)}</option>
					))}
				</select>
			</div>

			{items.length === 0 ? (
				<div className="rounded-lg bg-surface border border-border p-10 text-center text-muted text-sm">
					{isFetching ? t("common.loading") : t("billing.empty")}
				</div>
			) : (
				<motion.div variants={stagger} initial="hidden" animate="visible" className="overflow-x-auto rounded-lg border border-border">
					<table className="w-full text-sm">
						<thead className="bg-surface text-muted text-xs uppercase">
							<tr>
								<th className="text-start font-medium px-4 py-3">{t("billing.invoiceNumber")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.patient")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.date")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.patientDue")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.paid")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.balance")}</th>
								<th className="text-start font-medium px-4 py-3">{t("billing.status")}</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<motion.tr key={item.id} variants={fadeRise} className="border-t border-border hover:bg-surface/60">
									<td className="px-4 py-3 font-medium">{item.invoiceNumber}</td>
									<td className="px-4 py-3">{item.patientName}</td>
									<td className="px-4 py-3">{item.date}</td>
									<td className="px-4 py-3">{formatDA(item.patientDue)}</td>
									<td className="px-4 py-3 text-success">{formatDA(item.paidAmount)}</td>
									<td className="px-4 py-3">{formatDA(item.balance)}</td>
									<td className="px-4 py-3">
										<span className={"px-2 py-0.5 rounded-full text-[11px] " + statusClass(item.status)}>
											{t("billing.status_" + item.status)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-1">
											<button onClick={() => setPaying(item)} disabled={item.balance <= 0} className="w-8 h-8 grid place-items-center rounded-md border border-border text-accent hover:border-accent transition-colors disabled:opacity-40" title={t("billing.recordPayment")}>
												<CreditCard size={14} />
											</button>
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
				<InvoiceFormModal
					open={showForm}
					onClose={() => setShowForm(false)}
					initial={editing}
					date={todayIso()}
					patients={patients}
				/>
			)}

			{paying && (
				<PaymentModal
					open={Boolean(paying)}
					onClose={() => setPaying(null)}
					invoice={paying}
				/>
			)}
		</div>
	)
}
