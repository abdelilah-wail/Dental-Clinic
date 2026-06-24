import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Grid3x3 } from "lucide-react"
import { fadeRise, stagger } from "@/lib/motion"
import { usePatient } from "./usePatients"

function Field({ label, value }) {
	return (
		<div>
			<div className="text-xs text-muted mb-0.5">{label}</div>
			<div className="text-sm">{value || "—"}</div>
		</div>
	)
}

export default function PatientProfilePage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { data: patient, isLoading } = usePatient(id)

	if (isLoading) return <p className="text-muted">{t("common.loading")}</p>
	if (!patient) return <p className="text-muted">{t("patients.notFound")}</p>

	const history = patient.medicalHistory || {}

	return (
		<motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
			<motion.button variants={fadeRise} onClick={() => navigate("/patients")} className="text-sm text-muted hover:text-text transition-colors">
				← {t("patients.backToList")}
			</motion.button>

			<motion.div variants={fadeRise} className="rounded-lg bg-surface border border-border p-6 flex items-center gap-5">
				<div className="w-16 h-16 rounded-full bg-gold/15 text-gold grid place-items-center text-xl font-semibold">
					{patient.firstName ? patient.firstName[0] : "?"}
				</div>
				<div className="flex-1">
					<h1 className="text-xl font-semibold">{patient.firstName} {patient.lastName}</h1>
					<p className="text-muted text-sm">{t("patients.fileNo")}: {patient.fileNumber} · {patient.phone}</p>
				</div>
				<button onClick={() => navigate("/patients/" + id + "/chart")} className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">
					<Grid3x3 size={16} />
					{t("patients.dentalChart")}
				</button>
				<button className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent transition-colors">
					{t("common.edit")}
				</button>
			</motion.div>

			<motion.section variants={fadeRise} className="rounded-lg bg-surface border border-border p-6">
				<h2 className="font-semibold mb-4">{t("patients.demographics")}</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<Field label={t("patients.nin")} value={patient.nin} />
					<Field label={t("patients.dob")} value={patient.dateOfBirth} />
					<Field label={t("patients.gender")} value={patient.gender} />
					<Field label={t("patients.bloodType")} value={patient.bloodType} />
					<Field label={t("patients.wilaya")} value={patient.wilaya} />
					<Field label={t("patients.commune")} value={patient.commune} />
					<Field label={t("patients.insurance")} value={patient.insurance} />
					<Field label={t("patients.emergencyContact")} value={patient.emergencyContact} />
				</div>
			</motion.section>

			<motion.section variants={fadeRise} className="rounded-lg bg-surface border border-border p-6">
				<h2 className="font-semibold mb-4">{t("patients.medicalHistory")}</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					<Field label={t("patients.allergies")} value={history.allergies} />
					<Field label={t("patients.chronic")} value={history.chronicConditions} />
					<Field label={t("patients.medications")} value={history.medications} />
				</div>
			</motion.section>
		</motion.div>
	)
}
