import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { scaleIn } from "@/lib/motion"
import { WILAYAS, BLOOD_TYPES, INSURANCE_PROVIDERS, GENDERS } from "../algeria"
import { useSavePatient } from "../usePatients"
import { useToast } from "@/providers/ToastProvider"

const EMPTY = {
	firstName: "", lastName: "", nin: "", phone: "+213",
	dateOfBirth: "", gender: "male", bloodType: "",
	wilaya: "", commune: "", insurance: "none",
	emergencyContact: "", status: "active",
}

function Input({ label, value, onChange, type = "text", required = false }) {
	return (
		<label className="space-y-1 block">
			<span className="text-sm text-muted">{label}</span>
			<input
				type={type}
				value={value}
				required={required}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
			/>
		</label>
	)
}

function Select({ label, value, onChange, children }) {
	return (
		<label className="space-y-1 block">
			<span className="text-sm text-muted">{label}</span>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
			>
				{children}
			</select>
		</label>
	)
}

export default function PatientFormModal({ open, onClose, initial }) {
	const { t } = useTranslation()
	const save = useSavePatient()
	const toast = useToast()
	const [form, setForm] = useState(initial || EMPTY)

	if (!open) return null

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		const id = initial ? initial.id : null
		save.mutate(
			{ id, data: form },
			{
				onSuccess: () => {
					toast.success(
						t(id ? "patients.editTitle" : "patients.addTitle"),
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
			<motion.form
				variants={scaleIn}
				initial="hidden"
				animate="visible"
				onSubmit={handleSubmit}
				className="w-full max-w-2xl rounded-lg bg-surface border border-border p-6 max-h-[90vh] overflow-y-auto"
			>
				<h2 className="text-lg font-semibold mb-4">
					{initial ? t("patients.editTitle") : t("patients.addTitle")}
				</h2>

				<div className="grid gap-4 sm:grid-cols-2">
					<Input label={t("patients.firstName")} value={form.firstName} onChange={(v) => update("firstName", v)} required />
					<Input label={t("patients.lastName")} value={form.lastName} onChange={(v) => update("lastName", v)} required />
					<Input label={t("patients.nin")} value={form.nin} onChange={(v) => update("nin", v)} />
					<Input label={t("patients.phone")} value={form.phone} onChange={(v) => update("phone", v)} />
					<Input label={t("patients.dob")} type="date" value={form.dateOfBirth} onChange={(v) => update("dateOfBirth", v)} />

					<Select label={t("patients.gender")} value={form.gender} onChange={(v) => update("gender", v)}>
						{GENDERS.map((g) => (
							<option key={g.value} value={g.value}>{t(g.key)}</option>
						))}
					</Select>

					<Select label={t("patients.bloodType")} value={form.bloodType} onChange={(v) => update("bloodType", v)}>
						<option value="">—</option>
						{BLOOD_TYPES.map((b) => (
							<option key={b} value={b}>{b}</option>
						))}
					</Select>

					<Select label={t("patients.wilaya")} value={form.wilaya} onChange={(v) => update("wilaya", v)}>
						<option value="">—</option>
						{WILAYAS.map((w) => (
							<option key={w} value={w}>{w}</option>
						))}
					</Select>

					<Input label={t("patients.commune")} value={form.commune} onChange={(v) => update("commune", v)} />

					<Select label={t("patients.insurance")} value={form.insurance} onChange={(v) => update("insurance", v)}>
						{INSURANCE_PROVIDERS.map((i) => (
							<option key={i.value} value={i.value}>{i.label}</option>
						))}
					</Select>

					<Input label={t("patients.emergencyContact")} value={form.emergencyContact} onChange={(v) => update("emergencyContact", v)} />
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">
						{t("common.cancel")}
					</button>
					<button type="submit" disabled={save.isPending} className="rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm disabled:opacity-60">
						{save.isPending ? t("common.saving") : t("common.save")}
					</button>
				</div>
			</motion.form>
		</div>
	)
}
