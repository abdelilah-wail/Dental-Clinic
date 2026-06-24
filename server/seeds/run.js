import bcrypt from "bcryptjs"
import { pool } from "../src/config/db.js"
import { env } from "../src/config/env.js"
import {
	DEMO_PASSWORD,
	USERS,
	STAFF,
	PATIENTS,
	DENTAL_CHART,
	APPOINTMENTS,
	TREATMENTS,
	INVOICES,
	XRAYS,
	CLAIMS,
	INVENTORY,
} from "./data.js"

const pad = (value, len) => String(value).padStart(len, "0")

function day(offset) {
	const d = new Date()
	d.setDate(d.getDate() + offset)
	return d.toISOString().slice(0, 10)
}

async function seed() {
	const client = await pool.connect()
	try {
		await client.query("BEGIN")

		await client.query(`
			TRUNCATE staff, users, patients, dental_charts, appointments,
				treatments, invoices, payments, xrays, insurance_claims, inventory_items
			RESTART IDENTITY CASCADE
		`)

		// users (shared hashed password)
		const passwordHash = await bcrypt.hash(DEMO_PASSWORD, env.bcryptRounds)
		for (const u of USERS) {
			await client.query(
				"INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)",
				[u.email, passwordHash, u.fullName, u.role],
			)
		}

		// staff
		const staffIds = []
		for (const s of STAFF) {
			const { rows } = await client.query(
				`INSERT INTO staff (first_name, last_name, role, email, phone, specialty, status, hire_date, color)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
				[s.firstName, s.lastName, s.role, s.email, s.phone, s.specialty, s.status, s.hireDate, s.color],
			)
			staffIds.push(rows[0].id)
		}

		// patients (file number P-0001...)
		const patientIds = []
		for (let i = 0; i < PATIENTS.length; i++) {
			const p = PATIENTS[i]
			const fileNumber = "P-" + pad(i + 1, 4)
			const { rows } = await client.query(
				`INSERT INTO patients (file_number, first_name, last_name, phone, nin, date_of_birth, gender, email, address,
				                      blood_type, wilaya, commune, insurance, emergency_contact, status)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
				[
					fileNumber,
					p.firstName,
					p.lastName,
					p.phone,
					p.nin,
					p.dateOfBirth,
					p.gender,
					p.email,
					p.address,
					p.bloodType || null,
					p.wilaya || null,
					p.commune || null,
					p.insurance || 'none',
					p.emergencyContact || null,
					p.status || 'active'
				],
			)
			patientIds.push(rows[0].id)
		}

		// dental chart
		await client.query(
			"INSERT INTO dental_charts (patient_id, teeth) VALUES ($1, $2::jsonb)",
			[patientIds[DENTAL_CHART.patientIndex], JSON.stringify(DENTAL_CHART.teeth)],
		)

		// appointments
		for (const a of APPOINTMENTS) {
			await client.query(
				`INSERT INTO appointments (patient_id, dentist_id, date, time, duration, status, reason)
				 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
				[patientIds[a.patientIndex], staffIds[a.dentistIndex], day(a.dayOffset), a.time, a.duration, a.status, a.reason],
			)
		}

		// treatments
		for (const t of TREATMENTS) {
			await client.query(
				`INSERT INTO treatments (patient_id, procedure, tooth, status, cost, date)
				 VALUES ($1, $2, $3, $4, $5, $6)`,
				[patientIds[t.patientIndex], t.procedure, t.tooth, t.status, t.cost, day(t.dayOffset)],
			)
		}

		// invoices + payments (invoice number INV-00001...)
		for (let i = 0; i < INVOICES.length; i++) {
			const inv = INVOICES[i]
			const invoiceNumber = "INV-" + pad(i + 1, 5)
			const { rows } = await client.query(
				`INSERT INTO invoices (invoice_number, patient_id, date, total, status, notes)
				 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
				[invoiceNumber, patientIds[inv.patientIndex], day(inv.dayOffset), inv.total, inv.status, inv.notes || null],
			)
			const invoiceId = rows[0].id
			for (const payment of inv.payments || []) {
				await client.query(
					"INSERT INTO payments (invoice_id, amount, method, date) VALUES ($1, $2, $3, $4)",
					[invoiceId, payment.amount, payment.method, day(payment.dayOffset)],
				)
			}
		}

		// xrays
		for (const x of XRAYS) {
			await client.query(
				`INSERT INTO xrays (patient_id, type, image_url, notes, date)
				 VALUES ($1, $2, $3, $4, $5)`,
				[patientIds[x.patientIndex], x.type, x.imageUrl, x.notes, day(x.dayOffset)],
			)
		}

		// insurance claims (claim number CLM-0001...)
		for (let i = 0; i < CLAIMS.length; i++) {
			const c = CLAIMS[i]
			const claimNumber = "CLM-" + pad(i + 1, 4)
			await client.query(
				`INSERT INTO insurance_claims (claim_number, patient_id, provider, amount, amount_reimbursed, status, notes, date)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[claimNumber, patientIds[c.patientIndex], c.provider, c.amount, c.amountReimbursed, c.status, c.notes || null, day(c.dayOffset)],
			)
		}

		// inventory
		for (const item of INVENTORY) {
			await client.query(
				`INSERT INTO inventory_items (name, sku, category, quantity, reorder_level, unit, supplier, unit_cost, notes)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				[item.name, item.sku, item.category, item.quantity, item.reorderLevel, item.unit, item.supplier, item.unitCost, item.notes || null],
			)
		}

		await client.query("COMMIT")
		console.log("Seed complete.")
		console.log(`Users ${USERS.length} · Staff ${STAFF.length} · Patients ${PATIENTS.length}`)
		console.log(`Demo login: admin@clinic.dz / ${DEMO_PASSWORD}`)
	} catch (error) {
		await client.query("ROLLBACK")
		console.error("Seed failed:", error)
		process.exitCode = 1
	} finally {
		client.release()
		await pool.end()
	}
}

seed()
