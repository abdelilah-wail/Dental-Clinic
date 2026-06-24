import {
	useQuery,
	useMutation,
	useQueryClient,
	keepPreviousData,
} from "@tanstack/react-query"
import {
	listPatients,
	getPatient,
	createPatient,
	updatePatient,
	deletePatient,
} from "./patientsApi"

export function usePatients(params) {
	return useQuery({
		queryKey: ["patients", params],
		queryFn: () => listPatients(params),
		placeholderData: keepPreviousData,
	})
}

export function usePatient(id) {
	return useQuery({
		queryKey: ["patient", id],
		queryFn: () => getPatient(id),
		enabled: Boolean(id),
	})
}

export function useSavePatient() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input) =>
			input.id ? updatePatient(input.id, input.data) : createPatient(input.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
	})
}

export function useDeletePatient() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: deletePatient,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
	})
}
