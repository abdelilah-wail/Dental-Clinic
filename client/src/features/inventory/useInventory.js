import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchItems, createItem, updateItem, deleteItem, adjustStock } from "./inventoryApi"

export function useItems(filters = {}) {
	return useQuery({
		queryKey: ["inventory-items", filters],
		queryFn: () => fetchItems(filters),
	})
}

export function useSaveItem() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }) => (id ? updateItem(id, data) : createItem(data)),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory-items"] }),
	})
}

export function useDeleteItem() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id) => deleteItem(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory-items"] }),
	})
}

export function useAdjustStock() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }) => adjustStock(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory-items"] }),
	})
}
