import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Package, PackagePlus, Pencil, Trash2, ArrowUpDown, AlertTriangle } from "lucide-react"
import { useItems, useDeleteItem } from "./useInventory"
import { useToast } from "@/providers/ToastProvider"
import { ITEM_CATEGORIES, STOCK_STATUS, stockStatus, categoryLabel, formatDA } from "./inventoryMeta"
import InventoryItemModal from "./InventoryItemModal"
import StockAdjustModal from "./StockAdjustModal"

const listVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const rowVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0 },
}

export default function InventoryPage() {
	const { t } = useTranslation()
	const toast = useToast()
	const [category, setCategory] = useState("")
	const [status, setStatus] = useState("")
	const [search, setSearch] = useState("")
	const [editing, setEditing] = useState(null)
	const [adjusting, setAdjusting] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)

	const filters = {}
	if (category) filters.category = category
	if (status) filters.status = status
	if (search) filters.search = search

	const { data: items = [], isLoading } = useItems(filters)
	const deleteItem = useDeleteItem()

	const kpis = useMemo(() => {
		let value = 0
		let low = 0
		let out = 0
		for (const item of items) {
			value += (Number(item.quantity) || 0) * (Number(item.unitCost) || 0)
			const st = stockStatus(item)
			if (st === "low") low += 1
			if (st === "out") out += 1
		}
		return { count: items.length, value, low, out }
	}, [items])

	function openCreate() {
		setEditing(null)
		setModalOpen(true)
	}

	function openEdit(item) {
		setEditing(item)
		setModalOpen(true)
	}

	function handleDelete(item) {
		if (window.confirm(t("inventory.confirm_delete"))) {
			deleteItem.mutate(item.id, {
				onSuccess: () => toast.success(t("inventory.title"), t("toast.deleted")),
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			})
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-text">{t("inventory.title")}</h1>
				<button
					onClick={openCreate}
					className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-hover"
				>
					<PackagePlus size={16} />
					{t("inventory.new_item")}
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard icon={Package} label={t("inventory.total_items")} value={kpis.count} />
				<KpiCard icon={AlertTriangle} label={t("inventory.low_stock")} value={kpis.low} tone="warning" />
				<KpiCard icon={AlertTriangle} label={t("inventory.out_of_stock")} value={kpis.out} tone="danger" />
				<KpiCard icon={Package} label={t("inventory.stock_value")} value={formatDA(kpis.value)} />
			</div>

			<div className="flex flex-wrap gap-3">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t("inventory.search")}
					className="w-56 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
				/>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
				>
					<option value="">{t("inventory.all_categories")}</option>
					{ITEM_CATEGORIES.map((c) => (
						<option key={c.value} value={c.value}>
							{t(c.labelKey)}
						</option>
					))}
				</select>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
				>
					<option value="">{t("inventory.all_statuses")}</option>
					<option value="in_stock">{t("inventory.status_in_stock")}</option>
					<option value="low">{t("inventory.status_low")}</option>
					<option value="out">{t("inventory.status_out")}</option>
				</select>
			</div>

			<div className="overflow-hidden rounded-xl border border-border bg-surface">
				<table className="w-full text-start text-sm">
					<thead className="border-b border-border text-muted">
						<tr>
							<th className="px-4 py-3 font-medium">{t("inventory.col_name")}</th>
							<th className="px-4 py-3 font-medium">{t("inventory.col_category")}</th>
							<th className="px-4 py-3 font-medium">{t("inventory.col_quantity")}</th>
							<th className="px-4 py-3 font-medium">{t("inventory.col_cost")}</th>
							<th className="px-4 py-3 font-medium">{t("inventory.col_status")}</th>
							<th className="px-4 py-3 text-end font-medium">{t("inventory.col_actions")}</th>
						</tr>
					</thead>
					<motion.tbody variants={listVariants} initial="hidden" animate="visible">
						{items.map((item) => {
							const st = stockStatus(item)
							const badge = STOCK_STATUS[st]
							return (
								<motion.tr key={item.id} variants={rowVariants} className="border-b border-border/50">
									<td className="px-4 py-3 text-text">
										<div className="font-medium">{item.name}</div>
										<div className="text-xs text-muted">{item.sku}</div>
									</td>
									<td className="px-4 py-3 text-muted">{t(categoryLabel(item.category))}</td>
									<td className="px-4 py-3 text-text">
										{item.quantity} {item.unit}
									</td>
									<td className="px-4 py-3 text-muted">{formatDA(item.unitCost)}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.badge}`}>
											{t(badge.labelKey)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-2">
											<button onClick={() => setAdjusting(item)} className="rounded-md p-1.5 text-muted transition hover:bg-bg hover:text-accent" title={t("inventory.adjust")}>
												<ArrowUpDown size={16} />
											</button>
											<button onClick={() => openEdit(item)} className="rounded-md p-1.5 text-muted transition hover:bg-bg hover:text-accent">
												<Pencil size={16} />
											</button>
											<button onClick={() => handleDelete(item)} className="rounded-md p-1.5 text-muted transition hover:bg-bg hover:text-danger">
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</motion.tr>
							)
						})}
					</motion.tbody>
				</table>
				{!isLoading && items.length === 0 && (
					<div className="px-4 py-10 text-center text-sm text-muted">{t("inventory.empty")}</div>
				)}
			</div>

			<AnimatePresence>
				{modalOpen && <InventoryItemModal item={editing} onClose={() => setModalOpen(false)} />}
				{adjusting && <StockAdjustModal item={adjusting} onClose={() => setAdjusting(null)} />}
			</AnimatePresence>
		</div>
	)
}

function KpiCard({ icon: Icon, label, value, tone }) {
	const toneClass =
		tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : "text-accent"
	return (
		<div className="rounded-xl border border-border bg-surface p-4">
			<div className="flex items-center gap-2 text-muted">
				<Icon size={16} className={toneClass} />
				<span className="text-sm">{label}</span>
			</div>
			<div className="mt-2 text-2xl font-semibold text-text">{value}</div>
		</div>
	)
}
