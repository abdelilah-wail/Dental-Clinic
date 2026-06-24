import { api } from "../../lib/api"

export async function fetchClaims(filters = {}) {
	const params = {}
	if (filters.provider) params.provider = filters.provider
	if (filters.status) params.status = filters.status
	if (filters.patientId) params.patientId = filters.patientId
	const { data } = await api.get("/insurance", { params })
	return data.items || []
}

export async function createClaim(payload) {
	const { data } = await api.post("/insurance", payload)
	return data
}

export async function updateClaim(id, payload) {
	const { data } = await api.put(`/insurance/${id}`, payload)
	return data
}

export async function deleteClaim(id) {
	await api.delete(`/insurance/${id}`)
	return id
}
