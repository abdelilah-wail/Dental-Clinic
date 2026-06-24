import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listStaff,
	getStaffById,
	createStaff,
	updateStaff,
	deleteStaff,
} from "./staff.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { role, status, search } = req.query
	const items = await listStaff({ role, status, search })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const member = await getStaffById(req.params.id)
	if (!member) throw new ApiError(404, "Staff member not found")
	res.json(member)
})

export const create = asyncHandler(async (req, res) => {
	const { firstName, lastName } = req.body || {}
	if (!firstName || !lastName) {
		throw new ApiError(400, "firstName and lastName are required")
	}
	const member = await createStaff(req.body)
	res.status(201).json(member)
})

export const update = asyncHandler(async (req, res) => {
	const member = await updateStaff(req.params.id, req.body || {})
	if (!member) throw new ApiError(404, "Staff member not found")
	res.json(member)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await deleteStaff(req.params.id)
	if (!deleted) throw new ApiError(404, "Staff member not found")
	res.status(204).end()
})
