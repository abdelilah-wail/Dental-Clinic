export const ITEM_CATEGORIES = [
	{ value: "consumables", labelKey: "inventory.cat_consumables" },
	{ value: "instruments", labelKey: "inventory.cat_instruments" },
	{ value: "medications", labelKey: "inventory.cat_medications" },
	{ value: "ppe", labelKey: "inventory.cat_ppe" },
	{ value: "other", labelKey: "inventory.cat_other" },
]

export const UNITS = ["unit", "box", "pack", "bottle", "tube", "pair"]

export const STOCK_STATUS = {
	in_stock: { labelKey: "inventory.status_in_stock", badge: "bg-success/10 text-success" },
	low: { labelKey: "inventory.status_low", badge: "bg-warning/10 text-warning" },
	out: { labelKey: "inventory.status_out", badge: "bg-danger/10 text-danger" },
}

export function stockStatus(item) {
	const qty = Number(item.quantity) || 0
	const reorder = Number(item.reorderLevel) || 0
	if (qty <= 0) return "out"
	if (qty <= reorder) return "low"
	return "in_stock"
}

export function categoryLabel(value) {
	const found = ITEM_CATEGORIES.find((c) => c.value === value)
	return found ? found.labelKey : "inventory.cat_other"
}

export function formatDA(amount) {
	const n = Number(amount) || 0
	return n.toLocaleString("fr-DZ") + " DA"
}
