CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_client_id ON notes(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_teacher_id ON notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

CREATE TABLE IF NOT EXISTS dailies (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dailies_client_id ON dailies(client_id);
CREATE INDEX IF NOT EXISTS idx_dailies_teacher_id ON dailies(teacher_id);
CREATE INDEX IF NOT EXISTS idx_dailies_created_at ON dailies(created_at);

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
