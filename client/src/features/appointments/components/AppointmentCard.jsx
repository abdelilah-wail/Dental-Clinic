import { useTranslation } from "react-i18next"
import { User, Stethoscope, Pencil, Trash2 } from "lucide-react"
import { STATUS_STYLES } from "../appointmentMeta"

function statusClass(status) {
	return STATUS_STYLES[status] || "bg-white/10 text-muted"
}

export default function AppointmentCard({ appt, onEdit, onDelete }) {
	const { t } = useTranslation()

	return (
		<div className="rounded-lg bg-surface border border-border p-4 flex items-start gap-4 hover:border-accent/50 transition-colors">
			<div className="flex flex-col items-center justify-center rounded-md bg-bg border border-border px-3 py-2 min-w-[84px]">
				<span className="text-sm font-semibold text-accent">{appt.startTime}</span>
				<span className="text-[11px] text-muted">{appt.endTime}</span>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-medium">{appt.patientName}</span>
					<span className={"px-2 py-0.5 rounded-full text-[11px] " + statusClass(appt.status)}>
						{t("appointments.status_" + appt.status)}
					</span>
				</div>
				<div className="mt-1 flex items-center gap-4 text-xs text-muted flex-wrap">
					<span className="flex items-center gap-1"><Stethoscope size={13} /> {t("appointments.type_" + appt.type)}</span>
					<span className="flex items-center gap-1"><User size={13} /> {appt.dentistName}</span>
				</div>
				{appt.notes ? <p className="mt-2 text-xs text-muted">{appt.notes}</p> : null}
			</div>

			<div className="flex items-center gap-1">
				<button onClick={() => onEdit(appt)} className="w-8 h-8 grid place-items-center rounded-md border border-border text-muted hover:text-text hover:border-accent transition-colors">
					<Pencil size={14} />
				</button>
				<button onClick={() => onDelete(appt)} className="w-8 h-8 grid place-items-center rounded-md border border-border text-danger hover:border-danger transition-colors">
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	)
}
