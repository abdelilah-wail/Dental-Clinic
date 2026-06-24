import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchXrays, createXray, updateXray, deleteXray } from "./xrayApi"

export function useXrays(filters) {
	return useQuery({
		queryKey: ["xrays", filters],
		queryFn: () => fetchXrays(filters),
	})
}

export function useSaveXray() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload) =>
			payload.id ? updateXray(payload.id, payload.data) : createXray(payload.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["xrays"] }),
	})
}

export function useDeleteXray() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: deleteXray,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["xrays"] }),
	})
}
