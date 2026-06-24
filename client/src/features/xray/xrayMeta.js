// Radiograph image types + small display helpers (no backend dependency).
export const XRAY_TYPES = [
	{ value: "panoramic", labelKey: "xray.type_panoramic" },
	{ value: "periapical", labelKey: "xray.type_periapical" },
	{ value: "bitewing", labelKey: "xray.type_bitewing" },
	{ value: "occlusal", labelKey: "xray.type_occlusal" },
	{ value: "cephalometric", labelKey: "xray.type_cephalometric" },
	{ value: "cbct", labelKey: "xray.type_cbct" },
]

export function xrayTypeLabel(value) {
	const found = XRAY_TYPES.find((it) => it.value === value)
	return found ? found.labelKey : value
}

export function formatDate(value) {
	if (!value) return "—"
	const d = new Date(value)
	if (isNaN(d.getTime())) return value
	return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}
