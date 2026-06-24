import { query, withTransaction } from "../../config/db.js"

const INVOICE_SELECT = `
	SELECT
		i.id,
		i.invoice_number AS "invoiceNumber",
		i.patient_id AS "patientId",
		p.first_name || ' ' || p.last_name AS "patientName",
		to_char(i.date, 'YYYY-MM-DD') AS date,
		i.total::float AS total,
		i.notes,
		i.created_at AS "createdAt"
	FROM invoices i
	JOIN patients p ON p.id = i.patient_id
`

const PAYMENT_COLUMNS = `
	id,
	invoice_id AS "invoiceId",
	amount::float AS amount,
	method,
	to_char(date, 'YYYY-MM-DD') AS date,
	created_at AS "createdAt"
`

// Adds paid / balance / status, mirroring the frontend decorateInvoice().
function decorate(invoice, payments) {
	const paid = payments.reduce((sum, pmt) => sum + Number(pmt.amount), 0)
	const total = Number(invoice.total)
	const balance = total - paid
	const status = paid >= total && total > 0 ? "paid" : paid > 0 ? "partial" : "unpaid"
	return { ...invoice, payments, paid, balance, status }
}

export async function listInvoices(filters = {}) {
	const where = []
	const params = []
	if (filters.patientId) {
		params.push(filters.patientId)
		where.push(`i.patient_id = $${params.length}`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows: invoices } = await query(
		`${INVOICE_SELECT} ${clause} ORDER BY i.date DESC, i.id DESC`,
		params,
	)
	if (invoices.length === 0) return []
	const ids = invoices.map((inv) => inv.id)
	const { rows: payments } = await query(
		`SELECT ${PAYMENT_COLUMNS} FROM payments
		 WHERE invoice_id = ANY($1) ORDER BY date ASC, id ASC`,
		[ids],
	)
	const byInvoice = new Map()
	for (const pmt of payments) {
		const list = byInvoice.get(pmt.invoiceId) || []
		list.push(pmt)
		byInvoice.set(pmt.invoiceId, list)
	}
	let decorated = invoices.map((inv) => decorate(inv, byInvoice.get(inv.id) || []))
	if (filters.status) {
		decorated = decorated.filter((inv) => inv.status === filters.status)
	}
	return decorated
}

export async function getInvoiceById(id) {
	const { rows } = await query(`${INVOICE_SELECT} WHERE i.id = $1`, [id])
	const invoice = rows[0]
	if (!invoice) return null
	const { rows: payments } = await query(
		`SELECT ${PAYMENT_COLUMNS} FROM payments
		 WHERE invoice_id = $1 ORDER BY date ASC, id ASC`,
		[id],
	)
	return decorate(invoice, payments)
}

export async function createInvoice(data) {
	const id = await withTransaction(async (client) => {
		const numbered = await client.query(
			`SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) AS max
			 FROM invoices WHERE invoice_number LIKE 'INV-%'`,
		)
		const next = Number(numbered.rows[0].max) + 1
		const invoiceNumber = "INV-" + String(next).padStart(5, "0")
		const { rows } = await client.query(
			`INSERT INTO invoices (invoice_number, patient_id, date, total, status, notes)
			 VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4, 0), COALESCE($5, 'unpaid'), $6)
			 RETURNING id`,
			[
				invoiceNumber,
				data.patientId,
				data.date || null,
				data.total ?? null,
				data.status || null,
				data.notes || null,
			],
		)
		return rows[0].id
	})
	return getInvoiceById(id)
}

export async function updateInvoice(id, data) {
	const { rows } = await query(
		`UPDATE invoices SET
			patient_id = COALESCE($2, patient_id),
			date       = COALESCE($3, date),
			total      = COALESCE($4, total),
			status     = COALESCE($5, status),
			notes      = COALESCE($6, notes)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.patientId ?? null,
			data.date ?? null,
			data.total ?? null,
			data.status ?? null,
			data.notes ?? null,
		],
	)
	if (!rows[0]) return null
	return getInvoiceById(id)
}

export async function deleteInvoice(id) {
	const { rowCount } = await query("DELETE FROM invoices WHERE id = $1", [id])
	return rowCount > 0
}

export async function addPayment(invoiceId, data) {
	const { rows } = await query(
		`INSERT INTO payments (invoice_id, amount, method, date)
		 VALUES ($1, COALESCE($2, 0), COALESCE($3, 'cash'), COALESCE($4, CURRENT_DATE))
		 RETURNING id`,
		[invoiceId, data.amount ?? null, data.method || null, data.date || null],
	)
	return rows[0].id
}

export async function removePayment(invoiceId, paymentId) {
	const { rowCount } = await query(
		"DELETE FROM payments WHERE id = $1 AND invoice_id = $2",
		[paymentId, invoiceId],
	)
	return rowCount > 0
}
