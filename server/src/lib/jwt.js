import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function signAccessToken(user) {
	return jwt.sign(
		{ sub: user.id, email: user.email, role: user.role, type: "access" },
		env.jwt.accessSecret,
		{ expiresIn: env.jwt.accessExpires },
	)
}

export function signRefreshToken(user) {
	return jwt.sign(
		{ sub: user.id, type: "refresh" },
		env.jwt.refreshSecret,
		{ expiresIn: env.jwt.refreshExpires },
	)
}

export function verifyAccessToken(token) {
	const payload = jwt.verify(token, env.jwt.accessSecret)
	if (payload.type !== "access") throw new Error("Invalid token type")
	return payload
}

export function verifyRefreshToken(token) {
	const payload = jwt.verify(token, env.jwt.refreshSecret)
	if (payload.type !== "refresh") throw new Error("Invalid token type")
	return payload
}
