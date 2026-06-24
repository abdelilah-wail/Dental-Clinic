import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listTreatments,
	getTreatmentById,
	createTreatment,
	updateTreatment,
	deleteTreatment,
} from "./treatments.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { patientId, status } = req.query
	const items = await listTreatments({ patientId, status })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const treatment = await getTreatmentById(req.params.id)
	if (!treatment) throw new ApiError(404, "Treatment not found")
	res.json(treatment)
})

export const create = asyncHandler(async (req, res) => {
	const { patientId, procedure, procedureCode } = req.body || {}
	if (!patientId || (!procedure && !procedureCode)) {
		throw new ApiError(400, "patientId and procedure are required")
	}
	const treatment = await createTreatment(req.body)
	res.status(201).json(treatment)
})

export const update = asyncHandler(async (req, res) => {
	const treatment = await updateTreatment(req.params.id, req.body || {})
	if (!treatment) throw new ApiError(404, "Treatment not found")
	res.json(treatment)
})

export const remove = asyncHandler(async (req, res) => {
	const ok = await deleteTreatment(req.params.id)
	if (!ok) throw new ApiError(404, "Treatment not found")
	res.status(204).end()
})
