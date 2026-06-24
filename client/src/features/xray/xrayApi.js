import { api } from "@/lib/api"

export async function fetchXrays(params) {
	const { data } = await api.get("/xrays", { params })
	return data.items || []
}

/**
 * createXray accepts the form data object from XrayUploadModal.
 * If imageUrl is a local blob:// URL (from the file picker), we fetch it back
 * as a Blob and send multipart/form-data with the "image" field.
 * If imageUrl is a plain https:// URL (pasted), we send it as a text field.
 */
export async function createXray(payload) {
	const { imageUrl, file: fileRef, ...fields } = payload

	// Case 1: a local blob URL was produced by onFile() in the modal
	if (imageUrl && imageUrl.startsWith("blob:")) {
		const blob = await fetch(imageUrl).then((r) => r.blob())
		const formData = new FormData()
		formData.append("image", blob, "xray.png")
		if (fields.patientId) formData.append("patientId", fields.patientId)
		if (fields.type) formData.append("type", fields.type)
		if (fields.notes) formData.append("notes", fields.notes)
		if (fields.date) formData.append("date", fields.date)
		const { data } = await api.post("/xrays", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
		return data
	}

	// Case 2: a file object was passed directly
	if (fileRef instanceof File) {
		const formData = new FormData()
		formData.append("image", fileRef)
		if (fields.patientId) formData.append("patientId", fields.patientId)
		if (fields.type) formData.append("type", fields.type)
		if (fields.notes) formData.append("notes", fields.notes)
		if (fields.date) formData.append("date", fields.date)
		const { data } = await api.post("/xrays", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
		return data
	}

	// Case 3: imageUrl is an external URL — unsupported by backend (needs a file)
	throw new Error("An image file is required. Please select a file to upload.")
}

export async function updateXray(id, payload) {
	const { data } = await api.put("/xrays/" + id, payload)
	return data
}

export async function deleteXray(id) {
	await api.delete("/xrays/" + id)
	return id
}
