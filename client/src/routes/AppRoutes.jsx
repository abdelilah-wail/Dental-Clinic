import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { RoleGuard } from "./RoleGuard"
import AppLayout from "../components/layout/AppLayout"
import LoginPage from "../features/auth/LoginPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import PatientsPage from "../features/patients/PatientsPage"
import PatientProfilePage from "../features/patients/PatientProfilePage"
import DentalChartPage from "../features/dental-chart/DentalChartPage"
import AppointmentsPage from "../features/appointments/AppointmentsPage"
import TreatmentsPage from "../features/treatments/TreatmentsPage"
import XrayPage from "../features/xray/XrayPage"
import BillingPage from "../features/billing/BillingPage"
import InsurancePage from "../features/insurance/InsurancePage"
import InventoryPage from "../features/inventory/InventoryPage"
import StaffPage from "../features/staff/StaffPage"
import NotFoundPage from "../components/NotFoundPage"
import ReportsPage from "../features/reports/ReportsPage"

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route path="/dashboard" element={<DashboardPage />} />

					<Route element={<RoleGuard permission="patients.read" />}>
						<Route path="/patients" element={<PatientsPage />} />
						<Route path="/patients/:id" element={<PatientProfilePage />} />
					</Route>

					<Route element={<RoleGuard permission="charts.read" />}>
						<Route path="/patients/:id/chart" element={<DentalChartPage />} />
					</Route>

					<Route element={<RoleGuard permission="appointments.read" />}>
						<Route path="/appointments" element={<AppointmentsPage />} />
					</Route>

					<Route element={<RoleGuard permission="treatments.read" />}>
						<Route path="/treatments" element={<TreatmentsPage />} />
					</Route>

					<Route element={<RoleGuard permission="xray.read" />}>
						<Route path="/xrays" element={<XrayPage />} />
					</Route>

					<Route element={<RoleGuard permission="billing.read" />}>
						<Route path="/billing" element={<BillingPage />} />
					</Route>

					<Route element={<RoleGuard permission="insurance.read" />}>
						<Route path="/insurance" element={<InsurancePage />} />
					</Route>

					<Route element={<RoleGuard permission="inventory.read" />}>
						<Route path="/inventory" element={<InventoryPage />} />
					</Route>

					<Route element={<RoleGuard permission="staff.read" />}>
						<Route path="/staff" element={<StaffPage />} />
					</Route>

                    <Route element={<RoleGuard permission="reports.read" />}>
						<Route path="/reports" element={<ReportsPage />} />
					</Route>
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default AppRoutes
