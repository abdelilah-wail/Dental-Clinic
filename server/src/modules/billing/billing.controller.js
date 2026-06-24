import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	listInvoices,
	getInvoiceById,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	addPayment,
	removePayment,
} from "./billing.queries.js"

export const list = asyncHandler(async (req, res) => {
	const { patientId, status } = req.query
	const items = await listInvoices({ patientId, status })
	res.json({ items })
})

export const getOne = asyncHandler(async (req, res) => {
	const invoice = await getInvoiceById(req.params.id)
	if (!invoice) throw new ApiError(404, "Invoice not found")
	res.json(invoice)
})

export const create = asyncHandler(async (req, res) => {
	const { patientId } = req.body || {}
	if (!patientId) throw new ApiError(400, "patientId is required")
	const invoice = await createInvoice(req.body)
	res.status(201).json(invoice)
})

export const update = asyncHandler(async (req, res) => {
	const invoice = await updateInvoice(req.params.id, req.body || {})
	if (!invoice) throw new ApiError(404, "Invoice not found")
	res.json(invoice)
})

export const remove = asyncHandler(async (req, res) => {
	const ok = await deleteInvoice(req.params.id)
	if (!ok) throw new ApiError(404, "Invoice not found")
	res.status(204).end()
})

export const recordPayment = asyncHandler(async (req, res) => {
	const invoice = await getInvoiceById(req.params.id)
	if (!invoice) throw new ApiError(404, "Invoice not found")
	const { amount } = req.body || {}
	if (amount == null || Number(amount) <= 0) {
		throw new ApiError(400, "A positive payment amount is required")
	}
	await addPayment(req.params.id, req.body)
	res.status(201).json(await getInvoiceById(req.params.id))
})

export const deletePayment = asyncHandler(async (req, res) => {
	const invoice = await getInvoiceById(req.params.id)
	if (!invoice) throw new ApiError(404, "Invoice not found")
	const ok = await removePayment(req.params.id, req.params.paymentId)
	if (!ok) throw new ApiError(404, "Payment not found")
	res.json(await getInvoiceById(req.params.id))
})
