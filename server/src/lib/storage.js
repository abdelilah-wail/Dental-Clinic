import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "node:crypto"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const BUCKET = process.env.SUPABASE_BUCKET || "xrays"

// Read directly from process.env so swapping providers never touches config/env.js.
let client = null
function getClient() {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		throw new Error(
			"Supabase storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_KEY)",
		)
	}
	if (!client) {
		client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: { persistSession: false },
		})
	}
	return client
}

function extensionFor(name = "") {
	const dot = name.lastIndexOf(".")
	return dot >= 0 ? name.slice(dot) : ""
}

// Swappable storage interface: uploadFile / getSignedUrl / removeFile.
export const storage = {
	async uploadFile({ buffer, mimeType, originalName, folder = "xrays" }) {
		const key = `${folder}/${randomUUID()}${extensionFor(originalName)}`
		const { error } = await getClient()
			.storage.from(BUCKET)
			.upload(key, buffer, { contentType: mimeType, upsert: false })
		if (error) throw new Error(`Upload failed: ${error.message}`)
		const { data } = getClient().storage.from(BUCKET).getPublicUrl(key)
		return { key, url: data.publicUrl }
	},

	async getSignedUrl(key, expiresIn = 3600) {
		const { data, error } = await getClient()
			.storage.from(BUCKET)
			.createSignedUrl(key, expiresIn)
		if (error) throw new Error(`Signed URL failed: ${error.message}`)
		return data.signedUrl
	},

	async removeFile(key) {
		if (!key) return
		const { error } = await getClient().storage.from(BUCKET).remove([key])
		if (error) throw new Error(`Delete failed: ${error.message}`)
	},
}
