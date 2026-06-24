export const REPORT_PERIODS = [
	{ value: "this_month", labelKey: "reports.period_this_month" },
	{ value: "last_month", labelKey: "reports.period_last_month" },
	{ value: "this_year", labelKey: "reports.period_this_year" },
	{ value: "all", labelKey: "reports.period_all" },
]

export function formatDA(amount) {
	const n = Number(amount) || 0
	return n.toLocaleString("fr-DZ") + " DA"
}

export function formatNumber(value) {
	const n = Number(value) || 0
	return n.toLocaleString("fr-DZ")
}

export function periodLabel(value) {
	const found = REPORT_PERIODS.find((p) => p.value === value)
	return found ? found.labelKey : "reports.period_all"
}
