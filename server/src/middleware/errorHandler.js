export class ApiError extends Error {
	constructor(status, message, details) {
		super(message)
		this.status = status
		this.details = details
	}
}

export function notFound(req, res, next) {
	next(new ApiError(404, "Route not found"))
}

// Express needs all four args to recognize this as an error handler.
export function errorHandler(err, req, res, next) {
	const status = err.status || 500
	const payload = { message: err.message || "Internal server error" }
	if (err.details) payload.details = err.details
	if (status >= 500) console.error(err)
	res.status(status).json(payload)
}
