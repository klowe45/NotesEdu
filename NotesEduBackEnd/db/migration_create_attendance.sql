-- Create sequence first
CREATE SEQUENCE IF NOT EXISTS attendance_id_seq;

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY DEFAULT nextval('attendance_id_seq'),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  appeared BOOLEAN NOT NULL DEFAULT false,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Set sequence ownership
ALTER SEQUENCE attendance_id_seq OWNED BY attendance.id;

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_name ON attendance(first_name, last_name);
