import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Plus, ShieldCheck, FileText, Pencil, Trash2 } from "lucide-react"
import { useClaims, useDeleteClaim } from "./useInsurance"
import { usePatients } from "../patients/usePatients"
import { useToast } from "@/providers/ToastProvider"
import {
	INSURANCE_PROVIDERS,
	CLAIM_STATUSES,
	STATUS_BADGE,
	providerLabel,
	formatDA,
} from "./insuranceMeta"
import InsuranceClaimModal from "./InsuranceClaimModal"

const listVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const rowVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0 },
}

export default function InsurancePage() {
	const { t } = useTranslation()
	const toast = useToast()
	const [provider, setProvider] = useState("")
	const [status, setStatus] = useState("")
	const [patientId, setPatientId] = useState("")
	const [modalOpen, setModalOpen] = useState(false)
	const [editing, setEditing] = useState(null)

	const filters = {}
	if (provider) filters.provider = provider
	if (status) filters.status = status
	if (patientId) filters.patientId = patientId

	const { data: claimsData = [], isLoading } = useClaims(filters)
	const claims = Array.isArray(claimsData) ? claimsData : (claimsData.items || [])
	const { data: patientsData } = usePatients({ pageSize: 100 })
	const patients = patientsData ? patientsData.items || [] : []
	const remove = useDeleteClaim()

	const totals = useMemo(() => {
		const claimed = claims.reduce((s, c) => s + (Number(c.amountClaimed) || 0), 0)
		const reimbursed = claims.reduce((s, c) => s + (Number(c.amountReimbursed) || 0), 0)
		const pending = claims.filter((c) => c.status === "submitted" || c.status === "draft").length
		return { claimed, reimbursed, pending }
	}, [claims])

	const openCreate = () => {
		setEditing(null)
		setModalOpen(true)
	}

	const openEdit = (claim) => {
		setEditing(claim)
		setModalOpen(true)
	}

	const handleDelete = (claim) => {
		if (window.confirm(t("insurance.confirm_delete"))) {
			remove.mutate(claim.id, {
				onSuccess: () => toast.success(t("insurance.title"), t("toast.deleted")),
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			})
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<ShieldCheck className="text-accent" size={24} />
					<h1 className="text-2xl font-semibold text-text">{t("insurance.title")}</h1>
				</div>
				<button
					onClick={openCreate}
					className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-hover"
				>
					<Plus size={18} />
					{t("insurance.new_claim")}
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-xl border border-border bg-surface p-4">
					<p className="text-xs text-muted">{t("insurance.total_claimed")}</p>
					<p className="mt-1 text-xl font-semibold text-text">{formatDA(totals.claimed)}</p>
				</div>
				<div className="rounded-xl border border-border bg-surface p-4">
					<p className="text-xs text-muted">{t("insurance.total_reimbursed")}</p>
					<p className="mt-1 text-xl font-semibold text-success">{formatDA(totals.reimbursed)}</p>
				</div>
				<div className="rounded-xl border border-border bg-surface p-4">
					<p className="text-xs text-muted">{t("insurance.pending")}</p>
					<p className="mt-1 text-xl font-semibold text-warning">{totals.pending}</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<select value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text">
					<option value="">{t("insurance.all_providers")}</option>
					{INSURANCE_PROVIDERS.map((p) => (
						<option key={p.value} value={p.value}>{p.label}</option>
					))}
				</select>
				<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text">
					<option value="">{t("insurance.all_statuses")}</option>
					{CLAIM_STATUSES.map((s) => (
						<option key={s.value} value={s.value}>{t("insurance.status_" + s.value)}</option>
					))}
				</select>
				<select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text">
					<option value="">{t("insurance.all_patients")}</option>
					{patients.map((p) => (
						<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
					))}
				</select>
			</div>

			{isLoading ? (
				<p className="text-muted">{t("common.loading")}</p>
			) : claims.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
					<FileText className="text-muted" size={40} />
					<p className="mt-3 text-muted">{t("insurance.empty")}</p>
				</div>
			) : (
				<motion.div variants={listVariants} initial="hidden" animate="visible" className="overflow-hidden rounded-xl border border-border">
					<table className="w-full text-start text-sm">
						<thead className="bg-surface text-xs uppercase text-muted">
							<tr>
								<th className="px-4 py-3 font-medium">{t("insurance.col_claim")}</th>
								<th className="px-4 py-3 font-medium">{t("insurance.col_patient")}</th>
								<th className="px-4 py-3 font-medium">{t("insurance.col_provider")}</th>
								<th className="px-4 py-3 font-medium">{t("insurance.col_claimed")}</th>
								<th className="px-4 py-3 font-medium">{t("insurance.col_reimbursed")}</th>
								<th className="px-4 py-3 font-medium">{t("insurance.col_status")}</th>
								<th className="px-4 py-3 text-end font-medium">{t("insurance.col_actions")}</th>
							</tr>
						</thead>
						<tbody>
							{claims.map((claim) => (
								<motion.tr key={claim.id} variants={rowVariants} className="border-t border-border bg-bg">
									<td className="px-4 py-3 font-medium text-text">{claim.claimNumber}</td>
									<td className="px-4 py-3 text-muted">{claim.patientName}</td>
									<td className="px-4 py-3 text-muted">{providerLabel(claim.provider)}</td>
									<td className="px-4 py-3 text-text">{formatDA(claim.amountClaimed)}</td>
									<td className="px-4 py-3 text-success">{formatDA(claim.amountReimbursed)}</td>
									<td className="px-4 py-3">
										<span className={"rounded-full px-2 py-1 text-xs " + (STATUS_BADGE[claim.status] || STATUS_BADGE.draft)}>
											{t("insurance.status_" + claim.status)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-2">
											<button onClick={() => openEdit(claim)} className="text-muted hover:text-accent"><Pencil size={16} /></button>
											<button onClick={() => handleDelete(claim)} className="text-muted hover:text-danger"><Trash2 size={16} /></button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</motion.div>
			)}

			{modalOpen && (
				<InsuranceClaimModal claim={editing} patients={patients} onClose={() => setModalOpen(false)} />
			)}
		</div>
	)
}
