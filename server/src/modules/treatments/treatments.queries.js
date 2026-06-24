import { query } from "../../config/db.js"

const TREATMENT_SELECT = `
	SELECT
		t.id,
		t.patient_id AS "patientId",
		p.first_name || ' ' || p.last_name AS "patientName",
		t."procedure" AS "procedureCode",
		t.tooth,
		t.status,
		t.cost::float AS cost,
		to_char(t.date, 'YYYY-MM-DD') AS date,
		t.notes,
		t.created_at AS "createdAt"
	FROM treatments t
	JOIN patients p ON p.id = t.patient_id
`

export async function listTreatments(filters = {}) {
	const where = []
	const params = []
	if (filters.patientId) {
		params.push(filters.patientId)
		where.push(`t.patient_id = $${params.length}`)
	}
	if (filters.status) {
		params.push(filters.status)
		where.push(`t.status = $${params.length}`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(
		`${TREATMENT_SELECT} ${clause} ORDER BY t.date DESC NULLS LAST, t.id DESC`,
		params,
	)
	return rows
}

export async function getTreatmentById(id) {
	const { rows } = await query(`${TREATMENT_SELECT} WHERE t.id = $1`, [id])
	return rows[0] || null
}

export async function createTreatment(data) {
	const { rows } = await query(
		`INSERT INTO treatments
			(patient_id, "procedure", tooth, status, cost, date, notes)
		 VALUES ($1, $2, $3, COALESCE($4, 'planned'), COALESCE($5, 0), $6, $7)
		 RETURNING id`,
		[
			data.patientId,
			data.procedureCode || data.procedure || null,
			data.tooth || null,
			data.status || null,
			data.cost ?? null,
			data.date || null,
			data.notes || null,
		],
	)
	return getTreatmentById(rows[0].id)
}

export async function updateTreatment(id, data) {
	const { rows } = await query(
		`UPDATE treatments SET
			patient_id  = COALESCE($2, patient_id),
			"procedure" = COALESCE($3, "procedure"),
			tooth       = COALESCE($4, tooth),
			status      = COALESCE($5, status),
			cost        = COALESCE($6, cost),
			date        = COALESCE($7, date),
			notes       = COALESCE($8, notes)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.patientId ?? null,
			data.procedureCode ?? data.procedure ?? null,
			data.tooth ?? null,
			data.status ?? null,
			data.cost ?? null,
			data.date ?? null,
			data.notes ?? null,
		],
	)
	if (!rows[0]) return null
	return getTreatmentById(id)
}

export async function deleteTreatment(id) {
	const { rowCount } = await query("DELETE FROM treatments WHERE id = $1", [id])
	return rowCount > 0
}
