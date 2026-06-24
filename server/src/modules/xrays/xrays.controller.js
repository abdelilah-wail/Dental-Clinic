import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import { storage } from "../../lib/storage.js"
import {
	listXrays,
	getXrayById,
	createXray,
	updateXray,
	deleteXray,
} from "./xrays.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { patientId, type } = req.query
	const items = await listXrays({ patientId, type })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const xray = await getXrayById(req.params.id)
	if (!xray) throw new ApiError(404, "X-ray not found")
	res.json(xray)
})

export const create = asyncHandler(async (req, res) => {
	const { patientId } = req.body || {}
	if (!patientId) throw new ApiError(400, "patientId is required")
	if (!req.file) throw new ApiError(400, "An image file is required")

	const uploaded = await storage.uploadFile({
		buffer: req.file.buffer,
		mimeType: req.file.mimetype,
		originalName: req.file.originalname,
		folder: `patients/${patientId}`,
	})

	const xray = await createXray({
		patientId,
		type: req.body.type,
		notes: req.body.notes,
		date: req.body.date,
		imageUrl: uploaded.url,
		filePath: uploaded.key,
	})
	res.status(201).json(xray)
})

export const update = asyncHandler(async (req, res) => {
	const xray = await updateXray(req.params.id, req.body || {})
	if (!xray) throw new ApiError(404, "X-ray not found")
	res.json(xray)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await deleteXray(req.params.id)
	if (!deleted) throw new ApiError(404, "X-ray not found")
	if (deleted.filePath) {
		await storage.removeFile(deleted.filePath)
	}
	res.status(204).end()
})
