import { createApp } from "./app.js"
import { env } from "./config/env.js"
import { pool } from "./config/db.js"

const app = createApp()

const server = app.listen(env.port, () => {
	console.log(`API listening on http://localhost:${env.port}/api`)
})

async function shutdown(signal) {
	console.log(`\n${signal} received, shutting down...`)
	server.close(async () => {
		await pool.end()
		process.exit(0)
	})
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))
