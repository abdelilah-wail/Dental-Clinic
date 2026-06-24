import axios from "axios"
import { useAuthStore } from "@/features/auth/authStore"
import { refreshToken } from "@/features/auth/authApi"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "/api",
	withCredentials: false,
})

// Attach access token from the auth store.
api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

// Silent refresh on 401, then retry the original request once.
let refreshing = null
api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config
		const status = error.response ? error.response.status : null

		if (status === 401 && !original._retry) {
			original._retry = true
			try {
				refreshing = refreshing || refreshToken()
				const accessToken = await refreshing
				refreshing = null
				useAuthStore.getState().setToken(accessToken)
				original.headers.Authorization = `Bearer ${accessToken}`
				return api(original)
			} catch (e) {
				refreshing = null
				useAuthStore.getState().clearSession()
				window.location.href = "/login"
				return Promise.reject(e)
			}
		}
		return Promise.reject(error)
	},
)

