import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function StatusBadge({ status }) {
	const map = {
		active: "bg-success/15 text-success",
		inactive: "bg-warning/15 text-warning",
		archived: "bg-white/10 text-muted",
	}
	const cls = map[status] || "bg-white/10 text-muted"
	return <span className={"px-2 py-0.5 rounded-full text-xs " + cls}>{status}</span>
}

export default function PatientTable({ items }) {
	const navigate = useNavigate()
	const { t } = useTranslation()

	if (!items || items.length === 0) {
		return <p className="text-muted text-sm py-8 text-center">{t("patients.empty")}</p>
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="text-muted border-b border-border">
						<th className="text-start font-medium py-3 px-3">{t("patients.name")}</th>
						<th className="text-start font-medium py-3 px-3">{t("patients.phone")}</th>
						<th className="text-start font-medium py-3 px-3">{t("patients.wilaya")}</th>
						<th className="text-start font-medium py-3 px-3">{t("patients.insurance")}</th>
						<th className="text-start font-medium py-3 px-3">{t("patients.status")}</th>
					</tr>
				</thead>
				<tbody>
					{items.map((p) => (
						<tr
							key={p.id}
							onClick={() => navigate("/patients/" + p.id)}
							className="border-b border-border/60 cursor-pointer hover:bg-white/5 transition-colors"
						>
							<td className="py-3 px-3 font-medium">{p.firstName} {p.lastName}</td>
							<td className="py-3 px-3 text-muted">{p.phone}</td>
							<td className="py-3 px-3 text-muted">{p.wilaya}</td>
							<td className="py-3 px-3 text-muted uppercase">{p.insurance}</td>
							<td className="py-3 px-3"><StatusBadge status={p.status} /></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
