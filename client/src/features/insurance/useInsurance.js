import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchClaims, createClaim, updateClaim, deleteClaim } from "./insuranceApi"

export function useClaims(filters = {}) {
	return useQuery({
		queryKey: ["insurance-claims", filters],
		queryFn: () => fetchClaims(filters),
	})
}

export function useSaveClaim() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }) => (id ? updateClaim(id, data) : createClaim(data)),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance-claims"] }),
	})
}

export function useDeleteClaim() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id) => deleteClaim(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance-claims"] }),
	})
}
