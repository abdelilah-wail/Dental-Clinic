import { asyncHandler } from "../../middleware/asyncHandler.js"
import { getReportSummary } from "./reports.queries.js"

export const summary = asyncHandler(async (req, res) => {
	const data = await getReportSummary()
	res.json(data)
})
