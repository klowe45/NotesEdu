// Fake client data for testing and development

export const fakeClients = [
  {
    id: 1,
    firstName: "Emma",
    middleName: "Grace",
    lastName: "Johnson",
    grade: "3",
    createdAt: "2024-01-15T10:30:00.000Z",
    subjects: ["math", "english", "science"],
    notes: "Excellent progress in reading comprehension. Needs support with multiplication tables.",
    isActive: true
  },
  {
    id: 2,
    firstName: "Liam",
    middleName: "Alexander",
    lastName: "Williams",
    grade: "5",
    createdAt: "2024-01-20T14:15:00.000Z",
    subjects: ["math", "science", "history"],
    notes: "Strong analytical skills. Shows great interest in science experiments.",
    isActive: true
  },
  {
    id: 3,
    firstName: "Sophia",
    middleName: "Rose",
    lastName: "Brown",
    grade: "2",
    createdAt: "2024-02-01T09:45:00.000Z",
    subjects: ["english", "art", "music"],
    notes: "Creative and artistic. Loves storytelling and drawing activities.",
    isActive: true
  },
  {
    id: 4,
    firstName: "Noah",
    middleName: "James",
    lastName: "Davis",
    grade: "4",
    createdAt: "2024-02-10T11:20:00.000Z",
    subjects: ["math", "pe", "science"],
    notes: "Very active learner. Excels in physical activities and enjoys hands-on learning.",
    isActive: true
  },
  {
    id: 5,
    firstName: "Olivia",
    middleName: "Marie",
    lastName: "Miller",
    grade: "K",
    createdAt: "2024-02-15T08:30:00.000Z",
    subjects: ["english", "art"],
    notes: "Developing fine motor skills. Shows enthusiasm for learning letters and colors.",
    isActive: true
  },
  {
    id: 6,
    firstName: "Ethan",
    middleName: "Cole",
    lastName: "Wilson",
    grade: "6",
    createdAt: "2024-03-01T13:10:00.000Z",
    subjects: ["math", "science", "spanish"],
    notes: "Advanced problem solver. Shows aptitude for languages and enjoys challenges.",
    isActive: true
  },
  {
    id: 7,
    firstName: "Ava",
    middleName: "Claire",
    lastName: "Moore",
    grade: "1",
    createdAt: "2024-03-05T10:00:00.000Z",
    subjects: ["english", "music", "art"],
    notes: "Musical talent. Loves singing and has a natural rhythm. Reading at grade level.",
    isActive: true
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
    isActive: true
  }
];

// Helper functions for working with fake client data
export const getClientById = (id) => {
  return fakeClients.find(client => client.id === id);
};

export const getClientsByGrade = (grade) => {
  return fakeClients.filter(client => client.grade === grade);
};

export const getActiveClients = () => {
  return fakeClients.filter(client => client.isActive);
};

export const getClientsBySubject = (subject) => {
  return fakeClients.filter(client => client.subjects.includes(subject));
};

export const addNewClient = (clientData) => {
  const newClient = {
    id: Math.max(...fakeClients.map(c => c.id)) + 1,
    ...clientData,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  fakeClients.push(newClient);
  return newClient;
};

export const updateClientNotes = (clientId, newNotes, category = null) => {
  const clientIndex = fakeClients.findIndex(client => client.id === clientId);
  if (clientIndex !== -1) {
    const noteWithDate = {
      content: newNotes,
      category: category,
      createdAt: new Date().toISOString()
    };

    // Initialize notes as array if it doesn't exist or is a string (old format)
    if (!Array.isArray(fakeClients[clientIndex].notes)) {
      fakeClients[clientIndex].notes = [];
    }

    // Add new note to the array
    fakeClients[clientIndex].notes.push(noteWithDate);
    return fakeClients[clientIndex];
  }
  return null;
};

export const deleteClientNotes = (clientId) => {
  const clientIndex = fakeClients.findIndex(client => client.id === clientId);
  if (clientIndex !== -1) {
    fakeClients[clientIndex].notes = [];
    return fakeClients[clientIndex];
  }
  return null;
};

export const deleteSpecificNote = (clientId, noteIndex) => {
  const clientIndex = fakeClients.findIndex(client => client.id === clientId);
  if (clientIndex !== -1 && Array.isArray(fakeClients[clientIndex].notes)) {
    fakeClients[clientIndex].notes.splice(noteIndex, 1);
    return fakeClients[clientIndex];
  }
  return null;
};