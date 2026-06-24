import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listItems,
	getItemById,
	createItem,
	updateItem,
	adjustQuantity,
	deleteItem,
} from "./inventory.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { category, status, search } = req.query
	const items = await listItems({ category, status, search })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const item = await getItemById(req.params.id)
	if (!item) throw new ApiError(404, "Inventory item not found")
	res.json(item)
})

export const create = asyncHandler(async (req, res) => {
	const { name } = req.body || {}
	if (!name) throw new ApiError(400, "name is required")
	const item = await createItem(req.body)
	res.status(201).json(item)
})

export const update = asyncHandler(async (req, res) => {
	const item = await updateItem(req.params.id, req.body || {})
	if (!item) throw new ApiError(404, "Inventory item not found")
	res.json(item)
})

export const adjust = asyncHandler(async (req, res) => {
	const delta = Number(req.body?.delta)
	if (!Number.isFinite(delta) || delta === 0) {
		throw new ApiError(400, "A non-zero numeric delta is required")
	}
	const item = await adjustQuantity(req.params.id, delta)
	if (!item) throw new ApiError(404, "Inventory item not found")
	res.json(item)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await deleteItem(req.params.id)
	if (!deleted) throw new ApiError(404, "Inventory item not found")
	res.status(204).end()
})
