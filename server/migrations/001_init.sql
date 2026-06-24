-- 001_init.sql -- initial schema for the dental clinic API

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'receptionist',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'assistant',
  email       TEXT,
  phone       TEXT,
  specialty   TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'active',
  hire_date   DATE,
  color       TEXT NOT NULL DEFAULT '#d4af37',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patients (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  file_number     TEXT UNIQUE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  phone           TEXT,
  nin             TEXT,
  date_of_birth   DATE,
  gender          TEXT,
  email           TEXT,
  address         TEXT,
  medical_history JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dental_charts (
  patient_id BIGINT PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
  teeth      JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  dentist_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  date       DATE NOT NULL,
  time       TEXT,
  duration   INTEGER,
  status     TEXT NOT NULL DEFAULT 'scheduled',
  reason     TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS treatments (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  procedure  TEXT,
  tooth      TEXT,
  status     TEXT NOT NULL DEFAULT 'planned',
  cost       NUMERIC(12,2) NOT NULL DEFAULT 0,
  date       DATE,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_number TEXT UNIQUE,
  patient_id     BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  total          NUMERIC(12,2) NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'unpaid',
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  method     TEXT NOT NULL DEFAULT 'cash',
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS xrays (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type       TEXT,
  image_url  TEXT,
  file_path  TEXT,
  notes      TEXT,
  date       DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  claim_number      TEXT UNIQUE,
  patient_id        BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider          TEXT,
  amount            NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_reimbursed NUMERIC(12,2) NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'draft',
  notes             TEXT,
  date              DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL,
  sku           TEXT UNIQUE,
  category      TEXT,
  quantity      INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  unit          TEXT NOT NULL DEFAULT 'unit',
  supplier      TEXT,
  unit_cost     NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- helpful indexes for the common filters
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date    ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_treatments_patient   ON treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient     ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice     ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_xrays_patient        ON xrays(patient_id);
CREATE INDEX IF NOT EXISTS idx_claims_patient       ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_staff_role           ON staff(role);
