import { query } from "../../config/db.js"

const APPOINTMENT_SELECT = `
	SELECT
		a.id,
		a.patient_id AS "patientId",
		p.first_name || ' ' || p.last_name AS "patientName",
		a.dentist_id AS "dentistId",
		CASE WHEN s.id IS NULL THEN NULL
		     ELSE s.first_name || ' ' || s.last_name END AS "dentistName",
		to_char(a.date, 'YYYY-MM-DD') AS date,
		a.time,
		a.duration,
		a.status,
		a.reason,
		a.notes,
		a.created_at AS "createdAt"
	FROM appointments a
	JOIN patients p ON p.id = a.patient_id
	LEFT JOIN staff s ON s.id = a.dentist_id
`

export async function listAppointments(filters = {}) {
	const where = []
	const params = []
	if (filters.date) {
		params.push(filters.date)
		where.push(`a.date = $${params.length}`)
	}
	if (filters.status) {
		params.push(filters.status)
		where.push(`a.status = $${params.length}`)
	}
	if (filters.dentistId) {
		params.push(filters.dentistId)
		where.push(`a.dentist_id = $${params.length}`)
	}
	if (filters.patientId) {
		params.push(filters.patientId)
		where.push(`a.patient_id = $${params.length}`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(
		`${APPOINTMENT_SELECT} ${clause} ORDER BY a.date DESC, a.time ASC`,
		params,
	)
	return rows
}

export async function getAppointmentById(id) {
	const { rows } = await query(`${APPOINTMENT_SELECT} WHERE a.id = $1`, [id])
	return rows[0] || null
}

export async function createAppointment(data) {
	const { rows } = await query(
		`INSERT INTO appointments
			(patient_id, dentist_id, date, time, duration, status, reason, notes)
		 VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'scheduled'), $7, $8)
		 RETURNING id`,
		[
			data.patientId,
			data.dentistId || null,
			data.date,
			data.time || null,
			data.duration || null,
			data.status || null,
			data.reason || null,
			data.notes || null,
		],
	)
	return getAppointmentById(rows[0].id)
}

export async function updateAppointment(id, data) {
	const { rows } = await query(
		`UPDATE appointments SET
			patient_id = COALESCE($2, patient_id),
			dentist_id = COALESCE($3, dentist_id),
			date       = COALESCE($4, date),
			time       = COALESCE($5, time),
			duration   = COALESCE($6, duration),
			status     = COALESCE($7, status),
			reason     = COALESCE($8, reason),
			notes      = COALESCE($9, notes)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.patientId ?? null,
			data.dentistId ?? null,
			data.date ?? null,
			data.time ?? null,
			data.duration ?? null,
			data.status ?? null,
			data.reason ?? null,
			data.notes ?? null,
		],
	)
	if (!rows[0]) return null
	return getAppointmentById(id)
}

export async function deleteAppointment(id) {
	const { rowCount } = await query("DELETE FROM appointments WHERE id = $1", [id])
	return rowCount > 0
}
