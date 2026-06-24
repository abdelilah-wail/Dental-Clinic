import { api } from "@/lib/api"

function computeEndTime(startTime, duration) {
	if (!startTime) return ""
	const parts = startTime.split(":")
	if (parts.length < 2) return ""
	const hours = parseInt(parts[0], 10)
	const minutes = parseInt(parts[1], 10)
	const date = new Date()
	date.setHours(hours)
	date.setMinutes(minutes + (duration || 0))
	const h = String(date.getHours()).padStart(2, "0")
	const m = String(date.getMinutes()).padStart(2, "0")
	return `${h}:${m}`
}

function computeDuration(startTime, endTime) {
	if (!startTime || !endTime) return 30
	const partsStart = startTime.split(":")
	const partsEnd = endTime.split(":")
	if (partsStart.length < 2 || partsEnd.length < 2) return 30
	const sh = parseInt(partsStart[0], 10)
	const sm = parseInt(partsStart[1], 10)
	const eh = parseInt(partsEnd[0], 10)
	const em = parseInt(partsEnd[1], 10)
	const diff = (eh * 60 + em) - (sh * 60 + sm)
	return diff > 0 ? diff : 30
}

function mapAppointmentFromServer(appt) {
	if (!appt) return appt
	const startTime = appt.time || ""
	const type = appt.reason || "consultation"
	const endTime = computeEndTime(startTime, appt.duration)
	return {
		...appt,
		startTime,
		endTime,
		type,
	}
}

export async function listAppointments(params) {
	const { data } = await api.get("/appointments", { params })
	return {
		items: (data.items || []).map(mapAppointmentFromServer),
	}
}

export async function createAppointment(payload) {
	const duration = computeDuration(payload.startTime, payload.endTime)
	const mappedPayload = {
		patientId: payload.patientId,
		dentistId: payload.dentistId || null,
		date: payload.date,
		time: payload.startTime,
		duration: duration,
		status: payload.status,
		reason: payload.type,
		notes: payload.notes,
	}
	const { data } = await api.post("/appointments", mappedPayload)
	return mapAppointmentFromServer(data)
}

export async function updateAppointment(id, payload) {
	const duration = computeDuration(payload.startTime, payload.endTime)
	const mappedPayload = {
		patientId: payload.patientId,
		dentistId: payload.dentistId || null,
		date: payload.date,
		time: payload.startTime,
		duration: duration,
		status: payload.status,
		reason: payload.type,
		notes: payload.notes,
	}
	const { data } = await api.put("/appointments/" + id, mappedPayload)
	return mapAppointmentFromServer(data)
}

export async function deleteAppointment(id) {
	await api.delete("/appointments/" + id)
}

export async function listDentists() {
	const { data } = await api.get("/staff", { params: { role: "dentist" } })
	return data.items || []
}

