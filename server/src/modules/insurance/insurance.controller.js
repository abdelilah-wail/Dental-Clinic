import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listClaims,
	getClaimById,
	createClaim,
	updateClaim,
	deleteClaim,
} from "./insurance.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { patientId, status } = req.query
	const items = await listClaims({ patientId, status })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const claim = await getClaimById(req.params.id)
	if (!claim) throw new ApiError(404, "Insurance claim not found")
	res.json(claim)
})

export const create = asyncHandler(async (req, res) => {
	const { patientId } = req.body || {}
	if (!patientId) throw new ApiError(400, "patientId is required")
	const claim = await createClaim(req.body)
	res.status(201).json(claim)
})

export const update = asyncHandler(async (req, res) => {
	const claim = await updateClaim(req.params.id, req.body || {})
	if (!claim) throw new ApiError(404, "Insurance claim not found")
	res.json(claim)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await deleteClaim(req.params.id)
	if (!deleted) throw new ApiError(404, "Insurance claim not found")
	res.status(204).end()
})
