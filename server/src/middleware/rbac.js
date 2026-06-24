import { ApiError } from "./errorHandler.js"
import { hasPermission } from "../lib/roles.js"

// Guards a route behind a single permission string, e.g. requirePermission("patients.write").
export function requirePermission(permission) {
	return (req, res, next) => {
		if (!req.user) {
			return next(new ApiError(401, "Authentication required"))
		}
		if (!hasPermission(req.user.role, permission)) {
			return next(new ApiError(403, "You do not have permission to do that"))
		}
		next()
	}
}
