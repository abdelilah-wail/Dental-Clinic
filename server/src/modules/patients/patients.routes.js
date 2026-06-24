import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./patients.controller.js"

export const patientsRouter = Router()

// every patient route requires a logged-in user
patientsRouter.use(requireAuth)

patientsRouter.get("/", requirePermission("patients.read"), list)
patientsRouter.get("/:id", requirePermission("patients.read"), getOne)
patientsRouter.post("/", requirePermission("patients.write"), create)
patientsRouter.put("/:id", requirePermission("patients.write"), update)
patientsRouter.delete("/:id", requirePermission("patients.write"), remove)
