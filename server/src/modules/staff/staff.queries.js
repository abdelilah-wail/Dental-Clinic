import { query } from "../../config/db.js"

const STAFF_SELECT = `
	SELECT
		s.id,
		s.first_name AS "firstName",
		s.last_name AS "lastName",
		s.first_name || ' ' || s.last_name AS "fullName",
		s.role,
		s.email,
		s.phone,
		s.specialty,
		s.status,
		to_char(s.hire_date, 'YYYY-MM-DD') AS "hireDate",
		s.color,
		s.created_at AS "createdAt"
	FROM staff s
`

export async function listStaff(filters = {}) {
	const where = []
	const params = []
	if (filters.role) {
		params.push(filters.role)
		where.push(`s.role = $${params.length}`)
	}
	if (filters.status) {
		params.push(filters.status)
		where.push(`s.status = $${params.length}`)
	}
	if (filters.search) {
		params.push(`%${filters.search}%`)
		where.push(
			`(s.first_name ILIKE $${params.length} OR s.last_name ILIKE $${params.length} OR s.email ILIKE $${params.length})`,
		)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(
		`${STAFF_SELECT} ${clause} ORDER BY s.first_name ASC, s.last_name ASC`,
		params,
	)
	return rows
}

export async function getStaffById(id) {
	const { rows } = await query(`${STAFF_SELECT} WHERE s.id = $1`, [id])
	return rows[0] || null
}

export async function createStaff(data) {
	const { rows } = await query(
		`INSERT INTO staff
			(first_name, last_name, role, email, phone, specialty, status, hire_date, color)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, '#d4af37'))
		 RETURNING id`,
		[
			data.firstName || null,
			data.lastName || null,
			data.role || "assistant",
			data.email || null,
			data.phone || null,
			data.specialty || "",
			data.status || "active",
			data.hireDate || null,
			data.color || null,
		],
	)
	return getStaffById(rows[0].id)
}

export async function updateStaff(id, data) {
	const { rows } = await query(
		`UPDATE staff SET
			first_name = COALESCE($2, first_name),
			last_name  = COALESCE($3, last_name),
			role       = COALESCE($4, role),
			email      = COALESCE($5, email),
			phone      = COALESCE($6, phone),
			specialty  = COALESCE($7, specialty),
			status     = COALESCE($8, status),
			hire_date  = COALESCE($9, hire_date),
			color      = COALESCE($10, color)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.firstName ?? null,
			data.lastName ?? null,
			data.role ?? null,
			data.email ?? null,
			data.phone ?? null,
			data.specialty ?? null,
			data.status ?? null,
			data.hireDate ?? null,
			data.color ?? null,
		],
	)
	if (!rows[0]) return null
	return getStaffById(id)
}

export async function deleteStaff(id) {
	const { rows } = await query(
		`DELETE FROM staff WHERE id = $1 RETURNING id`,
		[id],
	)
	return rows[0] || null
}
