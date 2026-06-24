// Algeria-specific reference data — single source of truth.
export const WILAYAS = [
	"Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
	"Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
	"Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
	"Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
	"M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
	"Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
	"El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
	"Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
	"Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
	"In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
]

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export const INSURANCE_PROVIDERS = [
	{ value: "cnas", label: "CNAS" },
	{ value: "casnos", label: "CASNOS" },
	{ value: "private", label: "Private" },
	{ value: "none", label: "None" },
]

export const GENDERS = [
	{ value: "male", key: "patients.male" },
	{ value: "female", key: "patients.female" },
]

export const PATIENT_STATUS = ["active", "inactive", "archived"]
