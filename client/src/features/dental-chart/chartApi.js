import { api } from "@/lib/api"

export async function getDentalChart(patientId) {
	const { data } = await api.get("/charts/" + patientId)
	return data // { teeth }
}

export async function saveDentalChart(patientId, teeth) {
	const { data } = await api.put("/charts/" + patientId, { teeth })
	return data
}
