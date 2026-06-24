import { api } from "@/lib/api"

export async function listTreatments(params) {
	const { data } = await api.get("/treatments", { params })
	return data // { items }
}

export async function createTreatment(payload) {
	const { data } = await api.post("/treatments", payload)
	return data
}

export async function updateTreatment(id, payload) {
	const { data } = await api.put("/treatments/" + id, payload)
	return data
}

export async function deleteTreatment(id) {
	await api.delete("/treatments/" + id)
}
