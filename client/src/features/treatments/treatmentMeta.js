// Treatment reference data: procedure catalog, statuses, badge styles, currency.
export const PROCEDURES = [
	{ code: "exam", price: 1500 },
	{ code: "cleaning", price: 3000 },
	{ code: "filling", price: 4500 },
	{ code: "extraction", price: 5000 },
	{ code: "rootCanal", price: 12000 },
	{ code: "crown", price: 25000 },
	{ code: "whitening", price: 15000 },
	{ code: "implant", price: 80000 },
]

export const TREATMENT_STATUS = ["planned", "inProgress", "completed", "cancelled"]

export const TREATMENT_STATUS_STYLES = {
	planned: "bg-accent/15 text-accent",
	inProgress: "bg-blue-500/15 text-blue-400",
	completed: "bg-success/15 text-success",
	cancelled: "bg-danger/15 text-danger",
}

// Default catalog price for a procedure code.
export function priceFor(code) {
	const found = PROCEDURES.find((p) => p.code === code)
	return found ? found.price : 0
}

// Format an amount as Algerian dinars.
export function formatDA(amount) {
	const n = Number(amount) || 0
	return n.toLocaleString("fr-FR") + " DA"
}
