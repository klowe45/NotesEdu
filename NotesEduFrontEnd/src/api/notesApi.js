const API = "http://localhost:4000/api";

export async function getStudents() {
  const r = await fetch(`${API}/students`);
  return r.json();
}

export async function getStudentNotes(id) {
  const r = await fetch(`${API}/students/${id}/notes`);
  return r.json();
}

export async function createNote(studentId, payload) {
  const r = await fetch(`${API}/students/${studentId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}
