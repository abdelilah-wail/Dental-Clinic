import { createContext, useCallback, useContext, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react"

/* ─── Context ─────────────────────────────────────────────────── */
const ToastContext = createContext(null)

export function useToast() {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
	return ctx
}

/* ─── Icons & accent colors per type ─────────────────────────── */
const CONFIG = {
	success: {
		Icon: CheckCircle2,
		accent: "var(--color-success)",
		glow: "rgba(34,197,94,0.22)",
	},
	error: {
		Icon: XCircle,
		accent: "var(--color-danger)",
		glow: "rgba(239,68,68,0.22)",
	},
	warning: {
		Icon: AlertTriangle,
		accent: "var(--color-warning)",
		glow: "rgba(245,158,11,0.22)",
	},
	info: {
		Icon: Info,
		accent: "var(--color-accent)",
		glow: "rgba(124,92,252,0.22)",
	},
}

/* ─── Single Toast ────────────────────────────────────────────── */
function Toast({ id, type = "info", title, message, onDismiss, duration = 4000 }) {
	const { Icon, accent, glow } = CONFIG[type] || CONFIG.info
	const timerRef = useRef(null)
	const [paused, setPaused] = useState(false)
	const [progress, setProgress] = useState(100)
	const startedAt = useRef(Date.now())
	const remaining = useRef(duration)

	// start / resume countdown
	const startTimer = useCallback(() => {
		clearInterval(timerRef.current)
		const tick = 30
		timerRef.current = setInterval(() => {
			remaining.current -= tick
			setProgress(Math.max(0, (remaining.current / duration) * 100))
			if (remaining.current <= 0) {
				clearInterval(timerRef.current)
				onDismiss(id)
			}
		}, tick)
	}, [duration, id, onDismiss])

	// run on mount
	useState(() => {
		startTimer()
		return () => clearInterval(timerRef.current)
	})

	function handleMouseEnter() {
		clearInterval(timerRef.current)
		setPaused(true)
	}
	function handleMouseLeave() {
		setPaused(false)
		startTimer()
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, x: 60, scale: 0.92 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.18 } }}
			transition={{ type: "spring", stiffness: 380, damping: 32 }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{ "--accent": accent, "--glow": glow }}
			className="toast-item"
		>
			{/* glow orb */}
			<span className="toast-glow" />

			{/* icon */}
			<span className="toast-icon-wrap">
				<Icon size={18} strokeWidth={2.2} style={{ color: accent }} />
			</span>

			{/* text */}
			<div className="toast-body">
				{title && <p className="toast-title">{title}</p>}
				{message && <p className="toast-message">{message}</p>}
			</div>

			{/* close */}
			<button className="toast-close" onClick={() => onDismiss(id)} aria-label="Close">
				<X size={14} />
			</button>

			{/* progress bar */}
			<span
				className="toast-progress"
				style={{
					width: `${progress}%`,
					background: accent,
					transition: paused ? "none" : "width 30ms linear",
				}}
			/>
		</motion.div>
	)
}

/* ─── Container ───────────────────────────────────────────────── */
function ToastContainer({ toasts, dismiss }) {
	return (
		<div className="toast-container" aria-live="polite" aria-atomic="false">
			<AnimatePresence mode="sync">
				{toasts.map((t) => (
					<Toast key={t.id} {...t} onDismiss={dismiss} />
				))}
			</AnimatePresence>
		</div>
	)
}

/* ─── Provider ────────────────────────────────────────────────── */
let _id = 0

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([])

	const dismiss = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	const toast = useCallback(
		(type, title, message, opts = {}) => {
			const id = ++_id
			setToasts((prev) => [...prev, { id, type, title, message, ...opts }])
		},
		[],
	)

	// Convenience helpers
	const success = useCallback((title, message, opts) => toast("success", title, message, opts), [toast])
	const error = useCallback((title, message, opts) => toast("error", title, message, opts), [toast])
	const warning = useCallback((title, message, opts) => toast("warning", title, message, opts), [toast])
	const info = useCallback((title, message, opts) => toast("info", title, message, opts), [toast])

	return (
		<ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
			{children}
			<ToastContainer toasts={toasts} dismiss={dismiss} />
		</ToastContext.Provider>
	)
}
