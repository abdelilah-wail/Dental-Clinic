import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listPatients,
	getPatientById,
	createPatient,
	updatePatient,
	deletePatient,
} from "./patients.queries.js"

export const list = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1
	const pageSize = parseInt(req.query.pageSize, 10) || 10
	const { items, total } = await listPatients({
		search: req.query.search,
		status: req.query.status,
		page,
		pageSize,
	})
	res.json({ items, total, page, pageSize })
})

export const getOne = asyncHandler(async (req, res) => {
	const patient = await getPatientById(req.params.id)
	if (!patient) throw new ApiError(404, "Patient not found")
	res.json(patient)
})

export const create = asyncHandler(async (req, res) => {
	const { firstName, lastName } = req.body || {}
	if (!firstName || !lastName) {
		throw new ApiError(400, "First name and last name are required")
	}
	const patient = await createPatient(req.body)
	res.status(201).json(patient)
})

export const update = asyncHandler(async (req, res) => {
	const patient = await updatePatient(req.params.id, req.body || {})
	if (!patient) throw new ApiError(404, "Patient not found")
	res.json(patient)
})

export const remove = asyncHandler(async (req, res) => {
	const ok = await deletePatient(req.params.id)
	if (!ok) throw new ApiError(404, "Patient not found")
	res.status(204).end()
})
