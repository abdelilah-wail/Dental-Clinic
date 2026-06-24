// Dental condition catalog. `whole: true` covers the entire tooth
// (otherwise the condition is painted on a single surface).
export const CONDITIONS = {
	healthy:    { key: "chart.cond.healthy",    color: "transparent", whole: false, eraser: true },
	caries:     { key: "chart.cond.caries",     color: "#ef4444", whole: false },
	filling:    { key: "chart.cond.filling",    color: "#3b82f6", whole: false },
	sealant:    { key: "chart.cond.sealant",    color: "#22d3ee", whole: false },
	crown:      { key: "chart.cond.crown",      color: "#d4af37", whole: true },
	rootCanal:  { key: "chart.cond.rootCanal",  color: "#f59e0b", whole: true },
	implant:    { key: "chart.cond.implant",    color: "#10b981", whole: true },
	extraction: { key: "chart.cond.extraction", color: "#64748b", whole: true, missing: true },
}

export const CONDITION_ORDER = [
	"healthy", "caries", "filling", "sealant",
	"crown", "rootCanal", "implant", "extraction",
]

export const SURFACES = ["mesial", "occlusal", "distal", "buccal", "lingual"]

export function emptyTooth() {
	return {
		whole: null,
		surfaces: { mesial: null, distal: null, buccal: null, lingual: null, occlusal: null },
		note: "",
	}
}
