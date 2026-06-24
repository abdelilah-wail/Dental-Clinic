import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, adjust, remove } from "./inventory.controller.js"

export const inventoryRouter = Router()

inventoryRouter.use(requireAuth)

inventoryRouter.get("/", requirePermission("inventory.read"), list)
inventoryRouter.get("/:id", requirePermission("inventory.read"), getOne)
inventoryRouter.post("/", requirePermission("inventory.write"), create)
inventoryRouter.put("/:id", requirePermission("inventory.write"), update)
inventoryRouter.post("/:id/adjust", requirePermission("inventory.write"), adjust)
inventoryRouter.delete("/:id", requirePermission("inventory.write"), remove)
