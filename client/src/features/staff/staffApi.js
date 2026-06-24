import { api } from "../../lib/api"

export async function fetchStaff(params = {}) {
	const { data } = await api.get("/staff", { params })
	return data.items || []
}

export async function createStaff(payload) {
	const { data } = await api.post("/staff", payload)
	return data
}

export async function updateStaff(id, payload) {
	const { data } = await api.put(`/staff/${id}`, payload)
	return data
}

export async function deleteStaff(id) {
	const { data } = await api.delete(`/staff/${id}`)
	return data
}
