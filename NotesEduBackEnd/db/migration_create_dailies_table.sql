-- Create dailies table
CREATE TABLE IF NOT EXISTS dailies (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dailies_student_id ON dailies(student_id);
CREATE INDEX IF NOT EXISTS idx_dailies_teacher_id ON dailies(teacher_id);
CREATE INDEX IF NOT EXISTS idx_dailies_created_at ON dailies(created_at);
