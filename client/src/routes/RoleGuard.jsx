import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth/authStore"
import { hasPermission } from "@/features/auth/roles"

// Usage: <RoleGuard permission="billing.write"> ... </RoleGuard>
// or as a layout route wrapping <Outlet />.
export function RoleGuard({ permission, children }) {
	const user = useAuthStore((s) => s.user)
	const allowed = user && hasPermission(user.role, permission)

	if (!allowed) return <Navigate to="/dashboard" replace />
	return children ? children : <Outlet />
}
