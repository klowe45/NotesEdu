// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { assertDb } from "./db.js";

import clients from "./routes/clients.js";
import teachers from "./routes/teachers.js";
import notes from "./routes/notes.js";
import auth from "./routes/auth.js";
import attendance from "./routes/attendance.js";
import documents from "./routes/documents.js";
import dailies from "./routes/dailies.js";
import ratings from "./routes/ratings.js";
import medication from "./routes/medication.js";

const app = express();

/**
 * CORS
 * Set CORS_ORIGIN in Render like:
 *   https://klowe45.github.io,https://neuronenoteswi.com,https://www.neuronoteswi.com,https://neuronoteswi.com
 * (Include any domain you’ll call the API from.)
 */
const rawOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Allow localhost in dev by default
if (!rawOrigins.length) {
  rawOrigins.push(
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4000"
  );
}

app.set("trust proxy", 1);
app.use(
  cors({
    origin: function (origin, cb) {
      // allow same-origin/non-browser requests (like curl) where origin may be undefined
      if (!origin) return cb(null, true);
      return rawOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/** Simple health check */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

/** API routes */
app.use("/api/auth", auth);
app.use("/api/clients", clients);
app.use("/api/teachers", teachers);
app.use("/api/notes", notes);
app.use("/api/attendance", attendance);
app.use("/api/documents", documents);
app.use("/api/dailies", dailies);
app.use("/api/ratings", ratings);
app.use("/api/medication", medication);

/** 404 for unknown API routes */
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/** Error handler */
app.use((err, _req, res, _next) => {
  console.error("❌ Error details:", {
    code: err.code,
    message: err.message,
    detail: err.detail,
    stack: err.stack,
  });
  res.status(500).json({ error: err.message || "Server error" });
});

/** Start server */
const port = process.env.PORT || 4000;
assertDb().then(() => {
  app.listen(port, () => {
    console.log(`✅ API listening on ${port}`);
    console.log(`   Health: /api/health`);
    console.log(`   Allowed origins: ${rawOrigins.join(", ") || "(none)"}`);
  });
});
