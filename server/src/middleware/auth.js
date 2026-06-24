import { ApiError } from "./errorHandler.js"
import { verifyAccessToken } from "../lib/jwt.js"

// Verifies the Bearer access token and attaches req.user.
export function requireAuth(req, res, next) {
	const header = req.headers.authorization || ""
	const [scheme, token] = header.split(" ")
	if (scheme !== "Bearer" || !token) {
		return next(new ApiError(401, "Authentication required"))
	}
	try {
		const payload = verifyAccessToken(token)
		req.user = { id: payload.sub, email: payload.email, role: payload.role }
		next()
	} catch {
		next(new ApiError(401, "Invalid or expired token"))
	}
}
