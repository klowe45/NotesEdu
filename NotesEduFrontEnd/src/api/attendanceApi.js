const API = "http://localhost:4000/api";

export async function submitAttendance(attendanceData) {
  const r = await fetch(`${API}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendanceData }),
  });
  return r.json();
}

export async function getAllAttendance() {
  const r = await fetch(`${API}/attendance`);
  return r.json();
}

export async function getClientAttendance(firstName, lastName) {
  const r = await fetch(`${API}/attendance`);
  const allAttendance = await r.json();

  // Filter attendance records for this specific client
  return allAttendance.filter(record =>
    record.first_name === firstName && record.last_name === lastName
  );
}
