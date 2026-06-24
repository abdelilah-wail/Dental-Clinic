import { query } from "../../config/db.js"

const XRAY_SELECT = `
	SELECT
		x.id,
		x.patient_id AS "patientId",
		p.first_name || ' ' || p.last_name AS "patientName",
		x.type,
		x.image_url AS "imageUrl",
		x.file_path AS "filePath",
		x.notes,
		to_char(x.date, 'YYYY-MM-DD') AS date,
		x.created_at AS "createdAt"
	FROM xrays x
	JOIN patients p ON p.id = x.patient_id
`

export async function listXrays(filters = {}) {
	const where = []
	const params = []
	if (filters.patientId) {
		params.push(filters.patientId)
		where.push(`x.patient_id = $${params.length}`)
	}
	if (filters.type) {
		params.push(filters.type)
		where.push(`x.type = $${params.length}`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(
		`${XRAY_SELECT} ${clause} ORDER BY x.date DESC NULLS LAST, x.id DESC`,
		params,
	)
	return rows
}

export async function getXrayById(id) {
	const { rows } = await query(`${XRAY_SELECT} WHERE x.id = $1`, [id])
	return rows[0] || null
}

export async function createXray(data) {
	const { rows } = await query(
		`INSERT INTO xrays (patient_id, type, image_url, file_path, notes, date)
		 VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
		 RETURNING id`,
		[
			data.patientId,
			data.type || null,
			data.imageUrl || null,
			data.filePath || null,
			data.notes || null,
			data.date || null,
		],
	)
	return getXrayById(rows[0].id)
}

export async function updateXray(id, data) {
	const { rows } = await query(
		`UPDATE xrays SET
			type  = COALESCE($2, type),
			notes = COALESCE($3, notes),
			date  = COALESCE($4, date)
		 WHERE id = $1
		 RETURNING id`,
		[id, data.type ?? null, data.notes ?? null, data.date ?? null],
	)
	if (!rows[0]) return null
	return getXrayById(id)
}

export async function deleteXray(id) {
	const { rows } = await query(
		`DELETE FROM xrays WHERE id = $1 RETURNING file_path AS "filePath"`,
		[id],
	)
	return rows[0] || null
}
