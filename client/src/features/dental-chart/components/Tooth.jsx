import { CONDITIONS } from "../conditions"

// Geometry for the 5 surfaces inside a 40×40 tooth box.
const POLYS = {
	buccal:   "0,0 40,0 28,12 12,12",
	distal:   "40,0 40,40 28,28 28,12",
	lingual:  "0,40 40,40 28,28 12,28",
	mesial:   "0,0 0,40 12,28 12,12",
	occlusal: "12,12 28,12 28,28 12,28",
}
const SURFACE_KEYS = ["buccal", "distal", "lingual", "mesial", "occlusal"]

export default function Tooth({ id, tooth, selected, onSelectSurface, onSelectTooth }) {
	const data = tooth || null
	const whole = data ? data.whole : null
	const wholeColor = whole ? CONDITIONS[whole].color : null
	const isMissing = Boolean(whole && CONDITIONS[whole].missing)

	function fillFor(surface) {
		if (wholeColor && !isMissing) return wholeColor
		const key = data ? data.surfaces[surface] : null
		return key ? CONDITIONS[key].color : "transparent"
	}

	const svgClass =
		"w-10 h-10 cursor-pointer rounded-sm " + (selected ? "ring-2 ring-accent" : "")

	return (
		<div className="flex flex-col items-center gap-1">
			<svg viewBox="0 0 40 40" className={svgClass}>
				{SURFACE_KEYS.map((s) => (
					<polygon
						key={s}
						points={POLYS[s]}
						fill={fillFor(s)}
						stroke="rgba(148,163,184,0.45)"
						strokeWidth="0.8"
						onClick={(e) => {
							e.stopPropagation()
							onSelectSurface(id, s)
						}}
					/>
				))}
				{isMissing && (
					<g stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
						<line x1="6" y1="6" x2="34" y2="34" />
						<line x1="34" y1="6" x2="6" y2="34" />
					</g>
				)}
			</svg>
			<button
				onClick={() => onSelectTooth(id)}
				className={
					"text-[10px] tabular-nums " +
					(selected ? "text-accent font-semibold" : "text-muted hover:text-text")
				}
			>
				{id}
			</button>
		</div>
	)
}
