import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { X, Plus, Minus } from "lucide-react"
import { useAdjustStock } from "./useInventory"
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

export default function StockAdjustModal({ item, onClose }) {
	const { t } = useTranslation()
	const adjustStock = useAdjustStock()
	const toast = useToast()
	const [direction, setDirection] = useState("in")
	const [amount, setAmount] = useState(1)
	const [reason, setReason] = useState("")

	function handleSubmit(e) {
		e.preventDefault()
		const qty = Number(amount) || 0
		const delta = direction === "in" ? qty : -qty
		adjustStock.mutate(
			{ id: item.id, data: { delta, reason } },
			{
				onSuccess: () => {
					toast.success(t("inventory.adjust_stock"), t("toast.stockAdjusted"))
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
				className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-text">{t("inventory.adjust_stock")}</h2>
					<button onClick={onClose} className="rounded-md p-1 text-muted transition hover:text-text">
						<X size={18} />
					</button>
				</div>

				<p className="mb-4 text-sm text-muted">
					{item.name} — {item.quantity} {item.unit}
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={() => setDirection("in")}
							className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${direction === "in" ? "border-success bg-success/10 text-success" : "border-border text-muted hover:text-text"}`}
						>
							<Plus size={16} />
							{t("inventory.stock_in")}
						</button>
						<button
							type="button"
							onClick={() => setDirection("out")}
							className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${direction === "out" ? "border-danger bg-danger/10 text-danger" : "border-border text-muted hover:text-text"}`}
						>
							<Minus size={16} />
							{t("inventory.stock_out")}
						</button>
					</div>

					<div>
						<label className="mb-1 block text-sm text-muted">{t("inventory.amount")}</label>
						<input
							type="number"
							min="1"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm text-muted">{t("inventory.reason")}</label>
						<input
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text">
							{t("common.cancel")}
						</button>
						<button type="submit" disabled={adjustStock.isPending} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-hover disabled:opacity-60">
							{t("common.save")}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	)
}
