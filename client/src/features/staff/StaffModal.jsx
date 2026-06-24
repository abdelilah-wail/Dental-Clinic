import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { X, Save } from "lucide-react"
import { useSaveStaff } from "./useStaff"
import { STAFF_ROLES } from "./staffMeta"
import { useToast } from "@/providers/ToastProvider"

const backdrop = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
}

const panel = {
	hidden: { opacity: 0, y: 24, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: 24, scale: 0.98 },
}

const EMPTY = {
	firstName: "",
	lastName: "",
	role: "assistant",
	email: "",
	phone: "",
	specialty: "",
	status: "active",
	hireDate: "",
	color: "#d4af37",
}

export default function StaffModal({ member, onClose }) {
	const { t } = useTranslation()
	const saveStaff = useSaveStaff()
	const toast = useToast()
	const [form, setForm] = useState(member ? { ...EMPTY, ...member } : EMPTY)

	function update(field, value) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		saveStaff.mutate(
			{ id: member ? member.id : undefined, data: form },
			{
				onSuccess: () => {
					toast.success(
						t(member ? "staff.edit_member" : "staff.new_member"),
						t(member ? "toast.updated" : "toast.created"),
					)
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<motion.div
			variants={backdrop}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<motion.div
				variants={panel}
				className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-text">
						{member ? t("staff.edit_member") : t("staff.new_member")}
					</h2>
					<button onClick={onClose} className="rounded-md p-1 text-muted transition hover:text-text">
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_first_name")}</label>
							<input
								required
								value={form.firstName}
								onChange={(e) => update("firstName", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_last_name")}</label>
							<input
								required
								value={form.lastName}
								onChange={(e) => update("lastName", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_role")}</label>
							<select
								value={form.role}
								onChange={(e) => update("role", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							>
								{STAFF_ROLES.map((r) => (
									<option key={r.value} value={r.value}>
										{t(r.labelKey)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_specialty")}</label>
							<input
								value={form.specialty}
								onChange={(e) => update("specialty", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_email")}</label>
							<input
								type="email"
								value={form.email}
								onChange={(e) => update("email", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_phone")}</label>
							<input
								value={form.phone}
								onChange={(e) => update("phone", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_hire_date")}</label>
							<input
								type="date"
								value={form.hireDate}
								onChange={(e) => update("hireDate", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("staff.field_status")}</label>
							<select
								value={form.status}
								onChange={(e) => update("status", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							>
								<option value="active">{t("staff.status_active")}</option>
								<option value="inactive">{t("staff.status_inactive")}</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text">
							{t("common.cancel")}
						</button>
						<button type="submit" disabled={saveStaff.isPending} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-hover disabled:opacity-60">
							<Save size={16} />
							{t("common.save")}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	)
}
