import { useTranslation } from "react-i18next"
import { UPPER_ARCH, LOWER_ARCH } from "../toothData"
import Tooth from "./Tooth"

export default function Odontogram({ chart, selected, onSelectSurface, onSelectTooth }) {
	const { t } = useTranslation()

	function row(ids) {
		return (
			<div className="flex gap-1 justify-center flex-wrap">
				{ids.map((tid) => (
					<Tooth
						key={tid}
						id={tid}
						tooth={chart[tid]}
						selected={selected === tid}
						onSelectSurface={onSelectSurface}
						onSelectTooth={onSelectTooth}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="space-y-6 rounded-lg bg-surface border border-border p-5 overflow-x-auto">
			<div>
				<div className="text-xs text-muted mb-3 text-center">{t("chart.upper")}</div>
				{row(UPPER_ARCH)}
			</div>
			<div className="h-px bg-border" />
			<div>
				{row(LOWER_ARCH)}
				<div className="text-xs text-muted mt-3 text-center">{t("chart.lower")}</div>
			</div>
		</div>
	)
}
