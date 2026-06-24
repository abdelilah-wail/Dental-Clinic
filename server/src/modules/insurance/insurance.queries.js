import { query, withTransaction } from "../../config/db.js"

const CLAIM_SELECT = `
	SELECT
		c.id,
		c.claim_number AS "claimNumber",
		c.patient_id AS "patientId",
		p.first_name || ' ' || p.last_name AS "patientName",
		c.provider,
		c.amount::float AS amount,
		c.amount_reimbursed::float AS "amountReimbursed",
		c.status,
		c.notes,
		to_char(c.date, 'YYYY-MM-DD') AS date,
		c.created_at AS "createdAt"
	FROM insurance_claims c
	JOIN patients p ON p.id = c.patient_id
`

export async function listClaims(filters = {}) {
	const where = []
	const params = []
	if (filters.patientId) {
		params.push(filters.patientId)
		where.push(`c.patient_id = $${params.length}`)
	}
	if (filters.status) {
		params.push(filters.status)
		where.push(`c.status = $${params.length}`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(
		`${CLAIM_SELECT} ${clause} ORDER BY c.date DESC NULLS LAST, c.id DESC`,
		params,
	)
	return rows
}

export async function getClaimById(id) {
	const { rows } = await query(`${CLAIM_SELECT} WHERE c.id = $1`, [id])
	return rows[0] || null
}

export async function createClaim(data) {
	const id = await withTransaction(async (client) => {
		const { rows: seq } = await client.query(
			`SELECT COALESCE(MAX(CAST(SUBSTRING(claim_number FROM 5) AS INTEGER)), 0) + 1 AS next
			 FROM insurance_claims
			 WHERE claim_number ~ '^CLM-[0-9]+$'`,
		)
		const claimNumber = `CLM-${String(seq[0].next).padStart(4, "0")}`
		const { rows } = await client.query(
			`INSERT INTO insurance_claims
				(claim_number, patient_id, provider, amount, amount_reimbursed, status, notes, date)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_DATE))
			 RETURNING id`,
			[
				claimNumber,
				data.patientId,
				data.provider || null,
				data.amount || 0,
				data.amountReimbursed || 0,
				data.status || "draft",
				data.notes || null,
				data.date || null,
			],
		)
		return rows[0].id
	})
	return getClaimById(id)
}

export async function updateClaim(id, data) {
	const { rows } = await query(
		`UPDATE insurance_claims SET
			provider          = COALESCE($2, provider),
			amount            = COALESCE($3, amount),
			amount_reimbursed = COALESCE($4, amount_reimbursed),
			status            = COALESCE($5, status),
			notes             = COALESCE($6, notes),
			date              = COALESCE($7, date)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.provider ?? null,
			data.amount ?? null,
			data.amountReimbursed ?? null,
			data.status ?? null,
			data.notes ?? null,
			data.date ?? null,
		],
	)
	if (!rows[0]) return null
	return getClaimById(id)
}

export async function deleteClaim(id) {
	const { rows } = await query(
		`DELETE FROM insurance_claims WHERE id = $1 RETURNING id`,
		[id],
	)
	return rows[0] || null
}
