// Fake student data for testing and development

export const fakeStudents = [
  {
    id: 1,
    firstName: "Emma",
    middleName: "Grace",
    lastName: "Johnson",
    grade: "3",
    createdAt: "2024-01-15T10:30:00.000Z",

    notes:
      "Excellent progress in reading comprehension. Needs support with multiplication tables.",
    isActive: true,
  },
  {
    id: 2,
    firstName: "Liam",
    middleName: "Alexander",
    lastName: "Williams",
    grade: "5",
    createdAt: "2024-01-20T14:15:00.000Z",

    notes:
      "Strong analytical skills. Shows great interest in science experiments.",
    isActive: true,
  },
  {
    id: 3,
    firstName: "Sophia",
    middleName: "Rose",
    lastName: "Brown",
    grade: "2",
    createdAt: "2024-02-01T09:45:00.000Z",

    notes: "Creative and artistic. Loves storytelling and drawing activities.",
    isActive: true,
  },
  {
    id: 4,
    firstName: "Noah",
    middleName: "James",
    lastName: "Davis",
    grade: "4",
    createdAt: "2024-02-10T11:20:00.000Z",
  },
  {
    id: 5,
    firstName: "Olivia",
    middleName: "Marie",
    lastName: "Miller",
    grade: "K",
    createdAt: "2024-02-15T08:30:00.000Z",
    subjects: ["english", "art"],
    notes:
      "Developing fine motor skills. Shows enthusiasm for learning letters and colors.",
    isActive: true,
  },
  {
    id: 6,
    firstName: "Ethan",
    middleName: "Cole",
    lastName: "Wilson",
    grade: "6",
    createdAt: "2024-03-01T13:10:00.000Z",
    subjects: ["math", "science", "spanish"],
    notes:
      "Advanced problem solver. Shows aptitude for languages and enjoys challenges.",
    isActive: true,
  },
  {
    id: 7,
    firstName: "Ava",
    middleName: "Claire",
    lastName: "Moore",
    grade: "1",
    createdAt: "2024-03-05T10:00:00.000Z",
    subjects: ["english", "music", "art"],
    notes:
      "Musical talent. Loves singing and has a natural rhythm. Reading at grade level.",
    isActive: true,
  },
  {
    id: 8,
    firstName: "Mason",
    middleName: "Reid",
    lastName: "Taylor",
    grade: "7",
    createdAt: "2024-03-12T15:30:00.000Z",
    subjects: ["math", "science", "history"],
    notes: "Transitioning well to middle school. Strong in STEM subjects.",
    isActive: true,
  },
];

// Helper functions for working with fake student data
export const getStudentById = (id) => {
  return fakeStudents.find((student) => student.id === id);
};

export const getStudentsByGrade = (grade) => {
  return fakeStudents.filter((student) => student.grade === grade);
};

export const getActiveStudents = () => {
  return fakeStudents.filter((student) => student.isActive);
};

export const getStudentsBySubject = (subject) => {
  return fakeStudents.filter((student) => student.subjects.includes(subject));
};

export const addNewStudent = (studentData) => {
  const newStudent = {
    id: Math.max(...fakeStudents.map((s) => s.id)) + 1,
    ...studentData,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  fakeStudents.push(newStudent);
  return newStudent;
};

export const updateStudentNotes = (studentId, newNotes, category = null) => {
  const studentIndex = fakeStudents.findIndex(
    (student) => student.id === studentId
  );
  if (studentIndex !== -1) {
    const noteWithDate = {
      content: newNotes,
      category: category,
      createdAt: new Date().toISOString(),
    };

    // Initialize notes as array if it doesn't exist or is a string (old format)
    if (!Array.isArray(fakeStudents[studentIndex].notes)) {
      fakeStudents[studentIndex].notes = [];
    }

    // Add new note to the array
    fakeStudents[studentIndex].notes.push(noteWithDate);
    return fakeStudents[studentIndex];
  }
  return null;
};

export const deleteStudentNotes = (studentId) => {
  const studentIndex = fakeStudents.findIndex(
    (student) => student.id === studentId
  );
  if (studentIndex !== -1) {
    fakeStudents[studentIndex].notes = [];
    return fakeStudents[studentIndex];
  }
  return null;
};

export const deleteSpecificNote = (studentId, noteIndex) => {
  const studentIndex = fakeStudents.findIndex(
    (student) => student.id === studentId
  );
  if (studentIndex !== -1 && Array.isArray(fakeStudents[studentIndex].notes)) {
    fakeStudents[studentIndex].notes.splice(noteIndex, 1);
    return fakeStudents[studentIndex];
  }
  return null;
};
