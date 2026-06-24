import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./insurance.controller.js"

export const insuranceRouter = Router()

insuranceRouter.use(requireAuth)

insuranceRouter.get("/", requirePermission("insurance.read"), list)
insuranceRouter.get("/:id", requirePermission("insurance.read"), getOne)
insuranceRouter.post("/", requirePermission("insurance.write"), create)
insuranceRouter.put("/:id", requirePermission("insurance.write"), update)
insuranceRouter.delete("/:id", requirePermission("insurance.write"), remove)
