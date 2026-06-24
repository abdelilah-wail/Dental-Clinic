// Role -> permission map. Mirrors the frontend src/lib/roles.js so the
// server enforces exactly what the UI offers.

export const ROLE_PERMISSIONS = {
	owner: ["*"],
	admin: ["*"],
	dentist: [
		"patients.*",
		"appointments.*",
		"treatments.*",
		"charts.*",
		"xray.read",
		"xray.write",
		"inventory.read",
	],
	assistant: [
		"patients.read",
		"appointments.read",
		"charts.read",
		"xray.read",
		"inventory.read",
		"inventory.write",
	],
	receptionist: [
		"patients.*",
		"appointments.*",
		"billing.read",
		"insurance.read",
		"inventory.read",
	],
	accountant: [
		"billing.*",
		"reports.read",
		"insurance.read",
		"insurance.write",
		"inventory.read",
	],
}

export function hasPermission(role, permission) {
	const grants = ROLE_PERMISSIONS[role] || []
	if (grants.includes("*")) return true
	if (grants.includes(permission)) return true
	// prefix wildcard, e.g. "patients.*" grants "patients.read"
	const prefix = permission.split(".")[0] + ".*"
	return grants.includes(prefix)
}
