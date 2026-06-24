import { query } from "../../config/db.js"

const CHART_COLUMNS = `
	patient_id AS "patientId",
	teeth,
	updated_at AS "updatedAt"
`

export async function getChart(patientId) {
	const { rows } = await query(
		`SELECT ${CHART_COLUMNS} FROM dental_charts WHERE patient_id = $1`,
		[patientId],
	)
	return rows[0] || null
}

export async function upsertChart(patientId, teeth) {
	const { rows } = await query(
		`INSERT INTO dental_charts (patient_id, teeth, updated_at)
		 VALUES ($1, $2::jsonb, now())
		 ON CONFLICT (patient_id)
		 DO UPDATE SET teeth = EXCLUDED.teeth, updated_at = now()
		 RETURNING ${CHART_COLUMNS}`,
		[patientId, JSON.stringify(teeth ?? {})],
	)
	return rows[0]
}
