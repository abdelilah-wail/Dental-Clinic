import { api } from "../../lib/api"

export async function fetchItems(params = {}) {
	const { data } = await api.get("/inventory", { params })
	return data.items || []
}

export async function createItem(payload) {
	const { data } = await api.post("/inventory", payload)
	return data
}

export async function updateItem(id, payload) {
	const { data } = await api.put(`/inventory/${id}`, payload)
	return data
}

export async function deleteItem(id) {
	await api.delete(`/inventory/${id}`)
	return id
}

export async function adjustStock(id, payload) {
	const { data } = await api.post(`/inventory/${id}/adjust`, payload)
	return data
}
