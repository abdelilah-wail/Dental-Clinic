import { useTranslation } from "react-i18next"
import { X, Trash2 } from "lucide-react"
import { CONDITIONS, SURFACES } from "../conditions"

function dotStyle(key) {
	if (!key) return undefined
	return { backgroundColor: CONDITIONS[key].color }
}

export default function ToothPanel({ toothId, tooth, onClose, onClear, onNote }) {
	const { t } = useTranslation()

	if (!toothId) {
		return (
			<div className="rounded-lg bg-surface border border-border p-5 text-sm text-muted">
				{t("chart.selectHint")}
			</div>
		)
	}

	const data = tooth || { whole: null, surfaces: {}, note: "" }

	return (
		<div className="rounded-lg bg-surface border border-border p-5 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">{t("chart.tooth")} {toothId}</h3>
				<button onClick={onClose} className="text-muted hover:text-text">
					<X size={16} />
				</button>
			</div>

			<div className="space-y-2">
				<div className="text-xs text-muted">{t("chart.surfaces")}</div>
				{SURFACES.map((s) => {
					const key = data.surfaces ? data.surfaces[s] : null
					return (
						<div key={s} className="flex items-center justify-between text-sm">
							<span>{t("chart.surface." + s)}</span>
							<span className="flex items-center gap-2">
								<span className="w-3 h-3 rounded-sm border border-white/20" style={dotStyle(key)} />
								<span className="text-muted">{key ? t(CONDITIONS[key].key) : "—"}</span>
							</span>
						</div>
					)
				})}
			</div>

			{data.whole && (
				<div className="flex items-center justify-between text-sm">
					<span>{t("chart.wholeTooth")}</span>
					<span className="text-muted">{t(CONDITIONS[data.whole].key)}</span>
				</div>
			)}

			<label className="block space-y-1">
				<span className="text-xs text-muted">{t("chart.note")}</span>
				<textarea
					value={data.note || ""}
					onChange={(e) => onNote(toothId, e.target.value)}
					rows={3}
					className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
				/>
			</label>

			<button
				onClick={() => onClear(toothId)}
				className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-danger hover:border-danger transition-colors"
			>
				<Trash2 size={14} />
				{t("chart.clearTooth")}
			</button>
		</div>
	)
}
