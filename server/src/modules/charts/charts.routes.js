import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { getOne, upsert } from "./charts.controller.js"

export const chartsRouter = Router()

chartsRouter.use(requireAuth)

chartsRouter.get("/:patientId", requirePermission("charts.read"), getOne)
chartsRouter.put("/:patientId", requirePermission("charts.write"), upsert)
