import { useQuery } from "@tanstack/react-query"
import { fetchReportSummary } from "./reportsApi"

export function useReportSummary(period) {
	return useQuery({
		queryKey: ["reports-summary", period],
		queryFn: () => fetchReportSummary({ period }),
	})
}
