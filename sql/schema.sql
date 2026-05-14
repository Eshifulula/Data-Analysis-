CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','supervisor','viewer')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shifts (
  id BIGSERIAL PRIMARY KEY,
  shift_date DATE NOT NULL,
  shift_type VARCHAR(10) NOT NULL CHECK (shift_type IN ('Day','Night')),
  employee_name VARCHAR(120) NOT NULL,
  check_in_time TIME NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  location VARCHAR(160) NOT NULL,
  submitted_by BIGINT REFERENCES users(id),
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action VARCHAR(40) NOT NULL,
  table_name VARCHAR(40) NOT NULL,
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_shift_type ON shifts(shift_type);
CREATE INDEX IF NOT EXISTS idx_shifts_employee ON shifts(LOWER(employee_name));
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_shift_worker
ON shifts (shift_date, shift_type, LOWER(employee_name))
WHERE is_deleted = FALSE;
