import express from "express"
import cors from "cors"
import { env } from "./config/env.js"
import { router as apiRouter } from "./routes/index.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js"

export function createApp() {
	const app = express()

	app.use(cors({ origin: env.corsOrigin, credentials: true }))
	app.use(express.json({ limit: "5mb" }))
	app.use(express.urlencoded({ extended: true }))

	app.use("/api", apiRouter)

	app.use(notFound)
	app.use(errorHandler)

	return app
}
