import { create } from "zustand"
import { persist } from "zustand/middleware"

function mapUser(user) {
	if (!user) return null
	return {
		...user,
		name: user.fullName || user.name || "",
	}
}

export const useAuthStore = create(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			setSession: (user, accessToken, refreshToken) =>
				set({
					user: mapUser(user),
					accessToken,
					refreshToken,
					isAuthenticated: true,
				}),
			setToken: (accessToken) => set({ accessToken }),
			clearSession: () =>
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
				}),
		}),
		{ name: "dcms-auth" },
	),
)
