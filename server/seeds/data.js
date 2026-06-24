// Demo seed data mirroring the original mock layer.
// Passwords are hashed in run.js; every demo user shares the same password.

export const DEMO_PASSWORD = "password"

export const USERS = [
	{ email: "admin@clinic.dz", fullName: "Rachid Mansouri", role: "admin" },
	{ email: "dentist@clinic.dz", fullName: "Amine Benali", role: "dentist" },
	{ email: "reception@clinic.dz", fullName: "Sofiane Brahimi", role: "receptionist" },
	{ email: "accountant@clinic.dz", fullName: "Nadia Cherif", role: "accountant" },
]

export const STAFF = [
	{ firstName: "Amine", lastName: "Benali", role: "dentist", email: "amine@clinic.dz", phone: "0550 11 22 33", specialty: "Orthodontics", status: "active", hireDate: "2019-03-12", color: "#d4af37" },
	{ firstName: "Yasmine", lastName: "Haddad", role: "dentist", email: "yasmine@clinic.dz", phone: "0551 22 33 44", specialty: "Endodontics", status: "active", hireDate: "2020-06-01", color: "#3b82f6" },
	{ firstName: "Karima", lastName: "Saad", role: "assistant", email: "karima@clinic.dz", phone: "0552 33 44 55", specialty: "", status: "active", hireDate: "2021-09-15", color: "#10b981" },
	{ firstName: "Sofiane", lastName: "Brahimi", role: "receptionist", email: "reception@clinic.dz", phone: "0553 44 55 66", specialty: "", status: "active", hireDate: "2022-01-10", color: "#a855f7" },
	{ firstName: "Nadia", lastName: "Cherif", role: "accountant", email: "accountant@clinic.dz", phone: "0554 55 66 77", specialty: "", status: "active", hireDate: "2021-04-20", color: "#f59e0b" },
	{ firstName: "Rachid", lastName: "Mansouri", role: "admin", email: "admin@clinic.dz", phone: "0555 66 77 88", specialty: "", status: "inactive", hireDate: "2018-11-05", color: "#ef4444" },
]

export const PATIENTS = [
	{ firstName: "Mohamed", lastName: "Benaissa", phone: "0661 23 45 67", nin: "1198012345678", dateOfBirth: "1980-05-14", gender: "male", email: "m.benaissa@email.dz", address: "12 Rue Didouche Mourad, Alger", bloodType: "O+", wilaya: "Alger", commune: "Sidi M'Hamed", insurance: "cnas", emergencyContact: "0661 00 11 22", status: "active" },
	{ firstName: "Fatima Zohra", lastName: "Belkacem", phone: "0662 34 56 78", nin: "2298523456789", dateOfBirth: "1985-09-22", gender: "female", email: "fz.belkacem@email.dz", address: "5 Boulevard Zighoud Youcef, Oran", bloodType: "A+", wilaya: "Oran", commune: "Oran", insurance: "casnos", emergencyContact: "0662 99 88 77", status: "active" },
	{ firstName: "Yacine", lastName: "Boumediene", phone: "0663 45 67 89", nin: "1199034567890", dateOfBirth: "1990-01-03", gender: "male", email: "y.boumediene@email.dz", address: "23 Rue Larbi Ben Mhidi, Constantine", bloodType: "B+", wilaya: "Constantine", commune: "Constantine", insurance: "none", emergencyContact: "0663 11 22 33", status: "active" },
	{ firstName: "Amina", lastName: "Khelifi", phone: "0664 56 78 90", nin: "2299245678901", dateOfBirth: "1992-11-30", gender: "female", email: "a.khelifi@email.dz", address: "8 Cite des Asphodeles, Alger", bloodType: "AB+", wilaya: "Alger", commune: "Ben Aknoun", insurance: "private", emergencyContact: "0664 44 55 66", status: "active" },
	{ firstName: "Karim", lastName: "Ould Ali", phone: "0665 67 89 01", nin: "1197856789012", dateOfBirth: "1978-07-19", gender: "male", email: "k.ouldali@email.dz", address: "45 Rue de Tripoli, Annaba", bloodType: "O-", wilaya: "Annaba", commune: "Annaba", insurance: "cnas", emergencyContact: "0665 77 66 55", status: "active" },
	{ firstName: "Lila", lastName: "Hamdi", phone: "0666 78 90 12", nin: "2298867890123", dateOfBirth: "1988-03-08", gender: "female", email: "l.hamdi@email.dz", address: "17 Boulevard Colonel Amirouche, Bejaia", bloodType: "A-", wilaya: "Béjaïa", commune: "Béjaïa", insurance: "none", emergencyContact: "0666 22 33 44", status: "inactive" },
	{ firstName: "Sofiane", lastName: "Meziane", phone: "0667 89 01 23", nin: "1199578901234", dateOfBirth: "1995-12-25", gender: "male", email: "s.meziane@email.dz", address: "3 Rue Hassiba Ben Bouali, Setif", bloodType: "B-", wilaya: "Sétif", commune: "Sétif", insurance: "casnos", emergencyContact: "0667 88 99 00", status: "active" },
	{ firstName: "Nawal", lastName: "Bouzid", phone: "0668 90 12 34", nin: "2298390123456", dateOfBirth: "1983-06-11", gender: "female", email: "n.bowzid@email.dz", address: "29 Cite 1000 Logements, Blida", bloodType: "O+", wilaya: "Blida", commune: "Blida", insurance: "cnas", emergencyContact: "0668 12 34 56", status: "active" },
	{ firstName: "Riad", lastName: "Cherfaoui", phone: "0669 01 23 45", nin: "1199101234567", dateOfBirth: "1991-02-17", gender: "male", email: "r.cherfaoui@email.dz", address: "11 Rue Ahmed Zabana, Tlemcen", bloodType: "A+", wilaya: "Tlemcen", commune: "Tlemcen", insurance: "none", emergencyContact: "0669 23 45 67", status: "active" },
	{ firstName: "Samira", lastName: "Lounis", phone: "0670 12 34 56", nin: "2298712345670", dateOfBirth: "1987-10-04", gender: "female", email: "s.lounis@email.dz", address: "7 Boulevard de l'ALN, Tizi Ouzou", bloodType: "O-", wilaya: "Tizi Ouzou", commune: "Tizi Ouzou", insurance: "cnas", emergencyContact: "0670 34 56 78", status: "active" },
	{ firstName: "Bilal", lastName: "Toumi", phone: "0671 23 45 67", nin: "1199323456701", dateOfBirth: "1993-08-28", gender: "male", email: "b.toumi@email.dz", address: "19 Rue Emir Abdelkader, Mostaganem", bloodType: "AB-", wilaya: "Mostaganem", commune: "Mostaganem", insurance: "none", emergencyContact: "0671 45 67 89", status: "inactive" },
	{ firstName: "Hayat", lastName: "Ferhat", phone: "0672 34 56 78", nin: "2298934567012", dateOfBirth: "1989-04-15", gender: "female", email: "h.ferhat@email.dz", address: "2 Cite Daksi, Constantine", bloodType: "A+", wilaya: "Constantine", commune: "Constantine", insurance: "casnos", emergencyContact: "0672 56 78 90", status: "active" },
	{ firstName: "Omar", lastName: "Saadi", phone: "0673 45 67 89", nin: "1198245670123", dateOfBirth: "1982-01-09", gender: "male", email: "o.saadi@email.dz", address: "34 Rue Ben Boulaid, Batna", bloodType: "O+", wilaya: "Batna", commune: "Batna", insurance: "cnas", emergencyContact: "0673 67 89 01", status: "active" },
	{ firstName: "Imene", lastName: "Belhadj", phone: "0674 56 78 90", nin: "2299456701234", dateOfBirth: "1994-05-21", gender: "female", email: "i.belhadj@email.dz", address: "6 Cite Universitaire, Alger", bloodType: "B+", wilaya: "Alger", commune: "Alger", insurance: "private", emergencyContact: "0674 78 90 12", status: "active" },
]

export const DENTAL_CHART = {
	patientIndex: 0,
	teeth: [
		{ tooth: 11, status: "healthy" },
		{ tooth: 16, status: "filled" },
		{ tooth: 26, status: "decayed" },
		{ tooth: 36, status: "crown" },
		{ tooth: 46, status: "missing" },
	],
}

// dentistIndex points at STAFF (0 = Amine, 1 = Yasmine)
export const APPOINTMENTS = [
	{ patientIndex: 0, dentistIndex: 0, dayOffset: 0, time: "09:00", duration: 30, status: "scheduled", reason: "Routine check-up" },
	{ patientIndex: 1, dentistIndex: 1, dayOffset: 1, time: "10:30", duration: 45, status: "scheduled", reason: "Root canal consultation" },
	{ patientIndex: 2, dentistIndex: 0, dayOffset: -2, time: "14:00", duration: 30, status: "completed", reason: "Orthodontic adjustment" },
	{ patientIndex: 3, dentistIndex: 1, dayOffset: 2, time: "11:00", duration: 30, status: "scheduled", reason: "Tooth extraction" },
	{ patientIndex: 4, dentistIndex: 0, dayOffset: -5, time: "09:30", duration: 30, status: "completed", reason: "Cleaning" },
	{ patientIndex: 5, dentistIndex: 1, dayOffset: 3, time: "15:30", duration: 60, status: "scheduled", reason: "Crown fitting" },
	{ patientIndex: 6, dentistIndex: 0, dayOffset: -1, time: "16:00", duration: 20, status: "cancelled", reason: "Whitening consult" },
	{ patientIndex: 7, dentistIndex: 1, dayOffset: 5, time: "13:00", duration: 30, status: "scheduled", reason: "Filling" },
]

export const TREATMENTS = [
	{ patientIndex: 0, procedure: "cleaning", tooth: "", status: "completed", cost: 3000, dayOffset: -5 },
	{ patientIndex: 1, procedure: "rootCanal", tooth: "26", status: "planned", cost: 12000, dayOffset: 1 },
	{ patientIndex: 2, procedure: "filling", tooth: "16", status: "completed", cost: 4500, dayOffset: -2 },
	{ patientIndex: 3, procedure: "extraction", tooth: "38", status: "planned", cost: 5000, dayOffset: 2 },
	{ patientIndex: 4, procedure: "exam", tooth: "", status: "completed", cost: 1500, dayOffset: -5 },
	{ patientIndex: 5, procedure: "crown", tooth: "46", status: "planned", cost: 25000, dayOffset: 3 },
	{ patientIndex: 6, procedure: "whitening", tooth: "", status: "planned", cost: 15000, dayOffset: 0 },
	{ patientIndex: 7, procedure: "implant", tooth: "36", status: "planned", cost: 80000, dayOffset: 7 },
]

export const INVOICES = [
	{ patientIndex: 0, dayOffset: -5, total: 3000, status: "paid", notes: "Cleaning", payments: [{ amount: 3000, method: "cash", dayOffset: -5 }] },
	{ patientIndex: 2, dayOffset: -2, total: 4500, status: "partial", notes: "Filling", payments: [{ amount: 2000, method: "card", dayOffset: -2 }] },
	{ patientIndex: 4, dayOffset: -5, total: 1500, status: "paid", notes: "Exam", payments: [{ amount: 1500, method: "cash", dayOffset: -4 }] },
	{ patientIndex: 1, dayOffset: -10, total: 12000, status: "unpaid", notes: "Root canal", payments: [] },
	{ patientIndex: 5, dayOffset: -3, total: 25000, status: "partial", notes: "Crown", payments: [{ amount: 10000, method: "transfer", dayOffset: -3 }] },
	{ patientIndex: 7, dayOffset: -1, total: 5000, status: "unpaid", notes: "Extraction", payments: [] },
]

export const XRAYS = [
	{ patientIndex: 0, type: "panoramic", imageUrl: "https://placehold.co/600x400?text=Panoramic", notes: "Full mouth", dayOffset: -5 },
	{ patientIndex: 1, type: "periapical", imageUrl: "https://placehold.co/600x400?text=Periapical", notes: "Tooth 26", dayOffset: 1 },
	{ patientIndex: 2, type: "bitewing", imageUrl: "https://placehold.co/600x400?text=Bitewing", notes: "Right molars", dayOffset: -2 },
	{ patientIndex: 4, type: "panoramic", imageUrl: "https://placehold.co/600x400?text=Panoramic", notes: "Routine", dayOffset: -5 },
	{ patientIndex: 5, type: "cephalometric", imageUrl: "https://placehold.co/600x400?text=Cephalometric", notes: "Ortho planning", dayOffset: -3 },
	{ patientIndex: 7, type: "periapical", imageUrl: "https://placehold.co/600x400?text=Periapical", notes: "Implant site 36", dayOffset: -1 },
]

export const CLAIMS = [
	{ patientIndex: 0, provider: "CNAS", amount: 3000, amountReimbursed: 2400, status: "approved", notes: "Cleaning", dayOffset: -4 },
	{ patientIndex: 1, provider: "CASNOS", amount: 12000, amountReimbursed: 0, status: "submitted", notes: "Root canal", dayOffset: -1 },
	{ patientIndex: 2, provider: "CNAS", amount: 4500, amountReimbursed: 3600, status: "approved", notes: "Filling", dayOffset: -2 },
	{ patientIndex: 4, provider: "SAA", amount: 1500, amountReimbursed: 0, status: "draft", notes: "Exam", dayOffset: -5 },
	{ patientIndex: 5, provider: "CNAS", amount: 25000, amountReimbursed: 10000, status: "partial", notes: "Crown", dayOffset: -3 },
	{ patientIndex: 7, provider: "CASNOS", amount: 5000, amountReimbursed: 0, status: "rejected", notes: "Extraction", dayOffset: -1 },
]

export const INVENTORY = [
	{ name: "Latex Gloves", sku: "GLV-001", category: "Consumables", quantity: 40, reorderLevel: 10, unit: "box", supplier: "MedSupply DZ", unitCost: 800, notes: "" },
	{ name: "Dental Anesthetic", sku: "ANS-002", category: "Medication", quantity: 8, reorderLevel: 10, unit: "vial", supplier: "PharmaDent", unitCost: 1200, notes: "Lidocaine 2%" },
	{ name: "Composite Resin", sku: "CMP-003", category: "Materials", quantity: 25, reorderLevel: 5, unit: "syringe", supplier: "DentMat", unitCost: 2500, notes: "" },
	{ name: "Disposable Masks", sku: "MSK-004", category: "Consumables", quantity: 0, reorderLevel: 20, unit: "box", supplier: "MedSupply DZ", unitCost: 600, notes: "Out of stock" },
	{ name: "Dental Burs", sku: "BUR-005", category: "Instruments", quantity: 60, reorderLevel: 15, unit: "pack", supplier: "DentMat", unitCost: 1500, notes: "" },
	{ name: "X-Ray Film", sku: "XRF-006", category: "Imaging", quantity: 12, reorderLevel: 10, unit: "pack", supplier: "ImageDent", unitCost: 3000, notes: "" },
	{ name: "Fluoride Gel", sku: "FLG-007", category: "Materials", quantity: 18, reorderLevel: 8, unit: "tube", supplier: "PharmaDent", unitCost: 900, notes: "" },
	{ name: "Sterilization Pouches", sku: "STP-008", category: "Consumables", quantity: 4, reorderLevel: 25, unit: "box", supplier: "MedSupply DZ", unitCost: 1100, notes: "Reorder soon" },
]
