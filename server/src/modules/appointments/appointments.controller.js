import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listAppointments,
	getAppointmentById,
	createAppointment,
	updateAppointment,
	deleteAppointment,
} from "./appointments.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { date, status, dentistId, patientId } = req.query
	const items = await listAppointments({ date, status, dentistId, patientId })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const appointment = await getAppointmentById(req.params.id)
	if (!appointment) throw new ApiError(404, "Appointment not found")
	res.json(appointment)
})

export const create = asyncHandler(async (req, res) => {
	const { patientId, date } = req.body || {}
	if (!patientId || !date) {
		throw new ApiError(400, "patientId and date are required")
	}
	const appointment = await createAppointment(req.body)
	res.status(201).json(appointment)
})

export const update = asyncHandler(async (req, res) => {
	const appointment = await updateAppointment(req.params.id, req.body || {})
	if (!appointment) throw new ApiError(404, "Appointment not found")
	res.json(appointment)
})

export const remove = asyncHandler(async (req, res) => {
	const ok = await deleteAppointment(req.params.id)
	if (!ok) throw new ApiError(404, "Appointment not found")
	res.status(204).end()
})
