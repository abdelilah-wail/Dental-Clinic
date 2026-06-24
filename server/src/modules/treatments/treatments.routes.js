import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./treatments.controller.js"

export const treatmentsRouter = Router()

treatmentsRouter.use(requireAuth)

treatmentsRouter.get("/", requirePermission("treatments.read"), list)
treatmentsRouter.get("/:id", requirePermission("treatments.read"), getOne)
treatmentsRouter.post("/", requirePermission("treatments.write"), create)
treatmentsRouter.put("/:id", requirePermission("treatments.write"), update)
treatmentsRouter.delete("/:id", requirePermission("treatments.write"), remove)
