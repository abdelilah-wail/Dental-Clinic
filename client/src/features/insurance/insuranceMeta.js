export const INSURANCE_PROVIDERS = [
	{ value: "cnas", label: "CNAS", description: "Caisse Nationale des Assurances Sociales des travailleurs salariés" },
	{ value: "casnos", label: "CASNOS", description: "Caisse Nationale de Sécurité Sociale des Non-Salariés" },
	{ value: "private", label: "Private / Mutuelle", description: "Private or complementary insurance" },
	{ value: "none", label: "Self-pay", description: "No insurance coverage" },
]

export const CLAIM_STATUSES = [
	{ value: "draft", label: "Draft" },
	{ value: "submitted", label: "Submitted" },
	{ value: "approved", label: "Approved" },
	{ value: "rejected", label: "Rejected" },
	{ value: "paid", label: "Paid" },
]

export const STATUS_BADGE = {
	draft: "bg-muted/10 text-muted",
	submitted: "bg-warning/10 text-warning",
	approved: "bg-success/10 text-success",
	rejected: "bg-danger/10 text-danger",
	paid: "bg-success/10 text-success",
}

export function providerLabel(value) {
	const found = INSURANCE_PROVIDERS.find((p) => p.value === value)
	return found ? found.label : value
}

export function formatDate(value) {
	if (!value) return "—"
	return new Date(value).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDA(amount) {
	const n = Number(amount) || 0
	return n.toLocaleString("fr-DZ") + " DA"
}
