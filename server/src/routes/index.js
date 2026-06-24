import { Router } from "express"
import { authRouter } from "../modules/auth/auth.routes.js"
import { patientsRouter } from "../modules/patients/patients.routes.js"
import { chartsRouter } from "../modules/charts/charts.routes.js"
import { appointmentsRouter } from "../modules/appointments/appointments.routes.js"
import { treatmentsRouter } from "../modules/treatments/treatments.routes.js"
import { billingRouter } from "../modules/billing/billing.routes.js"
import { xraysRouter } from "../modules/xrays/xrays.routes.js"
import { insuranceRouter } from "../modules/insurance/insurance.routes.js"
import { inventoryRouter } from "../modules/inventory/inventory.routes.js"
import { staffRouter } from "../modules/staff/staff.routes.js"
import { reportsRouter } from "../modules/reports/reports.routes.js"

export const router = Router()

router.get("/health", (req, res) => {
	res.json({ status: "ok", time: new Date().toISOString() })
})

router.use("/auth", authRouter)
router.use("/patients", patientsRouter)
router.use("/charts", chartsRouter)
router.use("/appointments", appointmentsRouter)
router.use("/treatments", treatmentsRouter)
router.use("/invoices", billingRouter)
router.use("/xrays", xraysRouter)
router.use("/insurance", insuranceRouter)
router.use("/inventory", inventoryRouter)
router.use("/staff", staffRouter)
router.use("/reports", reportsRouter)
