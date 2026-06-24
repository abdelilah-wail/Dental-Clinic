import { query } from "../../config/db.js"

export async function findUserByEmail(email) {
	const { rows } = await query(
		`SELECT id, email, password_hash AS "passwordHash", full_name AS "fullName", role
		 FROM users WHERE email = $1`,
		[email],
	)
	return rows[0] || null
}

export async function findUserById(id) {
	const { rows } = await query(
		`SELECT id, email, full_name AS "fullName", role
		 FROM users WHERE id = $1`,
		[id],
	)
	return rows[0] || null
}
