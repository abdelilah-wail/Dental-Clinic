import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { scaleIn } from "@/lib/motion"
import { XRAY_TYPES } from "./xrayMeta"
import { useSaveXray } from "./useXray"
import { useToast } from "@/providers/ToastProvider"

const EMPTY = { patientId: "", type: "panoramic", date: "", imageUrl: "", fileObj: null, notes: "" }

const overlayFade = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }

export default function XrayUploadModal({ open, onClose, patients, defaultPatientId }) {
	const { t } = useTranslation()
	const save = useSaveXray()
	const toast = useToast()
	const [form, setForm] = useState(EMPTY)

	useEffect(() => {
		if (open) {
			const today = new Date().toISOString().slice(0, 10)
			setForm(Object.assign({}, EMPTY, { date: today, patientId: defaultPatientId || "" }))
		}
	}, [open, defaultPatientId])

	function set(key, value) {
		setForm((prev) => Object.assign({}, prev, { [key]: value }))
	}

	function onFile(e) {
		const file = e.target.files && e.target.files[0]
		if (file) {
			set("imageUrl", URL.createObjectURL(file))
			set("fileObj", file)
		}
	}

	function onSubmit(e) {
		e.preventDefault()
		const patient = patients.find((p) => p.id === form.patientId)
		const patientName = patient ? patient.firstName + " " + patient.lastName : ""
		const data = Object.assign({}, form, { patientName })
		save.mutate(
			{ data },
			{
				onSuccess: () => {
					toast.success(t("xray.addTitle"), t("toast.created"))
					onClose()
				},
				onError: () => toast.error(t("toast.errorTitle"), t("toast.errorMsg")),
			},
		)
	}

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					variants={overlayFade}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4"
				>
					<motion.form
						variants={scaleIn}
						initial="hidden"
						animate="visible"
						onSubmit={onSubmit}
						className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 space-y-4"
					>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">{t("xray.addTitle")}</h2>
							<button type="button" onClick={onClose} className="text-muted hover:text-text">
								<X size={18} />
							</button>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
							<label className="space-y-1.5 text-sm">
								<span className="text-muted">{t("xray.patient")}</span>
								<select
									value={form.patientId}
									onChange={(e) => set("patientId", e.target.value)}
									required
									className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
								>
									<option value="">{t("xray.selectPatient")}</option>
									{patients.map((p) => (
										<option key={p.id} value={p.id}>
											{p.firstName + " " + p.lastName}
										</option>
									))}
								</select>
							</label>

							<label className="space-y-1.5 text-sm">
								<span className="text-muted">{t("xray.type")}</span>
								<select
									value={form.type}
									onChange={(e) => set("type", e.target.value)}
									className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
								>
									{XRAY_TYPES.map((it) => (
										<option key={it.value} value={it.value}>
											{t(it.labelKey)}
										</option>
									))}
								</select>
							</label>

							<label className="space-y-1.5 text-sm">
								<span className="text-muted">{t("xray.date")}</span>
								<input
									type="date"
									value={form.date}
									onChange={(e) => set("date", e.target.value)}
									className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
								/>
							</label>

							<label className="space-y-1.5 text-sm">
								<span className="text-muted">{t("xray.imageUrl")}</span>
								<input
									type="url"
									value={form.imageUrl}
									onChange={(e) => set("imageUrl", e.target.value)}
									placeholder="https://..."
									className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
								/>
							</label>
						</div>

						<label className="flex items-center gap-2 text-sm text-accent cursor-pointer">
							<Upload size={16} />
							<span>{t("xray.uploadFile")}</span>
							<input type="file" accept="image/*" onChange={onFile} className="hidden" />
						</label>

						{form.imageUrl ? (
							<div className="rounded-md overflow-hidden border border-border bg-black/40 aspect-video grid place-items-center">
								<img src={form.imageUrl} alt="preview" className="max-h-full max-w-full object-contain" />
							</div>
						) : (
							<div className="rounded-md border border-dashed border-border aspect-video grid place-items-center text-muted">
								<ImageIcon size={28} />
							</div>
						)}

						<label className="space-y-1.5 text-sm block">
							<span className="text-muted">{t("xray.notes")}</span>
							<textarea
								value={form.notes}
								onChange={(e) => set("notes", e.target.value)}
								rows={2}
								className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
							/>
						</label>

						<div className="flex justify-end gap-2 pt-2">
							<button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-white/5">
								{t("xray.cancel")}
							</button>
							<button
								type="submit"
								disabled={save.isPending || !form.fileObj}
								className="rounded-md bg-accent text-primary font-medium px-4 py-2 text-sm hover:bg-accent-hover disabled:opacity-60"
							>
								{t("xray.save")}
							</button>
						</div>
					</motion.form>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
