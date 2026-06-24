import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { X, ChevronLeft, ChevronRight, Trash2, Download } from "lucide-react"
import { xrayTypeLabel, formatDate } from "./xrayMeta"
import { useDeleteXray } from "./useXray"
import { useToast } from "@/providers/ToastProvider"

const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }

export default function XrayLightbox({ images, index, onClose, onNavigate }) {
	const { t } = useTranslation()
	const remove = useDeleteXray()
	const toast = useToast()
	const open = index >= 0 && index < images.length
	const img = open ? images[index] : null

	function prev() {
		onNavigate(index > 0 ? index - 1 : images.length - 1)
	}
	function next() {
		onNavigate(index < images.length - 1 ? index + 1 : 0)
	}
	function onDelete() {
		if (!img) return
		remove.mutate(img.id, {
			onSuccess: () => {
				toast.success(t("xray.title"), t("toast.deleted"))
				onClose()
			},
			onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
		})
	}

	return (
		<AnimatePresence>
			{open && img && (
				<motion.div
					variants={backdrop}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="fixed inset-0 z-40 flex flex-col bg-black/90"
				>
					<div className="flex items-center justify-between p-4 text-white">
						<div>
							<div className="font-medium">{t(xrayTypeLabel(img.type))}</div>
							<div className="text-xs text-white/60">{img.patientName + " · " + formatDate(img.date)}</div>
						</div>
						<div className="flex items-center gap-2">
							<a href={img.imageUrl} download className="rounded-md border border-white/20 p-2 hover:bg-white/10" aria-label={t("xray.download")}>
								<Download size={18} />
							</a>
							<button onClick={onDelete} className="rounded-md border border-white/20 p-2 text-danger hover:bg-white/10" aria-label={t("xray.delete")}>
								<Trash2 size={18} />
							</button>
							<button onClick={onClose} className="rounded-md border border-white/20 p-2 hover:bg-white/10" aria-label={t("xray.close")}>
								<X size={18} />
							</button>
						</div>
					</div>

					<div className="relative flex-1 grid place-items-center px-4 pb-4">
						<button onClick={prev} className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label={t("xray.prev")}>
							<ChevronLeft size={24} className="text-white" />
						</button>
						<img src={img.imageUrl} alt={img.type} className="max-h-full max-w-full object-contain rounded-md" />
						<button onClick={next} className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label={t("xray.next")}>
							<ChevronRight size={24} className="text-white" />
						</button>
					</div>

					{img.notes ? (
						<div className="p-4 text-center text-sm text-white/70 border-t border-white/10">{img.notes}</div>
					) : null}
				</motion.div>
			)}
		</AnimatePresence>
	)
}
