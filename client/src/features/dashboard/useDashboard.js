import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "./dashboardApi"

// Mock fallback so the dashboard renders before the API exists.
const MOCK = {
	revenue: { value: "1 240 000 DA", delta: 12 },
	appointments: { value: 18, delta: 4 },
	patients: { value: 1284, delta: 7 },
	invoices: { value: 6, delta: -2 },
}

export function useDashboard() {
	return useQuery({
		queryKey: ["dashboard", "stats"],
		queryFn: fetchDashboardStats,
		placeholderData: MOCK,
		retry: false,
	})
}
