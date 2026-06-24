import { Router } from "express"
import multer from "multer"
import { requireAuth } from "../../middleware/auth.js"
import { requirePermission } from "../../middleware/rbac.js"
import { list, getOne, create, update, remove } from "./xrays.controller.js"

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 15 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const ok = /^image\//.test(file.mimetype) || file.mimetype === "application/pdf"
		cb(ok ? null : new Error("Only image or PDF files are allowed"), ok)
	},
})

export const xraysRouter = Router()

xraysRouter.use(requireAuth)

xraysRouter.get("/", requirePermission("xray.read"), list)
xraysRouter.get("/:id", requirePermission("xray.read"), getOne)
xraysRouter.post("/", requirePermission("xray.write"), upload.single("image"), create)
xraysRouter.put("/:id", requirePermission("xray.write"), update)
xraysRouter.delete("/:id", requirePermission("xray.write"), remove)
