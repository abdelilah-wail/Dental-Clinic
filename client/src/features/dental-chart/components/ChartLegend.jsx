import { useTranslation } from "react-i18next"
import { Eraser } from "lucide-react"
import { CONDITIONS, CONDITION_ORDER } from "../conditions"

function swatchStyle(c) {
	if (c.color === "transparent") return undefined
	return { backgroundColor: c.color }
}

export default function ChartLegend({ active, onPick }) {
	const { t } = useTranslation()

	return (
		<div className="flex flex-wrap gap-2">
			{CONDITION_ORDER.map((key) => {
				const c = CONDITIONS[key]
				const isActive = active === key
				const btnClass =
					"flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors " +
					(isActive
						? "border-accent bg-accent/10 text-text"
						: "border-border text-muted hover:text-text hover:border-accent/60")
				return (
					<button key={key} onClick={() => onPick(key)} className={btnClass}>
						<span
							className="w-3.5 h-3.5 rounded-sm border border-white/20 grid place-items-center"
							style={swatchStyle(c)}
						>
							{c.eraser ? <Eraser size={10} /> : null}
						</span>
						{t(c.key)}
					</button>
				)
			})}
		</div>
	)
}
