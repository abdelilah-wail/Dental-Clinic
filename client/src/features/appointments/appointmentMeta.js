// Appointment reference data: types, statuses, and status badge styles.
export const APPOINTMENT_TYPES = [
	"consultation", "checkup", "cleaning", "filling",
	"extraction", "rootCanal", "followup",
]

export const APPOINTMENT_STATUS = [
	"scheduled", "confirmed", "completed", "cancelled", "noShow",
]

// Tailwind classes for each status pill.
export const STATUS_STYLES = {
	scheduled: "bg-accent/15 text-accent",
	confirmed: "bg-blue-500/15 text-blue-400",
	completed: "bg-success/15 text-success",
	cancelled: "bg-danger/15 text-danger",
	noShow: "bg-warning/15 text-warning",
}
