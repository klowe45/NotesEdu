import express from "express";
import cors from "cors";
import { assertDb } from "./db.js";
import students from "./routes/students.js";
import teachers from "./routes/teachers.js";
import notes from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/students", students);
app.use("/api/teachers", teachers);
app.use("/api/notes", notes);

app.use((err, _req, res, _next) => {
  console.error("❌ Error details:", {
    code: err.code,
    message: err.message,
    detail: err.detail,
    stack: err.stack,
  });
  res.status(500).json({ error: err.message || "Server error" });
});

const port = process.env.PORT || 4000;
assertDb().then(() => {
  app.listen(port, () => console.log(`✅ API: http://localhost:${port}`));
});
