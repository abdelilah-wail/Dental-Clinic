import dotenv from "dotenv"

dotenv.config()

function required(name, fallback) {
	const value = process.env[name] ?? fallback
	if (value === undefined || value === "") {
		throw new Error(`Missing required environment variable: ${name}`)
	}
	return value
}

export const env = {
	port: Number(process.env.PORT) || 4000,
	nodeEnv: process.env.NODE_ENV || "development",
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
	databaseUrl: required("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/dental_clinic"),
	pgSsl: process.env.PGSSL === "true",
	jwt: {
		accessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret"),
		refreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret"),
		accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
		refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
	},
	bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
	supabase: {
		url: process.env.SUPABASE_URL || "",
		serviceKey: process.env.SUPABASE_SERVICE_KEY || "",
		bucket: process.env.SUPABASE_BUCKET || "xrays",
	},
}
