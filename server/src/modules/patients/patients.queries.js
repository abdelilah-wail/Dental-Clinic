import { query, withTransaction } from "../../config/db.js"

const PATIENT_COLUMNS = `
	id,
	file_number       AS "fileNumber",
	first_name        AS "firstName",
	last_name         AS "lastName",
	phone,
	nin,
	date_of_birth     AS "dateOfBirth",
	gender,
	email,
	address,
	medical_history   AS "medicalHistory",
	created_at        AS "createdAt",
	blood_type        AS "bloodType",
	wilaya,
	commune,
	insurance,
	emergency_contact AS "emergencyContact",
	status
`

export async function listPatients({ search, status, page = 1, pageSize = 10 } = {}) {
	let whereClauses = []
	let params = []

	if (search) {
		const like = `%${search}%`
		params.push(like)
		whereClauses.push(`(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR phone ILIKE $${params.length} OR file_number ILIKE $${params.length})`)
	}

	if (status) {
		params.push(status)
		whereClauses.push(`status = $${params.length}`)
	}

	const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

	const countRes = await query(`SELECT COUNT(*) AS count FROM patients ${whereStr}`, params)
	const total = parseInt(countRes.rows[0].count, 10)

	const offset = (page - 1) * pageSize
	params.push(pageSize, offset)
	const { rows } = await query(
		`SELECT ${PATIENT_COLUMNS} FROM patients
		 ${whereStr}
		 ORDER BY id DESC
		 LIMIT $${params.length - 1} OFFSET $${params.length}`,
		params,
	)

	return { items: rows, total }
}

export async function getPatientById(id) {
	const { rows } = await query(
		`SELECT ${PATIENT_COLUMNS} FROM patients WHERE id = $1`,
		[id],
	)
	return rows[0] || null
}

export async function createPatient(data) {
	return withTransaction(async (client) => {
		const numbered = await client.query(
			`SELECT COALESCE(MAX(CAST(SUBSTRING(file_number FROM 3) AS INTEGER)), 0) AS max
			 FROM patients WHERE file_number LIKE 'P-%'`,
		)
		const next = Number(numbered.rows[0].max) + 1
		const fileNumber = "P-" + String(next).padStart(4, "0")
		const { rows } = await client.query(
			`INSERT INTO patients
				(file_number, first_name, last_name, phone, nin, date_of_birth, gender, email, address, medical_history,
				 blood_type, wilaya, commune, insurance, emergency_contact, status)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15, $16)
			 RETURNING ${PATIENT_COLUMNS}`,
			[
				fileNumber,
				data.firstName,
				data.lastName,
				data.phone || null,
				data.nin || null,
				data.dateOfBirth || null,
				data.gender || null,
				data.email || null,
				data.address || null,
				JSON.stringify(data.medicalHistory || {}),
				data.bloodType || null,
				data.wilaya || null,
				data.commune || null,
				data.insurance || 'none',
				data.emergencyContact || null,
				data.status || 'active',
			],
		)
		return rows[0]
	})
}

export async function updatePatient(id, data) {
	const { rows } = await query(
		`UPDATE patients SET
			first_name        = COALESCE($2, first_name),
			last_name         = COALESCE($3, last_name),
			phone             = COALESCE($4, phone),
			nin               = COALESCE($5, nin),
			date_of_birth     = COALESCE($6, date_of_birth),
			gender            = COALESCE($7, gender),
			email             = COALESCE($8, email),
			address           = COALESCE($9, address),
			medical_history   = COALESCE($10::jsonb, medical_history),
			blood_type        = COALESCE($11, blood_type),
			wilaya            = COALESCE($12, wilaya),
			commune           = COALESCE($13, commune),
			insurance         = COALESCE($14, insurance),
			emergency_contact = COALESCE($15, emergency_contact),
			status            = COALESCE($16, status)
		 WHERE id = $1
		 RETURNING ${PATIENT_COLUMNS}`,
		[
			id,
			data.firstName ?? null,
			data.lastName ?? null,
			data.phone ?? null,
			data.nin ?? null,
			data.dateOfBirth ?? null,
			data.gender ?? null,
			data.email ?? null,
			data.address ?? null,
			data.medicalHistory !== undefined ? JSON.stringify(data.medicalHistory) : null,
			data.bloodType ?? null,
			data.wilaya ?? null,
			data.commune ?? null,
			data.insurance ?? null,
			data.emergencyContact ?? null,
			data.status ?? null,
		],
	)
	return rows[0] || null
}

export async function deletePatient(id) {
	const { rowCount } = await query("DELETE FROM patients WHERE id = $1", [id])
	return rowCount > 0
}
