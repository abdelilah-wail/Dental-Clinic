import { api } from "@/lib/api"
import { useAuthStore } from "./authStore"

export async function login(credentials) {
	const { data } = await api.post("/auth/login", credentials)
	return data // { user, accessToken, refreshToken }
}

export async function refreshToken() {
	const token = useAuthStore.getState().refreshToken
	if (!token) throw new Error("No refresh token found")
	const { data } = await api.post("/auth/refresh", { refreshToken: token })
	return data.accessToken
}

export async function fetchMe() {
	const { data } = await api.get("/auth/me")
	return data.user
}

export async function logout() {
	await api.post("/auth/logout")
}
