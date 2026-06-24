import { api } from "../../lib/api"

export async function fetchReportSummary(params = {}) {
	const { data } = await api.get("/reports/summary", { params })
	return data
}
