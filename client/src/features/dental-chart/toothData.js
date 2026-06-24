// FDI (ISO 3950) permanent dentition — two-digit notation.
// Quadrant 1: upper right · 2: upper left · 3: lower left · 4: lower right.

export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38]

export const UPPER_ARCH = [...UPPER_RIGHT, ...UPPER_LEFT]
export const LOWER_ARCH = [...LOWER_RIGHT, ...LOWER_LEFT]

// Tooth type from the second FDI digit (1..8).
export function toothType(id) {
	const n = id % 10
	if (n <= 2) return "incisor"
	if (n === 3) return "canine"
	if (n <= 5) return "premolar"
	return "molar"
}

export function isAnterior(id) {
	const type = toothType(id)
	return type === "incisor" || type === "canine"
}
