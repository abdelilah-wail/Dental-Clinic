import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import {
	list,
	getOne,
	create,
	update,
	remove,
	recordPayment,
	deletePayment,
} from "./billing.controller.js"

export const billingRouter = Router()

billingRouter.use(requireAuth)

billingRouter.get("/", requirePermission("billing.read"), list)
billingRouter.get("/:id", requirePermission("billing.read"), getOne)
billingRouter.post("/", requirePermission("billing.write"), create)
billingRouter.put("/:id", requirePermission("billing.write"), update)
billingRouter.delete("/:id", requirePermission("billing.write"), remove)
billingRouter.post("/:id/payments", requirePermission("billing.write"), recordPayment)
billingRouter.delete("/:id/payments/:paymentId", requirePermission("billing.write"), deletePayment)
