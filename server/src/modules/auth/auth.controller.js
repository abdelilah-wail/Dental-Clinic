import bcrypt from "bcryptjs"
import { asyncHandler } from "../../middleware/asyncHandler.js"
import { ApiError } from "../../middleware/errorHandler.js"
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "../../lib/jwt.js"
import { findUserByEmail, findUserById } from "./auth.queries.js"

function publicUser(user) {
	return { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
}

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body || {}
	if (!email || !password) {
		throw new ApiError(400, "Email and password are required")
	}
	const user = await findUserByEmail(email)
	if (!user) throw new ApiError(401, "Invalid email or password")
	const ok = await bcrypt.compare(password, user.passwordHash)
	if (!ok) throw new ApiError(401, "Invalid email or password")
	res.json({
		user: publicUser(user),
		accessToken: signAccessToken(user),
		refreshToken: signRefreshToken(user),
	})
})

export const refresh = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body || {}
	if (!refreshToken) throw new ApiError(400, "Refresh token is required")
	let payload
	try {
		payload = verifyRefreshToken(refreshToken)
	} catch {
		throw new ApiError(401, "Invalid or expired refresh token")
	}
	const user = await findUserById(payload.sub)
	if (!user) throw new ApiError(401, "User no longer exists")
	res.json({ accessToken: signAccessToken(user) })
})

export const me = asyncHandler(async (req, res) => {
	const user = await findUserById(req.user.id)
	if (!user) throw new ApiError(404, "User not found")
	res.json({ user: publicUser(user) })
})

export const logout = asyncHandler(async (req, res) => {
	// Stateless JWT: the client simply discards its tokens.
	res.status(204).end()
})
