import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { X, Save } from "lucide-react"
import { useSaveItem } from "./useInventory"
import { ITEM_CATEGORIES, UNITS } from "./inventoryMeta"
import { useToast } from "@/providers/ToastProvider"

const backdrop = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
}

const panel = {
	hidden: { opacity: 0, y: 24, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: 24, scale: 0.98 },
}

const EMPTY = {
	name: "",
	sku: "",
	category: "consumables",
	quantity: 0,
	unit: "unit",
	reorderLevel: 5,
	unitCost: 0,
	supplier: "",
	notes: "",
}

export default function InventoryItemModal({ item, onClose }) {
	const { t } = useTranslation()
	const saveItem = useSaveItem()
	const toast = useToast()
	const [form, setForm] = useState(item ? { ...EMPTY, ...item } : EMPTY)

	function update(field, value) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		const payload = {
			...form,
			quantity: Number(form.quantity) || 0,
			reorderLevel: Number(form.reorderLevel) || 0,
			unitCost: Number(form.unitCost) || 0,
		}
		saveItem.mutate(
			{ id: item ? item.id : undefined, data: payload },
			{
				onSuccess: () => {
					toast.success(
						t(item ? "inventory.edit_item" : "inventory.new_item"),
						t(item ? "toast.updated" : "toast.created"),
					)
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<motion.div
			variants={backdrop}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<motion.div
				variants={panel}
				className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-text">
						{item ? t("inventory.edit_item") : t("inventory.new_item")}
					</h2>
					<button onClick={onClose} className="rounded-md p-1 text-muted transition hover:text-text">
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm text-muted">{t("inventory.field_name")}</label>
						<input
							required
							value={form.name}
							onChange={(e) => update("name", e.target.value)}
							className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_sku")}</label>
							<input
								value={form.sku}
								onChange={(e) => update("sku", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_category")}</label>
							<select
								value={form.category}
								onChange={(e) => update("category", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							>
								{ITEM_CATEGORIES.map((c) => (
									<option key={c.value} value={c.value}>
										{t(c.labelKey)}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.col_quantity")}</label>
							<input
								type="number"
								value={form.quantity}
								onChange={(e) => update("quantity", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_unit")}</label>
							<select
								value={form.unit}
								onChange={(e) => update("unit", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							>
								{UNITS.map((u) => (
									<option key={u} value={u}>
										{t("inventory.unit_" + u)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_reorder")}</label>
							<input
								type="number"
								value={form.reorderLevel}
								onChange={(e) => update("reorderLevel", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_unit_cost")}</label>
							<input
								type="number"
								value={form.unitCost}
								onChange={(e) => update("unitCost", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-muted">{t("inventory.field_supplier")}</label>
							<input
								value={form.supplier}
								onChange={(e) => update("supplier", e.target.value)}
								className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label className="mb-1 block text-sm text-muted">{t("inventory.field_notes")}</label>
						<textarea
							rows={2}
							value={form.notes}
							onChange={(e) => update("notes", e.target.value)}
							className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text">
							{t("common.cancel")}
						</button>
						<button type="submit" disabled={saveItem.isPending} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-hover disabled:opacity-60">
							<Save size={16} />
							{t("common.save")}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	)
}
