import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./appointments.controller.js"

export const appointmentsRouter = Router()

appointmentsRouter.use(requireAuth)

appointmentsRouter.get("/", requirePermission("appointments.read"), list)
appointmentsRouter.get("/:id", requirePermission("appointments.read"), getOne)
appointmentsRouter.post("/", requirePermission("appointments.write"), create)
appointmentsRouter.put("/:id", requirePermission("appointments.write"), update)
appointmentsRouter.delete("/:id", requirePermission("appointments.write"), remove)
