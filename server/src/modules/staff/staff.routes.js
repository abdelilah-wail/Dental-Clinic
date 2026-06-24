import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./staff.controller.js"

export const staffRouter = Router()

staffRouter.use(requireAuth)

// Any authenticated user can read the team roster (needed for appointment dentist pickers).
staffRouter.get("/", list)
staffRouter.get("/:id", getOne)

// Managing staff is admin-only (staff.write is covered by the admin / owner wildcard).
staffRouter.post("/", requirePermission("staff.write"), create)
staffRouter.put("/:id", requirePermission("staff.write"), update)
staffRouter.delete("/:id", requirePermission("staff.write"), remove)
