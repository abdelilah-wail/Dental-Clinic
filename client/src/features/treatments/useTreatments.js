import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	listTreatments,
	createTreatment,
	updateTreatment,
	deleteTreatment,
} from "./treatmentsApi"

export function useTreatments(params) {
	return useQuery({
		queryKey: ["treatments", params],
		queryFn: () => listTreatments(params),
	})
}

export function useSaveTreatment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input) =>
			input.id ? updateTreatment(input.id, input.data) : createTreatment(input.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
	})
}

export function useDeleteTreatment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: deleteTreatment,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
	})
}
