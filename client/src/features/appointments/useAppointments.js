import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	listAppointments,
	createAppointment,
	updateAppointment,
	deleteAppointment,
	listDentists,
} from "./appointmentsApi"

export function useAppointments(params) {
	return useQuery({
		queryKey: ["appointments", params],
		queryFn: () => listAppointments(params),
	})
}

export function useDentists() {
	return useQuery({
		queryKey: ["dentists"],
		queryFn: listDentists,
	})
}

export function useSaveAppointment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input) =>
			input.id ? updateAppointment(input.id, input.data) : createAppointment(input.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
	})
}

export function useDeleteAppointment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: deleteAppointment,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
	})
}
