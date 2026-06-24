import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/features/auth/authStore"

export function ProtectedRoute() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
	const location = useLocation()
	const redirectState = { from: location }

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={redirectState} />
	}
	return <Outlet />
}
