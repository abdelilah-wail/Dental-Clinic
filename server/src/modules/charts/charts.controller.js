import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import { getPatientById } from "../patients/patients.queries.js"
import { getChart, upsertChart } from "./charts.queries.js"

export const getOne = asyncHandler(async (req, res) => {
	const { patientId } = req.params
	const patient = await getPatientById(patientId)
	if (!patient) throw new ApiError(404, "Patient not found")
	const chart = await getChart(patientId)
	// an un-charted patient still gets an empty chart
	res.json(chart || { patientId: Number(patientId), teeth: [], updatedAt: null })
})

export const upsert = asyncHandler(async (req, res) => {
	const { patientId } = req.params
	const patient = await getPatientById(patientId)
	if (!patient) throw new ApiError(404, "Patient not found")
	const { teeth } = req.body || {}
	// teeth can be an object (map keyed by tooth id) or an array
	if (teeth !== undefined && typeof teeth !== "object") {
		throw new ApiError(400, "teeth must be an object or array")
	}
	const chart = await upsertChart(patientId, teeth ?? {})
	res.json(chart)
})
