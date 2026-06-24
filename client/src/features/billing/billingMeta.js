// Billing reference data: invoice statuses, payment methods, styles, currency.
export const INVOICE_STATUS = ["draft", "unpaid", "partial", "paid", "cancelled"]

export const INVOICE_STATUS_STYLES = {
	draft: "bg-white/10 text-muted",
	unpaid: "bg-warning/15 text-warning",
	partial: "bg-blue-500/15 text-blue-400",
	paid: "bg-success/15 text-success",
	cancelled: "bg-danger/15 text-danger",
}

export const PAYMENT_METHODS = ["cash", "card", "cheque", "transfer"]

// Format an amount as Algerian dinars.
export function formatDA(amount) {
	const n = Number(amount) || 0
	return n.toLocaleString("fr-FR") + " DA"
}
