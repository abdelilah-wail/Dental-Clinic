import { api } from "@/lib/api"

export async function fetchDashboardStats() {
	const { data } = await api.get("/reports")
	// Map backend report summary to the KPI shape expected by DashboardPage
	return {
		revenue: {
			value: data.revenue?.collected != null
				? Math.round(data.revenue.collected).toLocaleString("fr-DZ") + " DA"
				: "—",
			delta: 12,
		},
		appointments: {
			value: data.appointments?.total ?? "—",
			delta: 4,
		},
		patients: {
			value: data.patients?.total ?? "—",
			delta: 7,
		},
		invoices: {
			value: data.revenue?.outstanding != null
				? Math.round(data.revenue.outstanding).toLocaleString("fr-DZ") + " DA"
				: "—",
			delta: -2,
		},
	}
}
