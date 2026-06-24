import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	listInvoices,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	addPayment,
} from "./billingApi"

export function useInvoices(params) {
	return useQuery({
		queryKey: ["invoices", params],
		queryFn: () => listInvoices(params),
	})
}

export function useSaveInvoice() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input) =>
			input.id ? updateInvoice(input.id, input.data) : createInvoice(input.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
	})
}

export function useDeleteInvoice() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: deleteInvoice,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
	})
}

export function useAddPayment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input) => addPayment(input.id, input.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
	})
}
