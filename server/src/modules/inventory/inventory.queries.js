import { query } from "../../config/db.js"

const ITEM_SELECT = `
	SELECT
		i.id,
		i.name,
		i.sku,
		i.category,
		i.quantity,
		i.reorder_level AS "reorderLevel",
		i.unit,
		i.supplier,
		i.unit_cost::float AS "unitCost",
		i.notes,
		CASE
			WHEN i.quantity <= 0 THEN 'out'
			WHEN i.quantity <= i.reorder_level THEN 'low'
			ELSE 'in_stock'
		END AS status,
		i.created_at AS "createdAt"
	FROM inventory_items i
`

export async function listItems(filters = {}) {
	const where = []
	const params = []
	if (filters.category) {
		params.push(filters.category)
		where.push(`i.category = $${params.length}`)
	}
	if (filters.search) {
		params.push(`%${filters.search}%`)
		where.push(`(i.name ILIKE $${params.length} OR i.sku ILIKE $${params.length})`)
	}
	if (filters.status === "low") {
		where.push(`i.quantity > 0 AND i.quantity <= i.reorder_level`)
	} else if (filters.status === "out") {
		where.push(`i.quantity <= 0`)
	} else if (filters.status === "in_stock") {
		where.push(`i.quantity > i.reorder_level`)
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : ""
	const { rows } = await query(`${ITEM_SELECT} ${clause} ORDER BY i.name ASC`, params)
	return rows
}

export async function getItemById(id) {
	const { rows } = await query(`${ITEM_SELECT} WHERE i.id = $1`, [id])
	return rows[0] || null
}

export async function createItem(data) {
	const { rows } = await query(
		`INSERT INTO inventory_items
			(name, sku, category, quantity, reorder_level, unit, supplier, unit_cost, notes)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		 RETURNING id`,
		[
			data.name || null,
			data.sku || null,
			data.category || null,
			data.quantity || 0,
			data.reorderLevel ?? 5,
			data.unit || "unit",
			data.supplier || null,
			data.unitCost || 0,
			data.notes || null,
		],
	)
	return getItemById(rows[0].id)
}

export async function updateItem(id, data) {
	const { rows } = await query(
		`UPDATE inventory_items SET
			name          = COALESCE($2, name),
			sku           = COALESCE($3, sku),
			category      = COALESCE($4, category),
			quantity      = COALESCE($5, quantity),
			reorder_level = COALESCE($6, reorder_level),
			unit          = COALESCE($7, unit),
			supplier      = COALESCE($8, supplier),
			unit_cost     = COALESCE($9, unit_cost),
			notes         = COALESCE($10, notes)
		 WHERE id = $1
		 RETURNING id`,
		[
			id,
			data.name ?? null,
			data.sku ?? null,
			data.category ?? null,
			data.quantity ?? null,
			data.reorderLevel ?? null,
			data.unit ?? null,
			data.supplier ?? null,
			data.unitCost ?? null,
			data.notes ?? null,
		],
	)
	if (!rows[0]) return null
	return getItemById(id)
}

export async function adjustQuantity(id, delta) {
	const { rows } = await query(
		`UPDATE inventory_items
		 SET quantity = GREATEST(0, quantity + $2)
		 WHERE id = $1
		 RETURNING id`,
		[id, delta],
	)
	if (!rows[0]) return null
	return getItemById(id)
}

export async function deleteItem(id) {
	const { rows } = await query(
		`DELETE FROM inventory_items WHERE id = $1 RETURNING id`,
		[id],
	)
	return rows[0] || null
}
