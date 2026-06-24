export const STAFF_ROLES = [
	{ value: "owner", labelKey: "staff.role_owner" },
	{ value: "admin", labelKey: "staff.role_admin" },
	{ value: "dentist", labelKey: "staff.role_dentist" },
	{ value: "assistant", labelKey: "staff.role_assistant" },
	{ value: "receptionist", labelKey: "staff.role_receptionist" },
	{ value: "accountant", labelKey: "staff.role_accountant" },
]

export const STAFF_STATUS = {
	active: { labelKey: "staff.status_active", badge: "bg-success/10 text-success" },
	inactive: { labelKey: "staff.status_inactive", badge: "bg-muted/10 text-muted" },
}

export function roleLabel(value) {
	const found = STAFF_ROLES.find((r) => r.value === value)
	return found ? found.labelKey : "staff.role_assistant"
}

export function fullName(member) {
	return `${member.firstName || ""} ${member.lastName || ""}`.trim()
}

export function initials(member) {
	const f = (member.firstName || "").charAt(0)
	const l = (member.lastName || "").charAt(0)
	return (f + l).toUpperCase()
}

export function formatDate(iso) {
	if (!iso) return "—"
	const d = new Date(iso)
	return d.toLocaleDateString("fr-DZ", { year: "numeric", month: "short", day: "numeric" })
}
