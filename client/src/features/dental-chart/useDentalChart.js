import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDentalChart, saveDentalChart } from "./chartApi"

export function useDentalChart(patientId) {
	return useQuery({
		queryKey: ["dental-chart", patientId],
		queryFn: () => getDentalChart(patientId),
		enabled: Boolean(patientId),
	})
}

export function useSaveDentalChart(patientId) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (teeth) => saveDentalChart(patientId, teeth),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["dental-chart", patientId] }),
	})
}
