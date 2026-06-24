import { query } from "../../config/db.js"

async function getRevenue() {
	const { rows } = await query(
		`SELECT
			COALESCE((SELECT SUM(total) FROM invoices), 0)::float AS invoiced,
			COALESCE((SELECT SUM(amount) FROM payments), 0)::float AS collected`,
	)
	const invoiced = rows[0].invoiced
	const collected = rows[0].collected
	return {
		invoiced,
		collected,
		outstanding: Math.max(0, invoiced - collected),
	}
}

async function getRevenueByMonth() {
	const { rows } = await query(
		`SELECT
			to_char(date_trunc('month', date), 'YYYY-MM') AS label,
			SUM(total)::float AS value
		 FROM invoices
		 WHERE date >= (CURRENT_DATE - INTERVAL '11 months')
		 GROUP BY date_trunc('month', date)
		 ORDER BY date_trunc('month', date) ASC`,
	)
	return rows
}

async function getPatients() {
	const { rows } = await query(`SELECT COUNT(*)::int AS total FROM patients`)
	return { total: rows[0].total }
}

async function getAppointments() {
	const { rows } = await query(
		`SELECT
			COUNT(*)::int AS total,
			COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
			COUNT(*) FILTER (WHERE status = 'scheduled')::int AS scheduled,
			COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
		 FROM appointments`,
	)
	return rows[0]
}

async function getTreatments() {
	const { rows } = await query(
		`SELECT
			COUNT(*)::int AS total,
			COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
			COUNT(*) FILTER (WHERE status = 'planned')::int AS planned
		 FROM treatments`,
	)
	return rows[0]
}

async function getTreatmentsByType() {
	const { rows } = await query(
		`SELECT "procedure" AS label, COUNT(*)::int AS value
		 FROM treatments
		 WHERE "procedure" IS NOT NULL AND "procedure" <> ''
		 GROUP BY "procedure"
		 ORDER BY value DESC, "procedure" ASC`,
	)
	return rows
}

async function getInventory() {
	const { rows } = await query(
		`SELECT
			COUNT(*)::int AS items,
			COUNT(*) FILTER (WHERE quantity > 0 AND quantity <= reorder_level)::int AS low,
			COUNT(*) FILTER (WHERE quantity <= 0)::int AS out,
			COALESCE(SUM(quantity * unit_cost), 0)::float AS "stockValue"
		 FROM inventory_items`,
	)
	return rows[0]
}

async function getInsurance() {
	const { rows } = await query(
		`SELECT
			COUNT(*)::int AS claims,
			COALESCE(SUM(amount_reimbursed), 0)::float AS reimbursed
		 FROM insurance_claims`,
	)
	return rows[0]
}

export async function getReportSummary() {
	const [
		revenue,
		revenueByMonth,
		patients,
		appointments,
		treatments,
		treatmentsByType,
		inventory,
		insurance,
	] = await Promise.all([
		getRevenue(),
		getRevenueByMonth(),
		getPatients(),
		getAppointments(),
		getTreatments(),
		getTreatmentsByType(),
		getInventory(),
		getInsurance(),
	])
	return {
		revenue,
		revenueByMonth,
		patients,
		appointments,
		treatments,
		treatmentsByType,
		inventory,
		insurance,
	}
}
