import { readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pool } from "../src/config/db.js"

const here = dirname(fileURLToPath(import.meta.url))

async function ensureMigrationsTable() {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS _migrations (
			id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
			name       TEXT NOT NULL UNIQUE,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)
	`)
}

async function appliedMigrations() {
	const { rows } = await pool.query("SELECT name FROM _migrations ORDER BY name")
	return new Set(rows.map((r) => r.name))
}

async function run() {
	await ensureMigrationsTable()
	const applied = await appliedMigrations()

	const files = (await readdir(here))
		.filter((f) => f.endsWith(".sql"))
		.sort()

	const pending = files.filter((f) => !applied.has(f))
	if (pending.length === 0) {
		console.log("No pending migrations.")
		await pool.end()
		return
	}

	for (const file of pending) {
		const sql = await readFile(join(here, file), "utf8")
		const client = await pool.connect()
		try {
			await client.query("BEGIN")
			await client.query(sql)
			await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file])
			await client.query("COMMIT")
			console.log(`Applied migration: ${file}`)
		} catch (error) {
			await client.query("ROLLBACK")
			console.error(`Failed migration: ${file}`)
			throw error
		} finally {
			client.release()
		}
	}

	await pool.end()
	console.log(`Done. Applied ${pending.length} migration(s).`)
}

run().catch((error) => {
	console.error(error)
	process.exit(1)
})
