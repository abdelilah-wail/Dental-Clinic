import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Users, UserCheck, Stethoscope, Pencil, Trash2, Mail, Phone } from "lucide-react"
import { useStaffList, useDeleteStaff } from "./useStaff"
import { useToast } from "@/providers/ToastProvider"
import { STAFF_ROLES, STAFF_STATUS, roleLabel, fullName, initials } from "./staffMeta"
import StaffModal from "./StaffModal"

const listVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const rowVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0 },
}

export default function StaffPage() {
	const { t } = useTranslation()
	const toast = useToast()
	const [role, setRole] = useState("")
	const [status, setStatus] = useState("")
	const [search, setSearch] = useState("")
	const [editing, setEditing] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)

	const filters = {}
	if (role) filters.role = role
	if (status) filters.status = status
	if (search) filters.search = search

	const { data: members = [], isLoading } = useStaffList(filters)
	const deleteStaff = useDeleteStaff()

	const kpis = useMemo(() => {
		let active = 0
		let dentists = 0
		for (const m of members) {
			if (m.status === "active") active += 1
			if (m.role === "dentist") dentists += 1
		}
		return { total: members.length, active, dentists }
	}, [members])

	function openCreate() {
		setEditing(null)
		setModalOpen(true)
	}

	function openEdit(member) {
		setEditing(member)
		setModalOpen(true)
	}

	function handleDelete(member) {
		if (window.confirm(t("staff.confirm_delete"))) {
			deleteStaff.mutate(member.id, {
				onSuccess: () => toast.success(t("staff.title"), t("toast.deleted")),
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			})
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-text">{t("staff.title")}</h1>
				<button
					onClick={openCreate}
					className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-hover"
				>
					<UserPlus size={16} />
					{t("staff.new_member")}
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<KpiCard icon={Users} label={t("staff.total")} value={kpis.total} />
				<KpiCard icon={UserCheck} label={t("staff.active")} value={kpis.active} tone="success" />
				<KpiCard icon={Stethoscope} label={t("staff.dentists")} value={kpis.dentists} />
			</div>

			<div className="flex flex-wrap gap-3">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t("staff.search")}
					className="w-56 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
				>
					<option value="">{t("staff.all_roles")}</option>
					{STAFF_ROLES.map((r) => (
						<option key={r.value} value={r.value}>
							{t(r.labelKey)}
						</option>
					))}
				</select>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
				>
					<option value="">{t("staff.all_statuses")}</option>
					<option value="active">{t("staff.status_active")}</option>
					<option value="inactive">{t("staff.status_inactive")}</option>
				</select>
			</div>

			<div className="overflow-hidden rounded-xl border border-border bg-surface">
				<table className="w-full text-start text-sm">
					<thead className="bg-surface text-xs uppercase text-muted">
						<tr>
							<th className="px-4 py-3 font-medium">{t("staff.col_name")}</th>
							<th className="px-4 py-3 font-medium">{t("staff.col_role")}</th>
							<th className="px-4 py-3 font-medium">{t("staff.col_contact")}</th>
							<th className="px-4 py-3 font-medium">{t("staff.col_status")}</th>
							<th className="px-4 py-3 text-end font-medium">{t("staff.col_actions")}</th>
						</tr>
					</thead>
					<motion.tbody variants={listVariants} initial="hidden" animate="visible">
						{members.map((member) => {
							const badge = STAFF_STATUS[member.status] || STAFF_STATUS.active
							const avatarStyle = { backgroundColor: member.color || "#d4af37" }
							return (
								<motion.tr key={member.id} variants={rowVariants} className="border-b border-border/50">
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-primary" style={avatarStyle}>
												{initials(member)}
											</span>
											<span className="font-medium text-text">{fullName(member)}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-muted">{t(roleLabel(member.role))}</td>
									<td className="px-4 py-3 text-muted">
										<div className="flex items-center gap-2">
											<Mail size={14} />
											<span>{member.email}</span>
										</div>
										<div className="mt-1 flex items-center gap-2">
											<Phone size={14} />
											<span>{member.phone}</span>
										</div>
									</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.badge}`}>
											{t(badge.labelKey)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-2">
											<button onClick={() => openEdit(member)} className="rounded-md p-1.5 text-muted transition hover:bg-bg hover:text-accent">
												<Pencil size={16} />
											</button>
											<button onClick={() => handleDelete(member)} className="rounded-md p-1.5 text-muted transition hover:bg-bg hover:text-danger">
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</motion.tr>
							)
						})}
					</motion.tbody>
				</table>
				{!isLoading && members.length === 0 && (
					<div className="px-4 py-10 text-center text-sm text-muted">{t("staff.empty")}</div>
				)}
			</div>

			<AnimatePresence>
				{modalOpen && <StaffModal member={editing} onClose={() => setModalOpen(false)} />}
			</AnimatePresence>
		</div>
	)
}

function KpiCard({ icon: Icon, label, value, tone }) {
	const toneClass = tone === "success" ? "text-success" : "text-accent"
	return (
		<div className="rounded-xl border border-border bg-surface p-4">
			<div className="flex items-center gap-2 text-muted">
				<Icon size={16} className={toneClass} />
				<span className="text-sm">{label}</span>
			</div>
			<div className="mt-2 text-2xl font-semibold text-text">{value}</div>
		</div>
	)
}
