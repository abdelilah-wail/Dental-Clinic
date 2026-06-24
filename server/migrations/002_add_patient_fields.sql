-- 002_add_patient_fields.sql -- Add missing columns to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS blood_type TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS wilaya TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS commune TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
