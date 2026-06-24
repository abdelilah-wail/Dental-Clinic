import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { login as loginRequest, logout as logoutRequest } from "./authApi"
import { useAuthStore } from "./authStore"
import { useToast } from "@/providers/ToastProvider"

export function useLogin() {
	const navigate = useNavigate()
	const setSession = useAuthStore((s) => s.setSession)
	const toast = useToast()
	const { t } = useTranslation()

	return useMutation({
		mutationFn: loginRequest,
		onSuccess: (data) => {
			setSession(data.user, data.accessToken, data.refreshToken)
			const name = data.user?.fullName || data.user?.name || ""
			toast.success(t("auth.welcome"), t("auth.hello", { name }))
			navigate("/dashboard", { replace: true })
		},
	})
}

export function useLogout() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const clearSession = useAuthStore((s) => s.clearSession)

	return useMutation({
		mutationFn: () => logoutRequest(),
		onSettled: () => {
			clearSession()
			queryClient.clear()
			navigate("/login", { replace: true })
		},
	})
}
