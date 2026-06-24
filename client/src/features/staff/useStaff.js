import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchStaff, createStaff, updateStaff, deleteStaff } from "./staffApi"

export function useStaffList(filters = {}) {
	return useQuery({
		queryKey: ["staff", filters],
		queryFn: () => fetchStaff(filters),
	})
}

export function useSaveStaff() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }) => (id ? updateStaff(id, data) : createStaff(data)),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
	})
}

export function useDeleteStaff() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id) => deleteStaff(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
	})
}
