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
	const perms = ROLE_PERMISSIONS[role] || []
	for (const p of perms) {
		if (p === "*") return true
		if (p === permission) return true
		if (p.endsWith(".*") && permission.startsWith(p.slice(0, -1))) return true
	}
	return false
}
