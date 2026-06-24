import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { summary } from "./reports.controller.js"

export const reportsRouter = Router()

reportsRouter.use(requireAuth)

// The dashboard is every role's home screen, so any authenticated user can read the summary.
reportsRouter.get("/", summary)
reportsRouter.get("/summary", summary)
