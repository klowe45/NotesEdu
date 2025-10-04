const API = "http://localhost:4000/api";

export async function getAllStudents() {
  const r = await fetch(`${API}/students`);
  return r.json();
}

export async function getStudentById(id) {
  const r = await fetch(`${API}/students/${id}`);
  return r.json();
}

export async function createStudent(payload) {
  const r = await fetch(`${API}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}
